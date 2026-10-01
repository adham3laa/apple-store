"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PromoCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number; // e.g. 10 for 10%, 50 for $50
  minSpend?: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: string;
  isActive: boolean;
  description: string;
  isTradeInVoucher?: boolean;
  tradeInDevice?: string;
}

interface ValidationResult {
  success: boolean;
  message: string;
  discountAmount: number;
  coupon?: PromoCoupon;
}

interface DiscountContextType {
  coupons: PromoCoupon[];
  appliedCoupon: PromoCoupon | null;
  applyCoupon: (code: string, currentSubtotal: number) => ValidationResult;
  removeAppliedCoupon: () => void;
  calculateDiscount: (currentSubtotal: number) => number;
  createCoupon: (coupon: Omit<PromoCoupon, "id" | "usedCount">) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  issueTradeInVoucher: (amount: number, deviceDescription: string) => PromoCoupon;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

const STORAGE_KEY = "cosmo_discounts_v2";

const SEED_COUPONS: PromoCoupon[] = [
  {
    id: "coupon-welcome10",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minSpend: 100,
    maxUses: 500,
    usedCount: 38,
    expiryDate: "2026-12-31",
    isActive: true,
    description: "10% off your order for new clients (min. $100 spend)"
  },
  {
    id: "coupon-apple50",
    code: "APPLE50",
    discountType: "fixed",
    discountValue: 50,
    minSpend: 500,
    maxUses: 200,
    usedCount: 74,
    expiryDate: "2026-12-31",
    isActive: true,
    description: "$50 instant voucher on orders above $500"
  },
  {
    id: "coupon-luxury2026",
    code: "LUXURY2026",
    discountType: "percentage",
    discountValue: 15,
    minSpend: 1200,
    maxUses: 100,
    usedCount: 19,
    expiryDate: "2026-11-30",
    isActive: true,
    description: "15% VIP discount on premium configurations above $1,200"
  }
];

export function DiscountProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<PromoCoupon[]>(SEED_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted coupons from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCoupons(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load coupons from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
      } catch (e) {
        console.warn("Failed to persist coupons to localStorage", e);
      }
    }
  }, [coupons, isHydrated]);

  const calculateDiscount = (subtotal: number): number => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minSpend && subtotal < appliedCoupon.minSpend) return 0;

    if (appliedCoupon.discountType === "percentage") {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      return Math.min(subtotal, appliedCoupon.discountValue);
    }
  };

  const applyCoupon = (code: string, currentSubtotal: number): ValidationResult => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Please enter a coupon or trade-in code.", discountAmount: 0 };
    }

    const matched = coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!matched) {
      return { success: false, message: `Promo code "${cleanCode}" is not recognized.`, discountAmount: 0 };
    }

    if (!matched.isActive) {
      return { success: false, message: `Promo code "${cleanCode}" has expired or is inactive.`, discountAmount: 0 };
    }

    if (matched.minSpend && currentSubtotal < matched.minSpend) {
      return {
        success: false,
        message: `This coupon requires a minimum spend of $${matched.minSpend}. (Current: $${currentSubtotal})`,
        discountAmount: 0
      };
    }

    if (matched.maxUses && matched.usedCount >= matched.maxUses) {
      return { success: false, message: `This promotional code has reached its maximum usage limit.`, discountAmount: 0 };
    }

    let discount = 0;
    if (matched.discountType === "percentage") {
      discount = Math.round((currentSubtotal * matched.discountValue) / 100);
    } else {
      discount = Math.min(currentSubtotal, matched.discountValue);
    }

    setAppliedCoupon(matched);
    return {
      success: true,
      message: matched.isTradeInVoucher 
        ? `Trade-In credit voucher applied! Saved $${discount}.`
        : `Coupon "${matched.code}" applied! Saved $${discount}.`,
      discountAmount: discount,
      coupon: matched
    };
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
  };

  const createCoupon = (couponData: Omit<PromoCoupon, "id" | "usedCount">) => {
    const newCoupon: PromoCoupon = {
      ...couponData,
      id: `coupon-${Date.now()}`,
      code: couponData.code.trim().toUpperCase(),
      usedCount: 0
    };

    setCoupons(prev => [newCoupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    if (appliedCoupon?.id === id) {
      setAppliedCoupon(null);
    }
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const issueTradeInVoucher = (amount: number, deviceDescription: string): PromoCoupon => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const voucherCode = `TRADEIN-${amount}-${randomSuffix}`;
    const voucher: PromoCoupon = {
      id: `voucher-${Date.now()}`,
      code: voucherCode,
      discountType: "fixed",
      discountValue: amount,
      minSpend: Math.max(100, amount + 50),
      usedCount: 0,
      maxUses: 1,
      isActive: true,
      description: `Official Apple Trade-In Credit for ${deviceDescription}`,
      isTradeInVoucher: true,
      tradeInDevice: deviceDescription
    };

    setCoupons(prev => [voucher, ...prev]);
    setAppliedCoupon(voucher);
    return voucher;
  };

  return (
    <DiscountContext.Provider
      value={{
        coupons,
        appliedCoupon,
        applyCoupon,
        removeAppliedCoupon,
        calculateDiscount,
        createCoupon,
        deleteCoupon,
        toggleCouponStatus,
        issueTradeInVoucher
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscounts() {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error("useDiscounts must be used within a DiscountProvider");
  }
  return context;
}
