# DUO 3.0 Import 設計メモ (次タスク用)

このメモは、DUO 3.0 (および同種の市販教材) のフレーズを eigochan に取り込む
Import 機能を、次のタスクで実装するための土台。本タスクでは Phrase の出典メタ
(`source` / `sourceSection` / `sourceIndex`) と D1 列、UI の出典フィルタまでを
入れた。Import 本体はまだ実装していない。

## 大方針

- **本文・音声をリポジトリに同梱しない。** Public GitHub に教材本文を置かない。
  ユーザーが自分の正規購入物・利用権限の範囲内で、自分の端末にだけ Import する。
- **既存の自作フレーズ・音声メモを壊さない。** 取り込みは追記/置換のみ。既存の
  `custom_*` 系 ID は触らない。
- **DUO フレーズも音声メモは個別管理。** セクション単位 MP3 を自動分割しない。
  必要なフレーズだけ手動で `reference` スロットに録音/取り込みする。

## 取り込みフォーマット (推奨)

JSON 配列を第一候補。CSV は BOM/エスケープが面倒なので二段階目で。

### JSON 配列 (`.json`)

```jsonc
[
  {
    "section": 5,
    "index": 87,
    "english": "...",
    "japanese": "...",
    "chunks": ["...", "..."],   // 省略時は autoChunkText() で自動生成
    "category": "custom",        // 省略時は "custom"
    "level": "intermediate",     // 省略時は "intermediate"
    "mood": "natural"            // 省略時は "natural"
  }
]
```

必須キー: `section` (正の整数、1〜45 想定)、`index` (正の整数)、`english`、`japanese`。
それ以外は省略可、省略時はデフォルトで埋める。

### CSV (`.csv`) — 任意対応

ヘッダ必須: `section,index,english,japanese,chunks?,category?,level?,mood?`
`chunks` は `|` 区切りの文字列 (例: `I'm getting|better at this.`)。

## ID 規約

- フレーズ ID: `duo3_s<NN>_<MMM>` (zero-pad 2/3 桁)。例: section=5, index=87 → `duo3_s05_087`。
  → `generateDuo3PhraseId()` (実装済) を使う。
- 同 ID が既にあれば **置換** (Import の冪等性)。
  → `addCustomPhrase()` 側で対応済 (source==='duo3' + section/index 両方ありのとき)。
- 音声メモも phraseId 単位なので、再 Import で音声が剥がれない。

## 取り込み手順 (Import UI 側の擬似コード)

```ts
async function importDuo3Json(rows: unknown[]): Promise<ImportResult> {
  let inserted = 0, replaced = 0;
  const skipped: string[] = [];
  rows.forEach((raw, i) => {
    const v = validateDuo3Row(raw); // section/index/english/japanese 必須
    if (!v) { skipped.push(`row #${i}`); return; }
    const input: CustomPhraseInput = {
      english: v.english,
      japanese: v.japanese,
      chunks: v.chunks ?? autoChunkText(v.english),
      level: v.level ?? "intermediate",
      category: v.category ?? "custom",
      mood: v.mood ?? "natural",
      source: "duo3",
      sourceSection: v.section,
      sourceIndex: v.index,
    };
    const phrase = addCustomPhrase(input);
    if (!phrase) skipped.push(`row #${i} (storage failed)`);
    // 既存判定は addCustomPhrase 側の置換ロジックで吸収
  });
  enqueueSnapshotPush(); // 同期キューへ
  return { inserted, replaced, skipped };
}
```

## UI 設計 (案)

- LogPage の「データ管理」セクションに「DUO 3.0 を取り込む」ボタンを追加。
- ファイル選択 (JSON/CSV) → プレビュー (件数 / うち上書き予定 N 件) → 実行。
- 実行後の通知: `N 件追加 / M 件更新 / K 件スキップ`。スキップ理由はサマリ表示。
- 取り込み後、フレーズ一覧の出典フィルタを `DUO 3.0` に切り替えれば結果が見える。

## 音声メモの取り扱い

- DUO 由来フレーズ (`duo3_s05_087` 等) でも、`PhraseEditPage` から既存の
  `PhraseAudioRecorder` で `reference` / `practice` スロットに音声を録音/取り込み可能
  (本タスクで実装済。新規実装不要)。
- セクション単位 MP3 → フレーズ単位への自動分割は実装しない。
  - 妥当な分割タイムスタンプを持たないため、自動分割は破壊的になる。
  - 「セクション MP3 を端末で再生しながら、必要なフレーズだけ録音する」運用を推奨。
  - 将来の拡張候補: 波形 + 手動マーカーでの半自動分割 UI。

## R2 同期との整合

R2 key 設計は変更不要:

```
audio/<user_id>/<phrase_id>/<slot>
例: audio/<user_id>/duo3_s05_087/reference
```

`<phrase_id>` 部分が `duo3_*` でも既存の API/key スキームに自然に乗る。
(`functions/api/audio/[phraseId]/[slot].ts` も変更不要のはず。)

## やらないこと (今回 / 次タスクとも)

- 本文の同梱 / Public 配布
- セクション MP3 の自動分割
- DUO 専用 UI の刷新 (一覧上は既存フィルタの 2 段目に乗る)
- 既存 `custom_*` ID の改名/移行

## 関連ファイル (本タスクで実装済)

- 型: `src/types/index.ts` (`PhraseSource` 追加)
- localStorage: `src/utils/customPhrases.ts` (`generateDuo3PhraseId`, `effectiveSource`, sanitize/normalize 拡張)
- D1: `migrations/0002_phrase_source.sql` (3 列追加)
- 同期: `functions/api/sync/snapshot.ts` (3 列の往復対応)
- 一覧 UI: `src/pages/PhrasesPage.tsx` (出典軸 + Section select)
- 編集 UI: `src/pages/PhraseEditPage.tsx` (出典 / Section / 通し番号 入力)
