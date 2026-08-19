# チャンクの区切りを点検するスクリプト

`ch` (チャンク) は画面でタップして読み上げるボタンになるので、
**声に出して意味のある塊** でないと練習に使えない。
分野を足したり英文を直したあとに回す。

```bash
npx tsx scripts/chunk-audit/ghost.mjs    # チャンクが英文に実在しない (最優先。0 であること)
npx tsx scripts/chunk-audit/bad.mjs      # 3 語以下の分割 / "..." 入り など
npx tsx scripts/chunk-audit/patcut.mjs   # 型を区切りが分断していないか
npx tsx scripts/chunk-audit/colloc.mjs   # 定型表現を区切りが分断していないか
npx tsx scripts/chunk-audit/style.mjs    # 分野ごとの流儀 (全文分割 / 要点抜粋) の内訳
```

判定基準は [docs/ja-en-mode-design.md の「チャンクの切り方」](../../docs/ja-en-mode-design.md) を参照。

`bad.mjs` の B (区切り手前が宙ぶらりん) と C (機能語だけのチャンク) は
**誤検出が多い**。`Do you have | a table for two?` のような良い区切りも拾うので、
数字が出ても慌てず中身を見ること。A・E と `ghost.mjs` は 0 を保つ。
