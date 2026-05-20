# 管理画面・スタッフ画面の認証設計メモ

このドキュメントは、公開デモで使う簡易保護と、本番案件で必要になる認証設計を整理したものです。

## 現在の簡易認証

このポートフォリオでは、`ADMIN_PASSWORD` が設定されている場合だけ `/admin` と `/staff` に簡易パスワード認証を出します。

- 対象画面: `/admin`, `/staff`
- Cookie名: `line_demo_admin_auth`
- Cookie有効期限: 12時間
- Cookie属性: `httpOnly`, `sameSite=lax`, 本番環境では `secure`
- パスワード検証: サーバー側APIでのみ実行
- 保護対象API: `/api/admin-data`

`ADMIN_PASSWORD` が未設定の場合は、営業・応募用にすぐ見せられるデモモードとして従来通り表示します。

## 認証API

実装しているAPIは以下です。

```text
POST /api/auth/admin-login
POST /api/auth/admin-logout
GET  /api/auth/admin-status
```

`admin-login` は `password` を受け取り、環境変数 `ADMIN_PASSWORD` と一致した場合のみHTTP-only Cookieを設定します。`admin-status` は認証済みか、またはデモモードかを返します。

## ADMIN_PASSWORD の設定方法

ローカルでは `.env.local` に設定します。

```env
ADMIN_PASSWORD=change-this-password
```

この値はGitHub、README、チャット、スクリーンショットに載せないでください。

## Renderでの設定方法

1. Render Dashboardで対象Web Serviceを開く
2. Environmentを開く
3. `ADMIN_PASSWORD` を追加
4. 値にデモ共有用のパスワードを設定
5. SaveしてManual DeployまたはRedeployを実行

設定後は `/admin` と `/staff` でパスワード入力画面が表示されます。未設定の場合はデモモード表示になります。

## 本番案件で必要な認証設計

この簡易認証はポートフォリオ用です。本番では以下のような設計に置き換えることを推奨します。

- 管理者ログイン
- 店舗スタッフログイン
- スタッフごとの操作権限
- LINEユーザー本人だけが自分の会員証や予約を見られる設計
- CSV出力や予約詳細の閲覧権限
- 操作ログ、監査ログ
- パスワードリセット
- 退職スタッフの権限停止

候補としては、Supabase Auth、NextAuth、Basic認証、Vercel Middleware、Cloudflare Access、独自認証などがあります。

## 権限分離の考え方

本番では画面ごとに役割を分けます。

| 役割 | できること |
| --- | --- |
| 管理者 | 診断回答、予約、会員情報、CSV出力、設定変更 |
| 店舗スタッフ | QR読み取り後の来店処理、ポイント付与、予約確認 |
| LINEユーザー | 自分の診断結果、予約、会員証、ポイント確認 |

特に `/staff` は一般ユーザー向けリッチメニューには出さず、スタッフ専用URLまたはスタッフ用ログイン後の導線にします。

## 個人情報保存時の注意

診断回答、予約情報、メールアドレス、LINE User IDは個人情報に該当し得ます。本番案件では以下を事前に決めてください。

- 取得目的
- 保存期間
- 削除依頼への対応
- 管理者・スタッフの閲覧範囲
- Slack通知に含める情報の範囲
- CSVダウンロード権限
- プライバシーポリシーへの記載

## Supabase RLSとの関係

Supabaseを本番利用する場合は、RLSを有効にして、役割ごとに参照・更新できる範囲を制限します。

- 管理者: 全件参照、必要な更新
- スタッフ: 店舗に紐づく予約・会員情報のみ
- LINEユーザー: 自分の `line_user_id` に紐づくデータのみ

このデモではNext.js API RouteからService Role Keyで保存できる構成にしていますが、本番では認証済みユーザーの権限とRLSポリシーを合わせて設計してください。
