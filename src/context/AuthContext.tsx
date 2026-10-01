"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { COSMO_CATALOG, CosmoProduct } from "../data/cosmo-catalog";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  provider: "google" | "email" | "guest";
  avatar?: string;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  streetAddress: string;
  buildingNumber: string;
  postalCode: string;
  courierNotes: string;
  isDefault: boolean;
}

export interface SavedCard {
  id: string;
  cardholder: string;
  cardNumber: string; // Formatted or masked: 4532 •••• •••• 8941
  cleanNumber: string; // 16 digits
  expiry: string; // MM / YY
  cvv: string;
  brand: "visa" | "mastercard" | "amex" | "generic";
  isDefault: boolean;
}

export type OrderMilestone = 
  | "vault_allocated" 
  | "quality_inspected" 
  | "courier_dispatched" 
  | "out_for_delivery" 
  | "delivered";

export interface OrderTimelineStep {
  step: OrderMilestone;
  label: string;
  description: string;
  timestamp: string;
  done: boolean;
  current?: boolean;
}

export interface OrderItem {
  product: CosmoProduct;
  selectedFinish?: string;
  quantity: number;
  appleCarePlan?: {
    name: string;
    price: number;
    duration: string;
  };
  engravingText?: string;
}

export interface PickupBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderMilestone;
  statusLabel: string;
  items: OrderItem[];
  shippingAddress: SavedAddress;
  shippingMethod: "complimentary" | "express" | "pickup";
  pickupBranch?: PickupBranch;
  shippingCost: number;
  paymentMethod: "card" | "cod" | "installments";
  cardBrand?: string;
  cardLast4?: string;
  installmentMonths?: number;
  subtotal?: number;
  discountAmount?: number;
  promoCode?: string;
  tradeInVoucher?: string;
  totalAmount: number;
  trackingCode: string;
  estimatedDelivery: string;
  courier: {
    name: string;
    vehicle: string;
    phone: string;
    securityPin: string;
  };
  timeline: OrderTimelineStep[];
}

interface AuthContextType {
  user: UserProfile | null;
  addresses: SavedAddress[];
  savedCards: SavedCard[];
  orders: Order[];
  loginWithGoogle: () => void;
  loginWithEmail: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addCard: (card: Omit<SavedCard, "id">) => void;
  deleteCard: (id: string) => void;
  setDefaultCard: (id: string) => void;
  addOrder: (order: Order) => void;
  advanceOrderStatus: (orderId: string) => void;
  setOrderStatus: (orderId: string, status: OrderMilestone, courierDetails?: Partial<Order["courier"]>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "cosmo_user_profile_v2";
const ADDRESSES_STORAGE_KEY = "cosmo_saved_addresses_v2";
const CARDS_STORAGE_KEY = "cosmo_saved_cards_v2";
const ORDERS_STORAGE_KEY = "cosmo_orders_history_v2";

/* Helper to build initial timeline */
export function buildTimeline(currentMilestone: OrderMilestone, createdAt: string): OrderTimelineStep[] {
  const steps: { milestone: OrderMilestone; label: string; desc: string; timeOffset: string }[] = [
    {
      milestone: "vault_allocated",
      label: "Order Confirmed",
      desc: "Your order is confirmed and your Apple device is being prepared.",
      timeOffset: "14:20"
    },
    {
      milestone: "quality_inspected",
      label: "Quality Check Passed",
      desc: "Device checked and factory seals verified intact.",
      timeOffset: "15:05"
    },
    {
      milestone: "courier_dispatched",
      label: "Shipped with Courier",
      desc: "Package handed over to our courier and on its way.",
      timeOffset: "16:40"
    },
    {
      milestone: "out_for_delivery",
      label: "Out for Delivery",
      desc: "Courier is in your area and arriving soon.",
      timeOffset: "Estimated 11:30 AM"
    },
    {
      milestone: "delivered",
      label: "Delivered Successfully",
      desc: "Package received and verified with delivery PIN code.",
      timeOffset: "Pending Delivery"
    }
  ];

  const milestoneOrder: OrderMilestone[] = [
    "vault_allocated",
    "quality_inspected",
    "courier_dispatched",
    "out_for_delivery",
    "delivered"
  ];

  const currentIndex = milestoneOrder.indexOf(currentMilestone);

  return steps.map((s, idx) => {
    return {
      step: s.milestone,
      label: s.label,
      description: s.desc,
      timestamp: s.timeOffset,
      done: idx <= currentIndex,
      current: idx === currentIndex
    };
  });
}

// Initial default user
const DEFAULT_USER: UserProfile = {
  id: "usr-adham",
  name: "Adham Alaa",
  email: "adham.alaa@gmail.com",
  phone: "+20 100 123 4567",
  provider: "google",
  avatar: "AA"
};

// Initial default address
const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-cairo",
    fullName: "Adham Alaa",
    phone: "+20 100 123 4567",
    country: "Egypt",
    city: "Cairo",
    streetAddress: "14 El-Thawra St, Heliopolis",
    buildingNumber: "Bldg 8, 4th Floor, Apt 402",
    postalCode: "11757",
    courierNotes: "Ring doorbell; courier may call upon arrival.",
    isDefault: true
  },
  {
    id: "addr-alex",
    fullName: "Adham Alaa",
    phone: "+20 100 123 4567",
    country: "Egypt",
    city: "Alexandria",
    streetAddress: "22 Corniche Road, Stanley",
    buildingNumber: "Palais Stanley, 7th Floor",
    postalCode: "21500",
    courierNotes: "Leave with building reception if unavailable.",
    isDefault: false
  }
];

// Initial default cards
const DEFAULT_CARDS: SavedCard[] = [
  {
    id: "card-visa-primary",
    cardholder: "ADHAM ALAA",
    cardNumber: "4532 •••• •••• 8941",
    cleanNumber: "45328941",
    expiry: "09 / 28",
    cvv: "841",
    brand: "visa",
    isDefault: true
  },
  {
    id: "card-mc-secondary",
    cardholder: "ADHAM ALAA",
    cardNumber: "5412 •••• •••• 2049",
    cleanNumber: "54122049",
    expiry: "11 / 27",
    cvv: "329",
    brand: "mastercard",
    isDefault: false
  }
];

// Initial seeded order for rich order history & tracking experience
const INITIAL_SEED_ORDERS: Order[] = [
  {
    id: "CSM-2026-48192",
    createdAt: "2026-09-12T14:30:00Z",
    status: "courier_dispatched",
    statusLabel: "Shipped with Courier",
    items: [
      {
        product: COSMO_CATALOG[0], // iPhone 16 Pro
        selectedFinish: "Desert Titanium // 256GB",
        quantity: 1
      },
      {
        product: COSMO_CATALOG[4], // AirPods Max
        selectedFinish: "Starlight",
        quantity: 1
      }
    ],
    shippingAddress: DEFAULT_ADDRESSES[0],
    shippingMethod: "express",
    shippingCost: 25,
    paymentMethod: "card",
    cardBrand: "visa",
    cardLast4: "8941",
    totalAmount: 1573,
    trackingCode: "TRK-2026-99214",
    estimatedDelivery: "Tomorrow by 2:00 PM",
    courier: {
      name: "Karim Hassan",
      vehicle: "Climate-Regulated Vault Van #12",
      phone: "+20 102 984 5512",
      securityPin: "4921"
    },
    timeline: buildTimeline("courier_dispatched", "2026-09-12T14:30:00Z")
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [addresses, setAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [savedCards, setSavedCards] = useState<SavedCard[]>(DEFAULT_CARDS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_SEED_ORDERS);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedAddresses = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (storedAddresses) setAddresses(JSON.parse(storedAddresses));

      const storedCards = localStorage.getItem(CARDS_STORAGE_KEY);
      if (storedCards) setSavedCards(JSON.parse(storedCards));

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.error("Failed to load auth data from localStorage", e);
    }
  }, []);

  // Sync User to localStorage
  const saveUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  // Sync Addresses
  const saveAddresses = (newAddresses: SavedAddress[]) => {
    setAddresses(newAddresses);
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(newAddresses));
  };

  // Sync Cards
  const saveCards = (newCards: SavedCard[]) => {
    setSavedCards(newCards);
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(newCards));
  };

  // Sync Orders
  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
  };

  // Actions
  const loginWithGoogle = () => {
    saveUser(DEFAULT_USER);
  };

  const loginWithEmail = (email: string, name?: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || email.split("@")[0],
      email,
      phone: "+20 100 000 0000",
      provider: "email",
      avatar: (name || email).slice(0, 2).toUpperCase()
    };
    saveUser(newUser);
  };

  const logout = () => {
    saveUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUser(updated);
  };

  const addAddress = (addressData: Omit<SavedAddress, "id">) => {
    const newAddress: SavedAddress = {
      ...addressData,
      id: `addr-${Date.now()}`
    };

    let updated = [...addresses];
    if (newAddress.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: false }));
    }
    updated.unshift(newAddress);
    saveAddresses(updated);
  };

  const updateAddress = (id: string, partial: Partial<SavedAddress>) => {
    let updated = addresses.map(addr => {
      if (addr.id === id) {
        return { ...addr, ...partial };
      }
      if (partial.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });
    saveAddresses(updated);
  };

  const deleteAddress = (id: string) => {
    const remaining = addresses.filter(a => a.id !== id);
    if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    saveAddresses(remaining);
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    saveAddresses(updated);
  };

  const addCard = (cardData: Omit<SavedCard, "id">) => {
    const newCard: SavedCard = {
      ...cardData,
      id: `card-${Date.now()}`
    };

    let updated = [...savedCards];
    if (newCard.isDefault) {
      updated = updated.map(c => ({ ...c, isDefault: false }));
    }
    updated.unshift(newCard);
    saveCards(updated);
  };

  const deleteCard = (id: string) => {
    const remaining = savedCards.filter(c => c.id !== id);
    if (remaining.length > 0 && !remaining.some(c => c.isDefault)) {
      remaining[0].isDefault = true;
    }
    saveCards(remaining);
  };

  const setDefaultCard = (id: string) => {
    const updated = savedCards.map(c => ({
      ...c,
      isDefault: c.id === id
    }));
    saveCards(updated);
  };

  const addOrder = (order: Order) => {
    const updated = [order, ...orders];
    saveOrders(updated);
  };

  // Interactive milestone advance for testing order progress
  const advanceOrderStatus = (orderId: string) => {
    const milestoneSequence: OrderMilestone[] = [
      "vault_allocated",
      "quality_inspected",
      "courier_dispatched",
      "out_for_delivery",
      "delivered"
    ];

    const labels: Record<OrderMilestone, string> = {
      vault_allocated: "Order Confirmed & Being Prepared",
      quality_inspected: "Quality Check Passed",
      courier_dispatched: "Shipped with Courier",
      out_for_delivery: "Out for Delivery (Courier Approaching)",
      delivered: "Delivered Successfully"
    };

    const updated = orders.map(ord => {
      if (ord.id !== orderId) return ord;
      const currentIdx = milestoneSequence.indexOf(ord.status);
      const nextIdx = (currentIdx + 1) % milestoneSequence.length;
      const nextMilestone = milestoneSequence[nextIdx];

      return {
        ...ord,
        status: nextMilestone,
        statusLabel: labels[nextMilestone],
        timeline: buildTimeline(nextMilestone, ord.createdAt)
      };
    });

    saveOrders(updated);
  };

  const setOrderStatus = (
    orderId: string,
    status: OrderMilestone,
    courierDetails?: Partial<Order["courier"]>
  ) => {
    const labels: Record<OrderMilestone, string> = {
      vault_allocated: "Order Confirmed & Being Prepared",
      quality_inspected: "Quality Check Passed",
      courier_dispatched: "Shipped with Courier",
      out_for_delivery: "Out for Delivery (Courier Approaching)",
      delivered: "Delivered Successfully"
    };

    const updated = orders.map(ord => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        status,
        statusLabel: labels[status],
        courier: courierDetails ? { ...ord.courier, ...courierDetails } : ord.courier,
        timeline: buildTimeline(status, ord.createdAt)
      };
    });

    saveOrders(updated);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    const updated = orders.map(ord => {
      if (ord.id !== orderId) return ord;
      return { ...ord, ...updates };
    });
    saveOrders(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        addresses,
        savedCards,
        orders,
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
        addOrder,
        advanceOrderStatus,
        setOrderStatus,
        updateOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
