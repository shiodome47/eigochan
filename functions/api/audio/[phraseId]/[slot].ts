// /api/audio/:phraseId/:slot
//   PUT    … バイナリの音声を R2 に保存し、phrase_audio メタを D1 に UPSERT(LWW)。
//   GET    … R2 から stream で返す。Content-Type は D1 の mime_type を使う。
//   DELETE … R2 から消し、phrase_audio を tombstone(deleted_at)。
//
// セキュリティ:
//   - Bearer 認可必須(authenticate())。
//   - phraseId / slot を厳格に検証(URL から R2 キーを組み立てるため)。
//   - サイズは 5MB 上限、Content-Type は "audio/" 始まりのみ許可。
//   - R2 のキーは "audio/<user_id>/<phrase_id>/<slot>"。バケットは public off 想定。

import type { Env } from "../../../_lib/env";
import { authenticate } from "../../../_lib/auth";
import { json, jsonError } from "../../../_lib/json";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_SLOTS = ["reference", "practice"] as const;
type Slot = (typeof ALLOWED_SLOTS)[number];

function isValidSlot(s: string): s is Slot {
  return (ALLOWED_SLOTS as readonly string[]).includes(s);
}

function isValidPhraseId(id: string): boolean {
  // 既存形式は "custom_<ts>_<rand>"。少しゆるく [A-Za-z0-9_-]{1,80}。
  return /^[A-Za-z0-9_-]{1,80}$/.test(id);
}

function r2Key(userId: string, phraseId: string, slot: Slot): string {
  return `audio/${userId}/${phraseId}/${slot}`;
}

function singleParam(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0] ?? "";
  return "";
}

type ParamKeys = "phraseId" | "slot";

// ---- PUT --------------------------------------------------------------

export const onRequestPut: PagesFunction<Env, ParamKeys> = async ({
  env,
  request,
  params,
}) => {
  const user = await authenticate(env, request);
  if (!user) return jsonError(401, "unauthorized");

  const phraseId = singleParam(params.phraseId);
  const slotRaw = singleParam(params.slot);
  if (!isValidPhraseId(phraseId)) return jsonError(400, "invalid_phrase_id");
  if (!isValidSlot(slotRaw)) return jsonError(400, "invalid_slot");
  const slot: Slot = slotRaw;

  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.startsWith("audio/")) {
    return jsonError(400, "invalid_content_type");
  }

  // Content-Length が信頼できるなら早期に弾く(無駄な転送を抑える)。
  const cl = request.headers.get("content-length");
  if (cl && Number(cl) > MAX_SIZE) return jsonError(413, "too_large");

  // 実体を読む。Pages Functions は arrayBuffer に十分対応。
  const buffer = await request.arrayBuffer();
  if (buffer.byteLength === 0) return jsonError(400, "empty_body");
  if (buffer.byteLength > MAX_SIZE) return jsonError(413, "too_large");

  const key = r2Key(user.user_id, phraseId, slot);

  await env.R2.put(key, buffer, {
    httpMetadata: { contentType },
  });

  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO phrase_audio (
       user_id, phrase_id, slot, r2_key, mime_type, size,
       created_at, updated_at, deleted_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)
     ON CONFLICT(user_id, phrase_id, slot) DO UPDATE SET
       r2_key     = excluded.r2_key,
       mime_type  = excluded.mime_type,
       size       = excluded.size,
       updated_at = excluded.updated_at,
       deleted_at = NULL
     WHERE excluded.updated_at >= phrase_audio.updated_at`,
  )
    .bind(
      user.user_id,
      phraseId,
      slot,
      key,
      contentType,
      buffer.byteLength,
      now,
      now,
    )
    .run();

  return json({ ok: true, savedAt: now, size: buffer.byteLength });
};

// ---- GET --------------------------------------------------------------

export const onRequestGet: PagesFunction<Env, ParamKeys> = async ({
  env,
  request,
  params,
}) => {
  const user = await authenticate(env, request);
  if (!user) return jsonError(401, "unauthorized");

  const phraseId = singleParam(params.phraseId);
  const slotRaw = singleParam(params.slot);
  if (!isValidPhraseId(phraseId)) return jsonError(400, "invalid_phrase_id");
  if (!isValidSlot(slotRaw)) return jsonError(400, "invalid_slot");
  const slot: Slot = slotRaw;

  // メタが alive であることをまず確認(tombstone 済を返さない)。
  const meta = await env.DB.prepare(
    `SELECT mime_type, size, updated_at
     FROM phrase_audio
     WHERE user_id = ? AND phrase_id = ? AND slot = ? AND deleted_at IS NULL`,
  )
    .bind(user.user_id, phraseId, slot)
    .first<{ mime_type: string; size: number; updated_at: string }>();

  if (!meta) return jsonError(404, "not_found");

  const key = r2Key(user.user_id, phraseId, slot);
  const obj = await env.R2.get(key);
  if (!obj) return jsonError(404, "not_found");

  return new Response(obj.body, {
    status: 200,
    headers: {
      "content-type": meta.mime_type,
      "content-length": String(meta.size),
      // 認可済バイナリ。CDN/中間にキャッシュさせない。
      "cache-control": "private, no-store",
      "x-updated-at": meta.updated_at,
    },
  });
};

// ---- DELETE -----------------------------------------------------------

export const onRequestDelete: PagesFunction<Env, ParamKeys> = async ({
  env,
  request,
  params,
}) => {
  const user = await authenticate(env, request);
  if (!user) return jsonError(401, "unauthorized");

  const phraseId = singleParam(params.phraseId);
  const slotRaw = singleParam(params.slot);
  if (!isValidPhraseId(phraseId)) return jsonError(400, "invalid_phrase_id");
  if (!isValidSlot(slotRaw)) return jsonError(400, "invalid_slot");
  const slot: Slot = slotRaw;

  const key = r2Key(user.user_id, phraseId, slot);
  await env.R2.delete(key);

  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE phrase_audio
     SET deleted_at = ?, updated_at = ?
     WHERE user_id = ? AND phrase_id = ? AND slot = ?`,
  )
    .bind(now, now, user.user_id, phraseId, slot)
    .run();

  return json({ ok: true, deletedAt: now });
};
