import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const ADMIN_AUTH_COOKIE = "line_demo_admin_auth";
export const ADMIN_AUTH_MAX_AGE_SECONDS = 60 * 60 * 12;

const TOKEN_NAMESPACE = "line-diagnosis-reservation-demo-admin";

export function isAdminAuthEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return true;
  }

  return safeCompare(hashValue(password), hashValue(adminPassword));
}

export async function isAdminRequestAuthenticated() {
  if (!isAdminAuthEnabled()) {
    return true;
  }

  const cookieStore = await cookies();
  return isValidAdminToken(cookieStore.get(ADMIN_AUTH_COOKIE)?.value);
}

export function setAdminAuthCookie(response: NextResponse, request: Request) {
  response.cookies.set(ADMIN_AUTH_COOKIE, getAdminToken(), {
    httpOnly: true,
    maxAge: ADMIN_AUTH_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: isSecureRequest(request)
  });
}

export function clearAdminAuthCookie(response: NextResponse, request: Request) {
  response.cookies.set(ADMIN_AUTH_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: isSecureRequest(request)
  });
}

function isValidAdminToken(token?: string) {
  if (!token) {
    return false;
  }

  return safeCompare(token, getAdminToken());
}

function getAdminToken() {
  return hashValue(`${TOKEN_NAMESPACE}:${process.env.ADMIN_PASSWORD ?? ""}`);
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeCompare(left: string, right: string) {
  try {
    return timingSafeEqual(Buffer.from(left), Buffer.from(right));
  } catch {
    return false;
  }
}

function isSecureRequest(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }

  return new URL(request.url).protocol === "https:";
}
