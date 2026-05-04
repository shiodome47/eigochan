-- ひとりごと英語 (source='monologue') の作成日時を D1 にも保持する。
--   thought_created_at : 日本語メモを保存した時刻 (ISO 8601 UTC)
--
-- 既存行はすべて NULL のまま (monologue 以外では使わない)。
-- monologue 以外のフレーズに対しては値が入っていても無害 (ただし通常は NULL)。
--
-- これを D1 にも乗せておくことで、PC/スマホ同期後も
-- 「最近のひとりごと」「今日浮かんだ日本語」「英語待ちの古い順」などを実装しやすくする。
--
-- 注意: D1 の updated_at は LWW 用のサーバ側タイムスタンプであり、
-- thought_created_at とは目的が違う (ユーザー視点での「ひとりごとが生まれた瞬間」)。

ALTER TABLE phrases ADD COLUMN thought_created_at TEXT;
