"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HERO_PRODUCT, CosmoProduct, ProductFinishes } from "../../data/cosmo-catalog";

interface HeroLookbookProps {
  onAddToCart: (product: CosmoProduct, finishName?: string) => void;
}

export function HeroLookbook({ onAddToCart }: HeroLookbookProps) {
  const [selectedFinishIndex, setSelectedFinishIndex] = useState(0);
  const [activeView, setActiveView] = useState<'primary' | 'secondary'>('primary');

  const finishes: ProductFinishes[] = HERO_PRODUCT.finishes || [];
  const currentFinish = finishes[selectedFinishIndex];

  const currentImage = activeView === 'primary' 
    ? (currentFinish ? currentFinish.heroImage : HERO_PRODUCT.primaryImage)
    : HERO_PRODUCT.secondaryImage;

  return (
    <section className="border-b border-[#E5DFD5] bg-[#FAF8F5]">
      <div className="max-w-[1520px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
        
        {/* Left Column: Curatorial Essay & Interactive Selector (6 cols) */}
        <div className="lg:col-span-6 p-8 md:p-16 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5DFD5]">
          <div>
            {/* Museum Classification */}
            <div className="flex items-center gap-3 text-[10px] font-mono-data tracking-[0.26em] uppercase text-neutral-500 mb-8">
              <span>{HERO_PRODUCT.era}</span>
              <span className="text-neutral-300">/</span>
              <span className="text-[#059669] font-medium">AVAILABLE IN STORE</span>
            </div>

            {/* Editorial Title */}
            <h2 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-[-0.02em] text-[#161514] mb-6">
              Crafted with <span className="italic font-light">Grade 5 Titanium</span>.
            </h2>

            <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-xl font-light mb-8">
              {HERO_PRODUCT.curatorialSubtitle}
            </p>

            {/* Interactive Material / Finish Selector */}
            <div className="border-t border-b border-[#E5DFD5] py-6 my-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono-data uppercase tracking-[0.2em] text-neutral-500">
                  Choose Color
                </span>
                <span className="text-[11px] font-mono-data uppercase tracking-[0.2em] text-black font-semibold">
                  {currentFinish?.name}
                </span>
              </div>

              {/* Finish Swatch Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {finishes.map((finish, idx) => {
                  const isSelected = idx === selectedFinishIndex;
                  return (
                    <button
                      key={finish.id}
                      onClick={() => {
                        setSelectedFinishIndex(idx);
                        setActiveView('primary');
                      }}
                      className={`p-3 text-left border transition-all ${
                        isSelected 
                          ? 'border-black bg-[#F3EFEA] shadow-sm' 
                          : 'border-[#E5DFD5] hover:border-neutral-400 bg-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner"
                          style={{ backgroundColor: finish.colorCode }}
                        />
                        <span className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-800 truncate font-medium">
                          {finish.name.replace(' Titanium', '').replace(' (Gold)', '')}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono-data text-neutral-500">
                        {isSelected ? "SELECTED" : "VIEW COLOR"}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic finish narrative */}
              <p className="text-xs text-neutral-500 italic mt-4 font-serif-editorial text-[14px]">
                &ldquo;{currentFinish?.editorialDescription}&rdquo;
              </p>
            </div>

            {/* Architectural Spec Footnotes */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono-data text-neutral-600 mb-8">
              <div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1">FRAME & FINISH</span>
                <span>{HERO_PRODUCT.material}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1">SIZE & WEIGHT</span>
                <span>{HERO_PRODUCT.dimensions} · {HERO_PRODUCT.weight}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#E5DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono-data uppercase tracking-[0.2em] text-neutral-400">STARTING PRICE</div>
              <div className="font-serif-editorial text-3xl md:text-4xl text-[#161514]">
                ${HERO_PRODUCT.basePrice} <span className="text-sm font-mono-data font-normal text-neutral-500">USD</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/device/${HERO_PRODUCT.slug}`}
                className="px-5 py-4 border border-[#161514] text-[#161514] text-xs font-mono-data uppercase tracking-[0.2em] hover:bg-[#F3EFEA] transition-colors text-center"
              >
                View Specifications
              </Link>
              <button
                onClick={() => onAddToCart(HERO_PRODUCT, currentFinish?.name)}
                className="px-6 py-4 bg-[#161514] text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.22em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 group"
              >
                <span>ADD TO BAG</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Full-Height Sculpture Photography (6 cols) */}
        <div className="lg:col-span-6 bg-[#F3EFEA] relative flex flex-col justify-between overflow-hidden">
          
          {/* Top image bar */}
          <div className="p-6 md:p-8 flex items-center justify-between z-10">
            <span className="text-[10px] font-mono-data uppercase tracking-[0.25em] text-neutral-500 bg-[#FAF8F5]/80 px-2.5 py-1 backdrop-blur-sm border border-[#E5DFD5]">
              COLOR // {currentFinish?.name.toUpperCase() || "TITANIUM"}
            </span>

            {/* View angle toggle */}
            <div className="flex border border-[#E5DFD5] bg-[#FAF8F5]/80 backdrop-blur-sm">
              <button
                onClick={() => setActiveView('primary')}
                className={`px-3 py-1 text-[10px] font-mono-data uppercase tracking-wider transition-colors ${activeView === 'primary' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveView('secondary')}
                className={`px-3 py-1 text-[10px] font-mono-data uppercase tracking-wider transition-colors ${activeView === 'secondary' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'}`}
              >
                Display
              </button>
            </div>
          </div>

          {/* Focal Image with containment */}
          <div className="relative flex-1 flex items-center justify-center p-8 md:p-14 group">
            <img
              src={currentImage}
              alt={HERO_PRODUCT.title}
              className="w-full max-h-[520px] object-contain filter contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          {/* Bottom Caption Bar */}
          <div className="p-6 md:p-8 border-t border-[#E5DFD5] bg-[#FAF8F5]/60 flex items-center justify-between text-[10px] font-mono-data uppercase tracking-[0.2em] text-neutral-500">
            <span>100% GENUINE APPLE</span>
            <Link 
              href={`/device/${HERO_PRODUCT.slug}`}
              className="text-black font-semibold hover:underline flex items-center gap-1"
            >
              <span>VIEW FULL SPECIFICATIONS</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
