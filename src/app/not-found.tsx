import React from "react";
import Link from "next/link";
import { CosmoLogo } from "@/components/cosmo/CosmoLogo";

export default function NotFoundPage() {
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

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-lg w-full bg-white border border-neutral-200/80 rounded-3xl p-8 md:p-12 shadow-xl shadow-black/[0.03] space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="2" width="14" height="20" rx="3" />
              <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-mono-data uppercase tracking-widest text-neutral-500">
              404 // Archive Not Located
            </span>
            <h1 className="font-serif-editorial text-3xl md:text-4xl font-normal tracking-tight text-[#161514]">
              Page Not Found
            </h1>
            <p className="text-xs text-neutral-600 font-sans-body leading-relaxed max-w-sm mx-auto">
              The hardware specimen or destination you requested is not present in our current collection index.
            </p>
          </div>

          {/* Curated Collection Shortcuts */}
          <div className="pt-2 pb-4">
            <p className="text-[11px] font-mono-data uppercase tracking-wider text-neutral-400 mb-3">
              Explore Available Curations
            </p>
            <div className="grid grid-cols-2 gap-2 text-left">
              <Link
                href="/?category=iphones"
                className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 transition-colors"
              >
                <div className="text-xs font-semibold text-neutral-900">iPhone Series</div>
                <div className="text-[10px] text-neutral-500 font-mono-data">Pro, Air & Baseline</div>
              </Link>
              <Link
                href="/?category=macbooks"
                className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 transition-colors"
              >
                <div className="text-xs font-semibold text-neutral-900">MacBook Studio</div>
                <div className="text-[10px] text-neutral-500 font-mono-data">M4 Pro & Max</div>
              </Link>
              <Link
                href="/coverage"
                className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 transition-colors"
              >
                <div className="text-xs font-semibold text-neutral-900">Coverage & Warranty</div>
                <div className="text-[10px] text-neutral-500 font-mono-data">Serial Number Lookup</div>
              </Link>
              <Link
                href="/engraving"
                className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 transition-colors"
              >
                <div className="text-xs font-semibold text-neutral-900">Laser Engraving</div>
                <div className="text-[10px] text-neutral-500 font-mono-data">Atelier Personalization</div>
              </Link>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block w-full py-3.5 bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-widest font-semibold rounded-full transition-colors shadow-sm"
          >
            Explore Complete Collection →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-[10px] font-mono-data text-neutral-400">
        COSMO LUXURY ELECTRONICS ATELIER · AUTHORIZED APPLE RESELLER
      </footer>
    </div>
  );
}
