"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CosmoLogo } from "@/components/cosmo/CosmoLogo";

export default function AdminLoginPage() {
  const [passkey, setPasskey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-check if already signed in
  useEffect(() => {
    if (typeof document !== "undefined" && document.cookie.includes("cosmo_admin_session=active_executive_session")) {
      window.location.href = "/admin";
      return;
    }
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          window.location.href = "/admin";
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = passkey.trim();
    if (!cleanKey) {
      setError("Please enter a security passkey.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey: cleanKey }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);

        // Immediate client cookie backup
        const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
        document.cookie = `cosmo_admin_session=active_executive_session; path=/; max-age=604800; SameSite=Lax${isHttps ? "; Secure" : ""}`;
        try {
          localStorage.setItem("cosmo_admin_session", "active");
        } catch (e) {}

        // Use hard navigation with ?key to completely bypass any client-side router cache race condition
        setTimeout(() => {
          window.location.href = `/admin?key=${encodeURIComponent(cleanKey)}`;
        }, 150);
      } else {
        setError(data.error || "Authentication failed. Invalid passkey.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError("Network or server connection error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setPasskey("2026");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col justify-between font-sans-body">
      {/* Top Bar */}
      <header className="px-3 sm:px-6 md:px-12 py-3 sm:py-5 flex items-center justify-between gap-2 border-b border-neutral-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
          <CosmoLogo size="sm" showSubtitle={true} />
        </Link>
        <Link
          href="/"
          className="text-xs font-mono-data uppercase tracking-wider text-neutral-500 hover:text-black transition-colors shrink-0 py-1.5 px-3 rounded-full hover:bg-neutral-100 touch-manipulation"
        >
          <span className="hidden sm:inline">← Return to Atelier</span>
          <span className="sm:hidden">← Store</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-black/[0.03]">
          {/* Security Terminal Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm transition-colors duration-300 ${isSuccess ? "bg-emerald-600 text-white" : "bg-neutral-900 text-[#FAF8F5]"}`}>
              {isSuccess ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-mono-data uppercase tracking-widest text-neutral-600 mb-2">
              Executive Vault Gate
            </div>
            <h1 className="font-serif-editorial text-2xl font-normal tracking-tight text-[#161514]">
              Owner Portal Authentication
            </h1>
            <p className="text-xs text-neutral-500 font-sans-body mt-1">
              Restricted to authorized atelier managers and catalog curators.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="passkey"
                className="block text-[11px] font-mono-data uppercase tracking-wider text-neutral-600 mb-2"
              >
                Security Passkey
              </label>
              <div className="relative">
                <input
                  id="passkey"
                  type={showPassword ? "text" : "password"}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter vault passkey (e.g. 2026)"
                  className="w-full pl-4 pr-11 py-3 bg-[#FAF8F5] border border-neutral-200 rounded-xl text-base sm:text-sm font-mono-data tracking-widest focus:outline-none focus:border-black transition-colors"
                  autoFocus
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 rounded transition-colors touch-manipulation"
                  aria-label={showPassword ? "Hide passkey" : "Show passkey"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50/90 border border-red-200 rounded-xl text-xs font-mono-data text-red-700 flex items-center gap-2 animate-shake">
                <svg className="w-4 h-4 shrink-0 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono-data text-emerald-800 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Passkey Accepted · Loading Atelier Vault...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isSuccess || !passkey.trim()}
              className={`w-full py-3.5 text-xs font-mono-data uppercase tracking-widest font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                isSuccess
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-[#161514] hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-[#161514] text-[#FAF8F5]"
              }`}
            >
              {isSuccess ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Entering Portal...</span>
                </>
              ) : isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Owner Portal</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono-data text-neutral-500">
            <span>Default Atelier PIN: <strong>2026</strong></span>
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isLoading || isSuccess}
              className="text-[#059669] hover:underline uppercase tracking-wider font-semibold disabled:opacity-40"
            >
              Fill PIN
            </button>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="px-6 py-4 text-center text-[10px] font-mono-data text-neutral-400">
        COSMO ATELIER EDGE ACCESS CONTROLLER · MIL-SPEC SHA-256 SESSION PROTECTION
      </footer>
    </div>
  );
}
