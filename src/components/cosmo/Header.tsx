"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ProductCategory } from "../../data/cosmo-catalog";
import { CosmoLogo } from "./CosmoLogo";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
}

export function Header({
  cartCount,
  onOpenCart,
  activeCategory,
  onSelectCategory
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, orders, logout, openGoogleSignIn } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOrdersCount = orders.filter(o => o.status !== "delivered").length;

  const handleCategorySelect = (cat: ProductCategory) => {
    setIsMobileMenuOpen(false);
    if (pathname === "/") {
      onSelectCategory(cat);
    } else {
      router.push(cat === "all" ? "/" : `/?category=${cat}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-neutral-200/60 transition-all">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#161514] text-[#FAF8F5] py-2 px-3 sm:px-6 text-center text-[9px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.24em] uppercase font-mono-data border-b border-[#272522] flex items-center justify-between">
        <span className="hidden md:inline text-neutral-400">COSMO STORE // 2026 EDITION</span>
        <span className="flex items-center gap-1.5 sm:gap-2 mx-auto md:mx-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
          <span>FREE INSURED COURIER DELIVERY ON ALL ORDERS</span>
        </span>
        <span className="hidden md:inline text-neutral-400">LONDON · NEW YORK · DUBAI</span>
      </div>

      {/* Main Navigation */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 md:px-12 py-3 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Left: Brand Monogram / Wordmark & Mobile Hamburger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-9 h-9 flex lg:hidden items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 transition-colors shadow-2xs cursor-pointer touch-manipulation"
            aria-label="Open Navigation Menu"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>

          <Link href="/" className="group cursor-pointer shrink-0" onClick={() => onSelectCategory('all')}>
            <CosmoLogo size="sm" showSubtitle={true} />
          </Link>
        </div>

        {/* Center: Curatorial Category Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-neutral-600">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${activeCategory === 'all' ? 'bg-[#161514] text-white' : 'hover:text-black hover:bg-neutral-100'}`}
          >
            All
          </button>
          <button
            onClick={() => handleCategorySelect('iphones')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${activeCategory === 'iphones' ? 'bg-[#161514] text-white' : 'hover:text-black hover:bg-neutral-100'}`}
          >
            iPhone
          </button>
          <button
            onClick={() => handleCategorySelect('macbooks')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${activeCategory === 'macbooks' ? 'bg-[#161514] text-white' : 'hover:text-black hover:bg-neutral-100'}`}
          >
            Mac
          </button>
          <button
            onClick={() => handleCategorySelect('airpods')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${activeCategory === 'airpods' ? 'bg-[#161514] text-white' : 'hover:text-black hover:bg-neutral-100'}`}
          >
            AirPods
          </button>
          <button
            onClick={() => handleCategorySelect('watches')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${activeCategory === 'watches' ? 'bg-[#161514] text-white' : 'hover:text-black hover:bg-neutral-100'}`}
          >
            Watch
          </button>
          <button
            onClick={() => handleCategorySelect('accessories')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${activeCategory === 'accessories' ? 'bg-[#161514] text-white' : 'hover:text-black hover:bg-neutral-100'}`}
          >
            Accessories
          </button>
        </nav>

        {/* Right: Client Account, Coverage & Acquisition Bag */}
        <div className="flex items-center gap-2.5 text-xs font-medium text-neutral-700">
          
          {/* Coverage Lookup Quick Link */}
          <Link
            href="/coverage"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-data text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all uppercase tracking-wider border border-transparent hover:border-neutral-200"
          >
            <svg className="w-3.5 h-3.5 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Coverage</span>
          </Link>

          {/* Client Account Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 transition-all shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-full bg-[#161514] text-[#FAF8F5] flex items-center justify-center font-mono-data text-[10px] font-bold relative">
                  <span>{user.avatar || user.name.slice(0, 2).toUpperCase()}</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#059669] ring-2 ring-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-[#161514] leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[9px] font-mono-data text-[#059669] leading-tight uppercase tracking-wider">
                    {activeOrdersCount > 0 ? `${activeOrdersCount} IN TRANSIT` : "VERIFIED ACCOUNT"}
                  </div>
                </div>
                <svg className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={openGoogleSignIn}
                className="flex items-center gap-2 py-2 px-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-[#161514] text-xs font-mono-data uppercase tracking-wider transition-colors shadow-2xs group"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Account Luxury Dropdown Menu */}
            {isDropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-fade-in font-sans-body">
                <div className="px-4 py-3 border-b border-neutral-100 bg-[#FAF8F5]/60">
                  <div className="text-xs font-bold text-[#161514] truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono-data truncate">
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-mono-data text-[#059669] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                    <span>Active Account</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/account?tab=orders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                      <span>Orders & Tracking</span>
                    </div>
                    {activeOrdersCount > 0 && (
                      <span className="text-[9px] font-mono-data bg-emerald-50 text-[#059669] px-1.5 py-0.5 rounded-full font-bold">
                        {activeOrdersCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/account?tab=addresses"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>Delivery Addresses</span>
                  </Link>

                  <Link
                    href="/account?tab=cards"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="5" width="20" height="14" rx="3"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    <span>Payment Cards</span>
                  </Link>

                  <Link
                    href="/coverage"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <polyline points="9 12 11 14 15 10"/>
                    </svg>
                    <span>Check Apple Coverage</span>
                  </Link>

                  <Link
                    href="/account?tab=profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Account Details</span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>Owner Portal (/admin)</span>
                  </Link>
                </div>

                <div className="border-t border-neutral-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-500 hover:text-red-600 hover:bg-neutral-50 transition-colors font-mono-data uppercase tracking-wider text-[10px]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bag Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 py-2 px-4 rounded-full bg-[#161514] text-[#FAF8F5] hover:bg-neutral-800 transition-colors font-mono-data tracking-wider uppercase text-[11px] shadow-sm group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] group-hover:scale-125 transition-transform" />
            <span>Bag</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {cartCount}
            </span>
          </button>

          {/* Discreet Admin Link */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 py-2 px-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors font-mono-data text-[10px] uppercase font-bold tracking-wider"
            title="Open Store Owner Admin Dashboard"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Admin</span>
          </Link>
        </div>
      </div>

      {/* Mobile & Tablet Responsive Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden font-sans-body">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-dvh max-h-dvh shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Drawer Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-[#FAF8F5]/80 pt-safe">
              <Link
                href="/"
                onClick={() => {
                  handleCategorySelect("all");
                }}
              >
                <CosmoLogo size="sm" showSubtitle={true} />
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors touch-manipulation cursor-pointer"
                aria-label="Close Navigation"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Curated Categories */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] font-mono-data tracking-[0.2em] uppercase text-neutral-400 font-bold px-3">
                  Catalog Collections
                </div>
                <div className="space-y-1">
                  {[
                    { id: "all", label: "All Apple Devices", desc: "Complete 2026 Collection" },
                    { id: "iphones", label: "iPhone", desc: "Titanium Flagships & Next-Gen" },
                    { id: "macbooks", label: "Mac", desc: "MacBook Pro & MacBook Air M-Series" },
                    { id: "airpods", label: "AirPods", desc: "AirPods Pro 2 & AirPods Max" },
                    { id: "watches", label: "Apple Watch", desc: "Ultra 2 & Series 10 Titanium" },
                    { id: "accessories", label: "Accessories", desc: "MagSafe, 35W Power, Magic Mouse" },
                  ].map((cat) => {
                    const isSelected = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id as ProductCategory)}
                        className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all touch-manipulation cursor-pointer ${
                          isSelected
                            ? "bg-[#161514] text-white shadow-sm"
                            : "hover:bg-neutral-50 text-neutral-800"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold">{cat.label}</div>
                          <div className={`text-[10px] font-mono-data ${isSelected ? "text-emerald-300" : "text-neutral-400"}`}>
                            {cat.desc}
                          </div>
                        </div>
                        <span className={`text-xs ${isSelected ? "text-white" : "text-neutral-300"}`}>→</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Atelier Services & Tools */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="text-[10px] font-mono-data tracking-[0.2em] uppercase text-neutral-400 font-bold px-3">
                  Services & Account
                </div>
                <div className="space-y-1 text-xs">
                  <Link
                    href="/coverage"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl hover:bg-neutral-50 flex items-center justify-between text-neutral-800 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                      <span>Check Apple Coverage</span>
                    </span>
                    <span className="text-[10px] font-mono-data text-neutral-400">SERIAL LOOKUP</span>
                  </Link>

                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl hover:bg-neutral-50 flex items-center justify-between text-neutral-800 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                      <span>Client Account & Orders</span>
                    </span>
                    <span className="text-[10px] font-mono-data text-neutral-400">
                      {user ? user.name.split(" ")[0] : "SIGN IN"}
                    </span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl hover:bg-emerald-50 flex items-center justify-between text-emerald-800 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Store Owner Portal</span>
                    </span>
                    <span className="text-[10px] font-mono-data text-emerald-600">ADMIN</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer with Safe Area */}
            <div className="p-5 border-t border-neutral-100 bg-[#FAF8F5] pb-safe space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono-data uppercase tracking-wider text-neutral-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                <span>Free Insured Delivery Across Egypt & Worldwide</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono-data">
                COSMO Apple Reseller // 2026 Collection
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
