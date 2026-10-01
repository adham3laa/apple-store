"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CosmoLogo } from "@/components/cosmo/CosmoLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed. Invalid passkey.");
      }
    } catch (err: any) {
      setError("Network or server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setPasskey("2026");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col justify-between font-sans-body">
      {/* Top Bar */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-neutral-200/60 bg-white/60 backdrop-blur-md">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <CosmoLogo size="sm" showSubtitle={true} />
        </Link>
        <Link
          href="/"
          className="text-xs font-mono-data uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
        >
          ← Return to Atelier
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-3xl p-8 md:p-10 shadow-xl shadow-black/[0.03]">
          {/* Security Terminal Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-[#FAF8F5] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
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
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter vault passkey"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-neutral-200 rounded-xl text-sm font-mono-data tracking-widest focus:outline-none focus:border-black transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50/80 border border-red-200/80 rounded-xl text-xs font-mono-data text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !passkey}
              className="w-full py-3.5 bg-[#161514] hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-[#161514] text-[#FAF8F5] text-xs font-mono-data uppercase tracking-widest font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
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
              className="text-[#059669] hover:underline uppercase tracking-wider font-semibold"
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
