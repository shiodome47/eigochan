// POST /api/codes
// 新しい同期コードを発行する。
//   * 生コード(syncCode)はレスポンスでだけ返す。それ以降はサーバ側に存在しない。
//   * D1 に保存するのは SHA-256(syncCode) のみ。
//   * 生コードは console には絶対に出さない。
//
// Phase 1 ではコードを「いつ」発行するかの制限は設けない。
// 1ユーザー = 1コードという制約は Phase 4 以降の設定UIで担保する。

import type { Env } from "../_lib/env";
import { generateSyncCode, sha256Hex } from "../_lib/auth";
import { json, jsonError } from "../_lib/json";

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  const syncCode = generateSyncCode();
  const codeHash = await sha256Hex(syncCode);
  const userId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await env.DB.prepare(
      "INSERT INTO users (user_id, code_hash, created_at, last_seen_at) VALUES (?, ?, ?, NULL)",
    )
      .bind(userId, codeHash, createdAt)
      .run();
  } catch (_err) {
    // SHA-256 衝突や code_hash UNIQUE 違反は実用上発生しない想定。
    // 何があっても生コード/ハッシュをログに出さないため _err を握りつぶす。
    return jsonError(500, "user_create_failed");
  }

  return json(
    {
      syncCode,
      userId,
      createdAt,
    },
    { status: 201 },
  );
};
