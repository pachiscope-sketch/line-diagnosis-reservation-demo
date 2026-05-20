import { NextResponse } from "next/server";
import {
  ADMIN_AUTH_MAX_AGE_SECONDS,
  isAdminAuthEnabled,
  isAdminRequestAuthenticated
} from "@/lib/adminAuth";

export async function GET() {
  const demoMode = !isAdminAuthEnabled();
  const authenticated = demoMode || (await isAdminRequestAuthenticated());

  return NextResponse.json({
    ok: true,
    authenticated,
    demoMode,
    maxAgeSeconds: ADMIN_AUTH_MAX_AGE_SECONDS
  });
}
