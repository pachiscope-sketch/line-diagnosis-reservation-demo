import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_AUTH_MAX_AGE_SECONDS,
  isAdminAuthEnabled,
  setAdminAuthCookie,
  verifyAdminPassword
} from "@/lib/adminAuth";

const loginSchema = z.object({
  password: z.string().min(1)
});

export async function POST(request: Request) {
  if (!isAdminAuthEnabled()) {
    return NextResponse.json({
      ok: true,
      authenticated: true,
      demoMode: true,
      maxAgeSeconds: ADMIN_AUTH_MAX_AGE_SECONDS
    });
  }

  const payload = loginSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json(
      {
        ok: false,
        authenticated: false,
        demoMode: false,
        error: "パスワードを入力してください。"
      },
      { status: 400 }
    );
  }

  if (!verifyAdminPassword(payload.data.password)) {
    return NextResponse.json(
      {
        ok: false,
        authenticated: false,
        demoMode: false,
        error: "パスワードが正しくありません。"
      },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    authenticated: true,
    demoMode: false,
    maxAgeSeconds: ADMIN_AUTH_MAX_AGE_SECONDS
  });
  setAdminAuthCookie(response, request);

  return response;
}
