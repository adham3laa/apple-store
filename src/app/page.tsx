"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "../components/cosmo/Header";
import { ProductCard } from "../components/cosmo/ProductCard";
import { CartDrawer } from "../components/cosmo/CartDrawer";
import { Footer } from "../components/cosmo/Footer";
import { ProductCategory, CosmoProduct } from "../data/cosmo-catalog";
import { CategoryFilterBar } from "../components/cosmo/CategoryFilterBar";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import { DeviceCompareModal } from "../components/cosmo/DeviceCompareModal";
import { InstallmentModal } from "../components/cosmo/InstallmentModal";

function HomeContent() {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    totalCount,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const { products } = useCatalog();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);
  const [selectedInstallmentProduct, setSelectedInstallmentProduct] = useState<CosmoProduct | null>(null);

  useEffect(() => {
    const categoryParam = searchParams.get('category') as ProductCategory | null;
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProducts = products.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col font-sans-body">
      {/* Navigation Masthead */}
      <Header
        cartCount={totalCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Main Exhibition: ALL DEVICES IS THE HOMEPAGE */}
      <main className="flex-1">
        
        {/* Curatorial Masthead & Catalog Index Header */}
        <section className="max-w-[1520px] mx-auto px-6 md:px-12 pt-10 md:pt-14 pb-4">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[11px] font-mono-data tracking-[0.26em] uppercase text-[#059669] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                  <span>COSMO STORE // 2026 COLLECTION</span>
                </div>
                <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-normal tracking-[-0.02em] text-[#161514] leading-[1.08]">
                  The Best of <span className="italic font-light">Modern Apple</span>.
                </h1>
                <p className="text-neutral-600 font-light text-base md:text-lg max-w-2xl leading-relaxed">
                  Explore the latest iPhones, MacBooks, AirPods, and Apple Watches. 100% genuine Apple devices with official warranty and free insured delivery.
                </p>
              </div>

              {/* Utility Tools Pill Toolbar: Compare & Installments & Owner */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-data">
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="py-2 px-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 shadow-2xs transition-all flex items-center gap-2 group"
                >
                  <svg className="w-3.5 h-3.5 text-neutral-500 group-hover:text-black transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="9" height="18" rx="2" />
                    <rect x="13" y="3" width="9" height="18" rx="2" />
                  </svg>
                  <span className="font-semibold">Compare Devices</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedInstallmentProduct(filteredProducts[0] || null);
                    setIsInstallmentOpen(true);
                  }}
                  className="py-2 px-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 shadow-2xs transition-all flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold">0% Installments</span>
                </button>

                <Link
                  href="/admin"
                  className="py-2 px-3.5 rounded-full bg-[#161514] hover:bg-neutral-800 text-white shadow-2xs transition-all flex items-center gap-2 group"
                >
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span className="font-semibold">Owner Portal</span>
                </Link>
              </div>
            </div>

            {/* Visual Category Filter Tabs */}
            <div className="pt-2">
              <CategoryFilterBar 
                activeCategory={activeCategory} 
                onSelectCategory={setActiveCategory} 
              />
            </div>
          </div>
        </section>

        {/* IMMEDIATE GALLERY GRID OF ALL PIECES */}
        <section className="max-w-[1520px] mx-auto px-6 md:px-12 py-8 md:py-12">
          <div 
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-apple-fade-in"
          >
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => addToCart(p)}
              />
            ))}
          </div>
        </section>

        {/* Editorial Trust Banner (Clean, borderless, rounded) */}
        <section className="max-w-[1520px] mx-auto px-6 md:px-12 pb-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-[#059669] mb-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h4 className="font-serif-editorial text-xl font-medium text-[#161514]">100% Genuine Apple</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans-body">
                Brand-new, factory-sealed Apple devices with official manufacturer warranty and valid serial numbers.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-[#161514] mb-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h4 className="font-serif-editorial text-xl font-medium text-[#161514]">Fast & Insured Delivery</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans-body">
                Free insured courier delivery with live tracking and direct signature confirmation on arrival.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-[#161514] mb-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" fill="currentColor" opacity="0.15" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <h4 className="font-serif-editorial text-xl font-medium text-[#161514]">Official 1-Year Warranty</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans-body">
                Full 1-year official Apple warranty, AppleCare+ eligibility, and friendly customer support whenever you need help.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-over Acquisition Bag */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      {/* Device Comparison Modal */}
      <DeviceCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={products}
      />

      {/* Installment Financing Modal */}
      <InstallmentModal
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
        product={selectedInstallmentProduct}
      />
    </div>
  );
}

export default function CosmoHome() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
