import { NextResponse } from "next/server";
import { mockDiagnoses } from "@/lib/mockData";
import {
  fromDiagnosisRow,
  getSupabaseServerClient,
  isSupabaseConfigured,
  toDiagnosisRow
} from "@/lib/supabaseClient";
import type { DiagnosisRecord } from "@/lib/types";

export async function GET() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "mock",
      diagnoses: mockDiagnoses
    });
  }

  const { data, error } = await supabase
    .from("diagnosis_answers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("[supabase diagnosis fetch failed]", error);
    return NextResponse.json({
      ok: false,
      mode: "supabase-error",
      diagnoses: mockDiagnoses
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    diagnoses: data.map(fromDiagnosisRow)
  });
}

export async function POST(request: Request) {
  const record = (await request.json().catch(() => null)) as DiagnosisRecord | null;

  if (!record) {
    return NextResponse.json(
      { ok: false, error: "診断回答データが不正です。" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    console.log("[mock diagnosis saved]", record);
    return NextResponse.json({
      ok: true,
      mode: "mock",
      diagnosis: record
    });
  }

  const { error } = await supabase
    .from("diagnosis_answers")
    .insert(toDiagnosisRow(record));

  if (error) {
    console.log("[supabase diagnosis insert failed]", error);
    return NextResponse.json({
      ok: false,
      mode: isSupabaseConfigured() ? "supabase-error" : "mock",
      diagnosis: record
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    diagnosis: record
  });
}
