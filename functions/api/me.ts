// GET /api/me
// Bearer トークン(syncCode)を検証して、紐づくユーザー情報を返す。
// Phase 1 では「認可が通っているか」を確かめるためだけに存在する。

import type { Env } from "../_lib/env";
import { authenticate } from "../_lib/auth";
import { json, jsonError } from "../_lib/json";

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const user = await authenticate(env, request);
  if (!user) return jsonError(401, "unauthorized");

  return json({
    userId: user.user_id,
    lastSeenAt: user.last_seen_at,
  });
};
