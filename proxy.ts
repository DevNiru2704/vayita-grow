import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "vg_session";

/**
 * Optimistic gate only (per Next.js auth guidance): fast redirect when the
 * session cookie is absent. Authoritative session validation happens in
 * app/dashboard/layout.tsx and inside every server action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !request.cookies.has(SESSION_COOKIE)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
