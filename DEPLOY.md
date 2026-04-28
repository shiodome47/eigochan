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

---

## 10. PC/スマホ同期 API(Phase 0–1)

`functions/api/*` で Cloudflare Pages Functions を同居させ、D1 + R2 でデータ層を組む構成。
Phase 1 では「同期コードの発行と認可疎通」だけが動く。フロント側は未連携。

### 10.1 構成ファイル

| パス | 役割 |
|---|---|
| `wrangler.toml` | Pages 用 binding 定義(`DB`=D1, `R2`=R2)、`migrations_dir = "migrations"` |
| `migrations/0001_init.sql` | `users` / `phrases` / `progress` / `phrase_audio` の初期スキーマ |
| `functions/_lib/env.ts` | `Env` 型(`DB: D1Database`, `R2: R2Bucket`) |
| `functions/_lib/json.ts` | `json()` / `jsonError()` レスポンスヘルパ(`cache-control: no-store` 付き) |
| `functions/_lib/auth.ts` | `generateSyncCode()` / `sha256Hex()` / `extractBearerToken()` / `authenticate()` |
| `functions/api/codes.ts` | `POST /api/codes` 同期コード発行 |
| `functions/api/me.ts`    | `GET  /api/me`    Bearer 検証 |
| `tsconfig.functions.json` | `functions/**/*.ts` の typecheck 設定(`@cloudflare/workers-types`) |

### 10.2 D1 と R2 の作成(初回のみ)

```bash
# D1 を作成。出力された database_id を wrangler.toml に書き戻す
wrangler d1 create eigochan-sync

# R2 バケットを作成
wrangler r2 bucket create eigochan-audio

# マイグレーションを適用(ローカル / 本番)
wrangler d1 migrations apply eigochan-sync --local
wrangler d1 migrations apply eigochan-sync --remote
```

`wrangler.toml` の `database_id = "REPLACE_WITH_D1_DATABASE_ID"` を、`d1 create` 出力の UUID で
置換する。これを忘れると本番で D1 にアクセスできない。

### 10.3 ローカルでの動作確認

```bash
# 1) フロントを一度ビルド(Pages Functions と組み合わせるため)
npm run build

# 2) Pages の dev サーバを起動。binding は wrangler.toml から読む
wrangler pages dev dist
```

別ターミナルで、

```bash
# (A) 同期コード発行
curl -i -X POST http://localhost:8788/api/codes
# 期待: 201。 body 例: {"syncCode":"<43文字 base64url>","userId":"<uuid>","createdAt":"2026-..."}

# (B) Bearer 検証(syncCode は (A) のレスポンスからコピー)
curl -i http://localhost:8788/api/me \
  -H "Authorization: Bearer <syncCode>"
# 期待: 200。 body: {"userId":"<uuid>","lastSeenAt":"2026-..."}

# (C) 認可失敗のケース
curl -i http://localhost:8788/api/me
# 期待: 401。 body: {"error":"unauthorized","message":"unauthorized"}
```

### 10.4 syncCode の保存・検証方式

- 生コードは **32 byte の `crypto.getRandomValues()` を base64url(43文字)** で表現。
- D1 に保存するのは **SHA-256(syncCode) の hex 64文字のみ**(`users.code_hash`)。
- 検証時はクライアントが `Authorization: Bearer <syncCode>` を送り、サーバ側で同じ手順で
  ハッシュして `code_hash` と照合する。
- 生コードは `console.log` / 例外メッセージ / レスポンスエラーのいずれにも出さない。
  生コードを返すのは `POST /api/codes` の 201 レスポンス **1 回限り**。

### 10.5 Cloudflare Pages 側で必要な設定

ダッシュボード(Pages → 該当プロジェクト → Settings → Functions)で以下を確認:

1. **Compatibility date** … `2025-01-01` 以降(`wrangler.toml` と一致)
2. **D1 database bindings** … `DB` → `eigochan-sync`(wrangler.toml と同期。dashboard でも明示しておくと安心)
3. **R2 bucket bindings** … `R2` → `eigochan-audio`
4. **Environment variables** … 現状不要(Phase 1)

`wrangler.toml` をコミットしておけば、Git 連携デプロイ時に上記 binding が自動で適用される。

### 10.6 typecheck / build 結果(Phase 1 完了時点)

```
$ npm run typecheck
> tsc -b --noEmit
(エラーなし)

$ npm run build
> tsc -b && vite build
✓ 68 modules transformed.
dist/index.html               1.05 kB
dist/assets/index-*.css      35.16 kB │ gzip:  7.02 kB
dist/assets/index-*.js      237.18 kB │ gzip: 76.52 kB
✓ built in 516ms
```

`vite` は `src/` のみバンドルするので `functions/` は dist に含まれない。
Cloudflare Pages 側がビルド時に `functions/` を別途ピックアップして Workers にデプロイする。

### 10.7 Phase 2 へ進む場合の手順(参考)

1. **API 追加**(`functions/api/sync/snapshot.ts`):
   - `GET /api/sync/snapshot` … `phrases` と `progress` を `authenticate()` 後に返す
   - `PUT /api/sync/snapshot` … 受信した phrases / progress を LWW で書き戻す
2. **クライアント側の sync クライアント**(`src/utils/syncClient.ts` 等):
   - `Authorization` ヘッダの管理(localStorage `eigochan.sync.code` に保存)
   - 起動時 pull、書き込み後 push
3. **設定画面 UI(最小)**:
   - 「同期を有効にする」→ `POST /api/codes` → 表示&コピー
   - 「コードで参加」→ 入力 → `GET /api/me` で疎通確認
4. **R2 アップロード**(Phase 3):
   - `PUT /api/audio/:phraseId/:slot`(body=binary、Content-Type 必須)
   - `GET /api/audio/:phraseId/:slot`(stream で返却)
   - 既存 IndexedDB はキャッシュとして残す
