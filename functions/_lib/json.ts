// JSON レスポンス用の薄いヘルパ。

const COMMON_HEADERS: HeadersInit = {
  "content-type": "application/json; charset=utf-8",
  // 同期コード等が万一URL経由で漏れた場合の二次被害を抑える(API はキャッシュ不要)
  "cache-control": "no-store",
};

export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...COMMON_HEADERS, ...(init.headers ?? {}) },
  });
}

export function jsonError(status: number, code: string, message?: string): Response {
  return json({ error: code, message: message ?? code }, { status });
}
