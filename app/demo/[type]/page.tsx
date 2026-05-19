import { notFound } from "next/navigation";
import { DemoApp } from "@/components/DemoApp";
import { demoTypes, type DemoType } from "@/lib/types";

const landingContent: Record<
  DemoType,
  {
    title: string;
    description: string;
  }
> = {
  store: {
    title: "店舗向けLINE診断予約デモ",
    description:
      "来店予約、クーポン、QR会員証、ポイントカード、再来店促進を見せるURLです。店舗DX案件の発注者にそのまま共有できます。"
  },
  beauty: {
    title: "美容室向けLINE診断予約デモ",
    description:
      "髪のお悩み診断、おすすめメニュー提案、予約、来店後ポイント付与を見せるURLです。美容室やサロン案件向けに共有できます。"
  },
  school: {
    title: "スクール向けLINE診断予約デモ",
    description:
      "学習目的診断、講座提案、無料相談予約、見込み客管理を見せるURLです。スクールや講座販売案件向けに共有できます。"
  }
};

type DemoTypePageProps = {
  params: Promise<{
    type: string;
  }>;
};

export function generateStaticParams() {
  return demoTypes.map((type) => ({ type }));
}

export default async function DemoTypePage({ params }: DemoTypePageProps) {
  const { type } = await params;

  if (!isDemoType(type)) {
    notFound();
  }

  const content = landingContent[type];

  return (
    <DemoApp
      initialDemo={type}
      landingTitle={content.title}
      landingDescription={content.description}
    />
  );
}

function isDemoType(value: string): value is DemoType {
  return (demoTypes as readonly string[]).includes(value);
}
