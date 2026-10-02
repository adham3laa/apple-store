"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { CosmoLogo } from "@/components/cosmo/CosmoLogo";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception to monitoring service
    console.error("COSMO Application Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col justify-between font-sans-body">
      {/* Header */}
      <header className="px-3 sm:px-6 md:px-12 py-3 sm:py-5 flex items-center justify-between gap-2 border-b border-neutral-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
          <CosmoLogo size="sm" showSubtitle={true} />
        </Link>
        <Link
          href="/"
          className="text-xs font-mono-data uppercase tracking-wider text-neutral-500 hover:text-black transition-colors shrink-0 py-1.5 px-3 rounded-full hover:bg-neutral-100 touch-manipulation"
        >
          <span className="hidden sm:inline">← Return to Storefront</span>
          <span className="sm:hidden">← Store</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white border border-neutral-200/80 rounded-3xl p-8 md:p-10 shadow-xl shadow-black/[0.03] space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-mono-data uppercase tracking-widest text-neutral-600">
              State Interruption
            </span>
            <h1 className="font-serif-editorial text-2xl md:text-3xl font-normal tracking-tight text-[#161514]">
              Unexpected Experience Interruption
            </h1>
            <p className="text-xs text-neutral-600 font-sans-body leading-relaxed">
              Our atelier encounter system encountered an unexpected condition.
              Your cart and session preferences remain safe in your vault.
            </p>
          </div>

          {error.digest && (
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-[10px] font-mono-data text-neutral-500 break-all">
              Reference Incident: <span className="text-neutral-800 font-bold">{error.digest}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-3 bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-widest font-semibold rounded-full transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>Attempt Recovery</span>
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono-data uppercase tracking-widest font-semibold rounded-full transition-colors flex items-center justify-center"
            >
              Return to Atelier
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-[10px] font-mono-data text-neutral-400">
        COSMO LUXURY ELECTRONICS ATELIER · 24/7 CLIENT CONCIERGE ASSISTANCE AVAILABLE
      </footer>
    </div>
  );
}
