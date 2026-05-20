import { NextResponse } from "next/server";
import { clearAdminAuthCookie } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const response = NextResponse.json({
    ok: true,
    authenticated: false
  });
  clearAdminAuthCookie(response, request);

  return response;
}
