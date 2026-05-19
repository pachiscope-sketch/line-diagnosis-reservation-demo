# Cloudflare Workersデプロイ手順

Netlifyの無料クレジットが不足している場合の代替デプロイ手順です。このアプリはNext.js App RouterとAPI Routeを使うため、CloudflareではOpenNext adapterを使ってWorkersへデプロイします。

## 1. 追加済みの構成

- `@opennextjs/cloudflare`
- `wrangler`
- `open-next.config.ts`
- `wrangler.jsonc`
- `npm run preview:cloudflare`
- `npm run deploy:cloudflare`

Cloudflare公式ドキュメントでは、Next.jsのApp Router、Route Handlers、SSG、SSRはOpenNext adapterでサポートされています。

## 公開デモURL

```text
https://line-diagnosis-reservation-demo.pachiscope.workers.dev
```

このURLを `NEXT_PUBLIC_APP_URL` としてビルド時に指定すると、会員証QRコードや `/line-links` のEndpoint URL表示も公開URLにそろいます。

## 2. CloudflareでGitHub連携する場合

1. Cloudflare Dashboardにログイン
2. Workers & Pagesを開く
3. Create applicationを選択
4. GitHubリポジトリ `pachiscope-sketch/line-diagnosis-reservation-demo` を接続
5. Production branchを `main` にする
6. Build commandを以下にする

```bash
npm run deploy:cloudflare
```

Git連携のUIでDeploy commandとBuild commandが分かれている場合は、CloudflareのNext.js/OpenNext自動設定に従い、`wrangler.jsonc` を参照する設定にしてください。

## 3. CLIでデプロイする場合

```bash
npm install
npm run deploy:cloudflare
```

初回はWranglerがCloudflareログインを求めます。課金、有料プラン、カード登録が必要な画面が出た場合は進めずに止めます。

## 4. 環境変数

初回モックデモ:

```env
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_APP_URL=https://your-worker-or-pages-url
```

LIFF ID取得後:

```env
NEXT_PUBLIC_APP_URL=https://your-worker-or-pages-url
NEXT_PUBLIC_LIFF_ID=xxxxxxxxxx-xxxxxxxx
NEXT_PUBLIC_USE_MOCK=false
```

SupabaseやSlackを使う場合:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SLACK_WEBHOOK_URL=
ADMIN_PASSWORD=
```

秘密情報はGitHubやREADMEには書かず、Cloudflare Dashboardの環境変数またはWrangler secretsに設定してください。

## 5. LINE Developersに設定するURL

メインLIFFアプリ:

```text
Endpoint URL: https://your-worker-or-pages-url
Rich menu URL: https://liff.line.me/{LIFF_ID}
```

業種別にLIFFを分ける場合:

```text
Endpoint URL: https://your-worker-or-pages-url/demo/store
Endpoint URL: https://your-worker-or-pages-url/demo/beauty
Endpoint URL: https://your-worker-or-pages-url/demo/school
Endpoint URL: https://your-worker-or-pages-url/member-card
```

`/staff` はスタッフ専用URLです。本番では認証を付け、一般ユーザー向けリッチメニューには出さないでください。
