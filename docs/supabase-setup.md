# Supabase設定手順

このデモでは、診断回答、予約情報、会員証データをSupabaseへ保存できます。

未設定の場合はローカルストレージとモックデータで動くため、Supabaseなしでもデモ確認できます。

## 作成するテーブル

- `diagnosis_answers`
- `reservations`
- `customers`

SQLは [../supabase/schema.sql](../supabase/schema.sql) にあります。

## セットアップ手順

1. SupabaseでProjectを作成
2. SQL Editorを開く
3. `supabase/schema.sql` の内容を実行
4. Project Settings → APIでURLとキーを確認
5. `.env.local` またはVercel Environment Variablesに設定

```env
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 保存される内容

### diagnosis_answers

- LINE User ID
- LINE表示名
- 業種
- 課題や悩み
- 目的
- 選択機能
- おすすめプラン
- デモ種別

### reservations

- LINE User ID
- LINE表示名
- 名前
- メール
- 希望日時
- 相談内容
- 診断回答ID
- デモ種別

### customers

- LINE User ID
- LINE表示名
- 会員番号
- QRコード値
- ポイント
- 来店回数
- 最終来店日

## RLSについて

`schema.sql` ではRLSを有効化しています。

このポートフォリオでは、ブラウザからSupabaseへ直接書き込むのではなく、Next.js API Routeを経由して保存します。API Route内で `SUPABASE_SERVICE_ROLE_KEY` を使い、診断回答、予約、会員情報をSupabaseへ保存する構成です。

Service Role KeyはRLSを回避できる強い権限を持つため、必ずサーバー側環境変数にだけ設定してください。`NEXT_PUBLIC_` を付けたり、ブラウザへ渡したりしてはいけません。

このデモはポートフォリオ用途のため、管理者ログインやスタッフ認証までは実装していません。本番ではRLSポリシーと認証設計が必須です。

本番運用では以下を設計してください。

- 管理者だけが全データを見られるポリシー
- LINEユーザー本人だけが自分の会員証を見られるポリシー
- 店舗スタッフが来店処理だけ行える権限
- 管理者、スタッフ、LINEユーザー本人の参照範囲
- 予約情報やメールアドレスを扱う画面のアクセス制御
- 個人情報削除依頼への対応
- 保存期間

## 本番RLS設計の例

- 管理者: `diagnosis_answers`、`reservations`、`customers` を全件閲覧可能
- 店舗スタッフ: `customers` のポイント更新と来店回数更新だけ可能
- LINEユーザー本人: 自分の `customers` レコードだけ閲覧可能
- 公開フォーム: 直接DBへ書かず、API Routeでバリデーション後に保存

LIFFで取得したLINE User IDを本人識別に使う場合も、単体では認証として十分ではありません。実案件では、LINE Login、独自管理者ログイン、スタッフログインの組み合わせを検討してください。

## Supabase未設定時

環境変数が未設定の場合は、アプリは落ちずに以下で動きます。

- 診断回答: ローカルストレージ保存
- 予約: ローカルストレージ保存
- 会員証: ローカルストレージ保存
- 管理画面: ローカルデータまたはモックデータ表示
