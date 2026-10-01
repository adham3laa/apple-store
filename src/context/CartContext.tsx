"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CosmoProduct } from "../data/cosmo-catalog";
import { CartItem } from "../components/cosmo/CartDrawer";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: CosmoProduct,
    finishName?: string,
    appleCarePlan?: { name: string; price: number; duration: string },
    engravingText?: string
  ) => void;
  updateQuantity: (productId: string, delta: number, selectedFinish?: string) => void;
  removeItem: (productId: string, selectedFinish?: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cosmo_cart_items_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when cart items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      } catch (e) {
        console.warn("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isHydrated]);

  const addToCart = (
    product: CosmoProduct,
    finishName?: string,
    appleCarePlan?: { name: string; price: number; duration: string },
    engravingText?: string
  ) => {
    setCartItems(prev => {
      // Check if exact same config already exists
      const existingIndex = prev.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedFinish === finishName &&
          item.appleCarePlan?.name === appleCarePlan?.name &&
          item.engravingText === engravingText
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1
        };
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedFinish: finishName,
          appleCarePlan,
          engravingText: engravingText?.trim() || undefined
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number, selectedFinish?: string) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId && (selectedFinish === undefined || item.selectedFinish === selectedFinish)) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (productId: string, selectedFinish?: string) => {
    setCartItems(prev =>
      prev.filter(
        item => !(item.product.id === productId && (selectedFinish === undefined || item.selectedFinish === selectedFinish))
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.product.basePrice + (item.appleCarePlan?.price || 0)) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalCount,
        totalAmount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
