// 同期コード(Bearer トークン)関連のユーティリティ。
// 本ファイルでは生コードをログ出力しない。呼び出し側でも console に出さないこと。

import type { Env } from "./env";

/** 32 byte の crypto.getRandomValues() を base64url で文字列化(43文字)。 */
export function generateSyncCode(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  // btoa は ASCII バイト文字列を期待するので、まず 1 文字 1 バイトに整形する
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** UTF-8 文字列の SHA-256 を hex(64文字)で返す。Web Crypto に依存。 */
export async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  const view = new Uint8Array(digest);
  let hex = "";
  for (let i = 0; i < view.length; i++) {
    hex += view[i]!.toString(16).padStart(2, "0");
  }
  return hex;
}

/** Authorization: Bearer <token> から token を取り出す。無ければ null。 */
export function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return null;
  const token = match[1]!.trim();
  return token.length > 0 ? token : null;
}

export interface AuthenticatedUser {
  user_id: string;
  last_seen_at: string;
}

/**
 * Bearer トークンで users を引き、見つかったら last_seen_at を更新して返す。
 * 見つからない/トークン無しなら null。
 *
 * 注意: 戻り値や引数のトークンを呼び出し側でログ出力しないこと。
 */
export async function authenticate(
  env: Env,
  request: Request,
): Promise<AuthenticatedUser | null> {
  const token = extractBearerToken(request);
  if (!token) return null;

  const codeHash = await sha256Hex(token);
  const row = await env.DB.prepare(
    "SELECT user_id, last_seen_at FROM users WHERE code_hash = ?",
  )
    .bind(codeHash)
    .first<{ user_id: string; last_seen_at: string | null }>();

  if (!row) return null;

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE users SET last_seen_at = ? WHERE user_id = ?")
    .bind(now, row.user_id)
    .run();

  return { user_id: row.user_id, last_seen_at: now };
}
