# Vercelデプロイ手順

このデモはNext.jsで作成しているため、Vercelにそのままデプロイできます。

## 最小構成

外部連携なしでポートフォリオ公開する場合は、以下だけで動きます。

```env
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_USE_MOCK=true
```

LIFF ID、Supabase、Slackが未設定でも、モックユーザー、ローカルストレージ、モック通知で動作します。

## デプロイ手順

1. GitHubへリポジトリをpush
2. VercelでNew Projectを作成
3. GitHubリポジトリを選択
4. Framework PresetがNext.jsになっていることを確認
5. Environment Variablesを設定
6. Deployを実行
7. 発行されたURLを `NEXT_PUBLIC_APP_URL` に設定
8. LIFFを使う場合は、LINE DevelopersのLIFF Endpoint URLにも同じURLを設定

## Vercel環境変数一覧

| 変数名 | 必須 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | 推奨 | QR会員証やLIFF URLの基準URL |
| `NEXT_PUBLIC_USE_MOCK` | 推奨 | `true`なら本番でもモック確認できる |
| `NEXT_PUBLIC_LIFF_ID` | 任意 | LINE Developersで発行したLIFF ID |
| `SUPABASE_URL` | 任意 | Supabase Project URL |
| `SUPABASE_ANON_KEY` | 任意 | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | 任意 | サーバー側保存用のService Role Key |
| `SLACK_WEBHOOK_URL` | 任意 | Slack Incoming Webhook URL |
| `ADMIN_PASSWORD` | 任意 | `/admin` と `/staff` の公開デモ用簡易パスワード |

## 本番向けの推奨

- ポートフォリオ公開だけなら `NEXT_PUBLIC_USE_MOCK=true`
- 実案件デモなら `NEXT_PUBLIC_USE_MOCK=false`
- Supabaseへ保存するなら `SUPABASE_SERVICE_ROLE_KEY` をVercelの環境変数に設定
- Slack通知を見せるなら `SLACK_WEBHOOK_URL` を設定
- 管理画面とスタッフ画面を公開URLで見せるなら `ADMIN_PASSWORD` で簡易保護
- Service Role KeyとSlack Webhook URLはブラウザに出さない

## デプロイ後の確認

以下のURLを確認します。

```text
/
/admin
/member-card
/staff
/line-flow
/line-links
/?demo=store
/?demo=beauty
/?demo=school
```

LINE公式アカウントからLIFFとして起動する手順は `docs/line-official-account-setup.md` を参照してください。
