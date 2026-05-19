import { NextResponse } from "next/server";

type NotifyPayload = {
  type?: "diagnosis" | "reservation" | "member" | "test";
  title?: string;
  message?: string;
  data?: {
    name?: string;
    email?: string;
    industry?: string;
    goal?: string;
    preferredDateTime?: string;
    consultation?: string;
    lineDisplayName?: string;
    lineUserId?: string;
    sourceDemoLabel?: string;
    sourceDemoType?: string;
  };
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as NotifyPayload;
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const title =
    payload.title ??
    (payload.type === "reservation"
      ? "【LINE診断予約デモ】新しい予約が入りました"
      : "【LINE診断予約デモ】通知");
  const message = payload.message ?? createSlackText(title, payload);

  if (!webhookUrl) {
    console.log("[mock slack notify]", {
      title,
      message,
      type: payload.type,
      data: payload.data
    });
    return NextResponse.json({ ok: true, mode: "mock" });
  }

  try {
    const slackResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: message,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${title}*`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: createSlackText("", payload)
            }
          }
        ]
      })
    });

    if (!slackResponse.ok) {
      console.log("[slack notify failed]", await slackResponse.text());
      return NextResponse.json({
        ok: false,
        mode: "slack-error",
        error: "Slack通知に失敗しました。ユーザー画面は継続します。"
      });
    }

    return NextResponse.json({ ok: true, mode: "slack" });
  } catch (error) {
    console.log("[slack notify exception]", error);
    return NextResponse.json({
      ok: false,
      mode: "slack-error",
      error: "Slack通知に失敗しました。ユーザー画面は継続します。"
    });
  }
}

function createSlackText(prefix: string, payload: NotifyPayload) {
  const data = payload.data ?? {};
  const lines = [
    prefix,
    "",
    "■ 名前",
    data.name ?? "未入力",
    "",
    "■ メール",
    data.email ?? "未入力",
    "",
    "■ 業種",
    data.industry ?? "未選択",
    "",
    "■ 目的",
    data.goal ?? "未選択",
    "",
    "■ 希望日時",
    data.preferredDateTime ?? "未入力",
    "",
    "■ 相談内容",
    data.consultation ?? payload.message ?? "未入力",
    "",
    "■ LINE情報",
    `表示名：${data.lineDisplayName ?? "不明"}`,
    `User ID：${data.lineUserId ?? "不明"}`,
    "",
    "■ デモ種別",
    data.sourceDemoLabel ?? data.sourceDemoType ?? "未選択"
  ];

  return lines.filter((line, index) => index !== 0 || line).join("\n");
}
