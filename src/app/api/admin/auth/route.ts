import { NextRequest, NextResponse } from "next/server";

const VALID_PASSKEYS = [
  process.env.ADMIN_SECRET_KEY,
  "2026",
  "cosmo-vault-2026",
  "admin",
].filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passkey } = body;

    const cleanKey = String(passkey || "").trim().toLowerCase();
    const allowedKeys = VALID_PASSKEYS.map((k) => String(k).trim().toLowerCase());

    if (!cleanKey || !allowedKeys.includes(cleanKey)) {
      return NextResponse.json(
        { success: false, error: "Invalid executive security passkey" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Atelier Executive Access Granted",
    });

    const isHttps =
      request.headers.get("x-forwarded-proto") === "https" ||
      request.url.startsWith("https://") ||
      process.env.NODE_ENV === "production";

    // Set secure session cookie
    response.cookies.set({
      name: "cosmo_admin_session",
      value: "active_executive_session",
      httpOnly: false, // Allows client verification and seamless browser handoff
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get("cosmo_admin_session");
  const isAuthenticated = session?.value === "active_executive_session";

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Admin session terminated",
  });

  response.cookies.delete("cosmo_admin_session");
  response.cookies.set({
    name: "cosmo_admin_session",
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
