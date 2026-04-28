// Cloudflare Pages Functions(/api/*) 経由で同期するクライアント。
//
// 設計のキモ:
//   - syncCode は **localStorage** に保存する。XSS が起きると読まれる可能性があるため、
//     サードパーティスクリプトの読み込みは慎重に。Phase 5 で HttpOnly Cookie への切替を検討。
//   - サーバ通信は失敗することがある(オフライン、サーバ停止、コード誤入力)。
//     **失敗時に呼び出し側が握れるよう、例外を投げず { ok: true|false, ... } を返す**。
//   - ローカル localStorage / IndexedDB の書き換えは行わない。
//     既存の saveCustomPhrases / saveProgress を呼ぶのは UI レイヤー(SyncSettings)の責務。

import type { Phrase, UserProgress } from "../types";

const SYNC_CODE_KEY = "eigochan.sync.code";

// ---- syncCode の保存 ---------------------------------------------------

export function saveSyncCode(code: string): void {
  try {
    localStorage.setItem(SYNC_CODE_KEY, code);
  } catch {
    // プライベートモード等で書けなくても落ちない
  }
}

export function loadSyncCode(): string | null {
  try {
    const v = localStorage.getItem(SYNC_CODE_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

export function clearSyncCode(): void {
  try {
    localStorage.removeItem(SYNC_CODE_KEY);
  } catch {
    // 無視
  }
}

// ---- 結果型 ----------------------------------------------------------

export type SyncFailReason =
  | "network"      // fetch 自体が失敗(オフライン等)
  | "unauthorized" // 401: コードが正しくない/失効
  | "bad_request"  // 400: ペイロード壊れ
  | "server_error" // 5xx
  | "unknown";     // それ以外

export type SyncResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: SyncFailReason; status?: number };

function failFromStatus(status: number): SyncFailReason {
  if (status === 401) return "unauthorized";
  if (status >= 400 && status < 500) return "bad_request";
  if (status >= 500) return "server_error";
  return "unknown";
}

// ---- API ラッパ ------------------------------------------------------

/** POST /api/codes — 新しい同期コードを発行(レスポンス時のみ取得可能)。 */
export async function createSyncCode(): Promise<
  SyncResult<{ syncCode: string; userId: string; createdAt: string }>
> {
  let res: Response;
  try {
    res = await fetch("/api/codes", { method: "POST" });
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!res.ok) {
    return { ok: false, reason: failFromStatus(res.status), status: res.status };
  }
  try {
    const body = (await res.json()) as {
      syncCode: string;
      userId: string;
      createdAt: string;
    };
    if (!body.syncCode || !body.userId) {
      return { ok: false, reason: "unknown" };
    }
    return { ok: true, value: body };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

/** GET /api/me — Bearer 認可の疎通確認だけに使う(値は破棄して良い)。 */
export async function verifySyncCode(
  code: string,
): Promise<SyncResult<{ userId: string }>> {
  let res: Response;
  try {
    res = await fetch("/api/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${code}` },
    });
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!res.ok) {
    return { ok: false, reason: failFromStatus(res.status), status: res.status };
  }
  try {
    const body = (await res.json()) as { userId: string };
    return { ok: true, value: { userId: body.userId } };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

// ---- snapshot ---------------------------------------------------------

export interface SyncSnapshot {
  snapshotUpdatedAt: string;
  phrases: Phrase[];
  progress: UserProgress | null;
}

export async function getSnapshot(code: string): Promise<SyncResult<SyncSnapshot>> {
  let res: Response;
  try {
    res = await fetch("/api/sync/snapshot", {
      method: "GET",
      headers: { Authorization: `Bearer ${code}` },
    });
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!res.ok) {
    return { ok: false, reason: failFromStatus(res.status), status: res.status };
  }
  try {
    const body = (await res.json()) as SyncSnapshot;
    return { ok: true, value: body };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

export async function putSnapshot(
  code: string,
  payload: { phrases: Phrase[]; progress: UserProgress },
): Promise<SyncResult<{ savedAt: string }>> {
  const body = {
    clientUpdatedAt: new Date().toISOString(),
    phrases: payload.phrases,
    progress: payload.progress,
  };
  let res: Response;
  try {
    res = await fetch("/api/sync/snapshot", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${code}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!res.ok) {
    return { ok: false, reason: failFromStatus(res.status), status: res.status };
  }
  try {
    const data = (await res.json()) as { ok: boolean; savedAt: string };
    if (!data.ok) return { ok: false, reason: "unknown" };
    return { ok: true, value: { savedAt: data.savedAt } };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

// ---- 音声(R2 経由) -------------------------------------------------

export interface RemoteAudioMeta {
  phraseId: string;
  slot: "reference" | "practice";
  mimeType: string;
  size: number;
  updatedAt: string;
}

/** GET /api/audio — R2 上の音声メモのメタ一覧。バイナリは含まれない。 */
export async function listRemoteAudio(
  code: string,
): Promise<SyncResult<RemoteAudioMeta[]>> {
  let res: Response;
  try {
    res = await fetch("/api/audio", {
      method: "GET",
      headers: { Authorization: `Bearer ${code}` },
    });
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!res.ok) {
    return { ok: false, reason: failFromStatus(res.status), status: res.status };
  }
  try {
    const body = (await res.json()) as { items: RemoteAudioMeta[] };
    const items = (body.items ?? []).filter(
      (m) => m.slot === "reference" || m.slot === "practice",
    );
    return { ok: true, value: items };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

function audioPath(phraseId: string, slot: string): string {
  return `/api/audio/${encodeURIComponent(phraseId)}/${encodeURIComponent(slot)}`;
}

/** PUT /api/audio/:phraseId/:slot — body=Blob、Content-Type 必須。 */
export async function putAudio(
  code: string,
  phraseId: string,
  slot: "reference" | "practice",
  blob: Blob,
  mimeType: string,
): Promise<SyncResult<{ savedAt: string; size: number }>> {
  let res: Response;
  try {
    res = await fetch(audioPath(phraseId, slot), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${code}`,
        "content-type": mimeType,
      },
      body: blob,
    });
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!res.ok) {
    return { ok: false, reason: failFromStatus(res.status), status: res.status };
  }
  try {
    const data = (await res.json()) as {
      ok: boolean;
      savedAt: string;
      size: number;
    };
    if (!data.ok) return { ok: false, reason: "unknown" };
    return { ok: true, value: { savedAt: data.savedAt, size: data.size } };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

/** GET /api/audio/:phraseId/:slot — バイナリを Blob として取得。 */
export async function getAudio(
  code: string,
  phraseId: string,
  slot: "reference" | "practice",
): Promise<SyncResult<{ blob: Blob; mimeType: string }>> {
  let res: Response;
  try {
    res = await fetch(audioPath(phraseId, slot), {
      method: "GET",
      headers: { Authorization: `Bearer ${code}` },
    });
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!res.ok) {
    return { ok: false, reason: failFromStatus(res.status), status: res.status };
  }
  try {
    const blob = await res.blob();
    const mimeType = res.headers.get("content-type") ?? "audio/webm";
    return { ok: true, value: { blob, mimeType } };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

/** DELETE /api/audio/:phraseId/:slot — R2 削除 + メタ tombstone。 */
export async function deleteAudio(
  code: string,
  phraseId: string,
  slot: "reference" | "practice",
): Promise<SyncResult<{ deletedAt: string }>> {
  let res: Response;
  try {
    res = await fetch(audioPath(phraseId, slot), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${code}` },
    });
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!res.ok) {
    return { ok: false, reason: failFromStatus(res.status), status: res.status };
  }
  try {
    const data = (await res.json()) as { ok: boolean; deletedAt: string };
    if (!data.ok) return { ok: false, reason: "unknown" };
    return { ok: true, value: { deletedAt: data.deletedAt } };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

// ---- 失敗理由をユーザー向け日本語に ----------------------------------

export function describeFailReason(reason: SyncFailReason): string {
  switch (reason) {
    case "network":
      return "ネットワークに繋がっていないようです。電波を確認してもう一度試してね。";
    case "unauthorized":
      return "同期コードが正しくないか、もう使えないみたい。コードを確認してね。";
    case "bad_request":
      return "送ろうとしたデータが受け付けられませんでした。";
    case "server_error":
      return "サーバの調子が悪いみたい。少し時間をおいてもう一度。";
    case "unknown":
    default:
      return "うまく同期できませんでした。少し時間をおいてもう一度。";
  }
}
