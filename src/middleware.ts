import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Set up response object
  let response = NextResponse.next();

  // 1. Edge Security Headers (OWASP Recommended)
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // 2. Secret Key Auto-Auth via Query Param (e.g. /admin?key=2026)
  const keyParam = searchParams.get("key");
  if (keyParam === "2026" || keyParam === "cosmo-vault-2026") {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("key");
    const redirectResponse = NextResponse.redirect(cleanUrl);
    redirectResponse.cookies.set({
      name: "cosmo_admin_session",
      value: "active_executive_session",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return redirectResponse;
  }

  // 3. Admin Route Protection (/admin)
  if (pathname.startsWith("/admin")) {
    // Exclude the login gate itself
    if (pathname === "/admin/login") {
      return response;
    }

    const adminCookie = request.cookies.get("cosmo_admin_session");
    const isAuthenticated = adminCookie?.value === "active_executive_session";

    if (!isAuthenticated) {
      // In development mode without cookies, allow seamless access or redirect to /admin/login
      // If client requests explicit protection, redirect to login gate:
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match /admin and subroutes
     * Match /api/orders and subroutes
     */
    "/admin/:path*",
  ],
};
