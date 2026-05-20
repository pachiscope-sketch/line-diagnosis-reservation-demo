import { NextResponse } from "next/server";
import { isAdminAuthEnabled, isAdminRequestAuthenticated } from "@/lib/adminAuth";
import { mockCustomers, mockDiagnoses, mockReservations } from "@/lib/mockData";
import {
  fromCustomerRow,
  fromDiagnosisRow,
  fromReservationRow,
  getSupabaseServerClient,
  isSupabaseConfigured
} from "@/lib/supabaseClient";
import type { AdminData } from "@/lib/types";

export async function GET() {
  if (isAdminAuthEnabled() && !(await isAdminRequestAuthenticated())) {
    return NextResponse.json(
      {
        ok: false,
        error: "管理画面の認証が必要です。"
      },
      { status: 401 }
    );
  }

  const status = {
    supabaseConfigured: isSupabaseConfigured(),
    slackConfigured: Boolean(process.env.SLACK_WEBHOOK_URL),
    liffConfigured: Boolean(process.env.NEXT_PUBLIC_LIFF_ID),
    mockMode:
      process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
      process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  };
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      mode: "mock",
      diagnoses: mockDiagnoses,
      reservations: mockReservations,
      customers: mockCustomers,
      status
    } satisfies AdminData);
  }

  const [diagnoses, reservations, customers] = await Promise.all([
    supabase
      .from("diagnosis_answers")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("customers").select("*").order("created_at", {
      ascending: false
    })
  ]);

  if (diagnoses.error || reservations.error || customers.error) {
    console.log("[supabase admin-data fetch failed]", {
      diagnoses: diagnoses.error,
      reservations: reservations.error,
      customers: customers.error
    });

    return NextResponse.json({
      mode: "supabase-error",
      diagnoses: mockDiagnoses,
      reservations: mockReservations,
      customers: mockCustomers,
      status
    } satisfies AdminData);
  }

  return NextResponse.json({
    mode: "supabase",
    diagnoses: diagnoses.data.map(fromDiagnosisRow),
    reservations: reservations.data.map(fromReservationRow),
    customers: customers.data.map(fromCustomerRow),
    status
  } satisfies AdminData);
}
