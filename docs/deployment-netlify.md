# Netlifyデプロイ手順

このデモはNext.js App RouterとAPI Routeを使っています。Netlifyは現在のNext.jsに対してOpenNext adapterを自動適用するため、通常は追加プラグインを固定せずにデプロイできます。

## 1. 事前準備

1. GitHubの `main` に最新コードをpushする
2. `npm run check` がローカルで成功していることを確認する
3. Netlifyにログインする
4. GitHub連携を許可する

## 2. New site from Gitで作成

1. Netlify Dashboardで「Add new site」または「New site from Git」を選択
2. Git providerにGitHubを選択
3. `pachiscope-sketch/line-diagnosis-reservation-demo` を選択
4. Branchは `main`
5. Build commandは `npm run build`
6. Publish directoryは `.next`

`netlify.toml` にも同じ設定を入れています。

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

## 3. 初回環境変数

初回はLIFF IDがなくても動くように、モックモードで公開します。

```env
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NEXT_PUBLIC_USE_MOCK=true
```

Netlify URLがまだ未確定の場合は、まず `NEXT_PUBLIC_USE_MOCK=true` だけでDeployし、公開URLが発行された後に `NEXT_PUBLIC_APP_URL` を更新してRedeployします。

## 4. 公開後に確認するURL

```text
https://your-site.netlify.app
https://your-site.netlify.app/demo/store
https://your-site.netlify.app/demo/beauty
https://your-site.netlify.app/demo/school
https://your-site.netlify.app/member-card
https://your-site.netlify.app/line-links
https://your-site.netlify.app/line-flow
https://your-site.netlify.app/admin
https://your-site.netlify.app/staff
```

API Routeも確認します。

```text
POST https://your-site.netlify.app/api/reservations
POST https://your-site.netlify.app/api/notify
```

Slack未設定時は `console.log` のモック通知になり、ユーザー画面は落ちません。

## 5. LIFF ID取得後の環境変数

LINE DevelopersでLIFFアプリを作成したら、NetlifyのSite configuration → Environment variablesで以下を設定します。

```env
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NEXT_PUBLIC_LIFF_ID=xxxxxxxxxx-xxxxxxxx
NEXT_PUBLIC_USE_MOCK=false
```

設定後、Deploysから「Trigger deploy」または「Retry deploy」でRedeployします。

## 6. LINE Developersに設定するURL

メインLIFFアプリ:

```text
Endpoint URL: https://your-site.netlify.app
```

業種別や会員証を直接開くLIFFを分ける場合:

```text
Endpoint URL: https://your-site.netlify.app/demo/store
Endpoint URL: https://your-site.netlify.app/demo/beauty
Endpoint URL: https://your-site.netlify.app/demo/school
Endpoint URL: https://your-site.netlify.app/member-card
```

リッチメニューに設定するURLは、Endpoint URLではなくLIFF URLです。

```text
Rich menu URL: https://liff.line.me/{LIFF_ID}
```

`/staff` はスタッフ専用URLです。一般ユーザー向けリッチメニューには出さず、本番では認証を付けて共有してください。

## 7. 本番案件で追加すること

- 管理画面とスタッフ画面の認証
- Supabase RLSとスタッフ権限設計
- LINE User IDやメールアドレスの保存目的、削除依頼対応
- Slack Webhook URL、Supabase Service Role Keyなどの秘密情報管理
- Messaging APIでBot化する場合のWebhook署名検証
