"use client";

import React, { useState } from "react";
import { CosmoProduct } from "../../data/cosmo-catalog";

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: CosmoProduct | null;
  baseAmount?: number;
}

export function InstallmentModal({ isOpen, onClose, product, baseAmount = 999 }: InstallmentModalProps) {
  const [tenure, setTenure] = useState<number>(12);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<string>("cib-0");

  if (!isOpen) return null;

  const total = product ? product.basePrice : baseAmount;
  const downPayment = Math.round(total * (downPaymentPercent / 100));
  const financedAmount = total - downPayment;
  const monthlyPayment = Math.ceil(financedAmount / tenure);

  const partners = [
    { id: "cib-0", name: "0% Bank Installments", promo: "0% Interest / 0% Admin Fees", maxTenure: 12 },
    { id: "valu", name: "ValU Consumer Finance", promo: "Up to 36 months, Instant Approval", maxTenure: 36 },
    { id: "sympl", name: "Sympl Pay", promo: "Split in 3, 4, or 5 payments with 0% interest", maxTenure: 6 },
    { id: "tabby", name: "Tabby / Tamara BNPL", promo: "4 Interest-Free Payments", maxTenure: 6 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans-body">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh] animate-apple-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-[#FAF8F5]/80">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono-data tracking-[0.2em] text-[#059669] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              <span>FINANCING & INSTALLMENT CALCULATOR</span>
            </div>
            <h3 className="font-serif-editorial text-2xl text-[#161514] font-medium mt-1">
              {product ? product.title : "Device Financing"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center apple-tap-press transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Monthly Payment Hero Banner */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-data tracking-wider uppercase text-neutral-500 font-semibold">
                Estimated Monthly Cost ({tenure} Months)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span key={monthlyPayment} className="font-serif-editorial text-3xl font-semibold text-[#161514] animate-tab-panel inline-block">
                  ${monthlyPayment}
                </span>
                <span className="text-xs font-mono-data text-neutral-400">/ month</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-[#059669] text-xs font-mono-data font-bold">
                0% Interest Available
              </span>
              <div className="text-[10px] font-mono-data text-neutral-400 mt-1">
                Device Price: ${total}
              </div>
            </div>
          </div>

          {/* Tenure Selection (Months) */}
          <div className="space-y-2">
            <label className="text-xs font-mono-data uppercase tracking-wider text-neutral-600 font-semibold">
              Select Financing Term (Months)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[6, 12, 18, 24].map((m) => (
                <button
                  key={m}
                  onClick={() => setTenure(m)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-mono-data font-semibold transition-all duration-300 apple-tap-press cursor-pointer ${
                    tenure === m
                      ? "bg-[#161514] text-white border-[#161514] shadow-sm scale-[1.02] animate-swatch-pop"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {m} Months
                </button>
              ))}
            </div>
          </div>

          {/* Down Payment Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono-data uppercase tracking-wider text-neutral-600 font-semibold">
                Down Payment: {downPaymentPercent}% (${downPayment})
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 20, 30].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono-data font-medium transition-all ${
                    downPaymentPercent === pct
                      ? "bg-neutral-800 text-white border-neutral-800"
                      : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  {pct === 0 ? "No Down Payment" : `${pct}% ($${Math.round(total * (pct / 100))})`}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Partners & Schemes */}
          <div className="space-y-2">
            <label className="text-xs font-mono-data uppercase tracking-wider text-neutral-600 font-semibold">
              Select Financing Partner
            </label>
            <div className="space-y-2">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPlan(partner.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedPlan === partner.id
                      ? "border-[#161514] bg-neutral-50 shadow-2xs"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPlan === partner.id ? "border-[#161514] bg-[#161514]" : "border-neutral-300"
                    }`}>
                      {selectedPlan === partner.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#161514]">{partner.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono-data">{partner.promo}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] font-bold">
                    0% FEES
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500">
            Terms subject to bank credit approval at checkout.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#161514] text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
