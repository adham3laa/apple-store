"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { COSMO_CATALOG, CosmoProduct, ProductCategory } from "../data/cosmo-catalog";

export const getFinishStock = (finish: { stockCount?: number }, fallback = 8): number => {
  return typeof finish.stockCount === "number" ? finish.stockCount : fallback;
};

export const getDeviceTotalStock = (product: CosmoProduct): number => {
  if (product.stockQuantity !== undefined) return product.stockQuantity;
  if (!product.inStock) return 0;
  if (!product.finishes || product.finishes.length === 0) return 12;
  return product.finishes.reduce((acc, f) => acc + getFinishStock(f), 0);
};

// Seed realistic stock numbers for each product's color finishes
const seedProductStock = (catalog: CosmoProduct[]): CosmoProduct[] => {
  return catalog.map((p, idx) => {
    const finishes = p.finishes?.map((f, fIdx) => {
      if (typeof f.stockCount === "number") return f;
      // Realistic varied stock per color (e.g. 5 to 16 units)
      const baseStock = 6 + ((idx * 3 + fIdx * 4) % 11);
      return { ...f, stockCount: baseStock };
    });

    const totalUnits = finishes
      ? finishes.reduce((acc, f) => acc + (f.stockCount || 0), 0)
      : p.stockQuantity || 15;

    return {
      ...p,
      finishes,
      stockQuantity: totalUnits,
    };
  });
};

interface CatalogContextType {
  products: CosmoProduct[];
  addProduct: (product: CosmoProduct) => void;
  updateProduct: (id: string, updates: Partial<CosmoProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleStockStatus: (id: string) => void;
  updateColorStock: (productId: string, finishId: string, newCount: number) => void;
  resetCatalog: () => void;
  getProductBySlug: (slug: string) => CosmoProduct | undefined;
  getProductById: (id: string) => CosmoProduct | undefined;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

const CATALOG_STORAGE_KEY = "cosmo_custom_catalog_v6";

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CosmoProduct[]>(() => seedProductStock(COSMO_CATALOG));
  const [isInitialized, setIsInitialized] = useState(false);

  // Load persisted catalog from localStorage on mount and merge with fresh catalog
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(CATALOG_STORAGE_KEY) ||
        localStorage.getItem("cosmo_custom_catalog_v5") ||
        localStorage.getItem("cosmo_custom_catalog_v4") ||
        localStorage.getItem("cosmo_custom_catalog_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedMap = new Map(parsed.map((p: CosmoProduct) => [p.id, p]));

          // Merge fresh COSMO_CATALOG with saved stock values
          const updatedCatalog = COSMO_CATALOG.map(baseProduct => {
            const savedProduct = savedMap.get(baseProduct.id);
            if (!savedProduct) return baseProduct;

            // Preserve finish stock counts if customized
            const mergedFinishes = baseProduct.finishes?.map(f => {
              const savedFinish = savedProduct.finishes?.find((sf: any) => sf.id === f.id);
              return savedFinish && typeof savedFinish.stockCount === "number"
                ? { ...f, stockCount: savedFinish.stockCount }
                : f;
            });

            return {
              ...baseProduct,
              inStock: savedProduct.inStock !== undefined ? savedProduct.inStock : baseProduct.inStock,
              stockQuantity: savedProduct.stockQuantity !== undefined ? savedProduct.stockQuantity : baseProduct.stockQuantity,
              finishes: mergedFinishes || baseProduct.finishes,
            };
          });

          // Also include any entirely custom products created by the owner in admin
          const catalogIds = new Set(COSMO_CATALOG.map(p => p.id));
          const customOwnerProducts = parsed.filter((p: CosmoProduct) => !catalogIds.has(p.id));

          const finalCatalog = [...updatedCatalog, ...customOwnerProducts];
          const seeded = seedProductStock(finalCatalog);
          setProducts(seeded);
          localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(seeded));
        }
      }
    } catch (e) {
      console.warn("Failed to load catalog from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  const saveToStorage = (updatedProducts: CosmoProduct[]) => {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (e) {
      console.warn("Failed to persist catalog to localStorage", e);
    }
  };

  const addProduct = (newProduct: CosmoProduct) => {
    setProducts(prev => {
      const safeId = newProduct.id || `apple-device-${Date.now()}`;
      const safeSlug = newProduct.slug || safeId;
      const totalUnits = newProduct.finishes
        ? newProduct.finishes.reduce((acc, f) => acc + (f.stockCount || 0), 0)
        : newProduct.stockQuantity || 15;

      const formattedProduct: CosmoProduct = {
        ...newProduct,
        id: safeId,
        slug: safeSlug,
        stockQuantity: totalUnits,
        inStock: totalUnits > 0,
      };

      const updated = [formattedProduct, ...prev];
      saveToStorage(updated);
      return updated;
    });
  };

  const updateProduct = (id: string, updates: Partial<CosmoProduct>) => {
    setProducts(prev => {
      const updated = prev.map(item => {
        if (item.id !== id) return item;
        const merged = { ...item, ...updates };
        if (merged.finishes) {
          merged.stockQuantity = merged.finishes.reduce((acc, f) => acc + (f.stockCount || 0), 0);
          merged.inStock = (merged.stockQuantity || 0) > 0;
        }
        return merged;
      });
      saveToStorage(updated);
      return updated;
    });
  };

  const updateColorStock = (productId: string, finishId: string, newCount: number) => {
    setProducts(prev => {
      const updated = prev.map(product => {
        if (product.id !== productId) return product;
        const safeCount = Math.max(0, newCount);
        const updatedFinishes = (product.finishes || []).map(f => {
          if (f.id !== finishId) return f;
          return { ...f, stockCount: safeCount };
        });

        const totalStock = updatedFinishes.reduce((acc, f) => acc + (f.stockCount || 0), 0);
        return {
          ...product,
          finishes: updatedFinishes,
          stockQuantity: totalStock,
          inStock: totalStock > 0,
        };
      });
      saveToStorage(updated);
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const toggleStockStatus = (id: string) => {
    setProducts(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const nextInStock = !item.inStock;
          const updatedFinishes = (item.finishes || []).map(f => ({
            ...f,
            stockCount: nextInStock ? (f.stockCount && f.stockCount > 0 ? f.stockCount : 6) : 0,
          }));
          const totalUnits = updatedFinishes.reduce((acc, f) => acc + (f.stockCount || 0), 0);
          return {
            ...item,
            inStock: nextInStock,
            finishes: updatedFinishes,
            stockQuantity: nextInStock ? totalUnits : 0,
          };
        }
        return item;
      });
      saveToStorage(updated);
      return updated;
    });
  };

  const resetCatalog = () => {
    try {
      localStorage.removeItem(CATALOG_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear catalog storage", e);
    }
    setProducts(seedProductStock(COSMO_CATALOG));
  };

  const getProductBySlug = (slug: string) => {
    return products.find(p => p.slug === slug);
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStockStatus,
        updateColorStock,
        resetCatalog,
        getProductBySlug,
        getProductById,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}
