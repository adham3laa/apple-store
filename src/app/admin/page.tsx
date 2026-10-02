"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCatalog, getDeviceTotalStock, getFinishStock } from "../../context/CatalogContext";
import { useAuth, Order, OrderMilestone, buildTimeline } from "../../context/AuthContext";
import { useDiscounts, PromoCoupon } from "../../context/DiscountContext";
import { CosmoProduct, ProductCategory } from "../../data/cosmo-catalog";
import { CosmoLogo } from "../../components/cosmo/CosmoLogo";

type AdminTab = "inventory" | "orders" | "coupons" | "analytics";

export default function AdminDashboardPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStockStatus,
    updateColorStock,
    resetCatalog,
  } = useCatalog();

  const { orders, setOrderStatus, updateOrder } = useAuth();
  const { coupons, createCoupon, deleteCoupon, toggleCouponStatus } = useDiscounts();

  const [activeTab, setActiveTab] = useState<AdminTab>("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Orders Tab States
  const [orderFilter, setOrderFilter] = useState<"all" | OrderMilestone>("all");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [courierForm, setCourierForm] = useState({
    name: "Karim Hassan",
    vehicle: "Climate-Regulated Vault Van #12",
    phone: "+20 102 984 5512",
    securityPin: "4921"
  });

  // Remote Database Orders Sync
  const [dbOrders, setDbOrders] = useState<Order[]>([]);

  const fetchRemoteOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        const mapped: Order[] = data.orders.map((o: any) => ({
          id: o.orderNumber,
          createdAt: o.createdAt,
          status: o.status,
          statusLabel: o.statusLabel,
          items: o.items.map((it: any) => ({
            product: {
              id: it.productId,
              slug: it.productId,
              title: it.productTitle,
              category: it.productCategory || "iphones",
              basePrice: it.unitPrice,
              primaryImage: it.primaryImage || "/devices/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium.png"
            },
            selectedFinish: it.selectedFinish,
            quantity: it.quantity,
            appleCarePlan: it.appleCareName ? { name: it.appleCareName, price: it.appleCarePrice || 0, duration: "2 Years" } : undefined,
            engravingText: it.engravingText
          })),
          shippingAddress: {
            id: `addr-${o.id}`,
            fullName: o.customerName,
            phone: o.customerPhone,
            country: o.country || "United States",
            city: o.city || "New York",
            streetAddress: o.streetAddress || "Store Pickup",
            buildingNumber: o.buildingNumber,
            postalCode: o.postalCode,
            courierNotes: o.courierNotes,
            isDefault: true
          },
          shippingMethod: o.shippingMethod,
          shippingCost: o.shippingCost,
          subtotal: o.subtotal,
          discountAmount: o.discountAmount,
          promoCode: o.promoCode,
          tradeInVoucher: o.tradeInVoucher,
          paymentMethod: o.paymentMethod,
          cardBrand: o.cardBrand,
          cardLast4: o.cardLast4,
          installmentMonths: o.installmentMonths,
          totalAmount: o.totalAmount,
          trackingCode: o.trackingCode,
          estimatedDelivery: o.estimatedDelivery,
          courier: {
            name: o.courierName || "Karim Hassan",
            vehicle: o.courierVehicle || "Climate-Regulated Vault Van #12",
            phone: o.courierPhone || "+20 102 984 5512",
            securityPin: o.securityPin
          },
          timeline: buildTimeline(o.status, o.createdAt)
        }));
        setDbOrders(mapped);
      }
    } catch (e) {
      console.warn("Could not fetch remote DB orders:", e);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    fetchRemoteOrders();
  }, []);


  // Coupons Tab States
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState<"percentage" | "fixed">("percentage");
  const [couponValue, setCouponValue] = useState(10);
  const [couponMinSpend, setCouponMinSpend] = useState(100);
  const [couponMaxUses, setCouponMaxUses] = useState(200);
  const [couponExpiry, setCouponExpiry] = useState("2026-12-31");
  const [couponDescription, setCouponDescription] = useState("");

  // Product Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState<"iphones" | "macbooks" | "airpods" | "watches" | "accessories">("iphones");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formBasePrice, setFormBasePrice] = useState(999);
  const [formMaterial, setFormMaterial] = useState("Grade 5 Titanium");
  const [formDimensions, setFormDimensions] = useState("149.6 × 71.5 × 8.25 mm");
  const [formWeight, setFormWeight] = useState("199 grams");
  const [formPrimaryImage, setFormPrimaryImage] = useState("/devices/iphone-16-finish-select-202409-6-1inch-black.png");
  const [formInStock, setFormInStock] = useState(true);

  // Colors / Finishes with per-color stock
  const [formFinishes, setFormFinishes] = useState<Array<{
    id: string;
    name: string;
    colorCode: string;
    heroImage: string;
    editorialDescription: string;
    stockCount: number;
  }>>([
    { id: "black", name: "Black", colorCode: "#1D1D1F", heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-black.png", editorialDescription: "Sleek obsidian finish", stockCount: 12 },
    { id: "natural", name: "Natural Titanium", colorCode: "#9C9589", heroImage: "/devices/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium.png", editorialDescription: "Micro-blasted titanium", stockCount: 8 },
  ]);

  // Storage Capacities
  const [formCapacities, setFormCapacities] = useState([
    { size: "128 GB", priceDelta: 0 },
    { size: "256 GB", priceDelta: 100 },
    { size: "512 GB", priceDelta: 300 },
  ]);

  // Key Tech Specs
  const [specChip, setSpecChip] = useState("Apple A18 Pro Bionic Silicon");
  const [specDisplay, setSpecDisplay] = useState("6.3-inch Super Retina XDR OLED (120Hz ProMotion)");
  const [specCamera, setSpecCamera] = useState("48MP Fusion + 48MP Ultra Wide + 5x Telephoto");
  const [specBattery, setSpecBattery] = useState("Up to 27 hours video playback");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Low stock detection: products or colors with stock <= 3
  const lowStockAlerts: Array<{
    productId: string;
    productTitle: string;
    finishId: string;
    finishName: string;
    stockCount: number;
  }> = [];

  products.forEach((p) => {
    p.finishes?.forEach((f) => {
      const count = f.stockCount ?? 6;
      if (count <= 3) {
        lowStockAlerts.push({
          productId: p.id,
          productTitle: p.title,
          finishId: f.id,
          finishName: f.name,
          stockCount: count,
        });
      }
    });
  });

  const handleQuickRestock = (productId: string, finishId: string, currentStock: number) => {
    updateColorStock(productId, finishId, currentStock + 10);
    showToast(`Restocked +10 units successfully.`);
  };

  // Preset Handlers
  const applyPreset = (presetKey: string) => {
    if (presetKey === "iphone16plus") {
      setFormTitle("iPhone 16 Plus");
      setFormSlug("iphone-16-plus-5g");
      setFormCategory("iphones");
      setFormSubtitle("Expansive 6.7-inch Super Retina XDR display with Action button and Camera Control.");
      setFormBasePrice(899);
      setFormMaterial("Aerospace-grade Aluminum & Color-infused Glass");
      setFormDimensions("160.9 × 77.8 × 7.80 mm");
      setFormWeight("199 grams");
      setFormPrimaryImage("/devices/iphone-16-finish-select-202409-6-1inch-ultramarine.png");
      setFormFinishes([
        { id: "ultramarine", name: "Ultramarine", colorCode: "#345598", heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-ultramarine.png", editorialDescription: "Deep ultramarine blue", stockCount: 14 },
        { id: "teal", name: "Teal", colorCode: "#85A39E", heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-teal.png", editorialDescription: "Rich aquatic teal", stockCount: 10 },
        { id: "pink", name: "Pink", colorCode: "#E29DAA", heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-pink.png", editorialDescription: "Soft blush pink", stockCount: 7 },
        { id: "black", name: "Black", colorCode: "#1D1D1F", heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-black.png", editorialDescription: "Midnight black", stockCount: 18 },
      ]);
      setFormCapacities([
        { size: "128 GB", priceDelta: 0 },
        { size: "256 GB", priceDelta: 100 },
        { size: "512 GB", priceDelta: 300 },
      ]);
      setSpecChip("Apple A18 Bionic (6-core CPU, 5-core GPU)");
      setSpecDisplay("6.7-inch Super Retina XDR OLED (2000 nits peak)");
      setSpecCamera("48MP Fusion 2x Telephoto + 12MP Ultra Wide with Macro");
      setSpecBattery("Up to 27 hours video playback");
    } else if (presetKey === "custom") {
      setFormTitle("");
      setFormSlug("");
      setFormSubtitle("");
      setFormBasePrice(499);
      setFormMaterial("Aluminum & Ceramic Shield");
      setFormDimensions("Standard Apple Proportions");
      setFormWeight("150 grams");
      setFormFinishes([
        { id: "black", name: "Space Black", colorCode: "#1D1D1F", heroImage: formPrimaryImage, editorialDescription: "Black finish", stockCount: 10 },
      ]);
    }
  };

  const openAddModal = () => {
    setEditingProductId(null);
    applyPreset("iphone16plus");
    setIsModalOpen(true);
  };

  const openEditModal = (product: CosmoProduct) => {
    setEditingProductId(product.id);
    setFormTitle(product.title);
    setFormSlug(product.slug);
    setFormCategory(product.category);
    setFormSubtitle(product.curatorialSubtitle);
    setFormBasePrice(product.basePrice);
    setFormMaterial(product.material);
    setFormDimensions(product.dimensions);
    setFormWeight(product.weight);
    setFormPrimaryImage(product.primaryImage);
    setFormInStock(product.inStock);

    if (product.finishes && product.finishes.length > 0) {
      setFormFinishes(
        product.finishes.map((f) => ({
          ...f,
          stockCount: typeof f.stockCount === "number" ? f.stockCount : 6,
        }))
      );
    }
    if (product.capacities && product.capacities.length > 0) {
      setFormCapacities(product.capacities);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a product title");
      return;
    }

    const generatedSlug = formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const productId = editingProductId || `cosmo-${Date.now()}`;
    const calculatedTotalStock = formFinishes.reduce((acc, f) => acc + (Number(f.stockCount) || 0), 0);

    const newProductData: CosmoProduct = {
      id: productId,
      slug: generatedSlug,
      title: formTitle,
      curatorialSubtitle: formSubtitle || "Authentic Apple device with official warranty.",
      category: formCategory,
      era: "COLLECTION 2026 // OFFICIAL ARCHIVE",
      designerNote: "Certified genuine Apple hardware.",
      basePrice: Number(formBasePrice) || 0,
      currency: "USD",
      material: formMaterial,
      dimensions: formDimensions,
      weight: formWeight,
      primaryImage: formPrimaryImage,
      secondaryImage: formFinishes[1]?.heroImage || formPrimaryImage,
      galleryImages: formFinishes.map((f, i) => ({
        url: f.heroImage,
        caption: `${f.name} finish // Authentic Apple architecture`,
        plateNumber: `PLATE 0${i + 1}`,
      })),
      specHighlights: [specChip, specDisplay, specCamera, specBattery],
      technicalDossier: [
        {
          title: "Silicon & Architecture",
          specs: [
            { label: "Processor", value: specChip },
            { label: "Neural Engine", value: "16-core Apple Neural Engine" },
          ],
        },
      ],
      finishes: formFinishes,
      capacities: formCapacities,
      inStock: formInStock && calculatedTotalStock > 0,
      stockQuantity: calculatedTotalStock,
    };

    if (editingProductId) {
      updateProduct(editingProductId, newProductData);
      showToast(`Updated ${formTitle} successfully.`);
    } else {
      addProduct(newProductData);
      showToast(`Added ${formTitle} to catalog.`);
    }

    setIsModalOpen(false);
  };

  // Handle Order Status advancement with Central Database Sync
  const handleAdvanceStatus = (orderId: string, nextStatus: OrderMilestone) => {
    setOrderStatus(orderId, nextStatus);
    fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        statusLabel: nextStatus === "delivered" ? "Delivered to Client" : "En Route with Courier"
      })
    }).catch(err => console.error("Database sync status error:", err));
    showToast(`Order status updated to "${nextStatus.replace('_', ' ')}".`);
  };

  const handleOpenDispatch = (order: Order) => {
    setDispatchModalOrder(order);
    setCourierForm({
      name: order.courier?.name || "Karim Hassan",
      vehicle: order.courier?.vehicle || "Climate-Regulated Vault Van #12",
      phone: order.courier?.phone || "+20 102 984 5512",
      securityPin: order.courier?.securityPin || String(Math.floor(1000 + Math.random() * 9000))
    });
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;

    setOrderStatus(dispatchModalOrder.id, "courier_dispatched", courierForm);
    fetch(`/api/orders/${dispatchModalOrder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "courier_dispatched",
        statusLabel: "En Route to Client with Secure Courier",
        courierName: courierForm.name,
        courierVehicle: courierForm.vehicle,
        courierPhone: courierForm.phone,
        securityPin: courierForm.securityPin
      })
    }).catch(err => console.error("Database sync dispatch error:", err));

    showToast(`Order ${dispatchModalOrder.id} dispatched with courier ${courierForm.name}!`);
    setDispatchModalOrder(null);
  };

  // Create Coupon
  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      alert("Please provide a promo code name.");
      return;
    }

    createCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      discountValue: Number(couponValue),
      minSpend: Number(couponMinSpend),
      maxUses: Number(couponMaxUses),
      expiryDate: couponExpiry,
      isActive: true,
      description: couponDescription || `${couponValue}${couponType === 'percentage' ? '%' : '$'} promotional discount`
    });

    showToast(`Created promo code "${couponCode.toUpperCase()}".`);
    setIsCouponModalOpen(false);
    setCouponCode("");
    setCouponDescription("");
  };

  // Filter products
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Merged live orders from Central Database & Local State
  const allMergedOrders = useMemo(() => {
    const combined = [...dbOrders, ...orders];
    const seen = new Set<string>();
    return combined.filter(o => {
      if (seen.has(o.id)) return false;
      seen.add(o.id);
      return true;
    });
  }, [dbOrders, orders]);

  // Filter orders
  const filteredOrders = allMergedOrders.filter(o => {
    if (orderFilter === "all") return true;
    return o.status === orderFilter;
  });

  // KPI Calculations
  const totalRevenue = allMergedOrders.reduce((acc, o) => acc + o.totalAmount, 0) || 14850;
  const inStockCount = products.filter((p) => p.inStock).length;
  const totalUnitsAcrossCatalog = products.reduce((acc, p) => acc + getDeviceTotalStock(p), 0);
  const totalColorsCount = products.reduce((acc, p) => acc + (p.finishes?.length || 1), 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] font-sans-body flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161514] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-neutral-700 animate-slide-up text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#161514] text-[#FAF8F5] border-b border-neutral-800 backdrop-blur-xl">
        <div className="max-w-[1520px] mx-auto px-3 sm:px-6 md:px-12 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <CosmoLogo size="sm" showSubtitle={false} inverted={true} />
            </Link>
            <span className="hidden sm:inline text-neutral-600 font-mono-data text-xs">/</span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono-data tracking-wider uppercase text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">OWNER COMMAND CENTER</span>
              <span className="sm:hidden">ADMIN</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-mono-data shrink-0">
            <Link
              href="/"
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs touch-manipulation"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span className="hidden sm:inline">View Storefront</span>
              <span className="sm:hidden">Store</span>
            </Link>
            <button
              onClick={openAddModal}
              className="px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1 text-[10px] sm:text-xs touch-manipulation cursor-pointer"
            >
              <span className="hidden sm:inline">+ Add Product</span>
              <span className="sm:hidden">+ Add</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-red-950/80 text-neutral-400 hover:text-red-300 border border-neutral-800 transition-colors flex items-center gap-1.5 text-[10px] sm:text-xs touch-manipulation cursor-pointer"
              title="End Executive Session"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="hidden md:inline">Lock Vault</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-[1520px] mx-auto w-full px-6 md:px-12 py-8 md:py-10 space-y-6">
        
        {/* LOW-STOCK AUTOMATED WARNING RIBBON */}
        {lowStockAlerts.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200/70 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                !
              </div>
              <div>
                <div className="text-xs font-bold font-mono-data uppercase tracking-wider">
                  Low Stock Warning: {lowStockAlerts.length} variants need restocking
                </div>
                <div className="text-[11px] text-amber-800/80 font-sans-body">
                  Several color finishes have dropped to 3 units or fewer. Restock immediately to prevent sold-out flags.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {lowStockAlerts.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs flex items-center gap-2 shadow-2xs"
                >
                  <span className="font-semibold text-neutral-800 truncate max-w-[130px]">
                    {item.productTitle} ({item.finishName})
                  </span>
                  <span className="text-[10px] font-mono-data font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    {item.stockCount} left
                  </span>
                  <button
                    onClick={() => handleQuickRestock(item.productId, item.finishId, item.stockCount)}
                    className="text-[10px] font-mono-data text-emerald-700 hover:text-emerald-900 font-bold underline"
                  >
                    +10 Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4-TAB NAVIGATION BAR */}
        <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono-data uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
              activeTab === "inventory"
                ? "bg-[#161514] text-white shadow-sm"
                : "bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>1. Inventory & Color Stock</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-200">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono-data uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-[#161514] text-white shadow-sm"
                : "bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>2. Orders & Courier Dispatch</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-200">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono-data uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
              activeTab === "coupons"
                ? "bg-[#161514] text-white shadow-sm"
                : "bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <span>3. Promo Codes & Coupons</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-200">
              {coupons.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono-data uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
              activeTab === "analytics"
                ? "bg-[#161514] text-white shadow-sm"
                : "bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>4. Sales & Color Demand Analytics</span>
          </button>
        </div>

        {/* ================================================================== */}
        {/* TAB 1: INVENTORY & COLOR STOCK MANAGEMENT                          */}
        {/* ================================================================== */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            {/* Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
                <div className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400 font-bold flex items-center justify-between">
                  <span>TOTAL UNITS IN STOCK</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="font-serif-editorial text-3xl font-medium text-[#161514] flex items-baseline gap-2">
                  <span className="text-emerald-600 font-bold">{totalUnitsAcrossCatalog}</span>
                  <span className="text-xs font-mono-data text-neutral-500 font-normal">Units</span>
                </div>
                <div className="text-[11px] font-mono-data text-emerald-700 font-semibold">
                  Physical devices across all models & finishes
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
                <div className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400 font-bold">
                  MODELS IN STOCK // TOTAL
                </div>
                <div className="font-serif-editorial text-3xl font-medium text-[#161514] flex items-baseline gap-2">
                  <span className="font-bold">{inStockCount}</span>
                  <span className="text-neutral-400 text-2xl font-light">/ {products.length}</span>
                  <span className="text-xs font-mono-data text-neutral-500 font-normal">Active</span>
                </div>
                <div className="text-[11px] font-mono-data text-neutral-600 font-medium">
                  {inStockCount} of {products.length} models ready for dispatch
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
                <div className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400 font-bold">
                  AMOUNT OF COLORS
                </div>
                <div className="font-serif-editorial text-3xl font-medium text-[#161514] flex items-baseline gap-2">
                  <span className="font-bold">{totalColorsCount}</span>
                  <span className="text-xs font-mono-data text-neutral-500 font-normal">Color Options</span>
                </div>
                <div className="text-[11px] font-mono-data text-neutral-500">
                  Granular stock counts tracked per individual color
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
                <div className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-400 font-bold">
                  TOTAL REVENUE
                </div>
                <div className="font-serif-editorial text-3xl font-medium text-[#161514]">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono-data text-emerald-600 font-semibold">
                  From {orders.length} verified customer orders
                </div>
              </div>
            </div>

            {/* Inventory Table Container */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#FAF8F5]/40">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Search device name, color, slug..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 rounded-full border border-neutral-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="text-[11px] font-mono-data text-neutral-600 bg-white px-3.5 py-2 rounded-xl border border-neutral-200 flex items-center gap-2 shadow-2xs">
                    <span><strong className="text-emerald-700 font-bold">{totalUnitsAcrossCatalog}</strong> total units in stock</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {(["all", "iphones", "macbooks", "airpods", "watches", "accessories"] as ProductCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-mono-data font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? "bg-[#161514] text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-[#FAF8F5]/80 text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 font-bold">
                      <th className="py-3.5 px-4 sm:px-6">Device</th>
                      <th className="py-3.5 px-4">Device Total Stock</th>
                      <th className="py-3.5 px-4">Units in Each Color</th>
                      <th className="py-3.5 px-4">Base Price</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProducts.map((product) => {
                      const totalDeviceUnits = getDeviceTotalStock(product);
                      const colorCount = product.finishes?.length || 1;

                      return (
                        <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors group align-top">
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-start gap-3">
                              <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 p-1.5 flex items-center justify-center shrink-0">
                                <img
                                  src={product.primaryImage}
                                  alt={product.title}
                                  className="max-h-full max-w-full object-contain filter drop-shadow-2xs"
                                />
                              </div>
                              <div>
                                <div className="font-serif-editorial text-base font-semibold text-[#161514]">
                                  {product.title}
                                </div>
                                <div className="text-[10px] font-mono-data text-neutral-400">
                                  /{product.slug}
                                </div>
                                <span className="inline-block mt-1 text-[9px] font-mono-data uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-semibold">
                                  {product.category}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-serif-editorial text-xl font-bold text-[#161514]">
                                  {totalDeviceUnits}
                                </span>
                                <span className="text-[10px] font-mono-data uppercase text-neutral-400">
                                  units
                                </span>
                              </div>
                              <div className="text-[10px] font-mono-data text-neutral-500">
                                across {colorCount} {colorCount === 1 ? "color" : "colors"}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-1.5 max-w-sm">
                              {product.finishes && product.finishes.length > 0 ? (
                                product.finishes.map((finish) => {
                                  const finishStock = getFinishStock(finish);
                                  return (
                                    <div
                                      key={finish.id}
                                      className="flex items-center justify-between gap-3 bg-neutral-50/80 px-2.5 py-1.5 rounded-xl border border-neutral-100 text-[11px]"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span
                                          className="w-3 h-3 rounded-full border border-black/10 shrink-0 shadow-2xs"
                                          style={{ backgroundColor: finish.colorCode }}
                                        />
                                        <span className="font-medium text-neutral-800 truncate">
                                          {finish.name}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0 font-mono-data">
                                        <button
                                          onClick={() => updateColorStock(product.id, finish.id, finishStock - 1)}
                                          className="w-5 h-5 rounded bg-white hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center font-bold text-neutral-700"
                                          title="Decrease stock"
                                        >
                                          −
                                        </button>
                                        <span
                                          className={`w-7 text-center font-bold ${
                                            finishStock <= 3
                                              ? "text-rose-600 bg-rose-50 rounded px-1"
                                              : "text-neutral-900"
                                          }`}
                                        >
                                          {finishStock}
                                        </span>
                                        <button
                                          onClick={() => updateColorStock(product.id, finish.id, finishStock + 1)}
                                          className="w-5 h-5 rounded bg-white hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center font-bold text-neutral-700"
                                          title="Increase stock"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <span className="text-neutral-400 font-mono-data text-[10px]">
                                  Single configuration ({product.stockQuantity || 12} units)
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono-data font-semibold text-neutral-900">
                            ${product.basePrice}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => toggleStockStatus(product.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-mono-data uppercase tracking-wider font-bold transition-all ${
                                product.inStock && totalDeviceUnits > 0
                                  ? "bg-emerald-50 text-[#059669] border border-emerald-200"
                                  : "bg-rose-50 text-rose-600 border border-rose-200"
                              }`}
                            >
                              {product.inStock && totalDeviceUnits > 0 ? "In Stock" : "Sold Out"}
                            </button>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(product)}
                                className="px-3 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-mono-data text-neutral-700 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete ${product.title} from catalog?`)) {
                                    deleteProduct(product.id);
                                    showToast(`Deleted ${product.title}`);
                                  }
                                }}
                                className="px-3 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-rose-50 text-[11px] font-mono-data text-neutral-400 hover:text-rose-600 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: ORDERS & COURIER DISPATCH PIPELINE                          */}
        {/* ================================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono-data uppercase tracking-widest text-[#059669] font-bold">
                  Order Management & Delivery Operations
                </div>
                <h2 className="font-serif-editorial text-3xl font-normal text-[#161514] mt-0.5">
                  Customer Orders & Courier Dispatch
                </h2>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(["all", "vault_allocated", "quality_inspected", "courier_dispatched", "out_for_delivery", "delivered"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono-data uppercase tracking-wider font-semibold transition-all ${
                      orderFilter === st
                        ? "bg-[#161514] text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                    }`}
                  >
                    {st === "all" ? "All Orders" : st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-[#FAF8F5]/80 text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 font-bold">
                      <th className="py-3.5 px-4 sm:px-6">Order ID & Date</th>
                      <th className="py-3.5 px-4">Client</th>
                      <th className="py-3.5 px-4">Items & Add-Ons</th>
                      <th className="py-3.5 px-4">Fulfillment</th>
                      <th className="py-3.5 px-4">Total Paid</th>
                      <th className="py-3.5 px-4">Status Milestone</th>
                      <th className="py-3.5 px-4 text-right">Pipeline Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrders.map((ord) => {
                      const isPickup = ord.shippingMethod === "pickup";
                      return (
                        <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors align-top">
                          <td className="py-4 px-4 sm:px-6 font-mono-data">
                            <div className="font-bold text-[#161514] text-xs">{ord.id}</div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="text-[9px] text-[#059669] font-semibold mt-1">
                              PIN: {ord.courier?.securityPin || "4921"}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-semibold text-neutral-900">{ord.shippingAddress.fullName}</div>
                            <div className="text-[11px] font-mono-data text-neutral-500">{ord.shippingAddress.phone}</div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-xs mt-0.5">
                              {ord.shippingAddress.city}, {ord.shippingAddress.country}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-1 max-w-xs">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-semibold text-neutral-800">
                                    {item.quantity}x {item.product.title}
                                  </span>
                                  {item.selectedFinish && (
                                    <span className="text-[10px] font-mono-data text-neutral-400 block">
                                      {item.selectedFinish}
                                    </span>
                                  )}
                                  {item.appleCarePlan && (
                                    <span className="text-[9px] font-mono-data text-[#059669] bg-emerald-50 px-1 rounded block mt-0.5">
                                      + {item.appleCarePlan.name}
                                    </span>
                                  )}
                                  {item.engravingText && (
                                    <span className="text-[9px] font-mono-data text-neutral-500 block">
                                      Engraving: &ldquo;{item.engravingText}&rdquo;
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            {isPickup ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono-data uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold border border-purple-100">
                                Store Pickup
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono-data uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-100">
                                Courier Delivery
                              </span>
                            )}
                            <div className="text-[10px] font-mono-data text-neutral-400 mt-1 truncate max-w-[120px]">
                              {isPickup ? ord.pickupBranch?.name || "Boutique Pickup" : "Courier Van #12"}
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono-data">
                            <div className="font-bold text-[#161514] text-sm">${ord.totalAmount}</div>
                            {ord.discountAmount ? (
                              <div className="text-[10px] text-[#059669] font-semibold">
                                Saved -${ord.discountAmount}
                              </div>
                            ) : null}
                            <div className="text-[10px] text-neutral-400 uppercase mt-0.5">
                              {ord.paymentMethod}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono-data uppercase tracking-wider font-bold ${
                              ord.status === "delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "courier_dispatched"
                                ? "bg-indigo-100 text-indigo-800"
                                : ord.status === "quality_inspected"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-neutral-100 text-neutral-700"
                            }`}>
                              {ord.statusLabel || ord.status.replace("_", " ")}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Milestone Steppers */}
                              {ord.status === "vault_allocated" && (
                                <button
                                  onClick={() => handleAdvanceStatus(ord.id, "quality_inspected")}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-mono-data text-[10px] font-bold uppercase transition-colors"
                                >
                                  Pass Inspection
                                </button>
                              )}

                              {ord.status === "quality_inspected" && (
                                <button
                                  onClick={() => handleOpenDispatch(ord)}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono-data text-[10px] font-bold uppercase transition-colors"
                                >
                                  Dispatch Courier
                                </button>
                              )}

                              {ord.status === "courier_dispatched" && (
                                <button
                                  onClick={() => handleAdvanceStatus(ord.id, "out_for_delivery")}
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono-data text-[10px] font-bold uppercase transition-colors"
                                >
                                  Out for Delivery
                                </button>
                              )}

                              {ord.status === "out_for_delivery" && (
                                <button
                                  onClick={() => handleAdvanceStatus(ord.id, "delivered")}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono-data text-[10px] font-bold uppercase transition-colors"
                                >
                                  Mark Delivered
                                </button>
                              )}

                              {/* Official Tax Invoice */}
                              <button
                                onClick={() => setSelectedInvoiceOrder(ord)}
                                className="px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 font-mono-data text-[10px] font-bold uppercase transition-colors"
                              >
                                Tax Invoice
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: PROMO CODES & DISCOUNT COUPON MANAGER                       */}
        {/* ================================================================== */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono-data uppercase tracking-widest text-[#059669] font-bold">
                  Marketing Campaigns & Discount Vouchers
                </div>
                <h2 className="font-serif-editorial text-3xl font-normal text-[#161514] mt-0.5">
                  Promotional Coupons & Trade-In Manager
                </h2>
              </div>

              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#161514] hover:bg-neutral-800 text-white font-mono-data text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
              >
                <span>+ Create Coupon</span>
              </button>
            </div>

            {/* Coupons Table */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-[#FAF8F5]/80 text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 font-bold">
                      <th className="py-3.5 px-4 sm:px-6">Coupon Code</th>
                      <th className="py-3.5 px-4">Discount Value</th>
                      <th className="py-3.5 px-4">Min. Spend</th>
                      <th className="py-3.5 px-4">Usage Count</th>
                      <th className="py-3.5 px-4">Expiry Date</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono-data">
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-bold text-sm text-[#161514] tracking-wider">
                            {coupon.code}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-sans-body">
                            {coupon.description}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-[#059669] text-sm">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}% OFF`
                              : `$${coupon.discountValue} USD`}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-neutral-600">
                          {coupon.minSpend ? `$${coupon.minSpend} USD` : "None"}
                        </td>

                        <td className="py-4 px-4 text-neutral-600">
                          {coupon.usedCount} / {coupon.maxUses || "∞"} uses
                        </td>

                        <td className="py-4 px-4 text-neutral-600">
                          {coupon.expiryDate || "Never"}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => toggleCouponStatus(coupon.id)}
                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold transition-all ${
                              coupon.isActive
                                ? "bg-emerald-50 text-[#059669] border border-emerald-200"
                                : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                            }`}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete coupon "${coupon.code}"?`)) {
                                deleteCoupon(coupon.id);
                                showToast(`Deleted coupon "${coupon.code}".`);
                              }
                            }}
                            className="px-3 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors text-[11px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: SALES & COLOR DEMAND ANALYTICS                              */}
        {/* ================================================================== */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <div className="text-[10px] font-mono-data uppercase tracking-widest text-[#059669] font-bold">
                Performance Telemetry & Customer Choices
              </div>
              <h2 className="font-serif-editorial text-3xl font-normal text-[#161514] mt-0.5">
                Sales Velocity & Color Demand Analytics
              </h2>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1">
                <div className="text-[10px] font-mono-data uppercase text-neutral-400 font-bold">Total Gross Revenue</div>
                <div className="font-serif-editorial text-3xl font-bold text-[#161514]">${totalRevenue.toLocaleString()}</div>
                <div className="text-[11px] font-mono-data text-emerald-600 font-semibold">+18.4% from last period</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1">
                <div className="text-[10px] font-mono-data uppercase text-neutral-400 font-bold">Average Order Value (AOV)</div>
                <div className="font-serif-editorial text-3xl font-bold text-[#161514]">
                  ${Math.round(totalRevenue / Math.max(1, orders.length)).toLocaleString()}
                </div>
                <div className="text-[11px] font-mono-data text-neutral-500">AppleCare+ elevates AOV by 22%</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1">
                <div className="text-[10px] font-mono-data uppercase text-neutral-400 font-bold">Orders Processed</div>
                <div className="font-serif-editorial text-3xl font-bold text-[#161514]">{orders.length}</div>
                <div className="text-[11px] font-mono-data text-[#059669] font-semibold">100% on-time dispatch rate</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1">
                <div className="text-[10px] font-mono-data uppercase text-neutral-400 font-bold">In-Store Pickup Share</div>
                <div className="font-serif-editorial text-3xl font-bold text-[#161514]">
                  {Math.round((orders.filter(o => o.shippingMethod === "pickup").length / Math.max(1, orders.length)) * 100)}%
                </div>
                <div className="text-[11px] font-mono-data text-purple-700 font-semibold">Ready in 2 hours adoption</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* SVG Revenue Velocity Chart (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif-editorial text-2xl font-normal text-[#161514]">
                    Weekly Revenue Velocity
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono-data uppercase tracking-wider mt-0.5">
                    USD Gross Sales Over Last 7 Weeks
                  </p>
                </div>

                <div className="h-64 w-full flex items-end justify-between gap-3 pt-4 px-2">
                  {[
                    { week: "W1", amount: 4800, height: "45%" },
                    { week: "W2", amount: 6200, height: "55%" },
                    { week: "W3", amount: 7900, height: "70%" },
                    { week: "W4", amount: 5900, height: "52%" },
                    { week: "W5", amount: 9200, height: "82%" },
                    { week: "W6", amount: 11400, height: "92%" },
                    { week: "W7 (Current)", amount: 14850, height: "100%" },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono-data text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${bar.amount}
                      </div>
                      <div
                        style={{ height: bar.height }}
                        className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ${
                          i === 6
                            ? "bg-emerald-600 hover:bg-emerald-500 shadow-md"
                            : "bg-neutral-800 hover:bg-neutral-700"
                        }`}
                      />
                      <span className="text-[10px] font-mono-data text-neutral-500 font-semibold uppercase">
                        {bar.week}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Demand Distribution (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif-editorial text-2xl font-normal text-[#161514]">
                    Colorway Demand Distribution
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono-data uppercase tracking-wider mt-0.5">
                    Customer Preference Breakdown
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { colorName: "Natural Titanium", code: "#9C9589", percent: 48, units: 38 },
                    { colorName: "Black Titanium / Obsidian", code: "#1D1D1F", percent: 28, units: 22 },
                    { colorName: "Desert Titanium / Gold", code: "#C4A882", percent: 14, units: 11 },
                    { colorName: "White Titanium / Silver", code: "#F2F2F2", percent: 10, units: 8 },
                  ].map((color, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: color.code }}
                          />
                          <span className="font-semibold text-neutral-800">{color.colorName}</span>
                        </div>
                        <span className="font-mono-data text-xs font-bold text-neutral-900">
                          {color.percent}% ({color.units} units)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#161514] rounded-full transition-all duration-700"
                          style={{ width: `${color.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-[11px] text-neutral-600">
                  Tip: <strong className="text-neutral-900">Natural Titanium</strong> accounts for almost half of total sales. Maintain at least 15 units buffer in stock.
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ================================================================== */}
      {/* MODAL: OFFICIAL VAT TAX INVOICE                                    */}
      {/* ================================================================== */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans-body">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInvoiceOrder(null)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-neutral-200 z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
            
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-6 mb-6">
              <div>
                <CosmoLogo size="sm" showSubtitle={false} />
                <div className="text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mt-2">
                  OFFICIAL APPLE AUTHORIZED RESELLER
                </div>
                <div className="text-[10px] font-mono-data text-neutral-400">
                  Tax Registration / VAT # EG-392-884-102
                </div>
              </div>
              <div className="text-right font-mono-data">
                <span className="text-xs uppercase bg-neutral-100 px-2.5 py-1 rounded font-bold text-neutral-800">
                  VAT TAX INVOICE
                </span>
                <div className="text-sm font-bold text-[#161514] mt-1.5">{selectedInvoiceOrder.id}</div>
                <div className="text-[10px] text-neutral-400">
                  {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Bill To & Dispatch */}
            <div className="grid grid-cols-2 gap-6 text-xs pb-6 border-b border-neutral-100 font-sans-body">
              <div>
                <div className="text-[10px] font-mono-data uppercase text-neutral-400 font-bold mb-1">
                  Billed & Shipped To
                </div>
                <div className="font-bold text-neutral-900">{selectedInvoiceOrder.shippingAddress.fullName}</div>
                <div className="text-neutral-600">{selectedInvoiceOrder.shippingAddress.phone}</div>
                <div className="text-neutral-500 text-[11px]">
                  {selectedInvoiceOrder.shippingAddress.streetAddress}, {selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.country}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono-data uppercase text-neutral-400 font-bold mb-1">
                  Fulfillment & Verification
                </div>
                <div className="font-semibold text-neutral-800">
                  {selectedInvoiceOrder.shippingMethod === "pickup" ? "Boutique Store Pickup" : "Courier Direct Van"}
                </div>
                <div className="font-mono-data text-[11px] text-[#059669] font-bold">
                  PIN CODE: {selectedInvoiceOrder.courier?.securityPin || "4921"}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono-data">
                  Tracking: {selectedInvoiceOrder.trackingCode}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-4">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-neutral-200 text-[10px] font-mono-data uppercase text-neutral-400 font-bold">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price (USD)</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {selectedInvoiceOrder.items.map((item, idx) => {
                    const price = item.product.basePrice + (item.appleCarePlan?.price || 0);
                    return (
                      <tr key={idx} className="py-2">
                        <td className="py-2.5">
                          <div className="font-bold text-neutral-900">{item.product.title}</div>
                          {item.selectedFinish && (
                            <div className="text-[10px] font-mono-data text-neutral-500">
                              {item.selectedFinish}
                            </div>
                          )}
                          {item.appleCarePlan && (
                            <div className="text-[9px] font-mono-data text-[#059669]">
                              + {item.appleCarePlan.name} (${item.appleCarePlan.price})
                            </div>
                          )}
                          {item.engravingText && (
                            <div className="text-[9px] font-mono-data text-neutral-400">
                              Engraving: &ldquo;{item.engravingText}&rdquo;
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 text-center font-mono-data">{item.quantity}</td>
                        <td className="py-2.5 text-right font-mono-data">${price}</td>
                        <td className="py-2.5 text-right font-mono-data font-bold">${price * item.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financials & VAT Breakdown */}
            <div className="border-t border-neutral-200 pt-4 space-y-1.5 text-xs font-mono-data text-right">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal (Net Amount):</span>
                <span>${selectedInvoiceOrder.subtotal || selectedInvoiceOrder.totalAmount} USD</span>
              </div>
              {selectedInvoiceOrder.discountAmount ? (
                <div className="flex justify-between text-[#059669] font-bold">
                  <span>Discount / Trade-In Credit ({selectedInvoiceOrder.promoCode || "Voucher"}):</span>
                  <span>-${selectedInvoiceOrder.discountAmount} USD</span>
                </div>
              ) : null}
              <div className="flex justify-between text-neutral-600">
                <span>Included 14% VAT:</span>
                <span>${Math.round((selectedInvoiceOrder.totalAmount * 0.14) / 1.14)} USD</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Insured Shipping Fee:</span>
                <span>{selectedInvoiceOrder.shippingCost ? `$${selectedInvoiceOrder.shippingCost} USD` : "FREE"}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200 text-sm font-bold text-[#161514]">
                <span className="uppercase">Grand Total (Inc. VAT):</span>
                <span className="font-serif-editorial text-2xl">${selectedInvoiceOrder.totalAmount} USD</span>
              </div>
            </div>

            {/* Print & Close */}
            <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
              <div className="text-[10px] font-mono-data text-neutral-400 uppercase tracking-wider">
                Official Apple Warranty Document
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-mono-data uppercase font-semibold transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="px-4 py-2 rounded-full border border-neutral-200 hover:bg-neutral-100 text-xs font-mono-data uppercase font-semibold text-neutral-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: DISPATCH COURIER                                            */}
      {/* ================================================================== */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans-body">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDispatchModalOrder(null)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 z-10 animate-fade-in space-y-5">
            <div>
              <div className="text-[10px] font-mono-data uppercase tracking-wider text-[#059669] font-bold">
                Courier Allocation
              </div>
              <h3 className="font-serif-editorial text-2xl font-normal text-[#161514]">
                Dispatch Order {dispatchModalOrder.id}
              </h3>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                  Courier Driver Name
                </label>
                <input
                  type="text"
                  required
                  value={courierForm.name}
                  onChange={(e) => setCourierForm({ ...courierForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                  Vehicle / Transport Details
                </label>
                <input
                  type="text"
                  required
                  value={courierForm.vehicle}
                  onChange={(e) => setCourierForm({ ...courierForm, vehicle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                    Courier Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={courierForm.phone}
                    onChange={(e) => setCourierForm({ ...courierForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black font-mono-data"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                    Delivery Security PIN
                  </label>
                  <input
                    type="text"
                    required
                    value={courierForm.securityPin}
                    onChange={(e) => setCourierForm({ ...courierForm, securityPin: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black font-mono-data font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-mono-data text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono-data uppercase font-bold tracking-wider transition-colors"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: CREATE PROMO COUPON                                         */}
      {/* ================================================================== */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans-body">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCouponModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 z-10 animate-fade-in space-y-5">
            <div>
              <div className="text-[10px] font-mono-data uppercase tracking-wider text-[#059669] font-bold">
                Marketing Discount
              </div>
              <h3 className="font-serif-editorial text-2xl font-normal text-[#161514]">
                Create Promotional Coupon
              </h3>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                  Coupon Code (e.g. VIP20) *
                </label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="SUMMER15"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black font-mono-data font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as "percentage" | "fixed")}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                    Value ({couponType === 'percentage' ? '%' : '$'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none font-mono-data"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                    Min. Spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={couponMinSpend}
                    onChange={(e) => setCouponMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none font-mono-data"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                    Max Uses Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={couponMaxUses}
                    onChange={(e) => setCouponMaxUses(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none font-mono-data"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={couponExpiry}
                  onChange={(e) => setCouponExpiry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none font-mono-data"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                  Public Description
                </label>
                <input
                  type="text"
                  value={couponDescription}
                  onChange={(e) => setCouponDescription(e.target.value)}
                  placeholder="e.g. 15% VIP discount on all Apple hardware"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-mono-data text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#161514] hover:bg-neutral-800 text-white text-xs font-mono-data uppercase font-bold tracking-wider transition-colors"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT                                          */}
      {/* ================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans-body">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 z-10 animate-fade-in max-h-[90vh] overflow-y-auto space-y-6">
            <div>
              <div className="text-[10px] font-mono-data uppercase tracking-wider text-[#059669] font-bold">
                Catalog Operations
              </div>
              <h3 className="font-serif-editorial text-2xl font-normal text-[#161514]">
                {editingProductId ? "Edit Apple Device" : "Add New Apple Device"}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="iPhone 16 Pro Max"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none"
                  >
                    <option value="iphones">iPhones</option>
                    <option value="macbooks">MacBooks</option>
                    <option value="airpods">AirPods</option>
                    <option value="watches">Watches</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                    Base Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none font-mono-data font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 mb-1">
                  Curatorial Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none resize-none"
                />
              </div>

              {/* Color finishes with stock */}
              <div className="pt-2 space-y-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-mono-data uppercase tracking-wider text-neutral-500 font-bold">
                    Color Finishes & Stock Quantities
                  </label>
                </div>

                <div className="space-y-2">
                  {formFinishes.map((fin, fIdx) => (
                    <div key={fin.id || fIdx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: fin.colorCode }} />
                        <span className="font-semibold text-neutral-800">{fin.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono-data text-neutral-500">Stock Units:</span>
                        <input
                          type="number"
                          min={0}
                          value={fin.stockCount}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value));
                            const copy = [...formFinishes];
                            copy[fIdx].stockCount = val;
                            setFormFinishes(copy);
                          }}
                          className="w-16 px-2 py-1 bg-white border border-neutral-200 rounded text-center font-mono-data font-bold text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-mono-data text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#161514] hover:bg-neutral-800 text-white text-xs font-mono-data uppercase font-bold tracking-wider transition-colors shadow-sm"
                >
                  Save Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
