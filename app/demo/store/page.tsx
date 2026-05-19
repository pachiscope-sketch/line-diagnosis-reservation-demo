import { DemoApp } from "@/components/DemoApp";

export default function StoreDemoPage() {
  return (
    <DemoApp
      initialDemo="store"
      landingTitle="店舗向けLINEデモ"
      landingDescription="来店予約、クーポン、QR会員証、ポイントカード、再来店促進を見せるURLです。店舗DX案件の発注者にそのまま共有できます。"
    />
  );
}
