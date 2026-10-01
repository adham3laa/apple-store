"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CosmoProduct } from "../../data/cosmo-catalog";

export interface CartItem {
  product: CosmoProduct;
  quantity: number;
  selectedFinish?: string;
  appleCarePlan?: {
    name: string;
    price: number;
    duration: string;
  };
  engravingText?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number, selectedFinish?: string) => void;
  onRemoveItem: (productId: string, selectedFinish?: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem
}: CartDrawerProps) {
  const router = useRouter();
  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product.basePrice + (item.appleCarePlan?.price || 0)) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#161514]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif-editorial text-2xl font-normal text-[#161514]">
              Shopping Bag
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-mono-data tracking-wider uppercase text-neutral-500 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              <span>
                {items.reduce((s, i) => s + i.quantity, 0)} {items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'Item' : 'Items'} Selected
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Delivery note */}
        <div className="bg-[#FAF8F5] px-6 py-3 text-xs text-neutral-600 flex items-center gap-2 border-b border-neutral-100/60 font-mono-data text-[10px] tracking-wider uppercase">
          <svg className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Free insured delivery & Apple warranty included</span>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-[#059669] mb-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <p className="font-serif-editorial text-xl font-normal text-neutral-800 mb-1">Your bag is empty.</p>
              <p className="text-xs text-neutral-500 font-sans-body">
                Explore our official Apple collection.
              </p>
            </div>
          ) : (
            items.map((item, idx) => {
              const itemUnitTotal = item.product.basePrice + (item.appleCarePlan?.price || 0);
              return (
                <div key={`${item.product.id}-${item.selectedFinish || 'default'}-${idx}`} className="py-5 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-18 h-18 bg-neutral-50 rounded-2xl flex-shrink-0 p-2 flex items-center justify-center border border-neutral-100">
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif-editorial text-base font-medium text-[#161514] leading-snug">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedFinish)}
                          className="text-xs font-medium text-neutral-400 hover:text-red-600 transition-colors font-mono-data text-[10px]"
                        >
                          REMOVE
                        </button>
                      </div>

                      {item.selectedFinish && (
                        <span className="inline-block text-[11px] font-mono-data text-neutral-500 mt-0.5 tracking-wider uppercase">
                          {item.selectedFinish}
                        </span>
                      )}

                      {/* Custom AppleCare+ Badge */}
                      {item.appleCarePlan && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono-data text-[#059669] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/80">
                          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <span>{item.appleCarePlan.name} (+${item.appleCarePlan.price})</span>
                        </div>
                      )}

                      {/* Custom Laser Engraving Badge */}
                      {item.engravingText && (
                        <div className="mt-1 text-[10px] font-mono-data text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          Laser Engraving: &ldquo;<span className="font-semibold text-black">{item.engravingText}</span>&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center bg-neutral-100 rounded-full">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1, item.selectedFinish)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-200 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-800 font-mono-data">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1, item.selectedFinish)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-200 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-serif-editorial text-lg font-semibold text-[#161514]">
                        ${itemUnitTotal * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-white space-y-4">
            <div className="space-y-1.5 text-xs text-neutral-600 font-mono-data text-[11px] uppercase tracking-wider">
              <div className="flex justify-between">
                <span>Insured Delivery</span>
                <span className="text-[#059669] font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-base text-[#161514] pt-3 border-t border-neutral-100 items-baseline">
                <span>Total Amount</span>
                <span className="font-serif-editorial text-2xl font-semibold text-[#161514]">${totalAmount} USD</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                router.push('/checkout');
              }}
              className="w-full py-4 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-3 shadow-sm group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] group-hover:scale-125 transition-transform" />
              <span>Proceed to Checkout</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
