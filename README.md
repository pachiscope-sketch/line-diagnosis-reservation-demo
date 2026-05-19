# LINE診断予約デモ

LINE公式アカウント構築、LIFFアプリ開発、診断フォーム、予約導線、Slack通知、Supabase保存、QR会員証をまとめて見せるポートフォリオ用デモです。

LIFF ID、Supabase、Slackが未設定でもモックモードで動くため、Vercelにデプロイしてすぐ営業デモとして使えます。

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
- Vercelデプロイ
- 非エンジニアの発注者に伝わるデモ設計

## 追加された機能一覧

- Vercelデプロイ対応
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
- `/admin` 管理画面
- `/member-card` QR会員証デモ
- `/line-flow` リッチメニューからLIFFへの導線説明

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
npm run build
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
```

未設定でも動く項目:

- LIFF ID未設定: モックユーザーで動作
- Supabase未設定: ローカルストレージとモックデータで動作
- Slack未設定: console.logでモック通知

## Vercelデプロイ手順

1. GitHubにこのリポジトリをpush
2. VercelでNew Projectを作成
3. GitHubリポジトリを選択
4. Framework PresetはNext.js
5. Environment Variablesに必要な値を設定
6. Deployを実行
7. 発行されたURLを `NEXT_PUBLIC_APP_URL` とLINE DevelopersのLIFF Endpoint URLに設定

モックだけで公開する場合は、最低限以下で動きます。

```env
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_USE_MOCK=true
```

詳細は [docs/deployment-vercel.md](docs/deployment-vercel.md) を参照してください。

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

## スクリーンショット

GitHub掲載用の画像は `docs/images/` に配置してください。

```text
docs/images/top.png
docs/images/result.png
docs/images/member-card.png
docs/images/admin.png
docs/images/line-flow.png
```
