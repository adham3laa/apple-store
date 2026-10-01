"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, SavedAddress, SavedCard, Order, OrderMilestone } from "../../context/AuthContext";
import { CosmoLogo } from "../../components/cosmo/CosmoLogo";

type AccountTab = "orders" | "addresses" | "cards" | "profile";

/* ========================================================================== */
/* BESPOKE LUXURY ICONS                                                       */
/* ========================================================================== */

function BoxIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function PinLocationIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function CardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
      <line x1="6" y1="15" x2="10" y2="15"/>
    </svg>
  );
}

function UserIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
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
/* MAIN ACCOUNT COMPONENT WRAPPER WITH SUSPENSE                              */
/* ========================================================================== */

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-mono-data text-xs uppercase tracking-widest text-neutral-400">Loading Account...</div>}>
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as AccountTab) || "orders";

  const {
    user,
    orders,
    addresses,
    savedCards,
    loginWithGoogle,
    loginWithEmail,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    addCard,
    deleteCard,
    setDefaultCard,
    advanceOrderStatus
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || "");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync tab from URL if changed
  useEffect(() => {
    const tabParam = searchParams.get("tab") as AccountTab;
    if (tabParam && ["orders", "addresses", "cards", "profile"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --------------------------------------------------------------------------
  // PROFILE EDIT STATE
  // --------------------------------------------------------------------------
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    showToast("Profile details updated.");
  };

  // --------------------------------------------------------------------------
  // ADDRESS MODAL / FORM STATE
  // --------------------------------------------------------------------------
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, "id">>({
    fullName: "",
    phone: "",
    country: "Egypt",
    city: "Cairo",
    streetAddress: "",
    buildingNumber: "",
    postalCode: "",
    courierNotes: "",
    isDefault: false
  });

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.name || "",
      phone: user?.phone || "",
      country: "Egypt",
      city: "Cairo",
      streetAddress: "",
      buildingNumber: "",
      postalCode: "",
      courierNotes: "",
      isDefault: addresses.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      country: addr.country,
      city: addr.city,
      streetAddress: addr.streetAddress,
      buildingNumber: addr.buildingNumber,
      postalCode: addr.postalCode,
      courierNotes: addr.courierNotes,
      isDefault: addr.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.streetAddress) {
      alert("Please enter required fields.");
      return;
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
      showToast("Delivery address updated.");
    } else {
      addAddress(addressForm);
      showToast("New delivery address saved.");
    }
    setIsAddressModalOpen(false);
  };

  // --------------------------------------------------------------------------
  // CARD MODAL / FORM STATE
  // --------------------------------------------------------------------------
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    isDefault: false
  });

  const cleanCardDigits = cardForm.cardNumber.replace(/\s+/g, "");
  let detectedCardBrand: "visa" | "mastercard" | "amex" | "generic" = "generic";
  if (cleanCardDigits.startsWith("4")) detectedCardBrand = "visa";
  else if (/^(5[1-5]|2[2-7])/.test(cleanCardDigits)) detectedCardBrand = "mastercard";
  else if (/^(34|37)/.test(cleanCardDigits)) detectedCardBrand = "amex";

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardForm(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)} / ${raw.slice(2)}`;
    }
    setCardForm(prev => ({ ...prev, expiry: raw }));
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.cardholder.trim() || cleanCardDigits.length !== 16 || !cardForm.expiry.trim() || cardForm.cvv.length < 3) {
      alert("Please enter complete, valid card details (16 digits, MM/YY expiry, CVV).");
      return;
    }

    const maskedNumber = `${cleanCardDigits.slice(0, 4)} •••• •••• ${cleanCardDigits.slice(-4)}`;
    addCard({
      cardholder: cardForm.cardholder.toUpperCase(),
      cardNumber: maskedNumber,
      cleanNumber: cleanCardDigits,
      expiry: cardForm.expiry,
      cvv: cardForm.cvv,
      brand: detectedCardBrand,
      isDefault: cardForm.isDefault || savedCards.length === 0
    });

    setIsCardModalOpen(false);
    setCardForm({ cardholder: "", cardNumber: "", expiry: "", cvv: "", isDefault: false });
    showToast("New card saved successfully.");
  };

  // Selected Order for tracking view
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  // If user is not logged in, show elegant login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col font-sans-body">
        <header className="p-6 md:px-12 flex justify-between items-center border-b border-neutral-200/60 bg-white/60">
          <Link href="/">
            <CosmoLogo size="sm" showSubtitle={true} />
          </Link>
          <Link href="/" className="text-xs font-mono-data uppercase tracking-wider text-neutral-500 hover:text-black">
            ← Return to Store
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-[#059669]">
              <UserIcon className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-bold">
                MY ACCOUNT
              </span>
              <h2 className="font-serif-editorial text-3xl font-medium text-[#161514] mt-1">
                Account Sign In
              </h2>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                Sign in to track orders, manage delivery addresses, and view saved payment cards.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full py-3.5 px-4 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 text-xs font-medium text-[#161514] shadow-2xs group"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => loginWithEmail("client@cosmo-atelier.com", "Adham Alaa")}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] transition-all text-xs font-mono-data uppercase tracking-wider font-semibold shadow-xs"
              >
                Sign In with Email
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col font-sans-body">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161514] text-[#FAF8F5] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-mono-data tracking-wider uppercase animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Account Masthead */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <CosmoLogo size="sm" showSubtitle={true} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-mono-data">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span className="font-semibold text-neutral-800">{user.name}</span>
            </div>
            <Link
              href="/"
              className="text-xs font-mono-data tracking-wider uppercase text-neutral-600 hover:text-black transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <section className="bg-white border-b border-neutral-200/60 py-8 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-bold flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              <span>CLIENT ACCOUNT</span>
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-[#161514]">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-neutral-500 font-mono-data mt-1">
              {user.email} • Member since 2026
            </p>
          </div>

          {/* Tab Navigation Controls */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100/80 rounded-2xl text-xs font-mono-data uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "orders"
                  ? "bg-[#161514] text-white font-bold shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <BoxIcon className="w-3.5 h-3.5" />
              <span>Orders & Tracking ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "addresses"
                  ? "bg-[#161514] text-white font-bold shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <PinLocationIcon className="w-3.5 h-3.5" />
              <span>Addresses ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("cards")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "cards"
                  ? "bg-[#161514] text-white font-bold shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <CardIcon className="w-3.5 h-3.5" />
              <span>Saved Cards ({savedCards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === "profile"
                  ? "bg-[#161514] text-white font-bold shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Profile Info</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <main className="max-w-[1440px] mx-auto w-full px-6 md:px-12 py-10 flex-1">
        
        {/* =================================================================== */}
        {/* TAB 1: ORDERS & LIVE TRACKING                                       */}
        {/* =================================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] max-w-md mx-auto space-y-4">
                <BoxIcon className="w-8 h-8 mx-auto text-neutral-400" />
                <h3 className="font-serif-editorial text-2xl">No Orders Yet</h3>
                <p className="text-xs text-neutral-500">
                  You have not placed any orders yet. Explore our Apple collection.
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 rounded-full bg-[#161514] text-white text-xs font-mono-data uppercase tracking-wider"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Orders List (5 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="text-xs font-mono-data uppercase tracking-wider text-neutral-500 font-semibold px-1 flex justify-between items-center">
                    <span>Order History</span>
                    <span>{orders.length} {orders.length === 1 ? "Record" : "Records"}</span>
                  </div>

                  <div className="space-y-3">
                    {orders.map((ord) => {
                      const isSelected = ord.id === selectedOrder?.id;
                      return (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedOrderId(ord.id)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-black bg-white shadow-md ring-1 ring-black"
                              : "border-neutral-200 bg-white/70 hover:bg-white hover:border-neutral-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs font-mono-data font-bold text-[#161514]">
                                {ord.id}
                              </span>
                              <p className="text-[10px] font-mono-data text-neutral-400 mt-0.5">
                                {new Date(ord.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                            <span className={`text-[9px] font-mono-data uppercase px-2 py-0.5 rounded-full font-bold ${
                              ord.status === "delivered"
                                ? "bg-neutral-100 text-neutral-800"
                                : "bg-emerald-50 text-[#059669]"
                            }`}>
                              {ord.status === "delivered" ? "Delivered" : "In Transit"}
                            </span>
                          </div>

                          {/* Thumbnails preview */}
                          <div className="flex items-center gap-2 my-3">
                            {ord.items.map((item, i) => (
                              <div key={i} className="w-12 h-12 rounded-xl bg-neutral-50 p-1 flex items-center justify-center border border-neutral-100">
                                <img
                                  src={item.product.primaryImage}
                                  alt={item.product.title}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-neutral-100 text-xs">
                            <span className="text-neutral-500 font-mono-data text-[11px]">
                              {ord.items.reduce((s, i) => s + i.quantity, 0)} Items
                            </span>
                            <span className="font-serif-editorial text-base font-semibold text-[#161514]">
                              ${ord.totalAmount} USD
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Live Courier Tracking & Order Dossier (8 cols) */}
                {selectedOrder && (
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Active Tracking Status Banner */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-neutral-100 pb-5">
                        <div>
                          <div className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                            <span>ORDER TRACKING STATUS</span>
                          </div>
                          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#161514] mt-1">
                            {selectedOrder.statusLabel}
                          </h2>
                          <p className="text-xs text-neutral-500 font-mono-data mt-1">
                            Tracking Code: <span className="font-bold text-black">{selectedOrder.trackingCode}</span> • Estimated: {selectedOrder.estimatedDelivery}
                          </p>
                        </div>

                        {/* Interactive Milestone Advance Button */}
                        <button
                          type="button"
                          onClick={() => {
                            advanceOrderStatus(selectedOrder.id);
                            showToast("Milestone updated for testing.");
                          }}
                          className="px-4 py-2 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-[10px] font-mono-data uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3 h-3 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                          </svg>
                          <span>Advance Milestone (Test)</span>
                        </button>
                      </div>

                      {/* 5-STAGE PROGRESS STEPPER */}
                      <div className="py-2">
                        <div className="grid grid-cols-5 gap-2 relative">
                          {selectedOrder.timeline.map((stage, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                              {/* Step circle */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono-data font-bold transition-all relative z-10 ${
                                stage.done
                                  ? "bg-[#161514] text-white"
                                  : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                              } ${stage.current ? "ring-4 ring-emerald-100 ring-offset-1" : ""}`}>
                                {stage.done ? (
                                  <CheckmarkIcon className="w-3.5 h-3.5" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>

                              {/* Label */}
                              <span className={`text-[10px] font-mono-data uppercase tracking-wider mt-2 font-semibold ${
                                stage.done ? "text-[#161514]" : "text-neutral-400"
                              }`}>
                                {stage.label.split(" ")[0]}
                              </span>
                              <span className="text-[8px] text-neutral-400 font-mono-data hidden sm:block">
                                {stage.timestamp}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Current Milestone Explanation Box */}
                      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-neutral-200/60 text-xs font-sans-body space-y-2">
                        <div className="flex items-center gap-2 text-[#059669] font-bold font-mono-data text-[10px] uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                          <span>DELIVERY STATUS</span>
                        </div>
                        <p className="text-neutral-700 leading-relaxed text-xs">
                          {selectedOrder.timeline.find(t => t.current)?.description || "Shipped and on its way."}
                        </p>
                      </div>

                      {/* Courier Dossier Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs">
                          <span className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400 block mb-1">
                            Delivery Courier
                          </span>
                          <p className="font-bold text-[#161514] text-sm">{selectedOrder.courier.name}</p>
                          <p className="text-neutral-500 text-[11px] font-mono-data">{selectedOrder.courier.vehicle}</p>
                          <p className="text-neutral-500 text-[11px] font-mono-data mt-1">{selectedOrder.courier.phone}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs">
                          <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#059669] block mb-1 font-bold">
                            Delivery PIN Code
                          </span>
                          <p className="font-mono-data font-bold text-2xl text-[#161514] tracking-widest">
                            {selectedOrder.courier.securityPin}
                          </p>
                          <p className="text-neutral-600 text-[10px] mt-1">
                            Share this 4-digit code with the courier upon receiving your package.
                          </p>
                        </div>
                      </div>

                      {/* Itemized Order Breakdown */}
                      <div className="border-t border-neutral-100 pt-5 space-y-4">
                        <h4 className="text-xs font-mono-data uppercase tracking-wider text-neutral-500 font-semibold">
                          Order Items
                        </h4>

                        <div className="divide-y divide-neutral-100">
                          {selectedOrder.items.map((it, idx) => (
                            <div key={idx} className="py-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl bg-neutral-50 p-1.5 flex items-center justify-center">
                                  <img
                                    src={it.product.primaryImage}
                                    alt={it.product.title}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <div>
                                  <h5 className="font-serif-editorial text-base font-medium text-[#161514]">
                                    {it.product.title}
                                  </h5>
                                  {it.selectedFinish && (
                                    <p className="text-[10px] font-mono-data text-neutral-500 uppercase tracking-wider mt-0.5">
                                      {it.selectedFinish}
                                    </p>
                                  )}
                                  <span className="text-xs text-neutral-400 font-mono-data">Qty: {it.quantity}</span>
                                </div>
                              </div>

                              <div className="font-serif-editorial text-base font-semibold text-[#161514]">
                                ${it.product.basePrice * it.quantity}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                          <button
                            onClick={() => window.print()}
                            className="px-5 py-2.5 rounded-full border border-neutral-200 hover:bg-neutral-50 text-xs font-mono-data uppercase tracking-wider text-neutral-700 transition-colors"
                          >
                            Print Receipt
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: SHIPPING ADDRESSES (EDIT & ADD)                              */}
        {/* =================================================================== */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#161514]">
                  Delivery Addresses
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Manage your delivery addresses for fast and safe courier delivery.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddAddress}
                className="px-5 py-2.5 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-wider font-semibold transition-all shadow-xs flex items-center gap-2"
              >
                <span>+ Add Address</span>
              </button>
            </div>

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border transition-all flex flex-col justify-between ${
                    addr.isDefault ? "border-black ring-1 ring-black" : "border-neutral-200"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#161514] text-sm">
                        {addr.fullName}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-mono-data bg-emerald-50 text-[#059669] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          DEFAULT ADDRESS
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed font-sans-body">
                      {addr.buildingNumber && `${addr.buildingNumber}, `}
                      {addr.streetAddress}
                      <br />
                      {addr.city}, {addr.postalCode && `${addr.postalCode}, `}{addr.country}
                    </p>

                    <p className="text-xs font-mono-data text-neutral-500">
                      Contact: {addr.phone}
                    </p>

                    {addr.courierNotes && (
                      <div className="text-[11px] text-neutral-500 bg-[#FAF8F5] p-3 rounded-xl border border-neutral-100 font-sans-body italic">
                        &ldquo;{addr.courierNotes}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-5 mt-4 border-t border-neutral-100 text-xs font-mono-data uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => openEditAddress(addr)}
                      className="text-neutral-800 hover:text-black font-semibold underline"
                    >
                      Edit Address
                    </button>
                    {!addr.isDefault && (
                      <>
                        <span className="text-neutral-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDefaultAddress(addr.id);
                            showToast("Default address updated.");
                          }}
                          className="text-neutral-500 hover:text-black"
                        >
                          Set Default
                        </button>
                        <span className="text-neutral-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteAddress(addr.id);
                            showToast("Address removed.");
                          }}
                          className="text-neutral-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ADDRESS MODAL (ADD / EDIT) */}
            {isAddressModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                    <h3 className="font-serif-editorial text-2xl font-medium text-[#161514]">
                      {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                          Country *
                        </label>
                        <select
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                        >
                          <option value="Egypt">Egypt</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                        Street Address & District *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.streetAddress}
                        onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                          Building, Floor & Apt
                        </label>
                        <input
                          type="text"
                          value={addressForm.buildingNumber}
                          onChange={(e) => setAddressForm({ ...addressForm, buildingNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={addressForm.courierNotes}
                        onChange={(e) => setAddressForm({ ...addressForm, courierNotes: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isDefaultAddress"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="rounded border-neutral-300"
                      />
                      <label htmlFor="isDefaultAddress" className="text-xs text-neutral-700">
                        Set as primary default delivery address
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(false)}
                        className="px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-mono-data uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-[#161514] text-white text-xs font-mono-data uppercase tracking-wider font-semibold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SAVED PAYMENT CARDS (EDIT & ADD)                             */}
        {/* =================================================================== */}
        {activeTab === "cards" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#161514]">
                  Saved Payment Cards
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Securely stored payment cards for fast and safe checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCardModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-wider font-semibold transition-all shadow-xs flex items-center gap-2"
              >
                <span>+ Add Card</span>
              </button>
            </div>

            {/* Saved Cards Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCards.map((c) => (
                <div key={c.id} className="space-y-3">
                  {/* Interactive Obsidian Metallic Card Preview */}
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-tr from-[#161514] via-[#262422] to-[#161514] text-white p-6 shadow-lg border aspect-[1.586/1] flex flex-col justify-between ${
                    c.isDefault ? "border-amber-400/50 ring-1 ring-amber-400/30" : "border-white/10"
                  }`}>
                    {/* Metallic shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none" />

                    {/* Top Row: Chip & Brand */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 flex items-center justify-center shadow-inner border border-amber-300/40">
                          <div className="w-full h-full border border-amber-900/30 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                            <div className="border-r border-b border-amber-900/30" />
                            <div className="border-b border-amber-900/30" />
                            <div className="border-r border-amber-900/30" />
                            <div />
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
                          <path d="M12 19a8.5 8.5 0 0 1 0-12" strokeLinecap="round" />
                          <path d="M15.5 21.5a12 12 0 0 1 0-17" strokeLinecap="round" />
                        </svg>
                      </div>

                      <div className="flex items-center">
                        {c.brand === "visa" && <VisaBadge />}
                        {c.brand === "mastercard" && <MastercardBadge />}
                        {c.brand === "amex" && <AmexBadge />}
                        {c.brand === "generic" && (
                          <span className="text-[10px] font-mono-data uppercase tracking-widest text-neutral-400">
                            COSMO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Masked Number */}
                    <div className="z-10 py-1 font-mono-data tracking-[0.22em] text-base font-medium text-white/90">
                      {c.cardNumber}
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-end justify-between text-xs z-10 pt-1">
                      <div>
                        <div className="text-[8px] font-mono-data uppercase tracking-widest text-neutral-400 mb-0.5">
                          CARDHOLDER
                        </div>
                        <div className="font-sans-body font-medium uppercase tracking-wider text-xs truncate max-w-[140px] text-white/90">
                          {c.cardholder}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] font-mono-data uppercase tracking-widest text-neutral-400 mb-0.5">
                          EXPIRES
                        </div>
                        <div className="font-mono-data font-medium tracking-wider text-xs text-white/90">
                          {c.expiry}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Controls */}
                  <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider px-2">
                    {c.isDefault ? (
                      <span className="text-[#059669] font-bold text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                        <span>DEFAULT CARD</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setDefaultCard(c.id);
                          showToast("Default payment card updated.");
                        }}
                        className="text-neutral-500 hover:text-black text-[11px]"
                      >
                        Set Default
                      </button>
                    )}

                    {!c.isDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteCard(c.id);
                          showToast("Card removed.");
                        }}
                        className="text-neutral-400 hover:text-red-600 text-[11px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ADD CARD MODAL */}
            {isCardModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                    <h3 className="font-serif-editorial text-2xl font-medium text-[#161514]">
                      Add New Payment Card
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCardModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCardSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                        Cardholder Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardForm.cardholder}
                        onChange={(e) => setCardForm({ ...cardForm, cardholder: e.target.value })}
                        placeholder="Name as printed on card"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                        16-Digit Card Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardForm.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 8920 1289 4432"
                          className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-neutral-200 text-xs font-mono-data"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          {detectedCardBrand === "visa" && <VisaBadge />}
                          {detectedCardBrand === "mastercard" && <MastercardBadge />}
                          {detectedCardBrand === "amex" && <AmexBadge />}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                          Expiry Date (MM / YY) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={7}
                          value={cardForm.expiry}
                          onChange={handleCardExpiryChange}
                          placeholder="09 / 28"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono-data"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                          Security CVV *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          placeholder="•••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono-data"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isDefaultCard"
                        checked={cardForm.isDefault}
                        onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
                        className="rounded border-neutral-300"
                      />
                      <label htmlFor="isDefaultCard" className="text-xs text-neutral-700">
                        Set as default payment card
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => setIsCardModalOpen(false)}
                        className="px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-mono-data uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-[#161514] text-white text-xs font-mono-data uppercase tracking-wider font-semibold"
                      >
                        Save Card
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: PROFILE INFO & PERSONAL DETAILS                              */}
        {/* =================================================================== */}
        {activeTab === "profile" && (
          <div className="max-w-2xl bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
            <div>
              <div className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-bold mb-1">
                ACCOUNT DETAILS
              </div>
              <h2 className="font-serif-editorial text-3xl font-medium text-[#161514]">
                Personal Information
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Keep your contact information up to date for order tracking and delivery updates.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1.5">
                  Phone Number (for delivery updates)
                </label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-xs bg-neutral-50/50"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold transition-all shadow-sm"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-mono-data uppercase tracking-wider text-neutral-400 hover:text-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Footer Colophon */}
      <footer className="border-t border-neutral-200/60 py-6 text-center text-xs text-neutral-400 font-mono-data text-[10px] uppercase tracking-wider">
        © 2026 COSMO STORE. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
