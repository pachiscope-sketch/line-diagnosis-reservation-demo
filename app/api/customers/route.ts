import { NextResponse } from "next/server";
import { mockCustomers } from "@/lib/mockData";
import {
  fromCustomerRow,
  getSupabaseServerClient,
  toCustomerRow
} from "@/lib/supabaseClient";
import type { CustomerRecord } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lineUserId = searchParams.get("lineUserId");
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const customers = lineUserId
      ? mockCustomers.filter((customer) => customer.lineUserId === lineUserId)
      : mockCustomers;
    return NextResponse.json({ ok: true, mode: "mock", customers });
  }

  let query = supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (lineUserId) {
    query = query.eq("line_user_id", lineUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.log("[supabase customers fetch failed]", error);
    return NextResponse.json({
      ok: false,
      mode: "supabase-error",
      customers: mockCustomers
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    customers: data.map(fromCustomerRow)
  });
}

export async function POST(request: Request) {
  const record = (await request.json().catch(() => null)) as CustomerRecord | null;
  const supabase = getSupabaseServerClient();

  if (!record) {
    return NextResponse.json(
      { ok: false, error: "会員データが不正です。" },
      { status: 400 }
    );
  }

  if (!supabase) {
    console.log("[mock customer saved]", record);
    return NextResponse.json({ ok: true, mode: "mock", customer: record });
  }

  const { error } = await supabase
    .from("customers")
    .upsert(toCustomerRow(record), { onConflict: "line_user_id" });

  if (error) {
    console.log("[supabase customer upsert failed]", error);
    return NextResponse.json({
      ok: false,
      mode: "supabase-error",
      customer: record
    });
  }

  return NextResponse.json({ ok: true, mode: "supabase", customer: record });
}

export async function PATCH(request: Request) {
  const record = (await request.json().catch(() => null)) as CustomerRecord | null;
  const supabase = getSupabaseServerClient();

  if (!record) {
    return NextResponse.json(
      { ok: false, error: "会員データが不正です。" },
      { status: 400 }
    );
  }

  if (!supabase) {
    console.log("[mock customer stamped]", record);
    return NextResponse.json({ ok: true, mode: "mock", customer: record });
  }

  const { error } = await supabase
    .from("customers")
    .upsert(toCustomerRow(record), { onConflict: "line_user_id" });

  if (error) {
    console.log("[supabase customer stamp failed]", error);
    return NextResponse.json({
      ok: false,
      mode: "supabase-error",
      customer: record
    });
  }

  return NextResponse.json({ ok: true, mode: "supabase", customer: record });
}
