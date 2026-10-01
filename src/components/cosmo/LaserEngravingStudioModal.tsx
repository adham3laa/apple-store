"use client";

import React, { useState, useRef, useMemo } from "react";
import { CosmoProduct } from "../../data/cosmo-catalog";

/* ========================================================================== */
/* CURATED APPLE LASER MONOGRAM & EMOJI GLYPHS                               */
/* ========================================================================== */

export interface LaserGlyph {
  id: string;
  char: string;
  label: string;
  category: "classic" | "nature" | "lifestyle" | "celestial";
}

export const APPLE_LASER_GLYPHS: LaserGlyph[] = [
  // Classic Monograms
  { id: "heart", char: "🤍", label: "Heart", category: "classic" },
  { id: "star", char: "⭐", label: "Star", category: "celestial" },
  { id: "lightning", char: "⚡", label: "Lightning", category: "celestial" },
  { id: "crown", char: "👑", label: "Crown", category: "classic" },
  { id: "infinity", char: "♾️", label: "Infinity", category: "classic" },
  { id: "diamond", char: "💎", label: "Diamond", category: "classic" },
  
  // Lifestyle & Audio
  { id: "headphones", char: "🎧", label: "Headphones", category: "lifestyle" },
  { id: "music", char: "🎵", label: "Music Note", category: "lifestyle" },
  { id: "sunglasses", char: "🕶️", label: "Sunglasses", category: "lifestyle" },
  { id: "coffee", char: "☕", label: "Coffee", category: "lifestyle" },
  { id: "target", char: "🎯", label: "Bullseye", category: "lifestyle" },
  { id: "flame", char: "🔥", label: "Flame", category: "lifestyle" },

  // Celestial & Space
  { id: "rocket", char: "🚀", label: "Rocket", category: "celestial" },
  { id: "saturn", char: "🪐", label: "Saturn", category: "celestial" },
  { id: "moon", char: "🌙", label: "Crescent", category: "celestial" },
  { id: "sparkles", char: "✨", label: "Sparkles", category: "celestial" },

  // Nature & Pets
  { id: "paw", char: "🐾", label: "Paw", category: "nature" },
  { id: "cat", char: "🐱", label: "Cat", category: "nature" },
  { id: "dog", char: "🐶", label: "Dog", category: "nature" },
  { id: "clover", char: "🍀", label: "Clover", category: "nature" },
  { id: "blossom", char: "🌸", label: "Blossom", category: "nature" },
  { id: "dove", char: "🕊️", label: "Dove", category: "nature" }
];

export const INSPIRATION_PRESETS = [
  { label: "Classic Monogram", value: "A · M" },
  { label: "Loved One", value: "🤍 COSMO" },
  { label: "Deep Focus", value: "🎧 FOCUS" },
  { label: "Milestone", value: "⭐ 2026" },
  { label: "Skybound", value: "🚀 DREAM" },
  { label: "Pet Companion", value: "🐾 LEO" },
  { label: "Good Fortune", value: "🍀 LUCKY" }
];

interface LaserEngravingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CosmoProduct;
  selectedFinishName?: string;
  initialText?: string;
  onSaveEngraving: (engravedValue: string) => void;
  onRemoveEngraving: () => void;
}

export function LaserEngravingStudioModal({
  isOpen,
  onClose,
  product,
  selectedFinishName,
  initialText = "",
  onSaveEngraving,
  onRemoveEngraving
}: LaserEngravingStudioModalProps) {
  const [text, setText] = useState(initialText);
  const [activeTab, setActiveTab] = useState<"text" | "emoji" | "presets">("text");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Synchronize when opening
  React.useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setTilt({ x: 0, y: 0 });
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  // Determine device canvas form factor
  const isAirPodsPro = product.id.includes("airpods-pro") || product.slug.includes("airpods-pro");
  const isAirPodsMax = product.id.includes("airpods-max") || product.slug.includes("airpods-max");
  const isAirPods4 = product.id.includes("airpods-4") || product.slug.includes("airpods-4");
  const isApplePencil = product.title.toLowerCase().includes("pencil");
  const isAirTag = product.title.toLowerCase().includes("airtag");
  const isIPad = product.title.toLowerCase().includes("ipad");

  const maxLength = isApplePencil ? 20 : (isIPad ? 24 : 14);

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -12; // Rotate around X
    const tiltY = ((x - centerX) / centerX) * 14;  // Rotate around Y
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleInsertGlyph = (char: string) => {
    if (text.length + char.length <= maxLength) {
      setText(prev => prev + char);
    }
  };

  // Font size calculation to ensure natural Apple proportions
  const fontStyle = useMemo(() => {
    const len = text.length;
    if (len <= 4) return "text-3xl tracking-[0.24em]";
    if (len <= 8) return "text-2xl tracking-[0.2em]";
    if (len <= 11) return "text-xl tracking-[0.16em]";
    return "text-base tracking-[0.12em]";
  }, [text]);

  const handleSave = () => {
    onSaveEngraving(text.trim());
    onClose();
  };

  const handleRemove = () => {
    setText("");
    onRemoveEngraving();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-sans-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#161514]/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Main Studio Modal Window */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-neutral-200/80 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-apple-fade-in">
        
        {/* Studio Top Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-neutral-200/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#161514] text-white flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-editorial text-xl sm:text-2xl font-normal text-[#161514]">
                  Bespoke Laser Engraving Studio
                </h2>
                <span className="text-[10px] font-mono-data uppercase bg-emerald-100 text-[#059669] px-2 py-0.5 rounded-full font-bold">
                  Complimentary
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono-data uppercase tracking-wider mt-0.5">
                {product.title} // Official Apple Atelier Marking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200/80">
          
          {/* LEFT: 3D PHOTOREALISTIC INTERACTIVE SURFACE CANVAS (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col items-center justify-center bg-gradient-to-b from-neutral-100/60 via-[#FAF8F5] to-neutral-200/40 relative overflow-hidden select-none">
            
            {/* Ambient Lighting Accents */}
            <div className="absolute top-8 left-8 text-[11px] font-mono-data text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Fiber Laser Alignment Active</span>
            </div>

            <div className="absolute bottom-6 left-6 text-[10px] font-mono-data text-neutral-400 uppercase tracking-wider">
              <span>Interactive 3D Canvas: Hover to inspect angles</span>
            </div>

            {/* Interactive 3D Case Container */}
            <div
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: "1200px"
              }}
              className="w-full max-w-sm h-72 sm:h-80 flex items-center justify-center cursor-grab active:cursor-grabbing relative"
            >
              <div
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.04 : 1})`,
                  transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
                  transformStyle: "preserve-3d"
                }}
                className="relative flex items-center justify-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.14)]"
              >
                {/* 1. AIRPODS PRO 2 CASE SURFACE */}
                {(isAirPodsPro || (!isAirPodsMax && !isAirPods4 && !isApplePencil && !isAirTag && !isIPad)) && (
                  <div className="relative w-64 h-52 bg-gradient-to-b from-[#FFFFFF] via-[#FDFDFD] to-[#EDEDED] rounded-[52px] border border-white/80 shadow-[inset_0_2px_8px_rgba(255,255,255,1),inset_0_-4px_12px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.12)] flex flex-col items-center justify-between p-6">
                    {/* Top Case Lid Seam Line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent absolute top-[34%]" />
                    
                    {/* Status LED Light */}
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] mt-3 z-10" />

                    {/* Centered Laser Engraving Zone */}
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

                    {/* Lightning / USB-C Port Hint */}
                    <div className="w-7 h-1.5 rounded-full bg-neutral-300/70 mb-0 shadow-inner" />
                  </div>
                )}

                {/* 2. AIRPODS 4 CASE SURFACE */}
                {isAirPods4 && (
                  <div className="relative w-56 h-56 bg-gradient-to-b from-[#FFFFFF] via-[#FBFBFB] to-[#EAEAEA] rounded-[48px] border border-white/80 shadow-[inset_0_2px_8px_rgba(255,255,255,1),inset_0_-4px_12px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.12)] flex flex-col items-center justify-between p-6">
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
                          className={`${fontStyle} font-semibold uppercase text-center select-none transition-all duration-300 break-all max-w-[180px] leading-tight`}
                        >
                          {text}
                        </div>
                      ) : (
                        <div className="text-neutral-400/60 font-mono-data text-xs uppercase tracking-widest text-center border border-dashed border-neutral-300/80 px-4 py-3 rounded-2xl">
                          Laser Etch Zone
                        </div>
                      )}
                    </div>
                    <div className="w-6 h-1.5 rounded-full bg-neutral-300/70 mb-0" />
                  </div>
                )}

                {/* 3. AIRPODS MAX ALUMINUM EAR CUP */}
                {isAirPodsMax && (
                  <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-[#383D48] via-[#4D5360] to-[#2B2F38] border-2 border-white/20 shadow-[inset_0_4px_16px_rgba(255,255,255,0.25),0_16px_40px_rgba(0,0,0,0.25)] flex items-center justify-center p-8">
                    <div className="w-full h-full rounded-full border border-white/10 flex flex-col items-center justify-center p-4">
                      {text ? (
                        <div
                          style={{
                            color: "#E6E4DF",
                            textShadow: "0px 1px 2px rgba(0,0,0,0.8)",
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                          }}
                          className={`${fontStyle} font-semibold uppercase text-center select-none transition-all duration-300 break-all max-w-[180px] leading-tight`}
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

                {/* 4. APPLE PENCIL FLAT FACET */}
                {isApplePencil && (
                  <div className="relative w-72 h-16 bg-white rounded-full border border-neutral-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_10px_24px_rgba(0,0,0,0.08)] flex items-center justify-between px-6">
                    <div className="w-3 h-3 rounded-full bg-neutral-200" />
                    <div className="flex-1 px-4 text-center">
                      {text ? (
                        <div
                          style={{
                            color: "#4A4744",
                            textShadow: "0px 0.5px 0.5px rgba(255,255,255,0.9)",
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                          }}
                          className="text-base font-semibold uppercase tracking-widest truncate"
                        >
                          {text}
                        </div>
                      ) : (
                        <div className="text-neutral-400 font-mono-data text-[10px] uppercase tracking-widest">
                          Pencil Facet Laser Zone
                        </div>
                      )}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-neutral-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Spec Footnote */}
            <div className="mt-4 flex items-center gap-4 text-[10px] font-mono-data text-neutral-500 uppercase tracking-wider">
              <span>Ablation Depth: 0.08mm</span>
              <span>•</span>
              <span>Cleanroom Annealed</span>
              <span>•</span>
              <span>Will Not Fade</span>
            </div>
          </div>

          {/* RIGHT: PERSONALIZATION CONTROLS & MONOGRAM PALETTE (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-6">
            
            <div className="space-y-6">
              {/* Mode Tabs */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 py-2 text-xs font-mono-data uppercase tracking-wider font-semibold rounded-xl transition-all duration-300 apple-tap-press cursor-pointer ${
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
                  className={`flex-1 py-2 text-xs font-mono-data uppercase tracking-wider font-semibold rounded-xl transition-all duration-300 apple-tap-press cursor-pointer ${
                    activeTab === "emoji"
                      ? "bg-white text-[#161514] shadow-xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Monograms
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("presets")}
                  className={`flex-1 py-2 text-xs font-mono-data uppercase tracking-wider font-semibold rounded-xl transition-all duration-300 apple-tap-press cursor-pointer ${
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
                <div className="space-y-4 animate-tab-panel">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider text-neutral-500 mb-2">
                      <span>Inscription Text</span>
                      <span className={text.length >= maxLength ? "text-amber-600 font-bold" : "text-neutral-400"}>
                        {text.length} / {maxLength}
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        maxLength={maxLength}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type initials or name..."
                        className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm tracking-wider font-mono-data transition-all"
                        autoFocus
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
                  </div>

                  {/* Quick Character Shortcuts */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400">
                      Common Laser Characters:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["·", "•", "-", "&", "/", "+", "#", "🤍", "⭐", "🎧"].map((sym) => (
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

              {/* TAB 2: APPLE LASER MONOGRAM / EMOJI VAULT */}
              {activeTab === "emoji" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider text-neutral-500">
                    <span>Curated Monochrome Glyphs</span>
                    <span>Tap to Stamp</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                    {APPLE_LASER_GLYPHS.map((glyph) => (
                      <button
                        key={glyph.id}
                        type="button"
                        onClick={() => handleInsertGlyph(glyph.char)}
                        title={glyph.label}
                        className="h-12 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-900 hover:text-white transition-all flex flex-col items-center justify-center text-lg hover:scale-105 active:scale-95 group shadow-2xs"
                      >
                        <span className="group-hover:scale-110 transition-transform">{glyph.char}</span>
                        <span className="text-[8px] font-mono-data tracking-tight text-neutral-400 group-hover:text-neutral-300 truncate w-full text-center px-1">
                          {glyph.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-neutral-500 font-sans-body leading-relaxed">
                    Apple laser glyphs are rendered in high-resolution vector monochrome, permanent and resistant to everyday wear.
                  </p>
                </div>
              )}

              {/* TAB 3: INSPIRATION PRESETS */}
              {activeTab === "presets" && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs font-mono-data uppercase tracking-wider text-neutral-500">
                    Curated Atelier Inspirations
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto">
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
                            Format: &ldquo;{preset.value}&rdquo;
                          </div>
                        </div>
                        <span className="text-xs font-mono-data text-neutral-400 group-hover:text-black font-semibold">
                          Apply →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-neutral-100 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-3.5 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-widest font-semibold transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{text.trim() ? "Apply Laser Engraving" : "Continue Without Engraving"}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>

                {initialText && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-4 py-3.5 rounded-full border border-neutral-200 bg-white hover:bg-red-50 text-neutral-500 hover:text-red-600 text-xs font-mono-data uppercase font-semibold transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="text-center text-[10px] font-mono-data text-neutral-400 uppercase tracking-wider">
                Certified Apple Reseller Atelier • 0% Fee • Fully Returnable Under Standard Policy
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
