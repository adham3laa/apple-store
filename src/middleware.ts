import { NextResponse, type NextRequest } from "next/server";

const VALID_PASSKEYS = [
  process.env.ADMIN_SECRET_KEY,
  "2026",
  "cosmo-vault-2026",
  "admin",
].filter(Boolean).map((k) => String(k).trim().toLowerCase());

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

  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    request.url.startsWith("https://") ||
    process.env.NODE_ENV === "production";

  // 2. Secret Key Auto-Auth via Query Param (e.g. /admin?key=2026)
  const keyParam = searchParams.get("key")?.trim().toLowerCase();
  const hasValidKey = Boolean(keyParam && VALID_PASSKEYS.includes(keyParam));

  if (hasValidKey) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("key");
    const redirectResponse = NextResponse.redirect(cleanUrl);
    redirectResponse.cookies.set({
      name: "cosmo_admin_session",
      value: "active_executive_session",
      httpOnly: false,
      secure: isHttps,
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
