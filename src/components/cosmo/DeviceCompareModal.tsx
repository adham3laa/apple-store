"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CosmoProduct } from "../../data/cosmo-catalog";
import { useCart } from "../../context/CartContext";

interface DeviceCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: CosmoProduct[];
  initialDeviceA?: CosmoProduct;
}

export function DeviceCompareModal({
  isOpen,
  onClose,
  products,
  initialDeviceA,
}: DeviceCompareModalProps) {
  const { addToCart } = useCart();

  const [deviceAId, setDeviceAId] = useState<string>(
    initialDeviceA ? initialDeviceA.id : products[0]?.id || ""
  );
  const [deviceBId, setDeviceBId] = useState<string>(
    products[1] ? products[1].id : products[0]?.id || ""
  );

  if (!isOpen) return null;

  const deviceA = products.find((p) => p.id === deviceAId) || products[0];
  const deviceB = products.find((p) => p.id === deviceBId) || products[1] || products[0];

  // Helper to extract spec value from technicalDossier
  const getSpec = (product: CosmoProduct, keyword: string): string => {
    if (!product || !product.technicalDossier) return "Standard Specification";
    for (const cat of product.technicalDossier) {
      for (const item of cat.specs) {
        if (
          item.label.toLowerCase().includes(keyword.toLowerCase()) ||
          cat.title.toLowerCase().includes(keyword.toLowerCase())
        ) {
          return item.value;
        }
      }
    }
    // Fallback to specHighlights or general attributes
    if (keyword === "material") return product.material;
    if (keyword === "weight") return product.weight;
    if (keyword === "dimensions") return product.dimensions;
    return product.specHighlights?.[0] || "Official Apple Specification";
  };

  const comparisonRows = [
    { label: "Category", getVal: (p: CosmoProduct) => p.category.toUpperCase() },
    { label: "Starting Price", getVal: (p: CosmoProduct) => `$${p.basePrice.toLocaleString()} ${p.currency}` },
    { label: "Material & Finish", getVal: (p: CosmoProduct) => p.material },
    { label: "Dimensions", getVal: (p: CosmoProduct) => p.dimensions },
    { label: "Weight", getVal: (p: CosmoProduct) => p.weight },
    { label: "Display & Screen", getVal: (p: CosmoProduct) => getSpec(p, "display") },
    { label: "Processor / Chip", getVal: (p: CosmoProduct) => getSpec(p, "chip") || getSpec(p, "processor") },
    { label: "Camera System", getVal: (p: CosmoProduct) => getSpec(p, "camera") },
    { label: "Battery & Power", getVal: (p: CosmoProduct) => getSpec(p, "battery") || getSpec(p, "power") },
    { label: "Storage Options", getVal: (p: CosmoProduct) => p.capacities?.map(c => c.size).join(", ") || "Standard" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in font-sans-body">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[92vh] animate-apple-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-[#FAF8F5]/80">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono-data tracking-[0.2em] text-[#059669] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              <span>COMPARE APPLE DEVICES // SIDE-BY-SIDE</span>
            </div>
            <h3 className="font-serif-editorial text-2xl text-[#161514] font-medium mt-0.5">
              Compare Specifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Device Selectors Top Row */}
        <div className="grid grid-cols-2 border-b border-neutral-100 divide-x divide-neutral-100 bg-neutral-50/50 p-4 sm:p-6 gap-4">
          {/* Device A Selector */}
          <div className="space-y-3 text-center">
            <select
              value={deviceAId}
              onChange={(e) => setDeviceAId(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-black"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (${p.basePrice})
                </option>
              ))}
            </select>

            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto relative flex items-center justify-center">
              <img
                src={deviceA.primaryImage}
                alt={deviceA.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform hover:scale-105 duration-300"
              />
            </div>

            <div>
              <h4 className="font-serif-editorial text-lg font-medium text-[#161514]">
                {deviceA.title}
              </h4>
              <div className="text-xs font-mono-data text-neutral-500 mt-0.5 font-bold">
                ${deviceA.basePrice.toLocaleString()} {deviceA.currency}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <Link
                href={`/device/${deviceA.slug}`}
                onClick={onClose}
                className="text-[11px] font-semibold text-neutral-700 hover:text-black underline underline-offset-4"
              >
                View Details
              </Link>
              <button
                onClick={() => {
                  addToCart(deviceA);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-full bg-[#161514] text-white text-[10px] font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-all"
              >
                Add to Bag
              </button>
            </div>
          </div>

          {/* Device B Selector */}
          <div className="space-y-3 text-center">
            <select
              value={deviceBId}
              onChange={(e) => setDeviceBId(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-black"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (${p.basePrice})
                </option>
              ))}
            </select>

            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto relative flex items-center justify-center">
              <img
                src={deviceB.primaryImage}
                alt={deviceB.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform hover:scale-105 duration-300"
              />
            </div>

            <div>
              <h4 className="font-serif-editorial text-lg font-medium text-[#161514]">
                {deviceB.title}
              </h4>
              <div className="text-xs font-mono-data text-neutral-500 mt-0.5 font-bold">
                ${deviceB.basePrice.toLocaleString()} {deviceB.currency}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <Link
                href={`/device/${deviceB.slug}`}
                onClick={onClose}
                className="text-[11px] font-semibold text-neutral-700 hover:text-black underline underline-offset-4"
              >
                View Details
              </Link>
              <button
                onClick={() => {
                  addToCart(deviceB);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-full bg-[#161514] text-white text-[10px] font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-all"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          <table className="w-full text-xs border-collapse">
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={row.label}
                  className={`border-b border-neutral-100 ${
                    idx % 2 === 0 ? "bg-[#FAF8F5]/50" : "bg-white"
                  }`}
                >
                  <td
                    colSpan={2}
                    className="pt-3 pb-1 px-3 text-[10px] font-mono-data uppercase tracking-wider text-neutral-400 font-bold block sm:table-cell sm:w-1/4 sm:py-3"
                  >
                    {row.label}
                  </td>
                  <td className="w-1/2 sm:w-3/8 py-2 sm:py-3 px-3 align-top font-medium text-neutral-800 border-r border-neutral-100">
                    {row.getVal(deviceA)}
                  </td>
                  <td className="w-1/2 sm:w-3/8 py-2 sm:py-3 px-3 align-top font-medium text-neutral-800">
                    {row.getVal(deviceB)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <span className="text-[11px] font-mono-data text-neutral-500">
            Official Apple technical specifications
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#161514] text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
