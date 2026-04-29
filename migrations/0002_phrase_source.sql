-- フレーズの出典メタを追加。
--   source         : 'initial' | 'original' | 'duo3' (NULL は 'original' 解釈)
--   source_section : DUO 3.0 等の Section 番号 (1〜45 を想定)
--   source_index   : 出典内の通し番号
--
-- 既存行はすべて NULL のまま。クライアントは NULL を 'original' として扱う。
--
-- 注意: 市販教材 (DUO 3.0 など) の本文・音声はリポジトリに含めない。
-- ユーザーが各端末から取り込んだフレーズだけがこの 3 列に値を持つ。

ALTER TABLE phrases ADD COLUMN source         TEXT;
ALTER TABLE phrases ADD COLUMN source_section INTEGER;
ALTER TABLE phrases ADD COLUMN source_index   INTEGER;

CREATE INDEX IF NOT EXISTS idx_phrases_user_source ON phrases(user_id, source, source_section);
