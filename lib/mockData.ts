import type {
  CustomerRecord,
  DiagnosisRecord,
  ReservationRecord
} from "@/lib/types";

export const mockDiagnoses: DiagnosisRecord[] = [
  {
    id: "mock-diagnosis-store-001",
    createdAt: "2026-05-19T08:30:00.000Z",
    lineUserId: "UdemoStore001",
    lineDisplayName: "Store Demo User",
    sourceDemoType: "store",
    recommendedPlan: "Store DXプラン",
    answers: {
      demoType: "store",
      industry: "店舗・小売・飲食",
      issue: "クーポンを使いたい",
      goal: "再来店を増やしたい",
      selectedFeatures: ["リッチメニュー", "クーポン配布", "QR会員証", "Slack通知"]
    }
  },
  {
    id: "mock-diagnosis-beauty-001",
    createdAt: "2026-05-18T10:15:00.000Z",
    lineUserId: "UdemoBeauty001",
    lineDisplayName: "Salon Demo User",
    sourceDemoType: "beauty",
    recommendedPlan: "Salon Growthプラン",
    answers: {
      demoType: "beauty",
      industry: "美容室・サロン",
      issue: "ダメージ",
      goal: "髪質改善",
      selectedFeatures: ["髪のお悩み診断", "おすすめメニュー提案", "予約フォーム"]
    }
  },
  {
    id: "mock-diagnosis-school-001",
    createdAt: "2026-05-17T12:00:00.000Z",
    lineUserId: "UdemoSchool001",
    lineDisplayName: "School Demo User",
    sourceDemoType: "school",
    recommendedPlan: "School Leadプラン",
    answers: {
      demoType: "school",
      industry: "スクール・講座・教育",
      issue: "副業",
      goal: "オンライン",
      selectedFeatures: ["講座診断", "無料相談予約", "ステップ配信", "管理画面"]
    }
  }
];

export const mockReservations: ReservationRecord[] = [
  {
    id: "mock-reservation-store-001",
    diagnosisId: "mock-diagnosis-store-001",
    sourceDemoType: "store",
    name: "田中 花子",
    email: "hanako@example.com",
    preferredDateTime: "2026-06-03T13:00",
    consultation: "LINEでクーポン配布と会員証をまとめて見せたいです。",
    lineDisplayName: "Store Demo User",
    lineUserId: "UdemoStore001",
    industry: "店舗・小売・飲食",
    goal: "再来店を増やしたい",
    createdAt: "2026-05-19T08:45:00.000Z"
  },
  {
    id: "mock-reservation-beauty-001",
    diagnosisId: "mock-diagnosis-beauty-001",
    sourceDemoType: "beauty",
    name: "佐藤 美咲",
    email: "misaki@example.com",
    preferredDateTime: "2026-06-05T15:00",
    consultation: "髪質改善メニューの予約導線をLINEで作りたいです。",
    lineDisplayName: "Salon Demo User",
    lineUserId: "UdemoBeauty001",
    industry: "美容室・サロン",
    goal: "髪質改善",
    createdAt: "2026-05-18T10:30:00.000Z"
  }
];

export const mockCustomers: CustomerRecord[] = [
  {
    id: "LINE-DEMO-0001",
    createdAt: "2026-05-19T08:00:00.000Z",
    lineUserId: "Udemo1234567890",
    lineDisplayName: "Demo User",
    email: "demo@example.com",
    name: "デモ会員",
    memberQrCode: "LINE-DEMO-0001:Udemo1234567890",
    points: 120,
    visitCount: 3,
    lastVisitAt: "2026-05-19T08:00:00.000Z"
  },
  {
    id: "LINE-DEMO-0002",
    createdAt: "2026-05-18T08:00:00.000Z",
    lineUserId: "UdemoBeauty001",
    lineDisplayName: "Salon Demo User",
    email: "salon@example.com",
    name: "サロン会員",
    memberQrCode: "LINE-DEMO-0002:UdemoBeauty001",
    points: 80,
    visitCount: 2,
    lastVisitAt: "2026-05-18T08:00:00.000Z"
  }
];
