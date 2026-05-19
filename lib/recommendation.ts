import type {
  DemoPattern,
  DiagnosisAnswers,
  Recommendation
} from "@/lib/types";

export function createRecommendation(
  answers: DiagnosisAnswers,
  pattern: DemoPattern
): Recommendation {
  const requiredFeatures = Array.from(
    new Set([...pattern.defaultFeatures, ...answers.selectedFeatures])
  );
  const plan = createPlan(pattern, requiredFeatures.length);

  return {
    title: `${pattern.shortLabel}向け ${answers.goal} 導線`,
    overview: `${answers.issue}というニーズに合わせて、LINE登録後の案内を出し分け、${answers.goal}まで進める構成です。${pattern.businessHint}`,
    route: pattern.flow,
    requiredFeatures,
    benefits: pattern.benefits,
    plan
  };
}

function createPlan(pattern: DemoPattern, featureCount: number) {
  if (featureCount >= 8) {
    return {
      name: `${pattern.recommendedPlan} Plus`,
      summary:
        "診断、予約、通知、DB保存、会員証、管理画面までまとめて構築する本格運用向けプランです。",
      priceHint: "構築目安: 25万円から45万円"
    };
  }

  if (featureCount >= 6) {
    return {
      name: pattern.recommendedPlan,
      summary:
        "診断結果に応じた案内、予約受付、Slack通知、管理画面を組み合わせる標準プランです。",
      priceHint: "構築目安: 15万円から25万円"
    };
  }

  return {
    name: `${pattern.shortLabel} Starterプラン`,
    summary:
      "LIFF診断、予約フォーム、モック通知に絞り、短期間で導入イメージを確認するプランです。",
    priceHint: "構築目安: 8万円から15万円"
  };
}
