# eigochan Cloudflare Pages デプロイメモ

最終更新: 2026-04-28

---

## 1. Cloudflare Pages 設定値

| 項目 | 値 |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory (advanced) | プロジェクトルート(空欄でも可) |
| Environment variables | `NODE_VERSION=20`(任意、明示推奨) |

公開URLは `https://<project>.pages.dev`、または独自ドメインに割当。

---

## 2. ビルド成果物のサイズ目安

```
dist/
├─ index.html                 ~1.05 KB
├─ manifest.webmanifest       ~0.49 KB
├─ registerSW.js              ~0.13 KB
├─ sw.js + workbox-*.js       ~16 KB
├─ favicon.svg                ~0.4 KB
├─ apple-touch-icon.png       ~7.7 KB
├─ pwa-192x192.png            ~8.2 KB
├─ pwa-512x512.png            ~23 KB
├─ pwa-icon-source.svg        ~1.9 KB
├─ assets/
│  ├─ index-*.css             ~29 KB (gzip: ~6 KB)
│  └─ index-*.js              ~223 KB (gzip: ~72 KB)
└─ city/
   ├─ city-map-base.webp      ~297 KB  ← モダンブラウザはこちら
   └─ city-map-base.png       ~2.97 MB ← フォールバック

合計: 約 3.4 MB(PNG フォールバック込み)
```

---

## 3. デプロイ前チェックリスト

### 必須

- [x] `npm run typecheck` が通る
- [x] `npm run build` が通る
- [x] `dist/` に必要なアセットがすべて出力される
- [x] `vite.config.ts` の `base` は未指定(=`/`)で OK
- [x] `manifest.webmanifest` の `start_url`/`scope` が `/`
- [ ] **`public/_redirects` を作成**(SPA フォールバック、下記の「必須対応」参照)

### 任意(推奨)

- [ ] `public/_headers` でキャッシュ制御を明示(下記参照)
- [ ] `NODE_VERSION` を CF Pages の環境変数で固定
- [ ] 背景 PNG (3MB) を削除して WebP 一本に切り替え
- [ ] 初回プレビューで `getUserMedia` (録音) と TTS が動くこと

---

## 4. 必須対応:SPA ルーティング用 `_redirects`

このアプリは React Router (BrowserRouter) を使っているため、
`/practice/phrase_001` / `/phrases/new` 等にブラウザ直アクセス・リロードすると、
CF Pages はそのパスに対応するファイルを探し **404** を返してしまう。

**対処**:`public/_redirects` を以下の内容で作成。
(`public/` 以下のファイルはビルド時に `dist/` にそのままコピーされる)

```
/*    /index.html   200
```

これで全パスが `index.html` にフォールバックされ、React Router が解決する。

> 注意:Cloudflare Pages の SPA は `_redirects` または `_routes.json` で設定する。
> `_redirects` のほうが軽量・標準的。

---

## 5. 任意対応:`_headers` でキャッシュ制御

ハッシュ付きアセットは強キャッシュ、HTML/SW は no-cache に。

`public/_headers`:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/city/*
  Cache-Control: public, max-age=2592000

/sw.js
  Cache-Control: no-cache

/registerSW.js
  Cache-Control: no-cache

/index.html
  Cache-Control: no-cache

/manifest.webmanifest
  Cache-Control: public, max-age=3600
```

CF Pages のデフォルトでも基本うまく動くが、明示しておくとリロードで sw.js が古いままになる事故を防げる。

---

## 6. PWA まわりの確認ポイント

- HTTPS:Cloudflare Pages は標準で HTTPS。MediaRecorder の `getUserMedia` が動く ✅
- Service Worker:`registerType: "autoUpdate"` + `cleanupOutdatedCaches: true` で自動更新
- Precache:19 エントリ(背景画像含む)、`maximumFileSizeToCacheInBytes: 5MB` で背景画像も収納
- Manifest:`start_url: "/"`, `scope: "/"` → CF Pages ドメインルート公開と一致

---

## 7. デプロイ手順(参考)

### Git 連携でデプロイする場合(推奨)

1. GitHub などにリポジトリを push(`.gitignore` に `node_modules/`, `dist/`, `.DS_Store` を含める)
2. Cloudflare ダッシュボード → Pages → "Connect to Git" → 該当リポジトリを選択
3. 上の表の値を入力(Framework preset = Vite)
4. Deploy 押下、初回ビルド完了後 `<project>.pages.dev` で確認

### 手動アップロード(Wrangler CLI)

```bash
npm install -g wrangler   # 一度だけ
npm run build
wrangler pages deploy dist --project-name=eigochan
```

`wrangler pages deploy` は `_redirects` / `_headers` を含めてアップロード。

---

## 8. 既知の留意点

- **背景画像 (3MB PNG) のキャッシュ初期化**:初回アクセス時にダウンロード必要。CF の CDN がキャッシュするので2回目以降は速い。
- **iOS Safari のホーム追加**:`apple-touch-icon.png` 配置済み。`apple-mobile-web-app-*` メタタグも `index.html` に明示済み。
- **TTS**:Web Speech API は端末搭載音声依存。オフライン時に発音されない端末あり。Log画面に注意書き済み。
- **MediaRecorder**:HTTPS 必須(CF Pages は満たす)。Firefox 等で WebM、Safari は MP4 にフォールバック済み。

---

## 9. 次の作業候補

1. `public/_redirects` を作成(必須)
2. `public/_headers` を作成(任意)
3. PNG フォールバックを削除して dist を 0.6MB 程度に圧縮(任意)
4. CF Pages にプロジェクト接続して初回デプロイ(本番作業)
5. カスタムドメインの割当・DNS 設定(任意)
