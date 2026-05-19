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

このポートフォリオでは、サーバー側API Routeから `SUPABASE_SERVICE_ROLE_KEY` を使って保存する想定です。Service Role Keyは必ずサーバー側環境変数にだけ設定し、ブラウザへ公開しないでください。

本番運用では以下を設計してください。

- 管理者だけが全データを見られるポリシー
- LINEユーザー本人だけが自分の会員証を見られるポリシー
- 店舗スタッフが来店処理だけ行える権限
- 個人情報削除依頼への対応
- 保存期間

## Supabase未設定時

環境変数が未設定の場合は、アプリは落ちずに以下で動きます。

- 診断回答: ローカルストレージ保存
- 予約: ローカルストレージ保存
- 会員証: ローカルストレージ保存
- 管理画面: ローカルデータまたはモックデータ表示
