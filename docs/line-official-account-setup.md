# LINE公式アカウント連携セットアップ

この手順では、Cloudflare Workers、Netlify、Vercelなどに公開した「LINE診断予約デモ」を、LINE公式アカウントのリッチメニューからLIFFアプリとして開ける状態に近づけます。

## 1. LINE公式アカウントを作成する

1. LINE Official Account Managerにログイン
2. 新しいLINE公式アカウントを作成
3. アカウント名、業種、プロフィール画像を設定
4. あいさつメッセージに「診断はこちら」「会員証はこちら」などの案内文を入れる
5. 友だち追加用QRコードを発行し、テスト端末で友だち追加できる状態にする

## 2. Messaging APIチャネルを作成する

1. LINE Official Account Managerで対象アカウントを開く
2. 設定からMessaging APIを有効化
3. LINE Developersへ移動
4. Providerを作成または選択
5. Messaging APIチャネルが作成されていることを確認
6. Webhookや自動返信Botを作る場合は、Webhook URLを別途設定する

このデモはLIFF、予約、通知、管理画面のポートフォリオなので、Messaging APIのWebhook実装は拡張ポイントです。

## 3. 公開URLへデプロイする

1. GitHubにリポジトリをpush
2. Cloudflare Workers、Netlify、Vercelなどで公開先を作成
3. GitHubリポジトリを選択
4. Branchを `main` にする
5. 公開先に合わせたBuild commandを設定
6. 初回は以下の最小設定で公開できます

```env
NEXT_PUBLIC_APP_URL=https://line-diagnosis-reservation-demo.pachiscope.workers.dev
NEXT_PUBLIC_USE_MOCK=true
```

公開後、診断トップ、業種別デモ、会員証、管理画面がブラウザで動くことを確認します。

`/line-links` を開くと、リッチメニューやLIFF Endpoint URLに設定する候補URLを一覧で確認できます。

## 4. LIFFアプリを作成する

1. LINE Developersで対象Providerを開く
2. Messaging APIチャネルを開く
3. LIFFタブを開く
4. Addを押してLIFFアプリを追加
5. LIFF app nameに「LINE診断予約デモ」などを入力
6. SizeはFullを推奨
7. Endpoint URLに公開URLを設定

例:

```text
https://line-diagnosis-reservation-demo.pachiscope.workers.dev
```

業種別ボタンをLIFFとして直接開きたい場合は、LIFFアプリを複数作り、それぞれのEndpoint URLを以下のように分けると説明しやすくなります。

```text
https://line-diagnosis-reservation-demo.pachiscope.workers.dev/demo/store
https://line-diagnosis-reservation-demo.pachiscope.workers.dev/demo/beauty
https://line-diagnosis-reservation-demo.pachiscope.workers.dev/demo/school
https://line-diagnosis-reservation-demo.pachiscope.workers.dev/member-card
```

スタッフ向け来店処理画面は以下です。

```text
https://line-diagnosis-reservation-demo.pachiscope.workers.dev/staff
```

`/staff` はQR会員証を読み取った後のポイント付与や来店処理を見せるスタッフ専用URLです。実案件では、一般ユーザー向けリッチメニューに直接出すのは非推奨です。店舗スタッフ用のブックマーク、管理画面内リンク、またはスタッフ専用ログイン後の導線として共有します。

## 5. 公開先の環境変数にLIFF IDを設定する

LIFFアプリ作成後、LIFF IDが発行されます。

Cloudflare、Netlify、Vercelなどの環境変数設定画面で以下を設定します。

```env
NEXT_PUBLIC_LIFF_ID=xxxxxxxxxx-xxxxxxxx
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_APP_URL=https://line-diagnosis-reservation-demo.pachiscope.workers.dev
```

設定後、公開先でRedeployします。

`NEXT_PUBLIC_USE_MOCK=false` にすると、LIFF IDがある場合に `liff.init()` を実行し、LINEログイン状態を確認します。

## 6. リッチメニューからLIFF URLへ遷移させる

LINE DevelopersでLIFFアプリを作成すると、以下のようなLIFF URLが発行されます。

```text
https://liff.line.me/{LIFF_ID}
```

LINE Official Account Managerでリッチメニューを作成し、各領域のアクションを「リンク」に設定します。

おすすめの6分割例:

| ボタン | リンク先 | 目的 |
| --- | --- | --- |
| 診断する | `https://liff.line.me/{診断用LIFF_ID}` | 診断フォームへ誘導 |
| 店舗デモ | `https://liff.line.me/{店舗用LIFF_ID}` | 店舗DX提案 |
| 美容室デモ | `https://liff.line.me/{美容室用LIFF_ID}` | 美容室予約提案 |
| スクールデモ | `https://liff.line.me/{スクール用LIFF_ID}` | 講座診断提案 |
| 会員証 | `https://liff.line.me/{会員証用LIFF_ID}` | QR会員証表示 |
| 導線説明 | `https://line-diagnosis-reservation-demo.pachiscope.workers.dev/line-flow` | 発注者向け説明 |

テスト用には `/line-links` ページでEndpoint URLを一覧確認できます。

`/staff` はスタッフ専用の来店処理画面です。リッチメニューに直接置くと一般ユーザーも開けてしまうため、本番では認証を付けたスタッフ専用URLとして共有してください。

## 7. QRコードで友だち追加してテストする

1. LINE Official Account Managerで友だち追加QRコードを表示
2. スマホのLINEアプリでQRコードを読み込む
3. 友だち追加する
4. あいさつメッセージが表示されることを確認
5. リッチメニューの「診断する」をタップ
6. LINE内ブラウザでLIFFアプリが起動することを確認
7. 診断、予約、会員証を操作する
8. `/staff` でスタッフ向け来店処理の流れを確認する
9. 管理画面で回答、予約、会員情報を確認する

## 8. 実案件での注意点

- 公開デモでは実際の個人情報を入力しない
- 本番案件では管理画面に認証を付ける
- LINE User ID、メールアドレス、相談内容の保存目的を明記する
- Supabase RLS、管理者権限、スタッフ権限を設計する
- Slack Webhook URLやSupabase Service Role Keyは公開しない
- Messaging APIで自動返信Bot化する場合はWebhook署名検証も実装する
