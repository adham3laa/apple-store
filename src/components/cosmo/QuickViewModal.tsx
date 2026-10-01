"use client";

import React from "react";
import { CosmoProduct } from "../../data/cosmo-catalog";

interface QuickViewModalProps {
  product: CosmoProduct | null;
  onClose: () => void;
  onAddToCart: (product: CosmoProduct) => void;
}

export function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#161514]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E5DFD5] shadow-2xl z-10 max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-12">
        {/* Left: Product Imagery (5 cols) */}
        <div className="md:col-span-6 bg-[#F3EFEA] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5DFD5]">
          <div className="text-[9px] font-mono-data uppercase tracking-[0.24em] text-neutral-500">
            {product.era}
          </div>

          <div className="my-8 aspect-[3/4] overflow-hidden flex items-center justify-center">
            <img
              src={product.primaryImage}
              alt={product.title}
              className="w-full h-full object-cover filter contrast-[1.02]"
            />
          </div>

          <div className="text-[10px] font-mono-data text-neutral-400">
            REGISTRATION // REF: {product.slug}
          </div>
        </div>

        {/* Right: Curatorial Details & Specs (7 cols) */}
        <div className="md:col-span-6 p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono-data uppercase tracking-[0.25em] text-[#059669]">
                DEVICE DETAILS
              </span>
              <button
                onClick={onClose}
                className="text-xs font-mono-data text-neutral-500 hover:text-black p-1"
              >
                [ESC ×]
              </button>
            </div>

            <h2 className="font-serif-editorial text-3xl text-[#161514] mb-2 leading-tight">
              {product.title}
            </h2>

            <p className="text-sm text-neutral-600 font-light mb-6">
              {product.curatorialSubtitle}
            </p>

            {/* Designer note quote */}
            <div className="border-l-2 border-[#161514] pl-4 py-1 my-4 bg-[#F3EFEA]/50">
              <p className="font-serif-editorial italic text-sm text-neutral-800">
                &ldquo;{product.designerNote}&rdquo;
              </p>
            </div>

            {/* Condition / Provenance if archival */}
            {product.condition && (
              <div className="bg-[#F3EFEA] p-3 border border-[#E5DFD5] my-4 text-xs font-mono-data space-y-1">
                <div className="text-amber-800 uppercase font-semibold">CONDITION:</div>
                <div className="text-neutral-700">{product.condition}</div>
                {product.provenance && (
                  <div className="text-neutral-500 pt-1 border-t border-[#E5DFD5]">
                    ORIGIN: {product.provenance}
                  </div>
                )}
              </div>
            )}

            {/* Technical Highlights */}
            <div className="mt-6">
              <span className="text-[10px] font-mono-data uppercase tracking-[0.2em] text-neutral-400 block mb-2">
                KEY FEATURES
              </span>
              <ul className="space-y-1.5 text-xs font-mono-data text-neutral-700">
                {product.specHighlights.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-black rounded-full" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-8 mt-8 border-t border-[#E5DFD5] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono-data uppercase tracking-[0.2em] text-neutral-400 block">
                PRICE
              </span>
              <span className="font-serif-editorial text-2xl text-[#161514]">
                ${product.basePrice} <span className="text-xs font-mono-data font-normal text-neutral-500">USD</span>
              </span>
            </div>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="px-6 py-3 bg-[#161514] text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
            >
              ADD TO BAG →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
