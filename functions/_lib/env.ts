// Cloudflare Pages Functions に注入される binding 群。
// wrangler.toml の [[d1_databases]] / [[r2_buckets]] と一致させる。
export interface Env {
  DB: D1Database;
  R2: R2Bucket;
}
