"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { CosmoLogo } from "../../components/cosmo/CosmoLogo";
import { useAuth, buildTimeline, Order, PickupBranch } from "../../context/AuthContext";
import { useDiscounts } from "../../context/DiscountContext";

type CheckoutStep = "auth" | "address" | "payment" | "confirmed";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider: "google" | "email" | "guest";
}

/* ========================================================================== */
/* BESPOKE LUXURY ATELIER SVG ICONS (REPLACING GENERIC EMOJIS)                */
/* ========================================================================== */

function CreditCardIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  );
}

function CourierVaultIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function InstallmentIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="8" y1="16" x2="16" y2="8" strokeLinecap="round" />
      <circle cx="9.5" cy="9.5" r="1.5" fill="currentColor" />
      <circle cx="14.5" cy="14.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CheckmarkIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShieldShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function LockIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CelestialSparkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AppleLogoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.92-3.26-7.85-8.08-11.79-14.48-6.86-11.05-11.54-23.01-14.04-35.88-2.5-12.87-2.3-24.11.6-33.72 3.69-12.44 10.37-22.18 20.03-29.21 9.67-7.03 20.47-10.63 32.42-10.82 4.13 0 9.04 1.13 14.75 3.39 5.71 2.26 9.38 3.44 11.02 3.54 1.63-.1 5.37-1.28 11.22-3.54 5.85-2.26 10.7-3.32 14.54-3.18 10.87.5 20.25 4.5 28.14 12 4.13 3.92 7.52 8.7 10.17 14.34-9.35 5.66-14.07 13.59-14.16 23.79-.1 8.87 3.33 16.48 10.28 22.82 4.35 3.92 9.28 6.63 14.79 8.13-2.18 6.31-4.73 12.63-7.65 18.96zm-31.78-109.12c0 6.54-2.38 12.69-7.14 18.45-4.76 5.76-10.67 9.35-17.73 10.77-.2-1.3-.3-2.4-.3-3.3 0-6.9 2.54-13.43 7.62-19.59 5.08-6.16 11.22-9.67 18.42-10.53.13 1.4.19 2.7.19 3.91z" />
    </svg>
  );
}

function VisaBadge() {
  return (
    <span className="font-serif italic font-extrabold tracking-wider text-[11px] px-1.5 py-0.5 rounded bg-[#1A1F71] text-white leading-none shadow-xs">
      VISA
    </span>
  );
}

function MastercardBadge() {
  return (
    <span className="flex items-center -space-x-1 px-1">
      <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-95" />
      <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-95" />
    </span>
  );
}

function AmexBadge() {
  return (
    <span className="text-[10px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded bg-[#006FCF] text-white leading-none shadow-xs">
      AMEX
    </span>
  );
}

/* ========================================================================== */
/* MAIN CHECKOUT PAGE COMPONENT                                               */
/* ========================================================================== */

export const PICKUP_BRANCHES: PickupBranch[] = [
  {
    id: "branch-downtown",
    name: "COSMO Flagship Boutique – Downtown",
    city: "Cairo",
    address: "15 El-Bostan St, Bab El Louk, Downtown Cairo",
    hours: "Mon – Sun: 10:00 AM – 11:00 PM",
    phone: "+20 100 882 1100"
  },
  {
    id: "branch-mall-arabia",
    name: "COSMO Mall of Arabia Branch",
    city: "Giza",
    address: "Gate 4, Ground Floor (Near Cinema Complex), 6th of October",
    hours: "Mon – Sun: 10:00 AM – 12:00 AM",
    phone: "+20 100 882 1101"
  },
  {
    id: "branch-citystars",
    name: "COSMO Citystars Heliopolis",
    city: "Cairo",
    address: "Phase 2, Level 3 (Apple Gallery Wing), Heliopolis",
    hours: "Mon – Sun: 10:00 AM – 11:00 PM",
    phone: "+20 100 882 1102"
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalAmount, totalCount, clearCart } = useCart();
  const { user: authUser, addresses, savedCards, addOrder, openGoogleSignIn, logout } = useAuth();
  const { appliedCoupon, applyCoupon, removeAppliedCoupon, calculateDiscount } = useDiscounts();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("auth");
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [user, setUser] = useState<UserProfile | null>(authUser);

  // Fulfillment Mode: Courier Home Delivery vs Store Pickup
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">("delivery");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("branch-downtown");

  // Promo Code / Voucher input state
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Form states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  const [shippingDetails, setShippingDetails] = useState({
    fullName: defaultAddress?.fullName || authUser?.name || "",
    phone: defaultAddress?.phone || authUser?.phone || "",
    country: defaultAddress?.country || "United States",
    city: defaultAddress?.city || "",
    streetAddress: defaultAddress?.streetAddress || "",
    buildingNumber: defaultAddress?.buildingNumber || "",
    postalCode: defaultAddress?.postalCode || "",
    courierNotes: defaultAddress?.courierNotes || "",
    shippingMethod: "complimentary" // 'complimentary' | 'express'
  });

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput, totalAmount);
    setCouponMessage({ text: res.message, success: res.success });
    if (res.success) {
      setCouponInput("");
    }
    setTimeout(() => {
      setCouponMessage(null);
    }, 4500);
  };

  const defaultCard = savedCards.find(c => c.isDefault) || savedCards[0];

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "installments">("card");
  const [cardDetails, setCardDetails] = useState({
    cardholder: defaultCard?.cardholder || authUser?.name || "",
    cardNumber: defaultCard?.cardNumber || "",
    expiry: defaultCard?.expiry || "",
    cvv: defaultCard?.cvv || ""
  });

  // Card validation error states
  const [cardErrors, setCardErrors] = useState<{
    cardholder?: string;
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
    general?: string;
  }>({});

  const [installmentMonths, setInstallmentMonths] = useState<number>(12);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>("");
  const [isProcessingApplePay, setIsProcessingApplePay] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Sync authUser on mount and change
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      if (defaultAddress) {
        setShippingDetails(prev => ({
          ...prev,
          fullName: defaultAddress.fullName,
          phone: defaultAddress.phone,
          country: defaultAddress.country,
          city: defaultAddress.city,
          streetAddress: defaultAddress.streetAddress,
          buildingNumber: defaultAddress.buildingNumber,
          postalCode: defaultAddress.postalCode,
          courierNotes: defaultAddress.courierNotes
        }));
      } else {
        setShippingDetails(prev => ({
          ...prev,
          fullName: prev.fullName || authUser.name,
          phone: prev.phone || authUser.phone || ""
        }));
      }
      if (defaultCard) {
        setCardDetails({
          cardholder: defaultCard.cardholder,
          cardNumber: defaultCard.cardNumber,
          expiry: defaultCard.expiry,
          cvv: defaultCard.cvv
        });
      }
      // If user was on auth step and signs in, move to address step
      if (currentStep === "auth") {
        setCurrentStep("address");
      }
    } else {
      setUser(null);
    }
  }, [authUser]);

  // Detect card network from digits
  const cleanCardDigits = cardDetails.cardNumber.replace(/\s+/g, "");
  let detectedBrand: "visa" | "mastercard" | "amex" | "generic" = "generic";
  if (cleanCardDigits.startsWith("4")) detectedBrand = "visa";
  else if (/^(5[1-5]|2[2-7])/.test(cleanCardDigits)) detectedBrand = "mastercard";
  else if (/^(34|37)/.test(cleanCardDigits)) detectedBrand = "amex";

  // Card Input Formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardDetails(prev => ({ ...prev, cardNumber: formatted }));
    if (cardErrors.cardNumber || cardErrors.general) {
      setCardErrors(prev => ({ ...prev, cardNumber: undefined, general: undefined }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)} / ${raw.slice(2)}`;
    }
    setCardDetails(prev => ({ ...prev, expiry: raw }));
    if (cardErrors.expiry || cardErrors.general) {
      setCardErrors(prev => ({ ...prev, expiry: undefined, general: undefined }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardDetails(prev => ({ ...prev, cvv: raw }));
    if (cardErrors.cvv || cardErrors.general) {
      setCardErrors(prev => ({ ...prev, cvv: undefined, general: undefined }));
    }
  };

  const handleCardholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails(prev => ({ ...prev, cardholder: e.target.value }));
    if (cardErrors.cardholder || cardErrors.general) {
      setCardErrors(prev => ({ ...prev, cardholder: undefined, general: undefined }));
    }
  };

  // Card Validation Logic
  const validateCard = (): boolean => {
    const errors: typeof cardErrors = {};
    const cleanNumber = cardDetails.cardNumber.replace(/\s+/g, "");

    if (!cardDetails.cardholder.trim()) {
      errors.cardholder = "Cardholder full name is required";
    }

    if (!cleanNumber) {
      errors.cardNumber = "Card number is required";
    } else if (cleanNumber.length !== 16 && !cleanNumber.includes("•")) {
      errors.cardNumber = "Please enter all 16 digits of your card";
    }

    if (!cardDetails.expiry.trim()) {
      errors.expiry = "Expiry date required";
    }

    if (!cardDetails.cvv.trim()) {
      errors.cvv = "Security CVV is required";
    } else if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
      errors.cvv = "3 or 4 digits required";
    }

    if (Object.keys(errors).length > 0) {
      errors.general = "Please enter complete, valid card details above to place your order, or select Apple Pay or Pay on Delivery.";
      setCardErrors(errors);
      return false;
    }

    setCardErrors({});
    return true;
  };

  // Handle Google OAuth
  const handleGoogleAuth = () => {
    openGoogleSignIn();
  };

  // Handle Standard Email Auth
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    const cleanEmail = authEmail.trim();
    const cleanName = authName.trim() || cleanEmail.split("@")[0];
    const standardUser: UserProfile = {
      name: cleanName,
      email: cleanEmail,
      phone: "",
      provider: "email"
    };
    setUser(standardUser);
    setShippingDetails(prev => ({
      ...prev,
      fullName: standardUser.name
    }));
    setCurrentStep("address");
  };

  // Handle Guest Checkout
  const handleGuestCheckout = () => {
    setUser({
      name: "Guest Client",
      email: authEmail.trim() || "guest@cosmo-store.com",
      phone: "",
      provider: "guest"
    });
    setCurrentStep("address");
  };

  // Handle Address / Pickup Submit
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fulfillmentType === "delivery") {
      if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.streetAddress) {
        alert("Please fill in the required shipping address fields.");
        return;
      }
    } else {
      if (!shippingDetails.fullName || !shippingDetails.phone) {
        alert("Please provide your contact name and phone number for store pickup verification.");
        return;
      }
    }
    setCurrentStep("payment");
  };

  // Handle Apple Pay Authorization
  const handleApplePayAuth = () => {
    setIsProcessingApplePay(true);
    setTimeout(() => {
      setIsProcessingApplePay(false);
      handleCompleteOrder("apple_pay");
    }, 1200);
  };

  const discountAmount = calculateDiscount(totalAmount);
  const shippingCost = fulfillmentType === "pickup" ? 0 : (shippingDetails.shippingMethod === "express" ? 25 : 0);
  const grandTotal = Math.max(0, totalAmount + shippingCost - discountAmount);

  // Complete Acquisition (with strict card verification and Order Saving)
  const handleCompleteOrder = (methodOverride?: "apple_pay" | "card") => {
    // If the payment method is card and not Apple Pay, enforce strict card input validation!
    if (paymentMethod === "card" && methodOverride !== "apple_pay") {
      const isValid = validateCard();
      if (!isValid) {
        return; // Prevents order submission without valid card info!
      }
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `CSM-2026-${randomSuffix}`;
    setConfirmedOrderNumber(orderId);

    const selectedBranch = PICKUP_BRANCHES.find(b => b.id === selectedBranchId);

    // Create and save permanent rich Order in AuthContext
    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "vault_allocated",
      statusLabel: fulfillmentType === "pickup" ? "Order Confirmed (Preparing for Pickup)" : "Order Confirmed",
      items: cartItems.map(ci => ({
        product: ci.product,
        selectedFinish: ci.selectedFinish,
        quantity: ci.quantity,
        appleCarePlan: ci.appleCarePlan,
        engravingText: ci.engravingText
      })),
      shippingAddress: {
        id: `addr-${Date.now()}`,
        fullName: shippingDetails.fullName || user?.name || "Client",
        phone: shippingDetails.phone || user?.phone || "+20 100 123 4567",
        country: shippingDetails.country,
        city: fulfillmentType === "pickup" ? selectedBranch?.city || "Cairo" : shippingDetails.city,
        streetAddress: fulfillmentType === "pickup" ? selectedBranch?.address || "Flagship Boutique" : shippingDetails.streetAddress,
        buildingNumber: fulfillmentType === "pickup" ? "Store Pickup" : shippingDetails.buildingNumber,
        postalCode: shippingDetails.postalCode,
        courierNotes: shippingDetails.courierNotes,
        isDefault: true
      },
      shippingMethod: fulfillmentType === "pickup" ? "pickup" : (shippingDetails.shippingMethod as "complimentary" | "express"),
      pickupBranch: fulfillmentType === "pickup" ? selectedBranch : undefined,
      shippingCost,
      subtotal: totalAmount,
      discountAmount,
      promoCode: appliedCoupon?.code,
      tradeInVoucher: appliedCoupon?.isTradeInVoucher ? appliedCoupon.code : undefined,
      paymentMethod,
      cardBrand: detectedBrand,
      cardLast4: cleanCardDigits.slice(-4) || "8941",
      installmentMonths: paymentMethod === "installments" ? installmentMonths : undefined,
      totalAmount: grandTotal,
      trackingCode: `TRK-2026-${randomSuffix}`,
      estimatedDelivery: fulfillmentType === "pickup" 
        ? "Ready for In-Store Pickup in 2 Hours"
        : (shippingDetails.shippingMethod === "express" ? "Tomorrow by 2:00 PM" : "2–3 Business Days"),
      courier: {
        name: fulfillmentType === "pickup" ? "Store Concierge Desk" : "Karim Hassan",
        vehicle: fulfillmentType === "pickup" ? "Flagship Boutique Counter" : "Delivery Van #12",
        phone: fulfillmentType === "pickup" ? (selectedBranch?.phone || "+20 100 882 1100") : "+20 102 984 5512",
        securityPin: String(Math.floor(1000 + Math.random() * 9000))
      },
      timeline: buildTimeline("vault_allocated", new Date().toISOString())
    };

    // Post to Central Database API so all orders sync to Owner Admin Command Center & send email
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: orderId,
        customerName: newOrder.shippingAddress.fullName,
        customerEmail: user?.email || "client@cosmo-store.com",
        customerPhone: newOrder.shippingAddress.phone,
        fulfillmentType,
        shippingMethod: newOrder.shippingMethod,
        streetAddress: newOrder.shippingAddress.streetAddress,
        buildingNumber: newOrder.shippingAddress.buildingNumber,
        city: newOrder.shippingAddress.city,
        country: newOrder.shippingAddress.country,
        postalCode: newOrder.shippingAddress.postalCode,
        courierNotes: newOrder.shippingAddress.courierNotes,
        pickupBranch: selectedBranch?.name,
        subtotal: totalAmount,
        shippingCost,
        discountAmount,
        promoCode: appliedCoupon?.code,
        tradeInVoucher: appliedCoupon?.isTradeInVoucher ? appliedCoupon.code : undefined,
        totalAmount: grandTotal,
        paymentMethod: methodOverride || paymentMethod,
        paymentStatus: "paid",
        cardBrand: detectedBrand,
        cardLast4: cleanCardDigits.slice(-4) || "8941",
        installmentMonths: paymentMethod === "installments" ? installmentMonths : undefined,
        trackingCode: newOrder.trackingCode,
        securityPin: newOrder.courier.securityPin,
        estimatedDelivery: newOrder.estimatedDelivery,
        items: cartItems.map(ci => ({
          productId: ci.product.id,
          productTitle: ci.product.title,
          productCategory: ci.product.category,
          primaryImage: ci.product.primaryImage,
          selectedFinish: ci.selectedFinish,
          unitPrice: ci.product.basePrice,
          quantity: ci.quantity,
          appleCarePlan: ci.appleCarePlan,
          engravingText: ci.engravingText
        }))
      })
    }).catch(err => console.error("Central API order dispatch error:", err));

    addOrder(newOrder);
    clearCart();
    setCurrentStep("confirmed");
  };

  // Empty cart guard (unless already on confirmation screen)
  if (cartItems.length === 0 && currentStep !== "confirmed") {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col justify-center items-center p-6 text-center font-sans-body">
        <CosmoLogo size="lg" showSubtitle={true} />
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-[#059669] my-6">
          <CelestialSparkIcon className="w-8 h-8" />
        </div>
        <h2 className="font-serif-editorial text-3xl font-medium text-[#161514] mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-neutral-500 font-mono-data uppercase tracking-wider mb-8 max-w-sm">
          Please select items from our Apple collection before proceeding to checkout.
        </p>
        <Link
          href="/"
          className="px-8 py-3.5 rounded-full bg-[#161514] text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <span>Explore Collection</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col font-sans-body">
      {/* Checkout Masthead */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/60 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
            <CosmoLogo size="sm" showSubtitle={true} />
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono-data text-neutral-600 shrink-0">
            <LockIcon className="w-3.5 h-3.5 text-[#059669]" />
            <span className="uppercase tracking-wider text-[11px]">
              256-Bit Secure Checkout
            </span>
          </div>

          <Link
            href="/"
            className="text-xs font-mono-data tracking-wider uppercase text-neutral-600 hover:text-black transition-colors shrink-0 py-1.5 px-3 rounded-full hover:bg-neutral-100 touch-manipulation"
          >
            <span className="hidden sm:inline">← Return to Store</span>
            <span className="sm:hidden">← Store</span>
          </Link>
        </div>
      </header>

      {/* Main Checkout Experience */}
      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-8 md:py-12 flex-1">
        {currentStep === "confirmed" ? (
          /* ==================================================================== */
          /* STEP 4: ORDER CONFIRMED RECEIPT SCREEN                              */
          /* ==================================================================== */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-center space-y-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto shadow-inner">
              <CheckmarkIcon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-bold flex items-center justify-center gap-1.5">
                <CelestialSparkIcon className="w-3 h-3" />
                <span>ORDER CONFIRMED // OFFICIAL RECEIPT</span>
              </span>
              <h1 className="font-serif-editorial text-4xl sm:text-5xl font-medium text-[#161514]">
                Thank You for Your Order!
              </h1>
              <p className="text-sm text-neutral-500 font-normal max-w-md mx-auto leading-relaxed">
                Your order has been registered and is being prepared. We have sent a confirmation email with all details.
              </p>
            </div>

            {/* Official Order Dossier Receipt Card */}
            <div className="bg-[#FAF8F5] rounded-2xl p-6 text-left space-y-4 font-mono-data text-xs border border-neutral-100">
              <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-500 uppercase tracking-wider">Order ID</span>
                <span className="text-[#161514] font-bold text-sm">{confirmedOrderNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-500 uppercase tracking-wider">Customer</span>
                <span className="text-[#161514] font-semibold">{user?.name} ({user?.email})</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-500 uppercase tracking-wider">
                  {fulfillmentType === "pickup" ? "Pickup Location" : "Delivery Address"}
                </span>
                <span className="text-[#161514] font-semibold text-right max-w-xs truncate">
                  {fulfillmentType === "pickup"
                    ? PICKUP_BRANCHES.find(b => b.id === selectedBranchId)?.name || "COSMO Flagship Boutique"
                    : `${shippingDetails.streetAddress}, ${shippingDetails.city}`}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-500 uppercase tracking-wider">Payment Method</span>
                <span className="text-[#161514] font-semibold uppercase">
                  {paymentMethod === "card"
                    ? `Credit Card (${detectedBrand.toUpperCase()} •••• ${cleanCardDigits.slice(-4) || "8941"})`
                    : paymentMethod === "cod"
                    ? "Pay on Delivery (Inspect First)"
                    : `Installments (${installmentMonths} Months)`}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3 text-[#059669]">
                  <span className="uppercase tracking-wider">Voucher Applied</span>
                  <span className="font-bold">{appliedCoupon.code} (-${discountAmount})</span>
                </div>
              )}
              <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                <span className="text-neutral-500 uppercase tracking-wider">Total Paid</span>
                <span className="text-[#161514] font-bold text-sm font-serif-editorial">${grandTotal} USD</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-neutral-500 uppercase tracking-wider">Status / Timeline</span>
                <span className="text-[#059669] font-bold">
                  {fulfillmentType === "pickup" ? "Ready for Pickup in 2 Hours" : "2–3 Business Days (Free Insured Courier)"}
                </span>
              </div>
            </div>

            {/* Primary Action: Track Live Order & Return */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/account?tab=orders"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] group-hover:scale-125 transition-transform" />
                <span>Track Your Order</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono-data uppercase tracking-wider font-semibold transition-colors"
              >
                Return to Home
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-4 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-mono-data uppercase tracking-wider font-semibold transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        ) : (
          /* ==================================================================== */
          /* CHECKOUT INTERFACE: 2-COLUMN LAYOUT (FORM + ORDER SUMMARY)           */
          /* ==================================================================== */
          <div className="space-y-6">
            {/* MOBILE ONLY: Collapsible Order Summary Accordion Bar */}
            <div className="lg:hidden bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                className="w-full px-5 py-3.5 flex items-center justify-between bg-neutral-50/80 hover:bg-neutral-100/60 transition-colors touch-manipulation"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="w-7 h-7 rounded-full bg-[#161514] text-white flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono-data uppercase tracking-wider font-bold text-neutral-900">
                        {mobileSummaryOpen ? "Hide Order Summary" : "Show Order Summary"}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${mobileSummaryOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono-data text-neutral-500">
                      {totalCount} {totalCount === 1 ? "Item" : "Items"} in Bag
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif-editorial text-lg font-bold text-[#161514]">
                    ${grandTotal} USD
                  </span>
                </div>
              </button>

              {/* Expanded Accordion Drawer */}
              {mobileSummaryOpen && (
                <div className="p-4 sm:p-5 border-t border-neutral-100 space-y-4 animate-fade-in bg-white">
                  {/* Items List */}
                  <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
                    {cartItems.map((item, idx) => {
                      const itemUnitTotal = item.product.basePrice + (item.appleCarePlan?.price || 0);
                      return (
                        <div key={idx} className="py-2.5 flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-neutral-50 p-1.5 flex items-center justify-center shrink-0 border border-neutral-100">
                            <img
                              src={item.product.primaryImage}
                              alt={item.product.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif-editorial text-xs font-medium text-[#161514] truncate">
                              {item.product.title}
                            </h4>
                            {item.selectedFinish && (
                              <p className="text-[9px] font-mono-data text-neutral-500 uppercase tracking-wider truncate">
                                {item.selectedFinish}
                              </p>
                            )}
                            {item.appleCarePlan && (
                              <span className="inline-block text-[8px] font-mono-data bg-emerald-50 text-[#059669] px-1 py-0.2 rounded font-bold">
                                + {item.appleCarePlan.name}
                              </span>
                            )}
                            <div className="flex items-center justify-between mt-1 text-[11px] font-mono-data">
                              <span className="text-neutral-400">Qty: {item.quantity}</span>
                              <span className="font-semibold text-neutral-900">${itemUnitTotal * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promo / Voucher Input in Mobile Drawer */}
                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    {appliedCoupon ? (
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#059669] shrink-0" />
                          <div>
                            <div className="font-mono-data text-[11px] font-bold text-emerald-800 tracking-wider">
                              {appliedCoupon.code}
                            </div>
                            <div className="text-[9px] text-emerald-700">
                              {appliedCoupon.isTradeInVoucher ? 'Official Trade-In Credit' : appliedCoupon.description}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeAppliedCoupon}
                          className="text-[9px] font-mono-data text-neutral-400 hover:text-red-600 uppercase font-bold px-2 py-1 shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Coupon / Trade-In Code"
                          className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono-data uppercase bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-mono-data uppercase tracking-wider font-semibold shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {couponMessage && (
                      <p className={`text-[9px] font-mono-data ${couponMessage.success ? 'text-[#059669]' : 'text-rose-600'}`}>
                        {couponMessage.text}
                      </p>
                    )}
                  </div>

                  {/* Totals Breakdown */}
                  <div className="border-t border-neutral-100 pt-2 space-y-1 text-xs font-mono-data">
                    <div className="flex justify-between text-neutral-600 text-[11px]">
                      <span>Subtotal</span>
                      <span>${totalAmount} USD</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#059669] font-bold text-[11px]">
                        <span>Discount</span>
                        <span>-${discountAmount} USD</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-600 text-[11px]">
                      <span>Fulfillment</span>
                      <span className={shippingCost === 0 ? "text-[#059669] font-bold" : ""}>
                        {fulfillmentType === "pickup" ? "STORE PICKUP (FREE)" : (shippingCost === 0 ? "FREE" : `$${shippingCost} USD`)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100 font-bold text-neutral-900">
                      <span className="uppercase text-[11px]">Total</span>
                      <span className="font-serif-editorial text-xl">${grandTotal} USD</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN: Steps Progression (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Stepper Tabs Navigation */}
              <div className="flex items-center gap-2 text-xs font-mono-data tracking-wider uppercase border-b border-neutral-200/60 pb-4 overflow-x-auto no-scrollbar shrink-0">
                <button
                  onClick={() => setCurrentStep("auth")}
                  className={`flex items-center gap-2 py-1 px-3 rounded-full transition-colors ${
                    currentStep === "auth"
                      ? "bg-[#161514] text-white font-bold"
                      : user
                      ? "text-[#059669] font-semibold"
                      : "text-neutral-400"
                  }`}
                >
                  <span>1. Account</span>
                  {user && <CheckmarkIcon className="w-3 h-3 text-[#059669]" />}
                </button>
                <span className="text-neutral-300">/</span>
                <button
                  onClick={() => user && setCurrentStep("address")}
                  disabled={!user}
                  className={`flex items-center gap-2 py-1 px-3 rounded-full transition-colors ${
                    currentStep === "address"
                      ? "bg-[#161514] text-white font-bold"
                      : currentStep === "payment"
                      ? "text-[#059669] font-semibold"
                      : "text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  <span>2. Delivery Address</span>
                  {currentStep === "payment" && <CheckmarkIcon className="w-3 h-3 text-[#059669]" />}
                </button>
                <span className="text-neutral-300">/</span>
                <button
                  disabled={!user || !shippingDetails.streetAddress}
                  className={`flex items-center gap-2 py-1 px-3 rounded-full transition-colors ${
                    currentStep === "payment"
                      ? "bg-[#161514] text-white font-bold"
                      : "text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  <span>3. Payment Method</span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* STEP 1: CLIENT AUTHENTICATION (GOOGLE / EMAIL / GUEST)        */}
              {/* ------------------------------------------------------------- */}
              {currentStep === "auth" && (
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
                  <div>
                    <div className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-semibold mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                      <span>STEP 1 // ACCOUNT</span>
                    </div>
                    <h2 className="font-serif-editorial text-3xl font-medium text-[#161514]">
                      Sign In or Create Account
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Sign in or continue with Google to track orders, save delivery addresses, and checkout faster.
                    </p>
                  </div>

                  {/* If user is already authenticated */}
                  {user ? (
                    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#161514] text-white flex items-center justify-center font-bold text-xs">
                          {user.avatar || user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#161514] flex items-center gap-2">
                            <span>Signed in as {user.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                          </div>
                          <div className="text-xs text-neutral-500 font-mono-data">
                            {user.email} {user.provider === "google" && "• Google Connected"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setCurrentStep("address")}
                          className="flex-1 py-3 rounded-full bg-[#161514] hover:bg-neutral-800 text-white text-xs font-mono-data uppercase tracking-wider font-semibold transition-all shadow-xs"
                        >
                          Continue to Delivery Address ➔
                        </button>
                        <button
                          type="button"
                          onClick={handleGuestCheckout}
                          className="px-4 py-3 rounded-full border border-neutral-200 text-neutral-600 hover:text-black text-xs font-mono-data uppercase tracking-wider transition-all"
                        >
                          Guest Checkout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Google OAuth Button */}
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={handleGoogleAuth}
                          className="w-full py-3.5 px-4 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 text-xs font-medium text-[#161514] shadow-xs group"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>Continue with Google</span>
                        </button>

                        <div className="relative flex items-center justify-center py-2">
                          <div className="border-t border-neutral-200 w-full" />
                          <span className="bg-white px-3 text-[10px] font-mono-data uppercase tracking-widest text-neutral-400 absolute">
                            OR WITH EMAIL
                          </span>
                        </div>
                      </div>

                      {/* Auth Mode Toggle Tabs (Sign Up vs. Log In) */}
                      <div className="flex border-b border-neutral-100">
                        <button
                          type="button"
                          onClick={() => setAuthMode("signup")}
                          className={`flex-1 py-2.5 text-xs font-mono-data uppercase tracking-wider font-semibold transition-colors border-b-2 ${
                            authMode === "signup"
                              ? "border-black text-black"
                              : "border-transparent text-neutral-400 hover:text-neutral-600"
                          }`}
                        >
                          Create Account
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthMode("login")}
                          className={`flex-1 py-2.5 text-xs font-mono-data uppercase tracking-wider font-semibold transition-colors border-b-2 ${
                            authMode === "login"
                              ? "border-black text-black"
                              : "border-transparent text-neutral-400 hover:text-neutral-600"
                          }`}
                        >
                          Already Have Account
                        </button>
                      </div>

                      {/* Email & Password Form */}
                      <form onSubmit={handleEmailAuth} className="space-y-4">
                        {authMode === "signup" && (
                          <div>
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                              Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={authName}
                              onChange={(e) => setAuthName(e.target.value)}
                              placeholder="e.g. John Doe"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                            Password
                          </label>
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          <span>{authMode === "signup" ? "Register & Continue to Address" : "Log In & Continue"}</span>
                          <span>→</span>
                        </button>
                      </form>

                      {/* Private Guest Option */}
                      <div className="pt-2 border-t border-neutral-100 text-center">
                        <button
                          type="button"
                          onClick={handleGuestCheckout}
                          className="text-xs text-neutral-500 hover:text-black font-mono-data uppercase tracking-wider underline transition-colors"
                        >
                          Proceed as Guest without Account
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP 2: SHIPPING ADDRESS DETAILS                             */}
              {/* ------------------------------------------------------------- */}
              {currentStep === "address" && (
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
                  {/* Verified User Badge */}
                  {user && (
                    <div className="flex items-center justify-between bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <CheckmarkIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#161514]">
                            Signed in as: {user.name}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono-data">
                            {user.email} {user.provider === "google" && "• Google Connected"}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentStep("auth")}
                        className="text-[11px] font-mono-data uppercase tracking-wider text-neutral-400 hover:text-black underline"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* Choose from Saved Addresses Pills */}
                  {addresses.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500">
                        Saved Addresses
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              setShippingDetails(prev => ({
                                ...prev,
                                fullName: addr.fullName,
                                phone: addr.phone,
                                country: addr.country,
                                city: addr.city,
                                streetAddress: addr.streetAddress,
                                buildingNumber: addr.buildingNumber,
                                postalCode: addr.postalCode,
                                courierNotes: addr.courierNotes
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-mono-data border transition-colors flex items-center gap-1.5 ${
                              shippingDetails.streetAddress === addr.streetAddress
                                ? "border-black bg-[#161514] text-white"
                                : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800"
                            }`}
                          >
                            <span>{addr.city} ({addr.streetAddress.slice(0, 16)}...)</span>
                            {addr.isDefault && <span className="text-[9px] text-[#059669] font-bold">★</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-semibold mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                      <span>STEP 2 // DELIVERY & PICKUP</span>
                    </div>
                    <h2 className="font-serif-editorial text-3xl font-medium text-[#161514]">
                      Fulfillment Method
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Choose between complimentary courier delivery directly to your address or in-store pickup at our flagship boutiques.
                    </p>
                  </div>

                  {/* Fulfillment Mode Toggle: Courier vs Store Pickup */}
                  <div className="grid grid-cols-2 gap-2.5 p-1 bg-neutral-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType("delivery")}
                      className={`py-3 px-4 rounded-xl text-xs font-mono-data uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 ${
                        fulfillmentType === "delivery"
                          ? "bg-white text-black shadow-sm ring-1 ring-neutral-200"
                          : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      <CourierVaultIcon className="w-4 h-4" />
                      <span>Courier Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType("pickup")}
                      className={`py-3 px-4 rounded-xl text-xs font-mono-data uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 ${
                        fulfillmentType === "pickup"
                          ? "bg-white text-black shadow-sm ring-1 ring-neutral-200"
                          : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <span>Click & Collect</span>
                    </button>
                  </div>

                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    
                    {/* OPTION A: STORE PICKUP / CLICK & COLLECT BRANCH SELECTOR */}
                    {fulfillmentType === "pickup" ? (
                      <div className="space-y-4">
                        <label className="block text-xs font-mono-data uppercase tracking-wider text-neutral-500 font-bold">
                          Select Boutique Pickup Location
                        </label>

                        <div className="space-y-3">
                          {PICKUP_BRANCHES.map((branch) => {
                            const isSelected = selectedBranchId === branch.id;
                            return (
                              <div
                                key={branch.id}
                                onClick={() => setSelectedBranchId(branch.id)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                                  isSelected
                                    ? "border-neutral-900 bg-[#FAF8F5]/80 ring-1 ring-neutral-900 shadow-2xs"
                                    : "border-neutral-200 bg-white hover:border-neutral-300"
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name="pickupBranch"
                                      checked={isSelected}
                                      onChange={() => setSelectedBranchId(branch.id)}
                                      className="text-black focus:ring-black cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-[#161514]">{branch.name}</span>
                                    <span className="text-[9px] font-mono-data bg-emerald-50 text-[#059669] font-bold px-1.5 py-0.2 rounded border border-emerald-100">
                                      Ready in 2 Hours
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-neutral-600 pl-5 font-sans-body">
                                    {branch.address}
                                  </p>
                                  <div className="flex items-center gap-3 pl-5 text-[10px] font-mono-data text-neutral-400 pt-0.5">
                                    <span>Hours: {branch.hours}</span>
                                    <span>•</span>
                                    <span>Tel: {branch.phone}</span>
                                  </div>
                                </div>
                                <span className="text-xs font-mono-data font-bold text-[#059669] shrink-0">
                                  FREE
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Pickup Contact Information */}
                        <div className="pt-2 space-y-3 border-t border-neutral-100">
                          <label className="block text-xs font-mono-data uppercase tracking-wider text-neutral-500 font-bold">
                            Pickup Contact (Authorized Person)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                                Full Legal Name (as on National ID / Passport) *
                              </label>
                              <input
                                type="text"
                                required
                                value={shippingDetails.fullName}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                                placeholder="Full legal name"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                                Mobile Number (for Pickup SMS PIN) *
                              </label>
                              <input
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                required
                                value={shippingDetails.phone}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                                placeholder="e.g. +1 555 123 4567"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* OPTION B: COURIER HOME DELIVERY FORM */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                              Recipient Full Name *
                            </label>
                            <input
                              type="text"
                              autoComplete="name"
                              required
                              value={shippingDetails.fullName}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                              placeholder="Full recipient name"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                              Mobile Contact *
                            </label>
                            <input
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel"
                              required
                              value={shippingDetails.phone}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                              placeholder="e.g. +1 555 123 4567"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                              Country / Territory *
                            </label>
                            <select
                              value={shippingDetails.country}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                            >
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="United Arab Emirates">United Arab Emirates</option>
                              <option value="Saudi Arabia">Saudi Arabia</option>
                              <option value="Egypt">Egypt</option>
                              <option value="Germany">Germany</option>
                              <option value="France">France</option>
                              <option value="Canada">Canada</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                              City / Region *
                            </label>
                            <input
                              type="text"
                              required
                              value={shippingDetails.city}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                              placeholder="e.g. New York, London, Dubai"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                            Street Address & District *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingDetails.streetAddress}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, streetAddress: e.target.value })}
                            placeholder="Street name, district, or avenue"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                              Building, Floor & Apartment
                            </label>
                            <input
                              type="text"
                              value={shippingDetails.buildingNumber}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, buildingNumber: e.target.value })}
                              placeholder="Apt 4B / Suite 200"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                              Postal / ZIP Code
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              value={shippingDetails.postalCode}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                              placeholder="e.g. 10001"
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                            Courier Delivery Notes (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={shippingDetails.courierNotes}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, courierNotes: e.target.value })}
                            placeholder="e.g. Ring doorbell, call upon arrival, or leave with security desk."
                            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50 resize-none"
                          />
                        </div>

                        {/* Dispatch Options */}
                        <div className="pt-2 space-y-2">
                          <span className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-2">
                            Select Delivery Option
                          </span>

                          <label
                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                              shippingDetails.shippingMethod === "complimentary"
                                ? "border-black bg-neutral-50/80 ring-1 ring-black"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                checked={shippingDetails.shippingMethod === "complimentary"}
                                onChange={() => setShippingDetails({ ...shippingDetails, shippingMethod: "complimentary" })}
                                className="text-black focus:ring-black"
                              />
                              <div>
                                <div className="text-xs font-bold text-[#161514]">
                                  Standard Insured Delivery
                                </div>
                                <div className="text-[11px] text-neutral-500 font-sans-body">
                                  Safe courier delivery (2–3 business days)
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-mono-data font-bold text-[#059669]">
                              FREE
                            </span>
                          </label>

                          <label
                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                              shippingDetails.shippingMethod === "express"
                                ? "border-black bg-neutral-50/80 ring-1 ring-black"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                checked={shippingDetails.shippingMethod === "express"}
                                onChange={() => setShippingDetails({ ...shippingDetails, shippingMethod: "express" })}
                                className="text-black focus:ring-black"
                              />
                              <div>
                                <div className="text-xs font-bold text-[#161514]">
                                  Express Courier Delivery
                                </div>
                                <div className="text-[11px] text-neutral-500 font-sans-body">
                                  Next business day delivery with dedicated courier
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-mono-data font-bold text-[#161514]">
                              +$25 USD
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold transition-all shadow-sm mt-4 flex items-center justify-center gap-2"
                    >
                      <span>Continue to Payment Method</span>
                      <span>→</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP 3: PAYMENT PROTOCOL (STRICT VALIDATION & LUXURY GRAPHICS) */}
              {/* ------------------------------------------------------------- */}
              {currentStep === "payment" && (
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
                  <div>
                    <div className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-semibold mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                      <span>STEP 3 // PAYMENT METHOD</span>
                    </div>
                    <h2 className="font-serif-editorial text-3xl font-medium text-[#161514]">
                      Choose Payment Method
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      All transactions are safe, encrypted, and processed securely.
                    </p>
                  </div>

                  {/* Saved Cards Selector */}
                  {savedCards.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500">
                        Saved Cards
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {savedCards.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setPaymentMethod("card");
                              setCardDetails({
                                cardholder: c.cardholder,
                                cardNumber: c.cardNumber,
                                expiry: c.expiry,
                                cvv: c.cvv
                              });
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-mono-data border transition-colors flex items-center gap-2 ${
                              cardDetails.cardNumber === c.cardNumber
                                ? "border-black bg-[#161514] text-white"
                                : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800"
                            }`}
                          >
                            <span className="capitalize">{c.brand}</span>
                            <span>{c.cardNumber}</span>
                            {c.isDefault && <span className="text-[9px] text-[#059669] font-bold">★</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selector Pills (Using Custom SVG Icons instead of emojis) */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("card");
                        setCardErrors({});
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        paymentMethod === "card"
                          ? "border-black bg-neutral-900 text-white shadow-sm"
                          : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      <CreditCardIcon className="w-5 h-5 mx-auto mb-1.5" />
                      <span className="text-xs font-semibold block">Card / Pay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("cod");
                        setCardErrors({});
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        paymentMethod === "cod"
                          ? "border-black bg-neutral-900 text-white shadow-sm"
                          : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      <CourierVaultIcon className="w-5 h-5 mx-auto mb-1.5" />
                      <span className="text-xs font-semibold block">Pay on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("installments");
                        setCardErrors({});
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        paymentMethod === "installments"
                          ? "border-black bg-neutral-900 text-white shadow-sm"
                          : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      <InstallmentIcon className="w-5 h-5 mx-auto mb-1.5" />
                      <span className="text-xs font-semibold block">0% Installments</span>
                    </button>
                  </div>

                  {/* SUB-SECTION: Credit Card / Apple Pay Form */}
                  {paymentMethod === "card" && (
                    <div className="space-y-5 pt-2">
                      {/* Apple Pay Button */}
                      <div>
                        <button
                          type="button"
                          onClick={handleApplePayAuth}
                          disabled={isProcessingApplePay}
                          className="w-full py-4 rounded-2xl bg-black text-white hover:bg-neutral-900 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm relative overflow-hidden"
                        >
                          {isProcessingApplePay ? (
                            <span className="flex items-center gap-2 font-mono-data text-[11px] uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              Verifying Biometric Authentication...
                            </span>
                          ) : (
                            <>
                              <span>Buy with</span>
                              <AppleLogoIcon className="w-3.5 h-3.5" />
                              <span className="font-semibold text-sm">Pay</span>
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-neutral-400 font-mono-data text-center mt-1.5 uppercase tracking-wider">
                          1-touch biometric checkout • No card entry required
                        </p>
                      </div>

                      <div className="relative flex items-center justify-center py-1">
                        <div className="border-t border-neutral-200 w-full" />
                        <span className="bg-white px-3 text-[10px] font-mono-data uppercase tracking-widest text-neutral-400 absolute">
                          OR ENTER CARD DETAILS
                        </span>
                      </div>

                      {/* Interactive Obsidian Metallic Card Graphic Preview */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-[#161514] via-[#262422] to-[#161514] text-white p-6 shadow-xl border border-white/10 aspect-[1.586/1] max-w-sm mx-auto flex flex-col justify-between">
                        {/* Metallic shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none" />
                        
                        {/* Card Top: Chip & Network */}
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-2.5">
                            {/* Metallic EMV Chip */}
                            <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 flex items-center justify-center shadow-inner border border-amber-300/40">
                              <div className="w-full h-full border border-amber-900/30 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                                <div className="border-r border-b border-amber-900/30" />
                                <div className="border-b border-amber-900/30" />
                                <div className="border-r border-amber-900/30" />
                                <div />
                              </div>
                            </div>
                            {/* Contactless Wave */}
                            <svg className="w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
                              <path d="M12 19a8.5 8.5 0 0 1 0-12" strokeLinecap="round" />
                              <path d="M15.5 21.5a12 12 0 0 1 0-17" strokeLinecap="round" />
                            </svg>
                          </div>

                          {/* Dynamic Card Brand Badge */}
                          <div className="flex items-center">
                            {detectedBrand === "visa" && <VisaBadge />}
                            {detectedBrand === "mastercard" && <MastercardBadge />}
                            {detectedBrand === "amex" && <AmexBadge />}
                            {detectedBrand === "generic" && (
                              <span className="text-[10px] font-mono-data uppercase tracking-widest text-neutral-400">
                                COSMO CARD
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Number */}
                        <div className="z-10 py-1">
                          <div className="font-mono-data tracking-[0.22em] text-base sm:text-lg font-medium text-white/90 drop-shadow-sm">
                            {cardDetails.cardNumber || "•••• •••• •••• ••••"}
                          </div>
                        </div>

                        {/* Card Bottom: Holder & Expiry */}
                        <div className="flex items-end justify-between text-xs z-10 pt-1">
                          <div>
                            <div className="text-[8px] font-mono-data uppercase tracking-widest text-neutral-400 mb-0.5">
                              CARDHOLDER
                            </div>
                            <div className="font-sans-body font-medium uppercase tracking-wider text-xs truncate max-w-[180px] text-white/90">
                              {cardDetails.cardholder || (user?.name ? user.name.toUpperCase() : "CLIENT NAME")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[8px] font-mono-data uppercase tracking-widest text-neutral-400 mb-0.5">
                              EXPIRES
                            </div>
                            <div className="font-mono-data font-medium tracking-wider text-xs text-white/90">
                              {cardDetails.expiry || "MM / YY"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Inputs with Strict Validation & Visual Error Highlights */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500">
                              Cardholder Full Name *
                            </label>
                            {cardErrors.cardholder && (
                              <span className="text-[10px] font-mono-data text-rose-600 font-semibold">
                                {cardErrors.cardholder}
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={cardDetails.cardholder}
                            onChange={handleCardholderChange}
                            placeholder="Name as printed on card"
                            className={`w-full px-4 py-3 rounded-xl border text-xs bg-neutral-50/50 transition-colors focus:outline-none ${
                              cardErrors.cardholder
                                ? "border-rose-400 bg-rose-50/20 focus:border-rose-600 ring-1 ring-rose-300"
                                : "border-neutral-200 focus:border-black"
                            }`}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500">
                              16-Digit Card Number *
                            </label>
                            {cardErrors.cardNumber && (
                              <span className="text-[10px] font-mono-data text-rose-600 font-semibold">
                                {cardErrors.cardNumber}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              maxLength={19}
                              value={cardDetails.cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="•••• •••• •••• ••••"
                              className={`w-full px-4 py-3 pr-20 rounded-xl border text-xs bg-neutral-50/50 font-mono-data transition-colors focus:outline-none ${
                                cardErrors.cardNumber
                                  ? "border-rose-400 bg-rose-50/20 focus:border-rose-600 ring-1 ring-rose-300"
                                  : "border-neutral-200 focus:border-black"
                              }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                              {detectedBrand === "visa" && <VisaBadge />}
                              {detectedBrand === "mastercard" && <MastercardBadge />}
                              {detectedBrand === "amex" && <AmexBadge />}
                              {detectedBrand === "generic" && (
                                <CreditCardIcon className="w-4 h-4 text-neutral-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500">
                                Expiry Date *
                              </label>
                              {cardErrors.expiry && (
                                <span className="text-[9px] font-mono-data text-rose-600 font-semibold truncate max-w-[90px]">
                                  Required
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              maxLength={7}
                              value={cardDetails.expiry}
                              onChange={handleExpiryChange}
                              placeholder="MM / YY"
                              className={`w-full px-4 py-3 rounded-xl border text-xs bg-neutral-50/50 font-mono-data transition-colors focus:outline-none ${
                                cardErrors.expiry
                                  ? "border-rose-400 bg-rose-50/20 focus:border-rose-600 ring-1 ring-rose-300"
                                  : "border-neutral-200 focus:border-black"
                              }`}
                            />
                            {cardErrors.expiry && (
                              <span className="text-[9px] font-mono-data text-rose-600 block mt-1">
                                {cardErrors.expiry}
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500">
                                Security CVV *
                              </label>
                              {cardErrors.cvv && (
                                <span className="text-[9px] font-mono-data text-rose-600 font-semibold truncate max-w-[90px]">
                                  Required
                                </span>
                              )}
                            </div>
                            <input
                              type="password"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              maxLength={4}
                              value={cardDetails.cvv}
                              onChange={handleCvvChange}
                              placeholder="•••"
                              className={`w-full px-4 py-3 rounded-xl border text-xs bg-neutral-50/50 font-mono-data transition-colors focus:outline-none ${
                                cardErrors.cvv
                                  ? "border-rose-400 bg-rose-50/20 focus:border-rose-600 ring-1 ring-rose-300"
                                  : "border-neutral-200 focus:border-black"
                              }`}
                            />
                            {cardErrors.cvv && (
                              <span className="text-[9px] font-mono-data text-rose-600 block mt-1">
                                {cardErrors.cvv}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-SECTION: Cash / Card on Delivery */}
                  {paymentMethod === "cod" && (
                    <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-neutral-200/60 space-y-3">
                      <div className="flex items-center gap-2 text-[#059669] font-bold text-xs font-mono-data uppercase tracking-wider">
                        <ShieldShieldIcon className="w-4 h-4 text-[#059669]" />
                        <span>INSPECT BEFORE YOU PAY</span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed font-sans-body">
                        You can check that the factory box is sealed before paying the courier.
                      </p>
                      <p className="text-[11px] text-neutral-500 font-mono-data">
                        Accepted upon delivery: Cash or credit/debit card.
                      </p>
                    </div>
                  )}

                  {/* SUB-SECTION: 0% Installments */}
                  {paymentMethod === "installments" && (
                    <div className="space-y-4 pt-2">
                      <p className="text-xs text-neutral-600 font-sans-body">
                        Pay in monthly installments with 0% interest via partner banks or ValU / Tabby:
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {[6, 12, 24].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setInstallmentMonths(m)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              installmentMonths === m
                                ? "border-black bg-neutral-900 text-white font-bold"
                                : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800"
                            }`}
                          >
                            <span className="block text-xs uppercase">{m} Months</span>
                            <span className="block text-sm font-serif-editorial font-semibold mt-1">
                              ${Math.round(grandTotal / m)}/mo
                            </span>
                            <span className="block text-[9px] text-[#059669] uppercase font-mono-data mt-0.5">
                              0% Interest
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General Validation Error Alert */}
                  {cardErrors.general && paymentMethod === "card" && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-fade-in">
                      <div className="w-4 h-4 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                        !
                      </div>
                      <div className="font-sans-body leading-relaxed">
                        {cardErrors.general}
                      </div>
                    </div>
                  )}

                  {/* Complete Order Button */}
                  <div className="pt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => handleCompleteOrder()}
                      className="w-full py-4 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-3 shadow-sm group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] group-hover:scale-125 transition-transform" />
                      <span>Place Order (${grandTotal} USD)</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </button>
                    <p className="text-[10px] font-mono-data text-neutral-400 text-center uppercase tracking-wider mt-2.5">
                      {paymentMethod === "card"
                        ? "Card details are required to complete payment"
                        : "Secured with 256-bit encryption"}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Sticky Order Summary (5 cols) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
                <div>
                  <div className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-semibold mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    <span>ORDER SUMMARY</span>
                  </div>
                  <h3 className="font-serif-editorial text-2xl font-medium text-[#161514]">
                    Order Summary
                  </h3>
                  <span className="text-xs text-neutral-500 font-mono-data">
                    {totalCount} {totalCount === 1 ? "Item" : "Items"} in Cart
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => {
                    const itemUnitTotal = item.product.basePrice + (item.appleCarePlan?.price || 0);
                    return (
                      <div key={idx} className="py-4 flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-neutral-50 p-2 flex items-center justify-center flex-shrink-0 border border-neutral-100">
                          <img
                            src={item.product.primaryImage}
                            alt={item.product.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif-editorial text-sm font-medium text-[#161514] truncate">
                            {item.product.title}
                          </h4>
                          {item.selectedFinish && (
                            <p className="text-[10px] font-mono-data text-neutral-500 uppercase tracking-wider truncate mt-0.5">
                              {item.selectedFinish}
                            </p>
                          )}

                          {item.appleCarePlan && (
                            <span className="inline-block mt-0.5 text-[9px] font-mono-data bg-emerald-50 text-[#059669] px-1.5 py-0.2 rounded border border-emerald-100 font-bold">
                              + {item.appleCarePlan.name} (${item.appleCarePlan.price})
                            </span>
                          )}

                          {item.engravingText && (
                            <p className="text-[9px] font-mono-data text-neutral-500 mt-0.5 truncate">
                              Laser Engraved: &ldquo;{item.engravingText}&rdquo;
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-1 text-xs">
                            <span className="text-neutral-400 font-mono-data">Qty: {item.quantity}</span>
                            <span className="font-semibold text-neutral-900 font-mono-data">
                              ${itemUnitTotal * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code & Trade-In Voucher Section */}
                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider">
                    <span className="text-neutral-500 font-medium">Coupon or Trade-In</span>
                    <span className="text-neutral-400 text-[10px]">Instant Credit</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-2 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#059669] shrink-0" />
                        <div>
                          <div className="font-mono-data text-xs font-bold text-emerald-800 tracking-wider">
                            {appliedCoupon.code}
                          </div>
                          <div className="text-[10px] text-emerald-700">
                            {appliedCoupon.isTradeInVoucher ? 'Official Trade-In Credit' : appliedCoupon.description}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeAppliedCoupon}
                        className="text-[10px] font-mono-data text-neutral-400 hover:text-red-600 uppercase font-bold px-2 py-1 transition-colors shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="e.g. WELCOME10 or TRADEIN"
                          className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono-data uppercase bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-mono-data uppercase tracking-wider font-semibold transition-colors shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                      {couponMessage && (
                        <p className={`text-[10px] font-mono-data ${couponMessage.success ? 'text-[#059669]' : 'text-rose-600'}`}>
                          {couponMessage.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Financial Breakdown */}
                <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs font-mono-data">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>${totalAmount} USD</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#059669] font-bold">
                      <span>Discount / Trade-In Credit</span>
                      <span>-${discountAmount} USD</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Fulfillment</span>
                    <span className={shippingCost === 0 ? "text-[#059669] font-bold" : ""}>
                      {fulfillmentType === "pickup" 
                        ? "STORE PICKUP (FREE)" 
                        : (shippingCost === 0 ? "FREE INSURED DELIVERY" : `$${shippingCost} USD`)}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Taxes & Fees</span>
                    <span className="text-neutral-400">INCLUDED</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-neutral-100 text-sm font-bold text-[#161514]">
                    <span className="uppercase tracking-wider">Total Amount</span>
                    <span className="font-serif-editorial text-2xl">${grandTotal} USD</span>
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="bg-[#FAF8F5] rounded-2xl p-4 space-y-2 text-[11px] text-neutral-600 border border-neutral-100/60">
                  <div className="flex items-center gap-2 text-[#059669] font-semibold font-mono-data uppercase text-[10px]">
                    <ShieldShieldIcon className="w-3.5 h-3.5 text-[#059669]" />
                    <span>COSMO GUARANTEE</span>
                  </div>
                  <p className="font-sans-body leading-relaxed text-neutral-500">
                    Factory-sealed authentic Apple hardware with 1-Year official manufacturer warranty and free returns within 14 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>

      {/* Checkout Footer Colophon */}
      <footer className="border-t border-neutral-200/60 py-6 text-center text-xs text-neutral-400 font-mono-data text-[10px] uppercase tracking-wider">
        © 2026 COSMO STORE. ALL SHIPMENTS ARE FULLY INSURED.
      </footer>
    </div>
  );
}
