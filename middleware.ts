import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!isAdminRoute || isLogin) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get("admin_session");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
