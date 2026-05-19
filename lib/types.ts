export const demoTypes = ["store", "beauty", "school"] as const;

export type DemoType = (typeof demoTypes)[number];

export type LiffMode = "liff" | "mock";

export type LiffUser = {
  mode: LiffMode;
  displayName: string;
  userId: string;
  pictureUrl?: string;
  isInClient: boolean;
  isLoggedIn: boolean;
};

export type DiagnosisQuestion = {
  id: "issue" | "goal" | "selectedFeatures";
  title: string;
  caption: string;
  options: readonly string[];
  multiple?: boolean;
};

export type DemoPattern = {
  id: DemoType;
  label: string;
  shortLabel: string;
  industry: string;
  targetClient: string;
  purpose: string;
  catchCopy: string;
  heroMessage: string;
  businessHint: string;
  flow: string[];
  questions: readonly DiagnosisQuestion[];
  defaultFeatures: string[];
  recommendedPlan: string;
  reservationCta: string;
  completionMessage: string;
  benefits: string[];
};

export type DiagnosisAnswers = {
  demoType: DemoType;
  industry: string;
  issue: string;
  goal: string;
  selectedFeatures: string[];
};

export type Recommendation = {
  title: string;
  overview: string;
  route: string[];
  requiredFeatures: string[];
  benefits: string[];
  plan: {
    name: string;
    summary: string;
    priceHint: string;
  };
};

export type DiagnosisRecord = {
  id: string;
  createdAt: string;
  lineUserId: string;
  lineDisplayName: string;
  sourceDemoType: DemoType;
  answers: DiagnosisAnswers;
  recommendedPlan: string;
};

export type ReservationRecord = {
  id: string;
  createdAt: string;
  diagnosisId?: string;
  sourceDemoType: DemoType;
  lineUserId: string;
  lineDisplayName: string;
  name: string;
  email: string;
  preferredDateTime: string;
  consultation: string;
  industry?: string;
  goal?: string;
};

export type CustomerRecord = {
  id: string;
  createdAt: string;
  lineUserId: string;
  lineDisplayName: string;
  email?: string;
  name?: string;
  memberQrCode: string;
  points: number;
  visitCount: number;
  lastVisitAt?: string;
};

export type DataSourceMode = "supabase" | "mock" | "local" | "supabase-error";

export type AdminData = {
  mode: DataSourceMode;
  diagnoses: DiagnosisRecord[];
  reservations: ReservationRecord[];
  customers: CustomerRecord[];
  status: {
    supabaseConfigured: boolean;
    slackConfigured: boolean;
    liffConfigured: boolean;
    mockMode: boolean;
  };
};
