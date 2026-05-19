import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  CustomerRecord,
  DemoType,
  DiagnosisRecord,
  ReservationRecord
} from "@/lib/types";

type DiagnosisRow = {
  id: string;
  created_at: string;
  line_user_id: string | null;
  line_display_name: string | null;
  industry: string;
  issue: string;
  goal: string;
  selected_features: string[];
  recommended_plan: string;
  source_demo_type: DemoType;
};

type ReservationRow = {
  id: string;
  created_at: string;
  line_user_id: string | null;
  line_display_name: string | null;
  name: string;
  email: string;
  preferred_datetime: string;
  message: string;
  diagnosis_answer_id: string | null;
  source_demo_type: DemoType;
};

type CustomerRow = {
  id: string;
  created_at: string;
  line_user_id: string;
  line_display_name: string;
  email: string | null;
  name: string | null;
  member_qr_code: string;
  points: number;
  visit_count: number;
  last_visit_at: string | null;
};

let cachedClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
  );
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient(
    process.env.SUPABASE_URL as string,
    (process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY) as string,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );

  return cachedClient;
}

export function toDiagnosisRow(record: DiagnosisRecord): DiagnosisRow {
  return {
    id: record.id,
    created_at: record.createdAt,
    line_user_id: record.lineUserId,
    line_display_name: record.lineDisplayName,
    industry: record.answers.industry,
    issue: record.answers.issue,
    goal: record.answers.goal,
    selected_features: record.answers.selectedFeatures,
    recommended_plan: record.recommendedPlan,
    source_demo_type: record.sourceDemoType
  };
}

export function fromDiagnosisRow(row: DiagnosisRow): DiagnosisRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    lineUserId: row.line_user_id ?? "",
    lineDisplayName: row.line_display_name ?? "",
    sourceDemoType: row.source_demo_type,
    recommendedPlan: row.recommended_plan,
    answers: {
      demoType: row.source_demo_type,
      industry: row.industry,
      issue: row.issue,
      goal: row.goal,
      selectedFeatures: row.selected_features ?? []
    }
  };
}

export function toReservationRow(record: ReservationRecord): ReservationRow {
  return {
    id: record.id,
    created_at: record.createdAt,
    line_user_id: record.lineUserId,
    line_display_name: record.lineDisplayName,
    name: record.name,
    email: record.email,
    preferred_datetime: record.preferredDateTime,
    message: record.consultation,
    diagnosis_answer_id: record.diagnosisId ?? null,
    source_demo_type: record.sourceDemoType
  };
}

export function fromReservationRow(row: ReservationRow): ReservationRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    diagnosisId: row.diagnosis_answer_id ?? undefined,
    sourceDemoType: row.source_demo_type,
    lineUserId: row.line_user_id ?? "",
    lineDisplayName: row.line_display_name ?? "",
    name: row.name,
    email: row.email,
    preferredDateTime: row.preferred_datetime,
    consultation: row.message
  };
}

export function toCustomerRow(record: CustomerRecord): CustomerRow {
  return {
    id: record.id,
    created_at: record.createdAt,
    line_user_id: record.lineUserId,
    line_display_name: record.lineDisplayName,
    email: record.email ?? null,
    name: record.name ?? null,
    member_qr_code: record.memberQrCode,
    points: record.points,
    visit_count: record.visitCount,
    last_visit_at: record.lastVisitAt ?? null
  };
}

export function fromCustomerRow(row: CustomerRow): CustomerRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    lineUserId: row.line_user_id,
    lineDisplayName: row.line_display_name,
    email: row.email ?? undefined,
    name: row.name ?? undefined,
    memberQrCode: row.member_qr_code,
    points: row.points,
    visitCount: row.visit_count,
    lastVisitAt: row.last_visit_at ?? undefined
  };
}
