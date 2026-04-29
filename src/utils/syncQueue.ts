// 自動同期の失敗を保持するキュー。localStorage に置く。
//
// 設計:
//   - draft_<id> はそもそも enqueue 側で弾く(本ファイル単体ではチェックしない)
//   - snapshotPush は singleton(同じ id "snapshotPush" で重複削除)
//   - audioUpload / audioDelete は (phraseId, slot) で重複削除し、
//     新しい操作で古い操作を上書きする(同じ slot に upload→delete なら最終的に delete)

const QUEUE_KEY = "eigochan.sync.queue.v1";

/** 直近の同期失敗の概要。UI のデバッグ表示用。 */
export interface SyncQueueLastError {
  /** SyncFailReason ('network' | 'unauthorized' | 'bad_request' | 'server_error' | 'unknown') */
  reason: string;
  /** HTTP ステータス。fetch 自体が失敗した場合 (network) は undefined。 */
  status?: number;
  /** いつ失敗したか (ISO 8601 UTC)。 */
  at: string;
}

export type SyncQueueItem =
  | {
      id: string;
      type: "snapshotPush";
      createdAt: string;
      attempts: number;
      lastError?: SyncQueueLastError;
    }
  | {
      id: string;
      type: "audioUpload";
      phraseId: string;
      slot: "reference" | "practice";
      createdAt: string;
      attempts: number;
      lastError?: SyncQueueLastError;
    }
  | {
      id: string;
      type: "audioDelete";
      phraseId: string;
      slot: "reference" | "practice";
      createdAt: string;
      attempts: number;
      lastError?: SyncQueueLastError;
    };

function isValidLastError(v: unknown): v is SyncQueueLastError {
  if (!v || typeof v !== "object") return false;
  const e = v as Record<string, unknown>;
  if (typeof e.reason !== "string" || !e.reason) return false;
  if (typeof e.at !== "string" || !e.at) return false;
  if ("status" in e && e.status !== undefined && typeof e.status !== "number") {
    return false;
  }
  return true;
}

function isValidItem(o: unknown): o is SyncQueueItem {
  if (!o || typeof o !== "object") return false;
  const r = o as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) return false;
  if (typeof r.createdAt !== "string") return false;
  if (typeof r.attempts !== "number") return false;
  // lastError は optional。値がある場合だけ型検査。
  if ("lastError" in r && r.lastError !== undefined && !isValidLastError(r.lastError)) {
    return false;
  }
  if (r.type === "snapshotPush") return true;
  if (r.type === "audioUpload" || r.type === "audioDelete") {
    return (
      typeof r.phraseId === "string" &&
      r.phraseId.length > 0 &&
      (r.slot === "reference" || r.slot === "practice")
    );
  }
  return false;
}

function safeRead(): SyncQueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidItem);
  } catch {
    return [];
  }
}

function safeWrite(items: SyncQueueItem[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  } catch {
    // 容量超過などは握りつぶす(同期を諦めるよりはローカル動作優先)
  }
}

export function loadQueue(): SyncQueueItem[] {
  return safeRead();
}

export function saveQueue(items: SyncQueueItem[]): void {
  safeWrite(items);
}

export function clearQueue(): void {
  safeWrite([]);
}

/**
 * key で重複を除去しながら追加。
 *   - snapshotPush は1件のみ(古いものは置き換え)
 *   - audioUpload / audioDelete は同じ (phraseId, slot) があれば置き換え
 *     (例: upload→delete の連続なら最終的に delete のみ残る)
 */
export function addToQueue(item: SyncQueueItem): void {
  const queue = safeRead();
  let next: SyncQueueItem[];
  if (item.type === "snapshotPush") {
    next = queue.filter((q) => q.type !== "snapshotPush");
  } else {
    next = queue.filter((q) => {
      if (q.type === "audioUpload" || q.type === "audioDelete") {
        return !(q.phraseId === item.phraseId && q.slot === item.slot);
      }
      return true;
    });
  }
  next.push(item);
  safeWrite(next);
}

export function removeFromQueue(id: string): void {
  const queue = safeRead();
  safeWrite(queue.filter((q) => q.id !== id));
}

export function incrementAttempts(id: string): void {
  const queue = safeRead();
  const next = queue.map((q) =>
    q.id === id ? { ...q, attempts: q.attempts + 1 } : q,
  );
  safeWrite(next);
}

/** 直近の失敗内容を queue に記録する。UI のデバッグ表示用。 */
export function setLastError(id: string, lastError: SyncQueueLastError): void {
  const queue = safeRead();
  const next = queue.map((q) => (q.id === id ? { ...q, lastError } : q));
  safeWrite(next);
}
