"use client";

import React from "react";
import { ProductCategory, CATEGORIES_DATA, COSMO_CATALOG } from "../../data/cosmo-catalog";

interface CategoryFilterBarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

export function CategoryFilterBar({
  activeCategory,
  onSelectCategory
}: CategoryFilterBarProps) {
  return (
    <nav 
      aria-label="Product Category Filter"
      className="w-full overflow-x-auto py-2 hide-scrollbar"
    >
      <div className="flex items-center gap-2 md:gap-3 min-w-max pb-1">
        {CATEGORIES_DATA.map(cat => {
          const isSelected = activeCategory === cat.id;
          const count = cat.id === 'all' 
            ? COSMO_CATALOG.length 
            : COSMO_CATALOG.filter(item => item.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 text-left apple-tap-press cursor-pointer ${
                isSelected
                  ? 'bg-[#161514] text-white shadow-md scale-[1.02] ring-1 ring-black/10'
                  : 'bg-white/90 hover:bg-white text-neutral-700 hover:text-black shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm'
              }`}
            >
              {/* Clean Hardware Miniature */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center p-1 flex-shrink-0 transition-all duration-300 ${
                isSelected ? 'bg-white/15 scale-110' : 'bg-neutral-100/80'
              }`}>
                <img
                  src={cat.thumbnail}
                  alt={cat.label}
                  className="w-full h-full object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Label & Count */}
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold tracking-tight transition-colors duration-200">
                  {cat.label}
                </span>
                <span className={`text-xs transition-colors duration-200 ${isSelected ? 'text-neutral-300 font-medium' : 'text-neutral-500'}`}>
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
