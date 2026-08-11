-- 日→英モードの学習データ (SRS・評価・分野メモ)。
-- 1 ユーザー 1 行。JSON 丸ごと LWW (snapshot と同じ updated_at)。

CREATE TABLE IF NOT EXISTS ja_state (
  user_id TEXT PRIMARY KEY,
  srs TEXT NOT NULL DEFAULT '{}',
  review TEXT NOT NULL DEFAULT '{}',
  domain_notes TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
