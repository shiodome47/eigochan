# eigochan

英語を声に出すほど、街が育つ。音読・暗唱・録音で英語を体に入れる PWA。

## 特徴

- **Local-first**: 既定では何もサーバに送りません。フレーズ・進捗・音声メモはすべてブラウザの中(localStorage / IndexedDB)に保存されます。
- **オフラインで使える PWA**: Service Worker で precache し、電波がなくても起動します。
- **音声メモ**: マイクで録音した「お手本音声」「練習音声」を端末内に保存し、再生できます。
- **オプションで PC/スマホ同期**: Cloudflare Pages Functions + D1 + R2 を使った同期機能を、後付けで有効化できます。

## 開発(同期機能なし)

これだけで完結します。サーバ設定なし、ログインなし。

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ に PWA 一式
npm run typecheck
```

ホスティング先は静的ファイルが置ければ何でも OK(Cloudflare Pages / Netlify / Vercel / GitHub Pages 等)。

## オプション:PC/スマホ同期を使う場合

「自分用に PC とスマホで同じデータが見えてほしい」場合のみ、Cloudflare 側のセットアップを行います。**有効にしないユーザーには影響しません**。

### 必要なもの

- Cloudflare アカウント(Workers/Pages 無料枠で十分)
- Cloudflare Pages 上の eigochan プロジェクト
- Wrangler CLI(`npm install -g wrangler`)

### セットアップ

詳細は [DEPLOY.md §10](./DEPLOY.md) を参照。要約:

```bash
# D1 と R2 を作成し、wrangler.toml の database_id を埋める
wrangler d1 create eigochan-sync
wrangler r2 bucket create eigochan-audio
wrangler d1 migrations apply eigochan-sync --remote
```

`wrangler.toml` をコミットすれば、Cloudflare Pages が自動でビルド・デプロイし、`/api/*` の Pages Functions が D1/R2 にバインドされます。

### 同期の使いかた

Log タブ → 「この端末のデータを同期する」セクション。

| 操作 | 何が起きるか |
|---|---|
| **同期コードを作成**(PC で初回) | 256bit の同期コードを発行し、現在のローカルをサーバにアップロード |
| **同期コードで参加**(スマホで初回) | コードを入力 → サーバから取得してローカルに反映 |
| **📤 サーバへ送信(全件)** | 現在のローカル(フレーズ・進捗)をサーバに反映 |
| **📥 サーバから取り込む(全件)** | サーバ側でローカルを上書き(確認ダイアログあり) |
| **音声メモをサーバへアップロード** | IndexedDB の音声を R2 に手動アップロード |
| **音声メモをサーバから取り込む** | R2 の音声を IndexedDB に手動ダウンロード |
| **保存量を更新** | ローカルとサーバの音声件数・サイズを表示 |
| **同期を解除** | この端末から syncCode を消す(サーバデータは残る) |

> **注意**: フレーズ・進捗・音声メモは現状**自動同期されません**。各操作はユーザーがボタンを押したタイミングで実行されます。差分同期や自動 push/pull は将来の拡張候補です。

### 同期コードの扱い

- syncCode は **パスワード相当** です。漏らさないでください。
- D1 には SHA-256 ハッシュのみ保存しています(生コードはサーバに残りません)。
- 失効・再発行は現状未実装。漏れた場合は対象アカウント側の D1 を作り直す運用です。詳細は [DEPLOY.md §13](./DEPLOY.md) 参照。

## ライセンス・お問い合わせ

このリポジトリは個人プロジェクトです。

## 関連ドキュメント

- [DEPLOY.md](./DEPLOY.md) — Cloudflare Pages デプロイ手順、同期機能のセットアップ詳細、セキュリティ・運用メモ
