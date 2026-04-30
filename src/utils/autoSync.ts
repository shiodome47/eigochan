// 自動同期のオーケストレータ。
//
// 設計の基本:
//   - syncCode が **無い** ユーザーには何もしない(全 enqueue が早期 return)
//   - ローカル保存を先に行い、その後 fire-and-forget で push
//   - 失敗時は queue に残し、bootstrap 時 / 手動再送で再試行
//   - bootstrap は flush → 自動 pull の順(未送信の局所変更を上書きしないため)
//   - 自動 pull は 1h 以内なら throttle(過剰アクセス防止)

import { loadCustomPhrases, saveCustomPhrases } from "./customPhrases";
import { loadProgress, saveProgress } from "./storage";
import { loadPhraseAudio } from "./phraseAudioStorage";
import {
  deleteAudio,
  getSnapshot,
  loadSyncCode,
  putAudio,
  putSnapshot,
} from "./syncClient";
import {
  addToQueue,
  clearQueue,
  incrementAttempts,
  loadQueue,
  removeFromQueue,
  setLastError,
  type SyncQueueItem,
} from "./syncQueue";
import type { SyncFailReason } from "./syncClient";

const LAST_AUTO_PULL_KEY = "eigochan.sync.lastAutoPullAt";
const LAST_SYNCED_KEY = "eigochan.sync.lastSyncedAt";
// サーバ側 snapshot の最後に「この端末が知っている」updatedAt(server-time ISO)。
// 同期成功(push / pull / 参加)のたびに更新する。bootstrap で
// server.snapshotUpdatedAt > stored の場合だけ自動 pull する判定基準として使う。
const LAST_KNOWN_SERVER_SNAPSHOT_KEY = "eigochan.sync.lastKnownServerSnapshotAt";

const FLUSH_DEBOUNCE_MS = 1000;

let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;
let queueListeners: Array<() => void> = [];

function isDraftPhraseId(id: string): boolean {
  return id.startsWith("draft_");
}

function nowIso(): string {
  return new Date().toISOString();
}

// ---- last-sync timestamps -------------------------------------------

function setLastSyncedAt(iso: string): void {
  try {
    localStorage.setItem(LAST_SYNCED_KEY, iso);
  } catch {
    // 無視
  }
}

export function getLastSyncedAt(): string | null {
  try {
    return localStorage.getItem(LAST_SYNCED_KEY);
  } catch {
    return null;
  }
}

function setLastAutoPullAt(iso: string): void {
  try {
    localStorage.setItem(LAST_AUTO_PULL_KEY, iso);
  } catch {
    // 無視
  }
}

/**
 * サーバ snapshot の baseline タイムスタンプ(server-time ISO)。
 * 同期成功(push の savedAt / pull・参加時の snapshotUpdatedAt)で更新し、
 * 次回の bootstrap で「server が本当に新しい場合だけ自動 pull する」判定に使う。
 */
export function getLastKnownServerSnapshotAt(): string | null {
  try {
    return localStorage.getItem(LAST_KNOWN_SERVER_SNAPSHOT_KEY);
  } catch {
    return null;
  }
}

export function setLastKnownServerSnapshotAt(iso: string): void {
  try {
    localStorage.setItem(LAST_KNOWN_SERVER_SNAPSHOT_KEY, iso);
  } catch {
    // 無視
  }
}

// ---- queue 変更の購読(SyncSettings の表示更新用)-------------------

export function subscribeQueueChanged(fn: () => void): () => void {
  queueListeners.push(fn);
  return () => {
    queueListeners = queueListeners.filter((f) => f !== fn);
  };
}

function notifyListeners(): void {
  for (const fn of queueListeners) {
    try {
      fn();
    } catch {
      // 無視
    }
  }
}

// ---- enqueue helpers -------------------------------------------------

/**
 * フレーズ・進捗の差分を全件 PUT として queue に積む。
 * syncCode が無ければ no-op。
 */
export function enqueueSnapshotPush(): void {
  const code = loadSyncCode();
  if (!code) return;
  addToQueue({
    id: "snapshotPush",
    type: "snapshotPush",
    createdAt: nowIso(),
    attempts: 0,
  });
  notifyListeners();
  scheduleFlush();
}

/**
 * 録音した音声を R2 にアップロードする予約を queue に積む。
 * draft_<id> は対象外(まだ正式 phraseId が決まっていないため)。
 */
export function enqueueAudioUpload(
  phraseId: string,
  slot: "reference" | "practice",
): void {
  const code = loadSyncCode();
  if (!code) return;
  if (isDraftPhraseId(phraseId)) return;
  addToQueue({
    id: `audioUpload:${phraseId}:${slot}`,
    type: "audioUpload",
    phraseId,
    slot,
    createdAt: nowIso(),
    attempts: 0,
  });
  notifyListeners();
  scheduleFlush();
}

/**
 * R2 上の音声を削除する予約を queue に積む。
 * draft_<id> は対象外。
 */
export function enqueueAudioDelete(
  phraseId: string,
  slot: "reference" | "practice",
): void {
  const code = loadSyncCode();
  if (!code) return;
  if (isDraftPhraseId(phraseId)) return;
  addToQueue({
    id: `audioDelete:${phraseId}:${slot}`,
    type: "audioDelete",
    phraseId,
    slot,
    createdAt: nowIso(),
    attempts: 0,
  });
  notifyListeners();
  scheduleFlush();
}

// ---- flush ----------------------------------------------------------

function scheduleFlush(): void {
  if (typeof window === "undefined") return;
  if (flushTimer !== null) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void runFlush();
  }, FLUSH_DEBOUNCE_MS);
}

type ProcessResult =
  | { ok: true }
  | { ok: false; reason: SyncFailReason; status?: number };

/**
 * queue を上から順に処理。成功は remove、失敗は attempts++ + lastError 記録。
 *   - 同時実行は flushing フラグで防ぐ
 *   - syncCode 無しなら早期 return
 *   - 個々の処理が throw しても全体は止めない
 */
export async function runFlush(): Promise<void> {
  if (flushing) return;
  const code = loadSyncCode();
  if (!code) return;
  flushing = true;
  try {
    const queue = loadQueue();
    for (const item of queue) {
      let result: ProcessResult;
      try {
        result = await processItem(code, item);
      } catch {
        result = { ok: false, reason: "unknown" };
      }
      if (result.ok) {
        removeFromQueue(item.id);
        setLastSyncedAt(nowIso());
        notifyListeners();
      } else {
        incrementAttempts(item.id);
        setLastError(item.id, {
          reason: result.reason,
          status: result.status,
          at: nowIso(),
        });
        notifyListeners();
      }
    }
  } finally {
    flushing = false;
  }
}

async function processItem(
  code: string,
  item: SyncQueueItem,
): Promise<ProcessResult> {
  if (item.type === "snapshotPush") {
    const phrases = loadCustomPhrases();
    const progress = loadProgress();
    const result = await putSnapshot(code, { phrases, progress });
    if (result.ok) {
      // 自端末が「サーバの最新が ここ までなのは知っている」状態に更新する。
      // 次回の bootstrap で自分自身の push が auto-pull の引き金にならないように。
      setLastKnownServerSnapshotAt(result.value.savedAt);
      return { ok: true };
    }
    return { ok: false, reason: result.reason, status: result.status };
  }
  if (item.type === "audioUpload") {
    if (isDraftPhraseId(item.phraseId)) return { ok: true }; // 念のため
    const audio = await loadPhraseAudio(item.phraseId, item.slot);
    if (!audio) {
      // 既にローカル削除済 → upload は不要、成功扱いで queue から外す
      return { ok: true };
    }
    const result = await putAudio(
      code,
      item.phraseId,
      item.slot,
      audio.blob,
      audio.mimeType,
    );
    if (result.ok) return { ok: true };
    return { ok: false, reason: result.reason, status: result.status };
  }
  if (item.type === "audioDelete") {
    if (isDraftPhraseId(item.phraseId)) return { ok: true };
    const result = await deleteAudio(code, item.phraseId, item.slot);
    if (result.ok) return { ok: true };
    return { ok: false, reason: result.reason, status: result.status };
  }
  return { ok: false, reason: "unknown" };
}

// ---- bootstrap ------------------------------------------------------

export interface BootstrapResult {
  flushed: boolean;
  pulled: boolean;
  /** 「pull が走らなかった」場合の理由 */
  pullSkippedReason?:
    | "no_code"
    | "pending_writes"
    | "already_pulled"
    | "failed";
}

/**
 * 起動時に呼ぶ。
 *   1. queue を flush(失敗してもアプリは止めない)
 *   2. snapshotPush が未送信ならローカル上書きを避けるため pull を見送る
 *      → 端末をまたいだ局所変更がまだサーバに届いていない状態。
 *        ここで pull すると未送信ぶんが消えるので絶対に pull しない。
 *   3. サーバ側 snapshot の updatedAt が、自端末が最後に把握している
 *      baseline (LAST_KNOWN_SERVER_SNAPSHOT_KEY) より新しい時だけ自動 pull する。
 *      → 他端末で増えたフレーズ(例: PC で DUO 3.0 取り込み)を
 *        スマホ起動時にそのまま反映できる。
 *      → 何も新しくなっていなければ pull しない(無駄な転送・上書きを避ける)。
 *      → 既存ユーザー(baseline 未設定)は queue が空なら pull する。
 *        queue 空 = 未送信の局所変更は無い、と分かっているので安全。
 *
 * 戻り値の result.pulled === true なら、呼び出し側は React state を再ロードする
 * (localStorage は既に書き換え済み)。
 */
export async function bootstrapAutoSync(): Promise<BootstrapResult> {
  const code = loadSyncCode();
  if (!code) {
    return { flushed: false, pulled: false, pullSkippedReason: "no_code" };
  }

  await runFlush();

  const queueAfterFlush = loadQueue();
  const hasPendingPush = queueAfterFlush.some(
    (q) => q.type === "snapshotPush",
  );
  if (hasPendingPush) {
    return {
      flushed: true,
      pulled: false,
      pullSkippedReason: "pending_writes",
    };
  }

  const result = await getSnapshot(code);
  if (!result.ok) {
    return { flushed: true, pulled: false, pullSkippedReason: "failed" };
  }

  // baseline と比較して、サーバが本当に新しい時だけ pull する。
  // baseline 未設定なら(初回 / 新仕様にアップグレードした既存ユーザー)、
  // queue が空であることは上で確認済み = 未送信の変更は無い、の前提で
  // サーバ側を取り込んで baseline を初期化する。
  const stored = getLastKnownServerSnapshotAt();
  const serverAt = result.value.snapshotUpdatedAt;
  if (stored && serverAt <= stored) {
    return {
      flushed: true,
      pulled: false,
      pullSkippedReason: "already_pulled",
    };
  }

  saveCustomPhrases(result.value.phrases);
  if (result.value.progress) {
    saveProgress(result.value.progress);
  }
  const t = nowIso();
  setLastAutoPullAt(t);
  setLastSyncedAt(t);
  setLastKnownServerSnapshotAt(serverAt);
  notifyListeners();
  return { flushed: true, pulled: true };
}

// ---- 同期解除時の掃除 ------------------------------------------------

/**
 * SyncSettings の「同期を解除」で呼ぶ。
 * 残っている queue と最終同期タイムスタンプを消す。
 * syncCode 自体は呼び出し側(SyncSettings)で clearSyncCode() する。
 */
export function clearAllSyncState(): void {
  clearQueue();
  try {
    localStorage.removeItem(LAST_AUTO_PULL_KEY);
    localStorage.removeItem(LAST_SYNCED_KEY);
    localStorage.removeItem(LAST_KNOWN_SERVER_SNAPSHOT_KEY);
  } catch {
    // 無視
  }
  notifyListeners();
}
