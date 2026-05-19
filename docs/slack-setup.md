# Slack通知設定手順

予約が送信されたとき、Slack Incoming Webhook URLが設定されていれば管理者向けに通知します。

未設定の場合は `console.log` にモック通知を出すため、ユーザー画面は落ちません。

## 設定手順

1. Slack Appを作成
2. Incoming Webhooksを有効化
3. 通知したいチャンネルを選択
4. Webhook URLをコピー
5. `.env.local` またはVercel Environment Variablesに設定

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
```

## 通知される内容

```text
【LINE診断予約デモ】新しい予約が入りました

■ 名前
山田 太郎

■ メール
taro@example.com

■ 業種
美容室

■ 目的
予約数を増やしたい

■ 希望日時
2026-05-20 15:00

■ 相談内容
LINEから予約を増やしたいです

■ LINE情報
表示名：Demo User
User ID：Uxxxxxxxx

■ デモ種別
美容室向けデモ
```

## 実案件での拡張案

- 予約内容を担当者別チャンネルへ振り分け
- 緊急度が高い問い合わせをメンション付きで通知
- Google SheetsやCRMへの保存と同時に通知
- Slackボタンからステータス変更
- LINE返信テンプレートを通知に含める
