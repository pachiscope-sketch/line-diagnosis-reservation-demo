import { NextResponse } from "next/server";
import { demoPatterns } from "@/lib/demoPatterns";
import { mockReservations } from "@/lib/mockData";
import {
  fromReservationRow,
  getSupabaseServerClient,
  isSupabaseConfigured,
  toReservationRow
} from "@/lib/supabaseClient";
import { reservationRecordSchema } from "@/lib/validation";

export async function GET() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "mock",
      reservations: mockReservations
    });
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("[supabase reservations fetch failed]", error);
    return NextResponse.json({
      ok: false,
      mode: "supabase-error",
      reservations: mockReservations
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    reservations: data.map(fromReservationRow)
  });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = reservationRecordSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "予約データが不正です。",
        issues: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const record = parsed.data;
  const supabase = getSupabaseServerClient();
  let mode = isSupabaseConfigured() ? "supabase" : "mock";

  if (supabase) {
    const { error } = await supabase
      .from("reservations")
      .insert(toReservationRow(record));

    if (error) {
      console.log("[supabase reservation insert failed]", error);
      mode = "supabase-error";
    }
  } else {
    console.log("[mock reservation saved]", record);
  }

  const pattern = demoPatterns[record.sourceDemoType];

  await fetch(new URL("/api/notify", request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "reservation",
      title: "【LINE診断予約デモ】新しい予約が入りました",
      data: {
        name: record.name,
        email: record.email,
        industry: record.industry ?? pattern.industry,
        goal: record.goal,
        preferredDateTime: record.preferredDateTime,
        consultation: record.consultation,
        lineDisplayName: record.lineDisplayName,
        lineUserId: record.lineUserId,
        sourceDemoType: record.sourceDemoType,
        sourceDemoLabel: pattern.label
      }
    })
  }).catch((error) => {
    console.log("[reservation notify failed but reservation succeeded]", {
      reservationId: record.id,
      error
    });
  });

  return NextResponse.json({
    ok: mode !== "supabase-error",
    mode,
    reservation: record
  });
}
