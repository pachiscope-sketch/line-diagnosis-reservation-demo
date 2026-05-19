# LINE診断予約デモ

LINE公式アカウント構築、LIFFアプリ開発、診断フォーム、予約導線、Slack通知、Supabase保存、QR会員証をまとめて見せるポートフォリオ用デモです。

LIFF ID、Supabase、Slackが未設定でもモックモードで動くため、Render、Cloudflare Workers、Netlifyなどにデプロイしてすぐ営業デモとして使えます。

## デモURL

今回の公開デモURLは `https://line-diagnosis-reservation-demo.onrender.com` です。別環境へデプロイする場合は、このURLを実際の公開URLに差し替えてください。`NEXT_PUBLIC_APP_URL` にも同じURLを設定すると、会員証QRやLINEリンク一覧の基準URLとして使えます。

実URLへ差し替えたREADMEは、そのままGitHubポートフォリオ、Upwork、クラウドワークス、営業DM、提案文の添付資料として使えます。

| 画面 | URL | 見せられる内容 |
| --- | --- | --- |
| 診断トップ | `https://line-diagnosis-reservation-demo.onrender.com` | LINE登録後の診断、結果表示、予約導線 |
| 店舗向けデモ | `https://line-diagnosis-reservation-demo.onrender.com/demo/store` | 来店予約、クーポン、QR会員証、ポイントカード |
| 美容室向けデモ | `https://line-diagnosis-reservation-demo.onrender.com/demo/beauty` | 髪のお悩み診断、メニュー提案、予約、再来店 |
| スクール向けデモ | `https://line-diagnosis-reservation-demo.onrender.com/demo/school` | 講座診断、無料相談予約、資料請求、見込み客管理 |
| 会員証 | `https://line-diagnosis-reservation-demo.onrender.com/member-card` | ユーザー向けQR会員証、ポイント、来店回数 |
| スタッフ画面 | `https://line-diagnosis-reservation-demo.onrender.com/staff` | QR読み取り後のポイント付与、来店処理 |
| 管理画面 | `https://line-diagnosis-reservation-demo.onrender.com/admin` | 診断回答、予約、会員、CSV出力、連携状態 |
| LINEリンク一覧 | `https://line-diagnosis-reservation-demo.onrender.com/line-links` | LINE公式アカウントに設定するURL一覧 |
| LINE導線説明 | `https://line-diagnosis-reservation-demo.onrender.com/line-flow` | リッチメニューからLIFFへ遷移する図解 |

## スクリーンショット

実際の画面キャプチャはPNGで以下に配置する想定です。現在PNG未配置の場合は、[docs/images/README.md](docs/images/README.md) の撮影手順に沿って追加してください。

| 診断トップ | 診断結果 | QR会員証 |
| --- | --- | --- |
| ![診断トップ](docs/images/top.png) | ![診断結果](docs/images/result.png) | ![QR会員証](docs/images/member-card.png) |

| スタッフ画面 | 管理画面 | LINE導線説明 |
| --- | --- | --- |
| ![スタッフ画面](docs/images/staff.png) | ![管理画面](docs/images/admin.png) | ![LINE導線説明](docs/images/line-flow.png) |

配置予定ファイル:

```text
docs/images/top.png
docs/images/result.png
docs/images/member-card.png
docs/images/staff.png
docs/images/admin.png
docs/images/line-flow.png
```

## このデモで応募しやすい案件

- LINE公式アカウント構築
- LIFFミニアプリ開発
- Lステップ風の診断・ステップ配信導線
- 店舗DX、会員証、ポイントカード、来店管理
- 美容室・サロンの予約率改善
- スクール・講座販売の無料相談予約導線
- Slack通知、Supabase保存、管理画面付きの業務改善
- Render / Cloudflare Workers / Netlifyデプロイ込みの小規模Webアプリ構築

## サービス概要

LINE公式アカウントを「配信だけ」で終わらせず、登録後のユーザーを診断、予約、会員化、再来店促進まで案内するデモアプリです。

想定する導線:

```text
LINE登録 → リッチメニュー → LIFF診断 → 結果表示 → 予約 → Slack通知 → Supabase管理
```

店舗、美容室、スクールの3パターンを切り替えられるため、LINE構築、LIFF開発、店舗DX、会員証、予約改善、見込み客管理など幅広い案件に応募できます。

## このポートフォリオで示せるスキル

- LINE公式アカウントの顧客導線設計
- LIFFアプリ開発
- `liff.init()` とLINE User ID取得
- 業種別の診断フォーム設計
- 予約フォームと管理者通知
- Slack Incoming Webhook通知
- Supabase保存
- QR会員証、ポイントカード、来店管理
- 管理画面、CSVエクスポート
- Render / Cloudflare Workers / Netlify / Vercelデプロイ
- 非エンジニアの発注者に伝わるデモ設計

## 追加された機能一覧

- Render / Cloudflare Workers / Netlify / Vercelデプロイ対応
- Supabase保存
- Slack通知実装
- QR会員証デモ
- LINE User ID取得処理
- リッチメニューからLIFFへ遷移する説明ページ
- 店舗向け、美容室向け、スクール向けの3パターンデモ
- 管理画面の強化

## 3つのデモパターン

### 店舗向けデモ

目的: 来店予約、クーポン配布、会員証、ポイントカード、リピート促進

導線:

```text
LINE登録 → 来店目的選択 → クーポン表示 → 予約 → 会員証表示 → Slack通知
```

URL:

```text
/?demo=store
```

### 美容室向けデモ

目的: 髪の悩み診断、おすすめメニュー提案、予約率向上、再来店促進

導線:

```text
LINE登録 → 髪の悩み診断 → おすすめメニュー表示 → 予約 → 来店後ポイント付与
```

URL:

```text
/?demo=beauty
```

### スクール向けデモ

目的: 講座診断、無料相談予約、資料請求、見込み客管理

導線:

```text
LINE登録 → 学習目的診断 → おすすめ講座表示 → 無料相談予約 → 管理者通知
```

URL:

```text
/?demo=school
```

詳細は [docs/demo-patterns.md](docs/demo-patterns.md) を参照してください。

## 画面

- `/` 診断予約デモ
- `/demo/store` 店舗向けデモ
- `/demo/beauty` 美容室向けデモ
- `/demo/school` スクール向けデモ
- `/admin` 管理画面
- `/member-card` ユーザー向けQR会員証
- `/staff` 店舗スタッフ向け来店処理
- `/line-flow` リッチメニューからLIFFへの導線説明
- `/line-links` リッチメニュー用リンク一覧

## ユーザー画面・スタッフ画面・管理画面

このデモは、実店舗運用を説明しやすいように3つの画面に分けています。

- ユーザー画面: `/member-card` でLINE会員証、ポイント、来店回数を表示
- スタッフ画面: `/staff` でQR読み取り後の来店処理とポイント付与を想定。本番ではスタッフ認証が必須
- 管理画面: `/admin` で診断回答、予約、会員情報、CSV出力、連携状態を確認。本番では管理者認証が必須

認証方針は [docs/admin-auth-plan.md](docs/admin-auth-plan.md) を参照してください。

## LIFF連携

`lib/liff.ts` と `hooks/useLiff.ts` にLIFF初期化処理を分離しています。

`NEXT_PUBLIC_LIFF_ID` が設定されている場合:

1. `liff.init({ liffId })` を実行
2. `liff.isLoggedIn()` を確認
3. 未ログインの場合は `liff.login()` に誘導できる構成
4. ログイン済みの場合は `liff.getProfile()` で `displayName`、`userId`、`pictureUrl` を取得
5. 診断回答、予約、会員証にLINE情報を連携

未設定の場合は以下のモックユーザーで動作します。

```json
{
  "userId": "Udemo1234567890",
  "displayName": "Demo User",
  "pictureUrl": ""
}
```

実案件では、LINE User IDや表示名は個人情報に準じて扱い、利用目的、保存期間、削除依頼への対応を決めてから運用してください。

## LINEアプリとして動かす手順

公開URLへデプロイした後、LINE DevelopersでLIFFアプリを作成すると、LINE公式アカウントのリッチメニューからこのアプリを開けます。

1. Cloudflare Workers、Netlify、Vercelなどで公開URLを発行
2. LINE Official Account ManagerでLINE公式アカウントを作成
3. LINE DevelopersでMessaging APIチャネルを確認
4. LIFFアプリを作成し、Endpoint URLに公開URLを設定
5. 発行されたLIFF IDを公開先の `NEXT_PUBLIC_LIFF_ID` に設定
6. `NEXT_PUBLIC_USE_MOCK=false` に切り替えてRedeploy
7. リッチメニューの「診断する」にLIFF URLを設定
8. 必要に応じて「会員証」「店舗デモ」「美容室デモ」「スクールデモ」用のLIFFアプリも追加

リッチメニューから診断画面へ誘導する場合は、診断トップ用LIFF URLを設定します。会員証を直接開かせたい場合は、Endpoint URLを `/member-card` にしたLIFFアプリを別途作ると説明しやすくなります。

管理画面 `/admin` はユーザー向けのLINE画面ではなく、営業デモや運用担当者向けに共有するURLです。本番案件では認証を付けて、一般ユーザーには見せない構成にします。

詳細手順は [docs/line-official-account-setup.md](docs/line-official-account-setup.md) を参照してください。

LINE公式アカウントから実際にLIFFとして開く前の確認項目は [docs/line-production-checklist.md](docs/line-production-checklist.md) にまとめています。

## Supabase保存

Supabaseが未設定の場合は、ローカルストレージとモックデータで動きます。

設定済みの場合は以下をSupabaseへ保存します。

- `diagnosis_answers`: 診断回答
- `reservations`: 予約情報
- `customers`: 会員証、ポイント、来店回数

SQLは [supabase/schema.sql](supabase/schema.sql) にあります。

セットアップ詳細は [docs/supabase-setup.md](docs/supabase-setup.md) を参照してください。

RLSについて:

このポートフォリオでは、サーバー側API RouteからSupabaseへ保存する構成です。本番運用では、RLS、管理者認証、スタッフ権限、LINEユーザー本人の参照範囲を設計してから公開してください。

## Slack通知

予約送信時に `SLACK_WEBHOOK_URL` が設定されていればSlackへ通知します。

未設定の場合は `console.log` にモック通知を出すため、画面は落ちません。

通知内容には、名前、メール、業種、目的、希望日時、相談内容、LINE表示名、LINE User ID、デモ種別を含めています。

設定手順は [docs/slack-setup.md](docs/slack-setup.md) を参照してください。

## QR会員証

`/member-card` で、LINE User IDまたはモックユーザーIDを使った会員証を表示します。

表示内容:

- 会員番号
- 表示名
- ポイント
- 来店回数
- QRコード
- 最終来店日
- 来店スタンプ追加
- スタッフ向け来店処理モック

詳細は [docs/member-card-demo.md](docs/member-card-demo.md) を参照してください。

## リッチメニューからLIFFへの導線

`/line-flow` に、LINE公式アカウントのリッチメニューからLIFFアプリへ遷移する流れを図解しています。

説明内容:

1. 友だち追加
2. あいさつメッセージ
3. リッチメニューの「診断する」をタップ
4. LIFFアプリ起動
5. 診断フォーム回答
6. 予約、会員証、クーポンへ誘導
7. Slack通知
8. Supabase管理画面で確認

詳細は [docs/line-richmenu-flow.md](docs/line-richmenu-flow.md) を参照してください。

リッチメニューに設定するURLは `/line-links` で一覧確認できます。`/line-links` では、LINE Developersに設定するEndpoint URLと、LINE公式アカウントのリッチメニューに設定するLIFF URLの違いも確認できます。

6分割リッチメニューの文言、リンク先、デザイン方針は [docs/rich-menu-design.md](docs/rich-menu-design.md) にまとめています。

## ローカル起動手順

```bash
npm install
npm run dev
```

```text
http://localhost:3000
```

検証:

```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

## 環境変数

`.env.example` を参考に `.env.local` を作成します。

```env
NEXT_PUBLIC_LIFF_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_DEMO_MODE=false

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SLACK_WEBHOOK_URL=
GOOGLE_SHEETS_SPREADSHEET_ID=

ADMIN_USERNAME=admin
ADMIN_PASSWORD=
```

未設定でも動く項目:

- LIFF ID未設定: モックユーザーで動作
- Supabase未設定: ローカルストレージとモックデータで動作
- Slack未設定: console.logでモック通知
- `ADMIN_PASSWORD` 未設定: 管理画面は営業デモ用に未保護で表示
- `ADMIN_PASSWORD` 設定済み: `/admin` と `/api/admin-data` に簡易Basic認証

## Renderデプロイ手順

1. GitHubにこのリポジトリをpush
2. RenderでNew Web Serviceを選択
3. GitHubリポジトリを選択
4. Branchは `main`
5. RuntimeはNode、Instance TypeはFreeを選択
6. Build commandは `npm install && npm run build`
7. Start commandは `npm run start`
8. 初回は `NEXT_PUBLIC_USE_MOCK=true` でDeploy
9. 発行されたRender URLを `NEXT_PUBLIC_APP_URL` とLINE DevelopersのLIFF Endpoint URLに設定
10. LINEアプリとして開く場合は `NEXT_PUBLIC_LIFF_ID` と `NEXT_PUBLIC_USE_MOCK=false` を設定してRedeploy

モックだけで公開する場合は、最低限以下で動きます。

```env
NEXT_PUBLIC_APP_URL=https://line-diagnosis-reservation-demo.onrender.com
NEXT_PUBLIC_USE_MOCK=true
```

今回の公開デモはRenderのFree Web Serviceで動かしています。詳細は [docs/deployment-render.md](docs/deployment-render.md) を参照してください。Cloudflare Workersを使う場合は [docs/deployment-cloudflare.md](docs/deployment-cloudflare.md)、Netlifyを使う場合は [docs/deployment-netlify.md](docs/deployment-netlify.md)、Vercelを使う場合の旧手順は [docs/deployment-vercel.md](docs/deployment-vercel.md) に残しています。

LINE公式アカウントからLIFFとして開く詳しい手順は [docs/line-official-account-setup.md](docs/line-official-account-setup.md) を参照してください。接続前の点検は [docs/line-production-checklist.md](docs/line-production-checklist.md)、管理画面とスタッフ画面の保護方針は [docs/admin-auth-plan.md](docs/admin-auth-plan.md) にまとめています。

## 実案件で拡張できること

- Messaging APIでの自動返信Bot
- LINE公式アカウントのタグ付け
- Lステップ風のステップ配信シナリオ
- Google Sheets、Notion、Airtable、CRM連携
- 予約カレンダー連携
- 管理者ログイン
- スタッフ権限
- クーポン利用履歴
- 会員ランク
- 決済連携
- 来店後アンケート

## 注意点

- LINE User ID、メールアドレス、予約内容は個人情報として扱ってください。
- 本番運用ではSupabase RLS、認証、管理者権限、削除依頼対応を設計してください。
- Slack Webhook URLやSupabase Service Role Keyは公開しないでください。
- LIFF Endpoint URLはHTTPSが必要です。
- Messaging APIを使う場合は、LINE Developers側のWebhook設定も別途必要です。
- 公開デモでは「ポートフォリオ用デモです。実際の個人情報は入力しないでください。」という注意文を表示しています。
- 管理画面は本番案件では必ず認証を付け、閲覧権限を分けてください。
- スタッフ画面は本番案件ではスタッフ専用認証を付け、一般ユーザー向けリッチメニューには出さないでください。

## スクリーンショット配置場所

GitHub掲載用の画像は `docs/images/` に配置してください。

```text
docs/images/top.png
docs/images/result.png
docs/images/member-card.png
docs/images/staff.png
docs/images/admin.png
docs/images/line-flow.png
```
