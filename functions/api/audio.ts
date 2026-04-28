// GET /api/audio
// このユーザーが R2 に保存している音声メモのメタデータ一覧を返す。
// Bearer 認可必須。deleted_at IS NULL の行のみ対象(tombstone は除外)。
// バイナリそのものはここでは返さない(個別 GET /api/audio/:phraseId/:slot)。

import type { Env } from "../_lib/env";
import { authenticate } from "../_lib/auth";
import { json, jsonError } from "../_lib/json";

interface AudioMetaRow {
  phrase_id: string;
  slot: string;
  mime_type: string;
  size: number;
  updated_at: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const user = await authenticate(env, request);
  if (!user) return jsonError(401, "unauthorized");

  const result = await env.DB.prepare(
    `SELECT phrase_id, slot, mime_type, size, updated_at
     FROM phrase_audio
     WHERE user_id = ? AND deleted_at IS NULL
     ORDER BY phrase_id, slot`,
  )
    .bind(user.user_id)
    .all<AudioMetaRow>();

  const items = (result.results ?? []).map((r) => ({
    phraseId: r.phrase_id,
    slot: r.slot,
    mimeType: r.mime_type,
    size: r.size,
    updatedAt: r.updated_at,
  }));

  return json({ items });
};
