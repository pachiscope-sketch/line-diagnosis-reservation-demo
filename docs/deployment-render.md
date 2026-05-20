# Renderデプロイ手順

このデモはNext.js App RouterとAPI Routeを使っています。RenderではNode.js Web Serviceとして起動し、`next start` で公開します。

## 公開デモURL

```text
https://line-diagnosis-reservation-demo.onrender.com
```

RenderのFreeインスタンスは一定時間アクセスがないとスリープします。初回アクセス時に起動まで時間がかかることがありますが、LIFF Endpoint URLとして使えるHTTPS URLを発行できます。

## 1. Web Serviceを作成する

1. Render Dashboardにログイン
2. NewからWeb Serviceを選択
3. GitHub連携で `pachiscope-sketch/line-diagnosis-reservation-demo` を選択
4. Branchを `main` にする
5. RuntimeをNodeにする
6. Instance TypeはFreeを選択

## 2. Build / Start command

```bash
Build command: npm install && npm run build
Start command: npm run start
```

`package.json` の `start` は `next start` です。Renderは `PORT` を渡すため、Next.jsはRender側のポートで起動します。

## 3. 初回環境変数

最初はLINE連携なしのモックモードで公開します。

```env
NEXT_PUBLIC_USE_MOCK=true
```

Render URLが発行された後に、以下を追加して再デプロイします。

```env
NEXT_PUBLIC_APP_URL=https://line-diagnosis-reservation-demo.onrender.com
NEXT_PUBLIC_USE_MOCK=true
```

`NEXT_PUBLIC_APP_URL` を設定すると、会員証QRコードや `/line-links` のEndpoint URL表示がRender URLにそろいます。

## 4. 再デプロイ

Environment Variablesで値を保存すると、Renderは再デプロイできます。手動で実行する場合は、サービス画面のManual Deployから最新コミットをデプロイします。

## 5. 確認するURL

```text
https://line-diagnosis-reservation-demo.onrender.com
https://line-diagnosis-reservation-demo.onrender.com/demo/store
https://line-diagnosis-reservation-demo.onrender.com/demo/beauty
https://line-diagnosis-reservation-demo.onrender.com/demo/school
https://line-diagnosis-reservation-demo.onrender.com/member-card
https://line-diagnosis-reservation-demo.onrender.com/line-links
https://line-diagnosis-reservation-demo.onrender.com/line-flow
https://line-diagnosis-reservation-demo.onrender.com/admin
https://line-diagnosis-reservation-demo.onrender.com/staff
```

API Route:

```text
GET  https://line-diagnosis-reservation-demo.onrender.com/api/reservations
GET  https://line-diagnosis-reservation-demo.onrender.com/api/admin-data
GET  https://line-diagnosis-reservation-demo.onrender.com/api/customers
POST https://line-diagnosis-reservation-demo.onrender.com/api/notify
```

SlackやSupabaseが未設定でも、モックモードとして落ちずに動けばOKです。

## 6. LIFF ID取得後

LINE DevelopersでLIFFアプリを作成したら、RenderのEnvironment Variablesで以下を設定します。

```env
NEXT_PUBLIC_APP_URL=https://line-diagnosis-reservation-demo.onrender.com
NEXT_PUBLIC_LIFF_ID=xxxxxxxxxx-xxxxxxxx
NEXT_PUBLIC_USE_MOCK=false
```

設定後、再デプロイします。

## 7. LINE Developersに設定するURL

メインLIFFアプリ:

```text
Endpoint URL: https://line-diagnosis-reservation-demo.onrender.com
Rich menu URL: https://liff.line.me/{LIFF_ID}
```

業種別にLIFFを分ける場合:

```text
Endpoint URL: https://line-diagnosis-reservation-demo.onrender.com/demo/store
Endpoint URL: https://line-diagnosis-reservation-demo.onrender.com/demo/beauty
Endpoint URL: https://line-diagnosis-reservation-demo.onrender.com/demo/school
Endpoint URL: https://line-diagnosis-reservation-demo.onrender.com/member-card
```

`/staff` はスタッフ専用URLです。本番では認証を付け、一般ユーザー向けリッチメニューには出さないでください。
## 追加: Render環境変数一覧

公開デモでは、必要な値だけをRenderのEnvironment Variablesに設定します。秘密値はGitHub、README、スクリーンショット、チャットに載せないでください。

| 環境変数 | 用途 | 未設定時の動作 |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | 公開URL、QRコード、リンク一覧の基準URL | ローカルまたは既定URLで表示 |
| `NEXT_PUBLIC_LIFF_ID` | LINE Developersで発行したLIFF ID | モックまたはLIFF未設定表示 |
| `NEXT_PUBLIC_USE_MOCK` | `true`ならブラウザ確認用モックを優先 | LIFF IDがあればLIFF初期化を試行 |
| `ADMIN_PASSWORD` | `/admin` と `/staff` の簡易保護 | デモモードとして従来通り表示 |
| `SUPABASE_URL` | Supabase保存先URL | ローカル保存・モックデータで動作 |
| `SUPABASE_SERVICE_ROLE_KEY` | API RouteからSupabaseへ保存するサーバー側キー | ローカル保存・モックデータで動作 |
| `SLACK_WEBHOOK_URL` | 予約通知をSlackへ送るWebhook URL | `console.log` にモック通知 |

`ADMIN_PASSWORD` を設定すると、`/admin` と `/staff` でパスワード入力画面が表示されます。値はRender側だけに保存し、READMEやGitHubには書かないでください。

LIFF接続後の推奨例:

```env
NEXT_PUBLIC_APP_URL=https://line-diagnosis-reservation-demo.onrender.com
NEXT_PUBLIC_LIFF_ID=xxxxxxxxxx-xxxxxxxx
NEXT_PUBLIC_USE_MOCK=false
ADMIN_PASSWORD=********
```

環境変数を変更した後は、RenderでManual DeployまたはRedeployを実行してください。
