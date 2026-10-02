"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CosmoProduct } from "../../data/cosmo-catalog";

interface ProductCardProps {
  product: CosmoProduct;
  onAddToCart: (product: CosmoProduct) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [activeFinishIndex, setActiveFinishIndex] = useState<number | null>(null);

  const finishes = product.finishes || [];
  const currentImage = activeFinishIndex !== null && finishes[activeFinishIndex]?.heroImage
    ? finishes[activeFinishIndex].heroImage
    : product.primaryImage;

  const currentFinishName = activeFinishIndex !== null && finishes[activeFinishIndex]?.name
    ? finishes[activeFinishIndex].name
    : null;

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl p-6 transition-all duration-400 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 border border-neutral-100/80">
      {/* Category Tag & Status */}
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="font-mono-data font-semibold uppercase tracking-[0.22em] text-[10px] text-[#059669] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
          {product.category}
        </span>
        <span className="font-mono-data text-[10px] text-neutral-400 tracking-wider">
          MODEL #{product.id}
        </span>
      </div>

      {/* Well-proportioned, compact image stage with fluid crossfade on color change */}
      <Link 
        href={`/device/${product.slug}`}
        className="relative w-full h-56 sm:h-64 flex items-center justify-center p-4 my-2 overflow-hidden rounded-xl apple-tap-press"
      >
        {finishes.length > 0 ? (
          finishes.map((f, idx) => {
            const isActive = (activeFinishIndex === null && idx === 0) || activeFinishIndex === idx;
            return (
              <img
                key={f.id}
                src={f.heroImage}
                alt={`${product.title} in ${f.name}`}
                className={`absolute inset-0 m-auto max-h-full max-w-full object-contain p-4 drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04] pointer-events-none ${
                  isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[0.98] z-0'
                }`}
              />
            );
          })
        ) : (
          <img
            src={product.primaryImage}
            alt={product.title}
            className="max-h-full max-w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
          />
        )}
      </Link>

      {/* Product Information */}
      <div className="pt-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Color finishes dots preview with live switch on hover/tap */}
          {finishes.length > 0 && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {finishes.map((f, idx) => {
                  const isSelected = activeFinishIndex === idx;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      title={f.name}
                      onMouseEnter={() => setActiveFinishIndex(idx)}
                      onClick={() => setActiveFinishIndex(idx)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 relative touch-manipulation before:content-[''] before:absolute before:-inset-2.5 before:rounded-full ${
                        isSelected 
                          ? 'scale-125 ring-2 ring-black/80 ring-offset-1 border-white shadow-xs z-10' 
                          : 'border-black/10 hover:scale-110 shadow-2xs'
                      }`}
                      style={{ backgroundColor: f.colorCode }}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] text-neutral-500 font-mono-data font-semibold truncate">
                {currentFinishName ? (
                  <span className="text-neutral-800 font-bold transition-all duration-200">
                    {currentFinishName.replace(' Titanium', '')}
                  </span>
                ) : (
                  `${finishes.length} ${finishes.length === 1 ? "color" : "colors"}`
                )}
              </span>
            </div>
          )}

          <Link href={`/device/${product.slug}`} className="block group/link">
            <h3 className="font-serif-editorial text-xl font-medium text-[#161514] group-hover/link:text-neutral-600 transition-colors tracking-tight mb-1.5 leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-neutral-500 font-normal leading-relaxed line-clamp-2 mb-4 font-sans-body">
            {product.curatorialSubtitle}
          </p>
        </div>

        {/* Pricing & Buy CTA */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="block text-[9px] font-mono-data uppercase tracking-wider text-neutral-400 font-medium">
              Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-serif-editorial font-semibold text-[#161514]">
                ${product.basePrice}
              </span>
              <span className="text-[10px] font-mono-data text-emerald-600 font-semibold">
                or ${Math.ceil(product.basePrice / 12)}/mo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/device/${product.slug}`}
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 apple-tap-press transition-colors"
            >
              Details
            </Link>
            {product.inStock !== false ? (
              <button
                onClick={() => onAddToCart(product)}
                className="px-4 py-2 rounded-full bg-[#161514] text-[#FAF8F5] text-xs font-semibold hover:bg-neutral-800 apple-tap-press transition-colors shadow-sm"
              >
                Add to Bag
              </button>
            ) : (
              <span className="px-3 py-2 rounded-full bg-neutral-100 text-neutral-400 text-xs font-mono-data font-semibold">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
