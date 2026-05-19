# LINE本番接続チェックリスト

このチェックリストは、ポートフォリオ用デモをLINE公式アカウントのリッチメニューからLIFFアプリとして開く前の確認用です。

本番運用ではなく、まずは「LINE内で診断、予約、会員証が動く」ことを見せるための動作デモを想定しています。

## 1. Netlifyデプロイ確認

- [ ] GitHubの `main` がNetlifyに接続されている
- [ ] NetlifyのDeployが成功している
- [ ] `https://your-site.netlify.app` でトップ画面が開く
- [ ] `/demo/store`、`/demo/beauty`、`/demo/school` が開く
- [ ] `/member-card` が開く
- [ ] `/line-links` が開く
- [ ] `/admin` は営業デモ用URLとして開ける
- [ ] `/staff` はスタッフ専用URLとして開ける

## 2. Netlify環境変数確認

- [ ] `NEXT_PUBLIC_APP_URL` にNetlify公開URLを設定している
- [ ] `NEXT_PUBLIC_LIFF_ID` にLINE Developersで発行されたLIFF IDを設定している
- [ ] `NEXT_PUBLIC_USE_MOCK=false` にしている
- [ ] Supabaseを使う場合は `SUPABASE_URL` を設定している
- [ ] Supabaseを使う場合は `SUPABASE_SERVICE_ROLE_KEY` をサーバー側環境変数として設定している
- [ ] Slack通知を見せる場合は `SLACK_WEBHOOK_URL` を設定している
- [ ] 管理画面を公開URLで見せる場合は `ADMIN_PASSWORD` を設定している

モックデモだけで見せる場合は `NEXT_PUBLIC_USE_MOCK=true` でも動作します。LINE内で実プロフィール取得を見せたい場合は `false` にします。

## 3. LINE Developers設定確認

- [ ] LINE Developersで対象Providerを選択している
- [ ] Messaging APIチャネルが作成されている
- [ ] LIFFアプリが作成されている
- [ ] LIFF SizeはFullまたはTallにしている
- [ ] LIFF Endpoint URLにNetlify公開URLを設定している
- [ ] Endpoint URLはHTTPSになっている
- [ ] Endpoint URLが実際にブラウザで開ける
- [ ] LIFF IDをNetlifyの `NEXT_PUBLIC_LIFF_ID` に反映している

例:

```text
Endpoint URL: https://your-site.netlify.app
Rich menu URL: https://liff.line.me/{LIFF_ID}
```

業種別にLIFFを分ける場合:

```text
Endpoint URL: https://your-site.netlify.app/demo/store
Endpoint URL: https://your-site.netlify.app/demo/beauty
Endpoint URL: https://your-site.netlify.app/demo/school
Endpoint URL: https://your-site.netlify.app/member-card
```

## 4. リッチメニュー設定確認

- [ ] LINE Official Account Managerでリッチメニューを作成している
- [ ] 「診断する」に診断用LIFF URLを設定している
- [ ] 「会員証」に会員証用LIFF URLを設定している
- [ ] 業種別デモを見せる場合は、それぞれのLIFF URLを設定している
- [ ] `/staff` は一般ユーザー向けリッチメニューに出していない
- [ ] `/line-links` でEndpoint URLとRich menu URLの違いを確認している

`/staff` はスタッフ専用画面です。本番では認証を付け、店舗スタッフ用のURL、管理画面内リンク、または店舗端末のブックマークとして扱います。

## 5. スマホLINEアプリでの確認

- [ ] LINE公式アカウントを友だち追加できる
- [ ] あいさつメッセージが表示される
- [ ] リッチメニューが表示される
- [ ] 「診断する」をタップするとLINE内ブラウザでLIFFが開く
- [ ] LIFF接続状態が画面上で分かる
- [ ] LIFF未設定時はデモユーザー表示になる
- [ ] LIFF設定済み未ログイン時はLINEログイン前表示になる
- [ ] LINEログイン済み時はLINEプロフィール表示になる
- [ ] 診断フォームのボタンが押しやすい
- [ ] 予約フォームの入力欄がLINE内ブラウザで入力しやすい
- [ ] 予約完了画面が表示される
- [ ] 会員証画面でQRコード、ポイント、来店回数が見える
- [ ] 管理画面で回答、予約、会員情報が確認できる

## 6. 認証と個人情報の注意

- [ ] `/admin` は営業デモ用。本番では認証必須
- [ ] `/staff` はスタッフ専用。本番では認証必須
- [ ] 公開デモでは実際の個人情報を入力しない
- [ ] LINE User ID、メールアドレス、相談内容の保存目的を説明できる
- [ ] 本番ではSupabase RLS、管理者権限、スタッフ権限を設計する

管理画面とスタッフ画面の保護方針は [admin-auth-plan.md](admin-auth-plan.md) を参照してください。
