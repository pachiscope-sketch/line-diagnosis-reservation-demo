import type { DemoPattern, DemoType, DiagnosisAnswers } from "@/lib/types";

export const demoPatterns: Record<DemoType, DemoPattern> = {
  store: {
    id: "store",
    label: "店舗向けデモ",
    shortLabel: "店舗",
    industry: "店舗・小売・飲食",
    targetClient: "飲食店、小売店、サロン、地域店舗",
    purpose: "来店予約、クーポン配布、会員証、ポイントカード、リピート促進",
    catchCopy: "LINE登録から予約、クーポン、会員証までを一つの導線に",
    heroMessage:
      "店舗のLINEを、配信だけでなく来店予約と再来店につながる会員導線として見せられます。",
    businessHint:
      "実案件では、初回来店クーポン、ポイント付与、再来店リマインド、スタッフ向け来店処理まで拡張できます。",
    flow: [
      "LINE登録",
      "来店目的選択",
      "クーポン表示",
      "来店予約",
      "会員証表示",
      "Slack通知"
    ],
    questions: [
      {
        id: "issue",
        title: "来店目的を選択してください",
        caption: "ユーザーの目的に合わせて、クーポンや予約導線を出し分けます。",
        options: [
          "初回来店したい",
          "クーポンを使いたい",
          "会員証を表示したい",
          "ポイントを貯めたい",
          "イベントに参加したい"
        ]
      },
      {
        id: "goal",
        title: "増やしたい成果を選択してください",
        caption: "店舗側が伸ばしたい指標に合わせて、LINE導線を設計します。",
        options: [
          "来店予約を増やしたい",
          "再来店を増やしたい",
          "クーポン利用を増やしたい",
          "会員登録を増やしたい",
          "休眠顧客を呼び戻したい"
        ]
      },
      {
        id: "selectedFeatures",
        title: "使いたい機能を選択してください",
        caption: "店舗DX案件で見せやすい機能を複数選べます。",
        multiple: true,
        options: [
          "リッチメニュー",
          "クーポン配布",
          "予約フォーム",
          "QR会員証",
          "ポイントカード",
          "来店スタンプ",
          "Slack通知",
          "Supabase保存",
          "管理画面"
        ]
      }
    ],
    defaultFeatures: ["リッチメニュー", "予約フォーム", "QR会員証", "Slack通知"],
    recommendedPlan: "Store DXプラン",
    reservationCta: "来店相談を予約する",
    completionMessage: "来店予約と会員登録の流れを受け付けました",
    benefits: [
      "LINE登録後すぐにクーポンや予約へ誘導でき、初回来店の取りこぼしを減らせます。",
      "会員証とポイントカードをLINE内に置くことで、紙カードなしで再来店を促せます。",
      "来店情報を管理画面に集約し、スタッフが次の接客に活かせます。"
    ]
  },
  beauty: {
    id: "beauty",
    label: "美容室向けデモ",
    shortLabel: "美容室",
    industry: "美容室・サロン",
    targetClient: "美容室、ヘアサロン、エステ、ネイルサロン",
    purpose: "髪の悩み診断、おすすめメニュー提案、予約率向上、再来店促進",
    catchCopy: "髪のお悩み診断からおすすめメニューと予約へ",
    heroMessage:
      "美容室のLINEを、メニュー相談、予約、来店後ポイント付与までつながる接客導線として見せられます。",
    businessHint:
      "実案件では、髪質改善メニュー提案、来店前カウンセリング、再来店リマインド、誕生日クーポンに拡張できます。",
    flow: [
      "LINE登録",
      "髪の悩み診断",
      "おすすめメニュー表示",
      "予約",
      "来店後ポイント付与"
    ],
    questions: [
      {
        id: "issue",
        title: "髪の悩みは？",
        caption: "悩みに合わせて、メニューやカウンセリング導線を出し分けます。",
        options: [
          "くせ毛",
          "ダメージ",
          "白髪",
          "ボリューム",
          "似合う髪型がわからない"
        ]
      },
      {
        id: "goal",
        title: "希望メニューは？",
        caption: "予約につながりやすいメニュー候補を選んでもらいます。",
        options: [
          "カット",
          "カラー",
          "髪質改善",
          "トリートメント",
          "相談したい"
        ]
      },
      {
        id: "selectedFeatures",
        title: "希望するLINE機能を選択してください",
        caption: "美容室の予約率と再来店率を上げる機能を組み合わせます。",
        multiple: true,
        options: [
          "リッチメニュー",
          "髪のお悩み診断",
          "おすすめメニュー提案",
          "予約フォーム",
          "来店前リマインド",
          "QR会員証",
          "ポイントカード",
          "Slack通知",
          "Supabase保存"
        ]
      }
    ],
    defaultFeatures: [
      "リッチメニュー",
      "髪のお悩み診断",
      "おすすめメニュー提案",
      "予約フォーム"
    ],
    recommendedPlan: "Salon Growthプラン",
    reservationCta: "メニュー相談を予約する",
    completionMessage: "メニュー相談の予約リクエストを受け付けました",
    benefits: [
      "来店前に悩みや希望メニューを把握でき、カウンセリングの質を上げられます。",
      "診断結果から予約ボタンまで近くすることで、メニュー選びの迷いを減らせます。",
      "ポイントカードや再来店通知を組み合わせると、リピート促進まで提案できます。"
    ]
  },
  school: {
    id: "school",
    label: "スクール向けデモ",
    shortLabel: "スクール",
    industry: "スクール・講座・教育",
    targetClient: "オンラインスクール、教室、資格講座、セミナー運営者",
    purpose: "講座診断、無料相談予約、資料請求、見込み客管理",
    catchCopy: "学習目的診断からおすすめ講座と無料相談へ",
    heroMessage:
      "スクールのLINEを、資料請求で終わらせず、講座診断から無料相談予約までつなげます。",
    businessHint:
      "実案件では、講座別ステップ配信、説明会予約、資料請求、見込み客スコアリングに拡張できます。",
    flow: [
      "LINE登録",
      "学習目的診断",
      "おすすめ講座表示",
      "無料相談予約",
      "管理者通知"
    ],
    questions: [
      {
        id: "issue",
        title: "学びたい目的は？",
        caption: "目的に合わせて、講座や説明会の案内を出し分けます。",
        options: ["転職", "副業", "資格取得", "趣味", "子どもの学習"]
      },
      {
        id: "goal",
        title: "希望スタイルは？",
        caption: "オンライン、通学、個別など、相談につながる条件を整理します。",
        options: [
          "オンライン",
          "通学",
          "マンツーマン",
          "グループ",
          "まだ決めていない"
        ]
      },
      {
        id: "selectedFeatures",
        title: "希望する機能を選択してください",
        caption: "見込み客管理と無料相談予約につながる機能を選べます。",
        multiple: true,
        options: [
          "リッチメニュー",
          "講座診断",
          "資料請求フォーム",
          "無料相談予約",
          "ステップ配信",
          "自動返信Bot",
          "Slack通知",
          "Supabase保存",
          "管理画面"
        ]
      }
    ],
    defaultFeatures: ["リッチメニュー", "講座診断", "無料相談予約", "Slack通知"],
    recommendedPlan: "School Leadプラン",
    reservationCta: "無料相談を予約する",
    completionMessage: "無料相談の予約リクエストを受け付けました",
    benefits: [
      "LINE登録後に目的を聞くことで、見込み客ごとに講座提案を変えられます。",
      "資料請求から無料相談までの流れを近くし、問い合わせ後の離脱を減らせます。",
      "回答内容を管理画面やDBに保存することで、営業フォローの優先順位をつけられます。"
    ]
  }
};

export function getDemoPattern(value?: string | null): DemoPattern {
  if (value === "beauty" || value === "school" || value === "store") {
    return demoPatterns[value];
  }

  return demoPatterns.store;
}

export function createInitialAnswers(pattern: DemoPattern): DiagnosisAnswers {
  const issue = pattern.questions.find((question) => question.id === "issue");
  const goal = pattern.questions.find((question) => question.id === "goal");

  return {
    demoType: pattern.id,
    industry: pattern.industry,
    issue: issue?.options[0] ?? "",
    goal: goal?.options[0] ?? "",
    selectedFeatures: pattern.defaultFeatures
  };
}
