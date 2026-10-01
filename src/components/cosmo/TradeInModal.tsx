"use client";

import React, { useState } from "react";
import { useDiscounts } from "../../context/DiscountContext";

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess?: (voucherCode: string, amount: number) => void;
}

interface TradeInDeviceOption {
  id: string;
  name: string;
  category: string;
  baseValuation: number;
}

const TRADE_IN_DEVICES: TradeInDeviceOption[] = [
  { id: "ip15pm", name: "iPhone 15 Pro Max", category: "iPhone", baseValuation: 650 },
  { id: "ip15p", name: "iPhone 15 Pro", category: "iPhone", baseValuation: 550 },
  { id: "ip14pm", name: "iPhone 14 Pro Max", category: "iPhone", baseValuation: 480 },
  { id: "ip14p", name: "iPhone 14 Pro", category: "iPhone", baseValuation: 420 },
  { id: "ip13pm", name: "iPhone 13 Pro Max", category: "iPhone", baseValuation: 350 },
  { id: "ip13", name: "iPhone 13", category: "iPhone", baseValuation: 280 },
  { id: "mba-m2", name: "MacBook Air (M2, 2022)", category: "Mac", baseValuation: 520 },
  { id: "mbp-m1", name: "MacBook Pro 14-inch (M1 Pro)", category: "Mac", baseValuation: 580 },
  { id: "aw-u1", name: "Apple Watch Ultra (Gen 1)", category: "Watch", baseValuation: 320 },
  { id: "ipad-pro-11", name: "iPad Pro 11-inch (M2)", category: "iPad", baseValuation: 390 },
];

export function TradeInModal({ isOpen, onClose, onApplySuccess }: TradeInModalProps) {
  const { issueTradeInVoucher } = useDiscounts();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("ip14p");

  // Condition checks
  const [powersOn, setPowersOn] = useState<boolean>(true);
  const [screenGood, setScreenGood] = useState<boolean>(true);
  const [camerasGood, setCamerasGood] = useState<boolean>(true);

  // Result state
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedDevice = TRADE_IN_DEVICES.find(d => d.id === selectedDeviceId) || TRADE_IN_DEVICES[3];

  // Calculate condition multiplier
  let conditionFactor = 1.0;
  if (!powersOn) conditionFactor *= 0.35;
  if (!screenGood) conditionFactor *= 0.65;
  if (!camerasGood) conditionFactor *= 0.85;

  const finalValuation = Math.max(50, Math.round(selectedDevice.baseValuation * conditionFactor));

  const handleCompleteDiagnosis = () => {
    const voucher = issueTradeInVoucher(finalValuation, selectedDevice.name);
    setIssuedCode(voucher.code);
    setStep(3);
    if (onApplySuccess) {
      onApplySuccess(voucher.code, finalValuation);
    }
  };

  const handleCopy = () => {
    if (issuedCode) {
      navigator.clipboard.writeText(issuedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setStep(1);
    setIssuedCode(null);
    setCopied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans-body">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#161514]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200/80 z-10 animate-apple-fade-in overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center font-bold text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
            </div>
            <div>
              <h3 className="font-serif-editorial text-2xl font-normal text-[#161514]">
                Apple Trade-In Valuation
              </h3>
              <p className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400">
                Official Reseller Guaranteed Exchange Credit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className={`flex items-center gap-2 text-xs font-mono-data ${step >= 1 ? 'text-black font-bold' : 'text-neutral-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-black text-white' : 'bg-neutral-200'}`}>1</span>
            <span>Device</span>
          </div>
          <div className="h-[1px] flex-1 bg-neutral-200 mx-3" />
          <div className={`flex items-center gap-2 text-xs font-mono-data ${step >= 2 ? 'text-black font-bold' : 'text-neutral-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-black text-white' : 'bg-neutral-200'}`}>2</span>
            <span>Condition</span>
          </div>
          <div className="h-[1px] flex-1 bg-neutral-200 mx-3" />
          <div className={`flex items-center gap-2 text-xs font-mono-data ${step >= 3 ? 'text-[#059669] font-bold' : 'text-neutral-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#059669] text-white' : 'bg-neutral-200'}`}>3</span>
            <span>Credit Voucher</span>
          </div>
        </div>

        {/* STEP 1: SELECT DEVICE */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-600 font-medium">
              Select the Apple device you wish to exchange:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {TRADE_IN_DEVICES.map(dev => {
                const isSelected = dev.id === selectedDeviceId;
                return (
                  <button
                    key={dev.id}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-sm ring-1 ring-black"
                        : "border-neutral-200 hover:border-neutral-300 bg-[#FAF8F5]/60 text-neutral-800"
                    }`}
                  >
                    <div className="text-[10px] font-mono-data uppercase tracking-wider opacity-70">
                      {dev.category}
                    </div>
                    <div className="text-xs font-semibold mt-1">
                      {dev.name}
                    </div>
                    <div className={`text-[11px] font-mono-data font-bold mt-2 ${isSelected ? 'text-emerald-400' : 'text-[#059669]'}`}>
                      Up to ${dev.baseValuation}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Continue to Condition Check</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CONDITION DIAGNOSTICS */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono-data text-neutral-400 uppercase">Selected Device</div>
                <div className="text-xs font-bold text-[#161514]">{selectedDevice.name}</div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-[11px] font-mono-data text-neutral-500 hover:text-black underline"
              >
                Change
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-neutral-500 font-medium">Answer these 3 quick diagnostics to calculate your exact credit:</p>

              {/* Q1 */}
              <div className="p-3.5 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-neutral-900">1. Does the device power on and charge?</div>
                  <div className="text-[11px] text-neutral-500">Device boots normally and battery functions properly.</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setPowersOn(true)}
                    className={`px-3 py-1 rounded-full text-xs font-mono-data font-semibold ${powersOn ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setPowersOn(false)}
                    className={`px-3 py-1 rounded-full text-xs font-mono-data font-semibold ${!powersOn ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Q2 */}
              <div className="p-3.5 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-neutral-900">2. Is the display free of cracks or dead pixels?</div>
                  <div className="text-[11px] text-neutral-500">Touch response works across the entire screen area.</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setScreenGood(true)}
                    className={`px-3 py-1 rounded-full text-xs font-mono-data font-semibold ${screenGood ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setScreenGood(false)}
                    className={`px-3 py-1 rounded-full text-xs font-mono-data font-semibold ${!screenGood ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Q3 */}
              <div className="p-3.5 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-neutral-900">3. Are cameras, buttons, and biometrics intact?</div>
                  <div className="text-[11px] text-neutral-500">Face ID/Touch ID, speakers, and microphones function.</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setCamerasGood(true)}
                    className={`px-3 py-1 rounded-full text-xs font-mono-data font-semibold ${camerasGood ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setCamerasGood(false)}
                    className={`px-3 py-1 rounded-full text-xs font-mono-data font-semibold ${!camerasGood ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Estimated Subtotal Preview */}
            <div className="flex items-baseline justify-between pt-2 border-t border-neutral-100">
              <span className="text-xs text-neutral-500 font-mono-data uppercase">Estimated Trade-In Credit:</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#059669]">${finalValuation} USD</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-mono-data uppercase text-neutral-500 hover:text-black"
              >
                ← Back
              </button>
              <button
                onClick={handleCompleteDiagnosis}
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono-data uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Generate Trade-In Voucher</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VOUCHER RESULT */}
        {step === 3 && (
          <div className="space-y-6 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <div className="text-[11px] font-mono-data uppercase tracking-widest text-[#059669] font-bold">
                Trade-In Credit Confirmed
              </div>
              <h4 className="font-serif-editorial text-4xl font-normal text-[#161514] mt-1">
                ${finalValuation} <span className="text-base text-neutral-400 font-mono-data">USD</span>
              </h4>
              <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
                Your trade-in credit for <strong className="text-neutral-800">{selectedDevice.name}</strong> has been created and automatically applied to your checkout.
              </p>
            </div>

            {/* Voucher Code Box */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <div className="text-[9px] font-mono-data text-neutral-400 uppercase tracking-widest">
                  Official Trade-In Voucher Code
                </div>
                <div className="font-mono-data text-base font-bold text-neutral-900 tracking-wider">
                  {issuedCode}
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-mono-data font-semibold text-neutral-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[#059669]">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-neutral-500 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-left space-y-1">
              <div className="font-semibold text-neutral-700">How to finalize your exchange:</div>
              <div>• We will deliver your new Apple device directly to your address.</div>
              <div>• Hand over your old {selectedDevice.name} to our courier upon delivery after inspecting your new device.</div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="text-xs font-mono-data uppercase text-neutral-500 hover:text-black"
              >
                Estimate Another Device
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-[#161514] hover:bg-neutral-800 text-white text-xs font-mono-data uppercase tracking-wider font-semibold transition-all shadow-sm"
              >
                Done & Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
