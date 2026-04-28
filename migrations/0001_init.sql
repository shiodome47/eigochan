-- eigochan sync: 初期スキーマ。
-- Phase 1 では users テーブルだけを使うが、Phase 2 以降で phrases / progress / phrase_audio
-- を埋めていくので、データ層は最初に一括で作っておく(後続マイグレーション数を減らす)。
--
-- 設計方針:
--   * 1 ユーザー = 1 つの sync_code(SHA-256 ハッシュで保存)
--   * 競合解決は Last Write Wins(updated_at で比較)
--   * 削除は tombstone(deleted_at IS NOT NULL)で伝播、物理削除はしない
--   * 日付/時刻はすべて ISO 8601 UTC 文字列(例: '2026-04-28T12:34:56.789Z')

PRAGMA foreign_keys = ON;

-- 同期コードの所有者。Phase 1 で実体ユーザーは1人だが、複数 "アカウント" を持てる構造にしておく。
CREATE TABLE users (
  user_id      TEXT PRIMARY KEY,            -- crypto.randomUUID()
  code_hash    TEXT NOT NULL UNIQUE,        -- SHA-256(syncCode) の hex 64文字
  created_at   TEXT NOT NULL,               -- ISO 8601 UTC
  last_seen_at TEXT                         -- ISO 8601 UTC, NULL=未アクセス
);

-- 自作フレーズ(localStorage の eigochan.customPhrases.v1 に対応)。
CREATE TABLE phrases (
  user_id    TEXT NOT NULL,
  phrase_id  TEXT NOT NULL,                 -- 既存形式 "custom_<ts>_<rand>"
  english    TEXT NOT NULL,
  japanese   TEXT NOT NULL,
  chunks     TEXT NOT NULL,                 -- JSON 配列(string[])
  level      TEXT NOT NULL,                 -- 'beginner' | 'intermediate' | 'advanced'
  category   TEXT NOT NULL,                 -- 'custom' | 'daily' | ... 既存と一致
  mood       TEXT NOT NULL,                 -- 'natural' | 'casual' | ...
  updated_at TEXT NOT NULL,                 -- LWW 用
  deleted_at TEXT,                          -- tombstone, NULL=生存
  PRIMARY KEY (user_id, phrase_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_phrases_user_updated ON phrases(user_id, updated_at);

-- 進捗(localStorage の eigochan.progress.v1 に対応)。1 ユーザー 1 行。
CREATE TABLE progress (
  user_id              TEXT PRIMARY KEY,
  total_xp             INTEGER NOT NULL DEFAULT 0,
  level                INTEGER NOT NULL DEFAULT 1,
  streak_days          INTEGER NOT NULL DEFAULT 0,
  total_practice_count INTEGER NOT NULL DEFAULT 0,
  total_read_count     INTEGER NOT NULL DEFAULT 0,
  total_recite_count   INTEGER NOT NULL DEFAULT 0,
  completed_phrase_ids TEXT    NOT NULL DEFAULT '[]',  -- JSON 配列
  recent_practices     TEXT    NOT NULL DEFAULT '[]',  -- JSON 配列
  last_practice_date   TEXT,                            -- 'YYYY-MM-DD' (JST想定)
  updated_at           TEXT    NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 音声メタ(IndexedDB の eigochan-phrase-audio に対応)。
-- 実体は R2 の "audio/<user_id>/<phrase_id>/<slot>" に置く。
CREATE TABLE phrase_audio (
  user_id    TEXT NOT NULL,
  phrase_id  TEXT NOT NULL,
  slot       TEXT NOT NULL,                 -- 'reference' | 'practice'
  r2_key     TEXT NOT NULL,
  mime_type  TEXT NOT NULL,
  size       INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (user_id, phrase_id, slot),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_phrase_audio_user_updated ON phrase_audio(user_id, updated_at);
