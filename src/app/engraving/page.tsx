"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../../components/cosmo/Header";
import { CartDrawer } from "../../components/cosmo/CartDrawer";
import { Footer } from "../../components/cosmo/Footer";
import { useCart } from "../../context/CartContext";
import { useCatalog } from "../../context/CatalogContext";
import { APPLE_LASER_GLYPHS, INSPIRATION_PRESETS } from "../../components/cosmo/LaserEngravingStudioModal";

interface EngravableModel {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  category: "airpods" | "accessories";
  type: "airpods-pro" | "airpods-4" | "airpods-max" | "pencil" | "airtag";
  maxChars: number;
}

const ENGRAVABLE_MODELS: EngravableModel[] = [
  {
    id: "airpods-pro-2",
    slug: "airpods-pro-2",
    title: "AirPods Pro 2 (USB-C)",
    subtitle: "MagSafe Charging Case (USB-C) with built-in speaker & lanyard loop",
    price: 249,
    image: "/devices/MTJV3.png",
    category: "airpods",
    type: "airpods-pro",
    maxChars: 14
  },
  {
    id: "airpods-4-anc",
    slug: "airpods-4-anc",
    title: "AirPods 4 with ANC",
    subtitle: "Streamlined wireless charging case with active noise cancellation",
    price: 179,
    image: "/devices/airpods-4-anc-select-202409.png",
    category: "airpods",
    type: "airpods-4",
    maxChars: 14
  },
  {
    id: "airpods-max",
    slug: "airpods-max",
    title: "AirPods Max",
    subtitle: "Precision-machined anodized aluminum earcups with digital crown",
    price: 549,
    image: "/devices/airpods-max-select-202409-midnight.png",
    category: "airpods",
    type: "airpods-max",
    maxChars: 14
  },
  {
    id: "bundle-apple-pencil",
    slug: "accessories",
    title: "Apple Pencil Pro",
    subtitle: "Flat magnetic edge with haptic feedback & barrel roll precision",
    price: 129,
    image: "/devices/MX6X3.png",
    category: "accessories",
    type: "pencil",
    maxChars: 20
  }
];

export default function LaserEngravingStudioPage() {
  const router = useRouter();
  const { products } = useCatalog();
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    totalCount,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const activeModel = ENGRAVABLE_MODELS[selectedModelIndex];

  const [text, setText] = useState("COSMO");
  const [activeTab, setActiveTab] = useState<"text" | "emoji" | "presets">("text");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 3D Perspective Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -12;
    const tiltY = ((x - centerX) / centerX) * 14;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleInsertGlyph = (char: string) => {
    if (text.length + char.length <= activeModel.maxChars) {
      setText(prev => prev + char);
    }
  };

  const fontStyle = useMemo(() => {
    const len = text.length;
    if (len <= 4) return "text-3xl tracking-[0.24em]";
    if (len <= 8) return "text-2xl tracking-[0.2em]";
    if (len <= 11) return "text-xl tracking-[0.16em]";
    return "text-base tracking-[0.12em]";
  }, [text]);

  // Handle Add To Cart with Engraving
  const handleAddEngravedToBag = () => {
    const matchedProduct = products.find(p => p.id === activeModel.id) || {
      id: activeModel.id,
      slug: activeModel.slug,
      title: activeModel.title,
      curatorialSubtitle: activeModel.subtitle,
      category: activeModel.category,
      era: "ATELIER ENGRAVED 2026",
      designerNote: "Custom laser-etched in our certified cleanroom atelier.",
      basePrice: activeModel.price,
      currency: "USD",
      material: "Apple Polycarbonate & Aluminum",
      dimensions: "Official",
      weight: "Standard",
      primaryImage: activeModel.image,
      secondaryImage: activeModel.image,
      galleryImages: [],
      specHighlights: ["Custom Laser Engraved", "Official Apple Warranty Preserved"],
      technicalDossier: [],
      inStock: true
    };

    addToCart(
      matchedProduct,
      "Atelier Laser Engraved Edition",
      undefined,
      text.trim() || undefined
    );

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col font-sans-body">
      {/* Navigation Masthead */}
      <Header
        cartCount={totalCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeCategory="all"
        onSelectCategory={(cat) => router.push(cat === "all" ? "/" : `/?category=${cat}`)}
      />

      {/* Breadcrumbs */}
      <div className="max-w-[1360px] mx-auto w-full px-6 md:px-12 pt-6 pb-2 text-xs tracking-wider text-neutral-500 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono-data text-[11px] uppercase tracking-wider">
          <Link href="/" className="hover:text-black transition-colors font-medium">
            COSMO Store
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-600">Atelier Services</span>
          <span className="text-neutral-300">/</span>
          <span className="text-[#161514] font-semibold">Laser Engraving Studio</span>
        </div>
        <div className="flex items-center gap-2 text-[#059669] font-mono-data font-medium text-[11px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
          <span>Complimentary Atelier Craftsmanship</span>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <main className="max-w-[1360px] mx-auto px-6 md:px-12 py-8 md:py-12 flex-1 w-full space-y-12">
        
        {/* Editorial Masthead Banner */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#059669] text-[10px] font-mono-data uppercase tracking-widest font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
            <span>Official Apple Personalization Suite</span>
          </div>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#161514] leading-[1.08]">
            Make it unmistakably yours.
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-sans-body leading-relaxed max-w-2xl">
            Engrave a mix of iconic Apple laser emojis, names, initials, and memorable milestones. 
            Executed using fiber laser precision directly onto authentic Apple surfaces at no extra charge.
          </p>
        </div>

        {/* Model Selector Bar */}
        <div className="space-y-3">
          <div className="text-xs font-mono-data uppercase tracking-wider text-neutral-500 font-semibold">
            1. Select Your Canvas:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ENGRAVABLE_MODELS.map((model, idx) => (
              <button
                key={model.id}
                type="button"
                onClick={() => setSelectedModelIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  selectedModelIndex === idx
                    ? "border-black bg-white ring-1 ring-black shadow-sm"
                    : "border-neutral-200/80 bg-white/60 hover:bg-white hover:border-neutral-300"
                }`}
              >
                <div className="h-16 flex items-center justify-center">
                  <img src={model.image} alt={model.title} className="max-h-full max-w-full object-contain filter drop-shadow-xs" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#161514] truncate">{model.title}</div>
                  <div className="font-serif-editorial text-sm font-semibold text-neutral-900 mt-0.5">
                    ${model.price} USD
                  </div>
                  <div className="text-[10px] font-mono-data uppercase text-[#059669] mt-1 font-bold">
                    Free Engraving
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Studio Interactive Workbench (Canvas on Left, Controls on Right) */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200/80">
          
          {/* LEFT: 3D INTERACTIVE CANVAS (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col items-center justify-center bg-gradient-to-b from-neutral-100/70 via-[#FAF8F5] to-neutral-200/40 relative overflow-hidden select-none min-h-[460px]">
            
            <div className="absolute top-6 left-6 text-[10px] font-mono-data text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Target: {activeModel.title}</span>
            </div>

            <div className="absolute bottom-6 left-6 text-[10px] font-mono-data text-neutral-400 uppercase tracking-wider">
              Hover cursor across device to inspect realistic depth
            </div>

            {/* 3D Canvas Box */}
            <div
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: "1200px" }}
              className="w-full max-w-md h-80 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <div
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
                  transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
                  transformStyle: "preserve-3d"
                }}
                className="relative flex items-center justify-center drop-shadow-[0_28px_54px_rgba(0,0,0,0.14)]"
              >
                {/* 1. AIRPODS PRO 2 CASE */}
                {activeModel.type === "airpods-pro" && (
                  <div className="relative w-72 h-56 bg-gradient-to-b from-[#FFFFFF] via-[#FDFDFD] to-[#ECECEC] rounded-[56px] border border-white/90 shadow-[inset_0_2px_8px_rgba(255,255,255,1),inset_0_-4px_12px_rgba(0,0,0,0.08),0_16px_36px_rgba(0,0,0,0.12)] flex flex-col items-center justify-between p-6">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent absolute top-[34%]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] mt-3 z-10" />

                    <div className="flex-1 flex flex-col items-center justify-center w-full px-4 -mt-2 z-10">
                      {text ? (
                        <div
                          style={{
                            color: "#3D3B39",
                            textShadow: "0px 0.75px 0.5px rgba(255,255,255,0.85), 0px -0.75px 0.5px rgba(0,0,0,0.35)",
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                          }}
                          className={`${fontStyle} font-semibold uppercase text-center select-none transition-all duration-300 break-all max-w-[220px] leading-tight`}
                        >
                          {text}
                        </div>
                      ) : (
                        <div className="text-neutral-400/60 font-mono-data text-xs uppercase tracking-widest text-center border border-dashed border-neutral-300/80 px-4 py-3 rounded-2xl">
                          Laser Etch Zone
                        </div>
                      )}
                    </div>

                    <div className="w-8 h-1.5 rounded-full bg-neutral-300/70 mb-0" />
                  </div>
                )}

                {/* 2. AIRPODS 4 CASE */}
                {activeModel.type === "airpods-4" && (
                  <div className="relative w-64 h-64 bg-gradient-to-b from-[#FFFFFF] via-[#FBFBFB] to-[#EAEAEA] rounded-[52px] border border-white/90 shadow-[inset_0_2px_8px_rgba(255,255,255,1),inset_0_-4px_12px_rgba(0,0,0,0.08),0_16px_36px_rgba(0,0,0,0.12)] flex flex-col items-center justify-between p-6">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent absolute top-[36%]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] mt-4 z-10" />
                    <div className="flex-1 flex flex-col items-center justify-center w-full px-4 -mt-2 z-10">
                      {text ? (
                        <div
                          style={{
                            color: "#3D3B39",
                            textShadow: "0px 0.75px 0.5px rgba(255,255,255,0.85), 0px -0.75px 0.5px rgba(0,0,0,0.35)",
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                          }}
                          className={`${fontStyle} font-semibold uppercase text-center select-none transition-all duration-300 break-all max-w-[200px] leading-tight`}
                        >
                          {text}
                        </div>
                      ) : (
                        <div className="text-neutral-400/60 font-mono-data text-xs uppercase tracking-widest text-center border border-dashed border-neutral-300/80 px-4 py-3 rounded-2xl">
                          Laser Etch Zone
                        </div>
                      )}
                    </div>
                    <div className="w-7 h-1.5 rounded-full bg-neutral-300/70 mb-0" />
                  </div>
                )}

                {/* 3. AIRPODS MAX ALUMINUM CUP */}
                {activeModel.type === "airpods-max" && (
                  <div className="relative w-72 h-72 rounded-full bg-gradient-to-tr from-[#383D48] via-[#4D5360] to-[#2B2F38] border-2 border-white/20 shadow-[inset_0_4px_16px_rgba(255,255,255,0.25),0_18px_44px_rgba(0,0,0,0.25)] flex items-center justify-center p-8">
                    <div className="w-full h-full rounded-full border border-white/10 flex flex-col items-center justify-center p-4">
                      {text ? (
                        <div
                          style={{
                            color: "#E6E4DF",
                            textShadow: "0px 1px 2px rgba(0,0,0,0.8)",
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                          }}
                          className={`${fontStyle} font-semibold uppercase text-center select-none transition-all duration-300 break-all max-w-[200px] leading-tight`}
                        >
                          {text}
                        </div>
                      ) : (
                        <div className="text-white/40 font-mono-data text-xs uppercase tracking-widest text-center border border-dashed border-white/20 px-4 py-3 rounded-2xl">
                          Anodized Laser Zone
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. APPLE PENCIL FACET */}
                {activeModel.type === "pencil" && (
                  <div className="relative w-80 h-20 bg-white rounded-full border border-neutral-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)] flex items-center justify-between px-6">
                    <div className="w-3.5 h-3.5 rounded-full bg-neutral-200" />
                    <div className="flex-1 px-4 text-center">
                      {text ? (
                        <div
                          style={{
                            color: "#4A4744",
                            textShadow: "0px 0.5px 0.5px rgba(255,255,255,0.9)",
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                          }}
                          className="text-lg font-semibold uppercase tracking-widest truncate"
                        >
                          {text}
                        </div>
                      ) : (
                        <div className="text-neutral-400 font-mono-data text-xs uppercase tracking-widest">
                          Pencil Facet Laser Zone
                        </div>
                      )}
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-[10px] font-mono-data text-neutral-500 uppercase tracking-wider">
              <span>Fiber Laser Ablation</span>
              <span>•</span>
              <span>Cleanroom Annealed</span>
              <span>•</span>
              <span>Complimentary Atelier Craft</span>
            </div>
          </div>

          {/* RIGHT: CONTROLS & MONOGRAM SELECTOR (5 cols) */}
          <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono-data uppercase tracking-wider text-neutral-500 font-semibold">
                  2. Personalize Inscription:
                </div>
                <span className="text-[10px] font-mono-data text-neutral-400 uppercase">
                  {text.length} / {activeModel.maxChars}
                </span>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 py-2 text-xs font-mono-data uppercase tracking-wider font-semibold rounded-xl transition-all ${
                    activeTab === "text"
                      ? "bg-white text-[#161514] shadow-xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Typography
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("emoji")}
                  className={`flex-1 py-2 text-xs font-mono-data uppercase tracking-wider font-semibold rounded-xl transition-all ${
                    activeTab === "emoji"
                      ? "bg-white text-[#161514] shadow-xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Apple Monograms
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("presets")}
                  className={`flex-1 py-2 text-xs font-mono-data uppercase tracking-wider font-semibold rounded-xl transition-all ${
                    activeTab === "presets"
                      ? "bg-white text-[#161514] shadow-xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Inspirations
                </button>
              </div>

              {/* TAB 1: TYPOGRAPHY INPUT */}
              {activeTab === "text" && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={activeModel.maxChars}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type initials or name..."
                      className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm tracking-wider font-mono-data transition-all"
                    />
                    {text && (
                      <button
                        type="button"
                        onClick={() => setText("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs font-mono-data uppercase font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400">
                      Quick Characters:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["·", "•", "-", "&", "/", "+", "🤍", "⭐", "🎧", "🚀"].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => handleInsertGlyph(sym)}
                          className="w-8 h-8 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-black text-xs font-mono-data font-bold text-neutral-700 transition-all flex items-center justify-center"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MONOGRAM & EMOJI VAULT */}
              {activeTab === "emoji" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-6 gap-2 max-h-52 overflow-y-auto p-1">
                    {APPLE_LASER_GLYPHS.map((glyph) => (
                      <button
                        key={glyph.id}
                        type="button"
                        onClick={() => handleInsertGlyph(glyph.char)}
                        title={glyph.label}
                        className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-900 hover:text-white transition-all flex flex-col items-center justify-center text-lg hover:scale-105 active:scale-95 group shadow-2xs"
                      >
                        <span className="group-hover:scale-110 transition-transform">{glyph.char}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-500 font-sans-body">
                    Official Apple laser symbols are permanently etched without fading.
                  </p>
                </div>
              )}

              {/* TAB 3: INSPIRATIONS */}
              {activeTab === "presets" && (
                <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto">
                  {INSPIRATION_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setText(preset.value)}
                      className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#161514]">{preset.label}</div>
                        <div className="text-[10px] font-mono-data text-neutral-500 uppercase tracking-widest mt-0.5">
                          &ldquo;{preset.value}&rdquo;
                        </div>
                      </div>
                      <span className="text-xs font-mono-data text-neutral-400 group-hover:text-black font-semibold">
                        Select →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Add to Bag CTA */}
            <div className="pt-6 border-t border-neutral-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400">
                    Configuration Total
                  </div>
                  <div className="font-serif-editorial text-3xl font-semibold text-[#161514]">
                    ${activeModel.price} <span className="text-xs font-mono-data text-neutral-400 font-normal">USD</span>
                  </div>
                </div>
                <div className="text-right text-xs font-mono-data text-[#059669] font-bold">
                  Laser Marking: $0 FREE
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddEngravedToBag}
                className="w-full py-4 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-3 shadow-sm group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] group-hover:scale-125 transition-transform" />
                <span>Add to Bag with Engraving</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              {addedToast && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono-data text-center animate-fade-in flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                  <span>Added {activeModel.title} with custom engraving to bag!</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Curatorial Craftsmanship Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-[#161514]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="font-serif-editorial text-lg font-medium text-[#161514]">Micron Precision Fiber Laser</h3>
            <p className="text-xs text-neutral-600 font-sans-body leading-relaxed">
              Industrial fiber laser marking operates at a controlled 0.08mm depth, leaving zero structural compromise on the charging case or chassis.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-[#161514]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="font-serif-editorial text-lg font-medium text-[#161514]">Apple Warranty Preserved</h3>
            <p className="text-xs text-neutral-600 font-sans-body leading-relaxed">
              Because our engraving meets Apple Reseller Atelier specifications, your standard 1-year Apple limited warranty and AppleCare+ remain 100% intact.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-[#161514]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="font-serif-editorial text-lg font-medium text-[#161514]">Zero Dispatch Delay</h3>
            <p className="text-xs text-neutral-600 font-sans-body leading-relaxed">
              Personalized devices are engraved on-site inside our cleanroom facility within 45 minutes of order placement, dispatching on the same day.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}
