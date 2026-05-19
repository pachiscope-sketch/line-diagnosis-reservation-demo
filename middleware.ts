import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");
  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";

  if (authorization?.startsWith("Basic ")) {
    const encoded = authorization.slice("Basic ".length);
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    if (user === expectedUser && password === adminPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="LINE Portfolio Admin"'
    }
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin-data/:path*"]
};
