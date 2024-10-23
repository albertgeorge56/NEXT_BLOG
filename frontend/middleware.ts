import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (
    !request.cookies.get("token") &&
    path.startsWith("/admin") &&
    path !== "/admin/login"
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}
