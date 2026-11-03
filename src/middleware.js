// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const authToken = request.cookies.get("tkg_auth_token")?.value;
  const url = request.nextUrl;

  // If user tries to access any page other than /login and doesn't have the auth cookie
  if (!authToken && url.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is already authenticated and visits /login, send them to /reports
  if (authToken && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/reports", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets, api routes, and favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};