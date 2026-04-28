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

---

## 11. セキュリティ・運用メモ(Phase 5)

同期機能を本番運用するときに守ること、設定すべきこと。

### 11.1 syncCode はパスワード相当

- **生値はサーバに保存しない**。D1 の `users.code_hash` には SHA-256 hex のみ。
- `console.log` / 例外メッセージ / レスポンスエラーボディに **絶対出さない**。
  `functions/_lib/auth.ts` と `functions/api/codes.ts` で `catch (_err)` の握り潰しは意図的(エラー詳細にトークンが混入しないよう)。
- クライアントの `localStorage["eigochan.sync.code"]` に保存しているため、XSS が起きると流出する。
  サードパーティスクリプトを増やさない、`Content-Security-Policy` を Cloudflare Pages の `_headers` で設定する、等の追加防御が望ましい。
- 漏れたら現状は D1 を作り直す運用(§13 参照)。

### 11.2 R2 バケットは public にしない

- `eigochan-audio` は **Public access off** のまま運用。
- バイナリ取得は必ず Worker 経由(`GET /api/audio/:phraseId/:slot`)。
- レスポンスに `Cache-Control: private, no-store` を付けて中間キャッシュを禁止(実装済)。

### 11.3 ペイロード上限

- 音声 1 ファイルあたり **5MB** 上限(`functions/api/audio/[phraseId]/[slot].ts`)。
- `Content-Type` は `audio/` 始まりのみ許可。
- `phraseId` は `^[A-Za-z0-9_-]{1,80}$` で検証(URL からそのまま R2 key を組むため厳格に)。

### 11.4 推奨:Cloudflare Rate Limiting

ダッシュボード → Security → WAF → Rate limiting rules で、以下の API に保護を入れることを推奨。

| パス | 想定攻撃 | 推奨レート |
|---|---|---|
| `POST /api/codes` | コード乱発による D1 行膨張 | IP あたり 5 req / 1 hour |
| `GET /api/me` | syncCode のブルートフォース | IP あたり 10 req / 1 minute |
| `PUT /api/audio/*` | 帯域・容量の悪用 | IP あたり 30 req / 1 minute |
| `GET /api/audio/*` | 帯域消費型 DoS | IP あたり 60 req / 1 minute |
| `PUT /api/sync/snapshot` | 大量書き込みによる D1 row 膨張 | IP あたり 30 req / 1 minute |

レート上限は実利用に合わせて調整。1 ユーザー = 1 IP とは限らないため過度に絞ると誤爆する。

### 11.5 監視

- Cloudflare ダッシュボード → Workers & Pages → eigochan → Functions タブで、Worker invocations / Errors を見る。
- D1 のローエラーは Pages のログには出ないので、デプロイ後に `wrangler d1 execute eigochan-sync --remote --command "SELECT COUNT(*) FROM users"` 等で散発的にヘルスチェック。

---

## 12. 差分同期の設計メモ(未実装、Phase 5+)

現状は GET/PUT ともに**全件スナップショット**で動いている。データが増えると以下の問題が出てくる:

- 帯域の浪費(変わってない行も毎回送受信)
- 起動時 pull の自動化に向かない(コスト的に)

### 12.1 サーバ側の拡張(forward-compatible)

`GET /api/sync/snapshot?since=<ISO>` を実装する。

```ts
const url = new URL(request.url);
const since = url.searchParams.get("since"); // null or "2026-04-28T..."

// phrases: since 指定時は updated_at > since の行を全部返す(tombstone 含む)
const sql = since
  ? `SELECT ..., deleted_at FROM phrases WHERE user_id = ? AND updated_at > ? ORDER BY phrase_id`
  : `SELECT ... FROM phrases WHERE user_id = ? AND deleted_at IS NULL ORDER BY phrase_id`;
```

- `since` 未指定なら**従来通り全件 alive のみ**(API 後方互換)
- `since` 指定なら **alive 行 + tombstone 行**(クライアントが削除を反映できるよう)
- progress も `updated_at > since` のときだけ返す(`null` で「変化なし」を表現)
- 同様に `GET /api/audio?since=<ISO>` も拡張

### 12.2 クライアント側の merge ロジック(未実装)

現状の Phase 2 GET 受信ロジック(`SyncSettings.handlePullSnapshot`)は **全件上書き**。差分同期では merge が必要:

```pseudocode
for incoming in response.phrases:
  if incoming.deleted_at: localDelete(incoming.id)
  else if local has incoming.id with older updatedAt: localUpsert(incoming)
  else if local missing: localUpsert(incoming)
```

これを実装するには、**ローカル側の `Phrase` に `updatedAt` フィールドを追加**する必要がある(現在は型に存在しない)。`localStorage` のスキーマ拡張になるため、既存データの読み出し時に `updatedAt = epoch 0` 扱いで補完するマイグレーションが必要。

### 12.3 段階的移行案

1. **Step A**(本タスクで実装可能):サーバ側 `?since` を実装。クライアントは未使用。後方互換。
2. **Step B**(別タスク):`Phrase` 型に `updatedAt` を追加、addCustomPhrase / updateCustomPhrase で記録。`localStorage` 旧データは epoch 0 で読み込み。
3. **Step C**(別タスク):クライアント側 `lastSyncedAt` を保存、起動時に `?since` でフェッチして merge。
4. **Step D**(別タスク):書き込み時に fire-and-forget の差分 PUT。失敗時はキューに蓄積。

各 Step は独立にデプロイ可能。

---

## 13. 同期コードの失効・再発行の設計メモ(未実装、Phase 5+)

### 13.1 必要性

syncCode が漏れた場合、現状は対処不能(サーバ側に削除手段なし)。実装案:

- **DELETE /api/codes/current**:Bearer 認可で自分の `users` 行と関連データ(phrases / progress / phrase_audio / R2 オブジェクト)を全削除。
- **POST /api/codes/rotate**:現コードで認可 → 新コードを発行 → 旧 `code_hash` を新ハッシュに置き換え(同じ `user_id` を維持してデータを保つ)。

### 13.2 設計上の注意

- **rotate は冪等にする**:ネットワーク障害でクライアントが新コードを受け取れなかった場合、旧コードでもう一度 rotate を呼んでも問題ないようにする(難しい)。実装案:rotate のレスポンスを idempotency-key 付きでキャッシュする、または「旧コード」「新コード」両方が一定時間有効な遷移期間を設ける。
- **DELETE は強い破壊操作**なので、UI で「最後の確認」を必ず挟む。R2 オブジェクトは個別 DELETE が必要(D1 cascade では消えない)。
- **rate limit を厳しく**:rotate / DELETE は通常そう頻繁には呼ばないので、IP あたり 1 req / 1 hour 程度に絞る。

### 13.3 当面の運用(現状)

漏えいが確認されたら:

```bash
# 漏れた syncCode の SHA-256 hash を求めて該当 users 行を削除
wrangler d1 execute eigochan-sync --remote \
  --command "DELETE FROM users WHERE code_hash = '<漏れた syncCode の SHA-256>'"
# CASCADE で関連する phrases / progress / phrase_audio も消える
# R2 オブジェクトは別途手動削除:
wrangler r2 bucket list-objects eigochan-audio --prefix "audio/<user_id>/"
```

R2 のクリーンアップは現状ツール経由しかないので、定期的なオーファン回収機能を将来追加する。

---

## 14. 競合解決の方針(現状 LWW)

PC とスマホで同時に同じデータを編集した場合の扱い。

### 14.1 現状の動作

サーバ側 D1 では行ごとに `updated_at` を持ち、`UPSERT … WHERE excluded.updated_at >= phrases.updated_at` で **Last Write Wins** している(Phase 2 / Phase 3 で実装済)。具体的には:

- **新しい `updated_at` が勝つ**:あとから書いた方が常に上書きする
- **削除も LWW**:`deleted_at` を立てるのも `updated_at` で勝負する
- **クライアント未来時計対策**:サーバ now にクランプ(`min(client_ts, server_now)`)

### 14.2 ローカルデータ保護の原則

サーバ取り込み時(JOIN / Pull)に **失敗したらローカルを書き換えない**:

- 取り込み前にユーザー確認ダイアログを必須(SyncSettings 実装済)
- ネットワーク失敗時はローカル不変(syncClient の `SyncResult` 設計)
- 部分書き込みを避ける(snapshot は all-or-nothing)

### 14.3 将来の conflict UI 設計案

LWW で「自分の編集が上書きされた」という体験は混乱を招く。将来の改善案:

- **3-way merge**:サーバの old(前回 sync 時)と new(今のサーバ)とローカルの 3 点で差分を見て、両方にユニークな変更がある行は「競合」として通知。
- **競合通知**:Pull 時に「サーバ側で N 件、ローカル側で M 件、両方変わっていて K 件競合があります」のサマリーを出す。
- **per-row resolution**:競合行ごとに「サーバ採用」「ローカル採用」を選ばせる(凝った UI)。

これらはスマホ ↔ PC 1 ユーザーの想定では稀なケースなので、優先度は低い。
