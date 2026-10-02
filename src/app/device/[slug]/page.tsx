"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CosmoProduct } from "../../../data/cosmo-catalog";
import { Header } from "../../../components/cosmo/Header";
import { CartDrawer } from "../../../components/cosmo/CartDrawer";
import { Footer } from "../../../components/cosmo/Footer";
import { useCart } from "../../../context/CartContext";
import { useCatalog } from "../../../context/CatalogContext";
import { InstallmentModal } from "../../../components/cosmo/InstallmentModal";
import { TradeInModal } from "../../../components/cosmo/TradeInModal";
import { LaserEngravingStudioModal } from "../../../components/cosmo/LaserEngravingStudioModal";

interface BundleCompanion {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  badgeRole: string;
  description: string;
}

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { products } = useCatalog();
  const cleanSlug = slug ? decodeURIComponent(slug).trim().toLowerCase() : "";

  const SLUG_ALIASES: Record<string, string> = {
    "iphone-air": "iphone-17-air",
    "iphone-17-slim": "iphone-17-air",
    "macbook-pro-m4": "macbook-pro-space-black",
    "macbook-pro": "macbook-pro-space-black",
    "macbook-air-m3": "macbook-air-15-m3",
    "macbook-air": "macbook-air-15-m3",
    "airpods-max": "airpods-max-sculpture",
    "airpods-max-usb-c": "airpods-max-sculpture",
    "apple-watch-ultra-2": "apple-watch-ultra-2-black",
    "watch-ultra-2": "apple-watch-ultra-2-black",
    "apple-watch-s10": "apple-watch-series-10",
    "watch-series-10": "apple-watch-series-10",
    "iphone-16-pro": "iphone-16-pro-titanium",
    "iphone-18": "iphone-18-pro",
  };

  const targetSlug = SLUG_ALIASES[cleanSlug] || cleanSlug;
  const product: CosmoProduct | undefined = products.find(
    item =>
      item.slug.toLowerCase() === targetSlug ||
      item.id.toLowerCase() === targetSlug ||
      item.slug.toLowerCase() === cleanSlug ||
      item.id.toLowerCase() === cleanSlug
  );

  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isEngravingModalOpen, setIsEngravingModalOpen] = useState(false);

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    totalCount,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [selectedFinishIndex, setSelectedFinishIndex] = useState(0);
  const [selectedCapacityIndex, setSelectedCapacityIndex] = useState(0);
  const [selectedImageOverride, setSelectedImageOverride] = useState<string | null>(null);
  const [activeSpecTab, setActiveSpecTab] = useState<number | 'all'>('all');

  // AppleCare+ selection
  const [hasAppleCare, setHasAppleCare] = useState(false);

  // Laser Engraving text
  const [engravingText, setEngravingText] = useState("");

  // Smart 3-Item Bundle companions state
  const [bundleItem1Checked, setBundleItem1Checked] = useState(true);
  const [bundleItem2Checked, setBundleItem2Checked] = useState(true);
  const [bundleItem3Checked, setBundleItem3Checked] = useState(true);

  // Mobile Sticky Floating Bar visibility state
  const [showMobileStickyBar, setShowMobileStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 420) {
        setShowMobileStickyBar(true);
      } else {
        setShowMobileStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col font-sans-body">
        <Header
          cartCount={totalCount}
          onOpenCart={() => setIsCartOpen(true)}
          activeCategory="all"
          onSelectCategory={(cat) => router.push(cat === 'all' ? '/' : `/?category=${cat}`)}
        />
        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center max-w-md mx-auto my-16 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="5" y="2" width="14" height="20" rx="3" />
              <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
            </svg>
          </div>
          <h2 className="font-serif-editorial text-3xl font-normal">Device Not Found</h2>
          <p className="text-xs text-neutral-600 font-sans-body leading-relaxed">
            The device you are looking for may have been updated or moved in our catalog.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-wider font-semibold rounded-full transition-colors"
          >
            Explore All Apple Devices →
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const finishes = product.finishes || [];
  const activeFinish = finishes[selectedFinishIndex];
  const capacities = product.capacities || [];
  const activeCapacity = capacities[selectedCapacityIndex];

  // Dynamic price based on capacity
  const calculatedDevicePrice = product.basePrice + (activeCapacity ? activeCapacity.priceDelta : 0);

  // AppleCare price per category
  const appleCarePrices: Record<string, number> = {
    iphones: 149,
    macbooks: 199,
    airpods: 29,
    watches: 79,
    accessories: 39,
  };
  const appleCareFee = appleCarePrices[product.category] || 99;
  const currentTotal = calculatedDevicePrice + (hasAppleCare ? appleCareFee : 0);

  // Active hero image
  const activeDeviceImage = selectedImageOverride || (activeFinish ? activeFinish.heroImage : product.primaryImage);

  // Engraving eligibility
  const canEngrave = product.category === 'airpods' || product.category === 'accessories' || product.title.toLowerCase().includes('ipad');

  // Smart 3-Item Accessory Companions dynamically mapped by category
  const getBundleCompanions = (): [BundleCompanion, BundleCompanion, BundleCompanion] => {
    if (product.category === 'iphones') {
      return [
        {
          id: "bundle-35w-dual-usbc",
          title: "Apple 35W Dual USB-C Compact Power Adapter",
          price: 59,
          image: "/devices/MX6X3.png",
          category: "accessories",
          badgeRole: "FAST CHARGER",
          description: "Charges iPhone to 50% in 20 min while powering your watch or AirPods."
        },
        {
          id: "bundle-airpods-4-anc",
          title: "AirPods 4 with Active Noise Cancellation",
          price: 179,
          image: "/devices/airpods-4-anc-select-202409.png",
          category: "airpods",
          badgeRole: "AIRPODS AUDIO",
          description: "Personalized Spatial Audio with dynamic head tracking and ANC."
        },
        {
          id: "bundle-magsafe-case-control",
          title: "MagSafe Case with Camera Control",
          price: 49,
          image: "/devices/MM0Y3.png",
          category: "accessories",
          badgeRole: "MAGSAFE CASE",
          description: "Conductive sapphire crystal button interface with drop protection."
        }
      ];
    } else if (product.category === 'macbooks') {
      return [
        {
          id: "bundle-magic-mouse",
          title: "Magic Mouse (USB-C Edition)",
          price: 79,
          image: "/devices/MK0U3.png",
          category: "accessories",
          badgeRole: "WIRELESS MOUSE",
          description: "Multi-Touch surface for fluid gestures and precision scrolling."
        },
        {
          id: "bundle-140w-adapter",
          title: "Apple 140W USB-C Dynamic Power Adapter",
          price: 99,
          image: "/devices/MX6X3.png",
          category: "accessories",
          badgeRole: "FAST CHARGER",
          description: "High-efficiency Gallium Nitride fast charging for sustained performance."
        },
        {
          id: "bundle-leather-sleeve",
          title: "Precision Suede Laptop Sleeve",
          price: 89,
          image: "/devices/MM0Y3.png",
          category: "accessories",
          badgeRole: "PROTECTIVE SLEEVE",
          description: "Handcrafted shock-absorbing protection tailored for MacBook."
        }
      ];
    } else if (product.category === 'watches') {
      return [
        {
          id: "bundle-watch-milanese-band",
          title: "Titanium Milanese Loop Alternate Band",
          price: 99,
          image: "/devices/watch-card-40-s10-202409.png",
          category: "watches",
          badgeRole: "LUXURY BAND",
          description: "Aerospace titanium woven mesh with dual magnetic deployant clasp."
        },
        {
          id: "bundle-magsafe-fast-charger",
          title: "MagSafe Fast Magnetic Wireless Charger (2m)",
          price: 49,
          image: "/devices/MX6Y3.png",
          category: "accessories",
          badgeRole: "FAST CHARGER",
          description: "High-speed magnetic inductive charging up to 25W with Qi2 alignment."
        },
        {
          id: "bundle-airpods-4-anc",
          title: "AirPods 4 with Active Noise Cancellation",
          price: 179,
          image: "/devices/airpods-4-anc-select-202409.png",
          category: "airpods",
          badgeRole: "AIRPODS AUDIO",
          description: "Instant wrist pairing for music playback and calls without your phone."
        }
      ];
    } else if (product.category === 'airpods') {
      return [
        {
          id: "bundle-20w-charger",
          title: "Apple 20W USB-C Power Adapter",
          price: 19,
          image: "/devices/MX6X3.png",
          category: "accessories",
          badgeRole: "WALL CHARGER",
          description: "Compact fast charging brick for rapid battery replenishment."
        },
        {
          id: "bundle-magsafe-charger-puck",
          title: "MagSafe Fast Magnetic Charger (2m)",
          price: 49,
          image: "/devices/MX6Y3.png",
          category: "accessories",
          badgeRole: "WIRELESS PUCK",
          description: "Braided magnetic inductive pad for desk or nightstand charging."
        },
        {
          id: "bundle-polishing-cloth",
          title: "Apple Polishing Cloth & Acoustic Fit Kit",
          price: 19,
          image: "/devices/MM0Y3.png",
          category: "accessories",
          badgeRole: "CARE KIT",
          description: "Non-abrasive microfiber maintenance and acoustic seal care."
        }
      ];
    } else {
      return [
        {
          id: "bundle-35w-dual-usbc",
          title: "Apple 35W Dual USB-C Compact Power Adapter",
          price: 59,
          image: "/devices/MX6X3.png",
          category: "accessories",
          badgeRole: "FAST CHARGER",
          description: "Simultaneous dual-device high-speed power delivery."
        },
        {
          id: "bundle-magsafe-charger",
          title: "Apple MagSafe Fast Charger (2m)",
          price: 49,
          image: "/devices/MX6Y3.png",
          category: "accessories",
          badgeRole: "WIRELESS CHARGER",
          description: "Braided woven 25W magnetic wireless inductive puck."
        },
        {
          id: "bundle-airpods-4-anc",
          title: "AirPods 4 with Active Noise Cancellation",
          price: 179,
          image: "/devices/airpods-4-anc-select-202409.png",
          category: "airpods",
          badgeRole: "AIRPODS AUDIO",
          description: "Premium spatial audio with intelligent noise reduction."
        }
      ];
    }
  };

  const [companion1, companion2, companion3] = getBundleCompanions();

  // Add to Cart handler with AppleCare & Engraving
  const handleAddToCart = () => {
    const finishLabel = activeFinish ? activeFinish.name : undefined;
    const capacityLabel = activeCapacity ? activeCapacity.size : undefined;
    const fullSpecLabel = [finishLabel, capacityLabel].filter(Boolean).join(" // ");

    const carePlan = hasAppleCare
      ? {
          name: "AppleCare+ 2-Year Official Protection",
          price: appleCareFee,
          duration: "2 Years"
        }
      : undefined;

    addToCart(
      { ...product, basePrice: calculatedDevicePrice },
      fullSpecLabel,
      carePlan,
      engravingText.trim() || undefined
    );
  };

  // Add Complete Bundle to Bag (Device + All Selected Companions at 10% Off)
  const handleAddBundleToBag = () => {
    // 1. Add main device
    handleAddToCart();

    // 2. Add companion 1 if checked (with 10% discount)
    if (bundleItem1Checked) {
      const discountedPrice1 = Math.round(companion1.price * 0.9);
      addToCart(
        {
          id: companion1.id,
          slug: companion1.id,
          title: companion1.title,
          curatorialSubtitle: `Included in Smart Essentials Bundle (10% Off · ${companion1.badgeRole})`,
          category: "accessories",
          era: "ACCESSORY BUNDLE 2026",
          designerNote: companion1.description,
          basePrice: discountedPrice1,
          currency: "USD",
          material: "Official Apple Component",
          dimensions: "Standard",
          weight: "50g",
          primaryImage: companion1.image,
          secondaryImage: companion1.image,
          galleryImages: [],
          specHighlights: ["Official Apple Certified", "10% Bundle Savings Applied"],
          technicalDossier: [],
          inStock: true
        },
        "Bundle Edition"
      );
    }

    // 3. Add companion 2 if checked (with 10% discount)
    if (bundleItem2Checked) {
      const discountedPrice2 = Math.round(companion2.price * 0.9);
      addToCart(
        {
          id: companion2.id,
          slug: companion2.id,
          title: companion2.title,
          curatorialSubtitle: `Included in Smart Essentials Bundle (10% Off · ${companion2.badgeRole})`,
          category: "accessories",
          era: "ACCESSORY BUNDLE 2026",
          designerNote: companion2.description,
          basePrice: discountedPrice2,
          currency: "USD",
          material: "Official Apple Component",
          dimensions: "Standard",
          weight: "50g",
          primaryImage: companion2.image,
          secondaryImage: companion2.image,
          galleryImages: [],
          specHighlights: ["Official Apple Certified", "10% Bundle Savings Applied"],
          technicalDossier: [],
          inStock: true
        },
        "Bundle Edition"
      );
    }

    // 4. Add companion 3 if checked (with 10% discount)
    if (bundleItem3Checked) {
      const discountedPrice3 = Math.round(companion3.price * 0.9);
      addToCart(
        {
          id: companion3.id,
          slug: companion3.id,
          title: companion3.title,
          curatorialSubtitle: `Included in Smart Essentials Bundle (10% Off · ${companion3.badgeRole})`,
          category: "accessories",
          era: "ACCESSORY BUNDLE 2026",
          designerNote: companion3.description,
          basePrice: discountedPrice3,
          currency: "USD",
          material: "Official Apple Component",
          dimensions: "Standard",
          weight: "50g",
          primaryImage: companion3.image,
          secondaryImage: companion3.image,
          galleryImages: [],
          specHighlights: ["Official Apple Certified", "10% Bundle Savings Applied"],
          technicalDossier: [],
          inStock: true
        },
        "Bundle Edition"
      );
    }
  };

  // Bundle calculations
  const accessoriesTotal = 
    (bundleItem1Checked ? companion1.price : 0) + 
    (bundleItem2Checked ? companion2.price : 0) +
    (bundleItem3Checked ? companion3.price : 0);
  const bundleSavings = Math.round(accessoriesTotal * 0.1);
  const bundleTotalPrice = currentTotal + accessoriesTotal - bundleSavings;
  const checkedAccessoriesCount = [bundleItem1Checked, bundleItem2Checked, bundleItem3Checked].filter(Boolean).length;

  // Schema.org Structured Data for Google Search Rich Snippets & E-Commerce Crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.curatorialSubtitle || product.designerNote || "Authentic Apple device from COSMO Authorized Apple Reseller",
    image: product.primaryImage.startsWith("http")
      ? product.primaryImage
      : `https://cosmo-store.com${product.primaryImage}`,
    sku: product.id,
    mpn: product.slug,
    brand: {
      "@type": "Brand",
      name: "Apple",
    },
    offers: {
      "@type": "Offer",
      url: `https://cosmo-store.com/device/${product.slug}`,
      priceCurrency: "USD",
      price: calculatedDevicePrice,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "COSMO Luxury Electronics Atelier",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161514] flex flex-col font-sans-body">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navigation Masthead */}
      <Header
        cartCount={totalCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeCategory="all"
        onSelectCategory={() => router.push('/')}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 md:px-12 pt-4 sm:pt-6 pb-2 text-xs tracking-wider text-neutral-500 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono-data text-[11px] uppercase tracking-wider flex-wrap">
          <Link href="/" className="hover:text-black transition-colors font-medium">
            COSMO Store
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="capitalize text-neutral-600">{product.category}</span>
          <span className="text-neutral-300">/</span>
          <span className="text-[#161514] font-semibold truncate max-w-[200px] sm:max-w-none">{product.title}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[#059669] font-mono-data font-medium text-[11px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
          <span>In Stock: Ready to Ship</span>
        </div>
      </div>

      {/* Main Product Showcase Layout */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 py-4 sm:py-8 md:py-12 flex-1">
        
        {/* Mobile Product Title Bar (Shown only on mobile screens directly above the image) */}
        <div className="lg:hidden mb-4 space-y-1">
          <div className="text-[10px] font-mono-data tracking-[0.2em] uppercase text-[#059669] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            <span>ORIGINAL APPLE // MODEL #{product.id}</span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#161514] tracking-tight leading-tight">
            {product.title}
          </h1>
          <p className="text-xs text-neutral-600 font-light leading-relaxed font-sans-body">
            {product.curatorialSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* LEFT COLUMN: Gallery Showcase, Specs, & Bundle Builder (7 cols) */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-12">
            
            {/* Interactive Image Showcase */}
            <div className="space-y-4">
              <div className="w-full h-[320px] sm:h-[400px] md:h-[440px] bg-white rounded-3xl flex items-center justify-center p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all relative overflow-hidden group border border-neutral-100/80">
                {/* Dynamic Ambient Halo Glow matching device finish */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-20 filter blur-3xl rounded-full scale-125"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${activeFinish?.colorCode || '#E5DFD5'} 0%, transparent 70%)`
                  }}
                />

                {/* Layered Hardware Image Stack for 100% Continuous Zero-Flicker Snappy Crossfade */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {finishes.length > 0 ? (
                    finishes.map((finish, fIdx) => {
                      const isFinishActive = selectedImageOverride === null && fIdx === selectedFinishIndex;
                      return (
                        <img
                          key={finish.id}
                          src={finish.heroImage}
                          alt={`${product.title} in ${finish.name}`}
                          className={`absolute inset-0 m-auto max-h-full max-w-full object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-400 ease-out group-hover:scale-[1.03] pointer-events-none ${
                            isFinishActive
                              ? 'opacity-100 scale-100 z-10'
                              : 'opacity-0 scale-[0.985] z-0'
                          }`}
                        />
                      );
                    })
                  ) : (
                    <img
                      src={product.primaryImage}
                      alt={product.title}
                      className="absolute inset-0 m-auto max-h-full max-w-full object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-400 ease-out group-hover:scale-[1.03]"
                    />
                  )}

                  {/* Angle Override Preview (when thumbnail clicked) */}
                  {selectedImageOverride && (
                    <img
                      key={selectedImageOverride}
                      src={selectedImageOverride}
                      alt={`${product.title} angle preview`}
                      className="absolute inset-0 m-auto max-h-full max-w-full object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-400 ease-out opacity-100 scale-100 z-20 group-hover:scale-[1.03] animate-apple-fade-in pointer-events-none"
                    />
                  )}
                </div>

                {/* Laser Engraving Visual Watermark Overlay */}
                {canEngrave && engravingText.trim() && (
                  <button
                    type="button"
                    onClick={() => setIsEngravingModalOpen(true)}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#161514] font-mono-data text-xs tracking-widest uppercase border border-neutral-200/80 shadow-lg hover:bg-black hover:text-white apple-tap-press transition-all flex items-center gap-2 group cursor-pointer z-30"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>Engraved: &ldquo;{engravingText}&rdquo;</span>
                    <span className="text-[10px] text-neutral-400 group-hover:text-neutral-300 font-normal underline">Edit</span>
                  </button>
                )}
              </div>

              {/* Thumbnails Angle Selector Bar */}
              {product.galleryImages && product.galleryImages.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto py-2 hide-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedImageOverride(null)}
                    className={`w-16 h-16 rounded-xl flex-shrink-0 bg-white p-2 transition-all duration-300 apple-tap-press cursor-pointer ${
                      selectedImageOverride === null
                        ? 'ring-2 ring-black shadow-sm scale-105'
                        : 'opacity-70 hover:opacity-100 hover:scale-102 border border-neutral-200/60'
                    }`}
                    title={`${product.title} - ${activeFinish?.name || 'Primary'}`}
                  >
                    <img
                      src={activeFinish?.heroImage || product.primaryImage}
                      alt="Primary view"
                      className="w-full h-full object-contain"
                    />
                  </button>

                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageOverride(img.url)}
                      className={`w-16 h-16 rounded-xl flex-shrink-0 bg-white p-2 transition-all duration-300 apple-tap-press cursor-pointer ${
                        selectedImageOverride === img.url
                          ? 'ring-2 ring-black shadow-sm scale-105'
                          : 'opacity-70 hover:opacity-100 hover:scale-102 border border-neutral-200/60'
                      }`}
                      title={img.caption}
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* DIRECT HARDWARE CONFIGURATION CONSOLE (Color Finishes & Storage Space directly under the picture) */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
                
                {/* 1. FINISH / COLORWAY SELECTOR */}
                {finishes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider">
                      <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                        <span>Finish</span>
                        <span className="text-neutral-300">/</span>
                        <strong className="text-neutral-900 font-bold">{activeFinish?.name}</strong>
                      </span>
                      <span className="text-[11px] font-mono-data text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100/70">
                        {activeFinish?.stockCount !== undefined ? `${activeFinish.stockCount} in stock` : "Available to Ship"}
                      </span>
                    </div>

                    {/* Circular Color Swatches */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {finishes.map((finish, idx) => {
                        const isSelected = idx === selectedFinishIndex;
                        return (
                          <button
                            key={finish.id}
                            type="button"
                            onClick={() => {
                              setSelectedFinishIndex(idx);
                              setSelectedImageOverride(null);
                            }}
                            className={`group relative p-3 rounded-2xl flex items-center gap-2.5 transition-all duration-200 text-left apple-tap-press cursor-pointer border ${
                              isSelected
                                ? 'bg-[#161514] text-white border-[#161514] shadow-md ring-2 ring-[#161514] ring-offset-2 scale-[1.02]'
                                : 'bg-[#FAF8F5] hover:bg-neutral-100 text-neutral-800 border-neutral-200/70 hover:border-neutral-300'
                            }`}
                            title={finish.name}
                          >
                            <span
                              className={`w-5 h-5 rounded-full border border-black/15 shrink-0 shadow-sm transition-transform duration-200 ${
                                isSelected ? 'scale-110 ring-2 ring-white' : 'group-hover:scale-105'
                              }`}
                              style={{ backgroundColor: finish.colorCode }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold truncate leading-tight">
                                {finish.name.replace(' Titanium', '')}
                              </div>
                              <div className={`text-[10px] font-mono-data mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-neutral-400'}`}>
                                {finish.stockCount !== undefined ? `${finish.stockCount} left` : 'Available'}
                              </div>
                            </div>
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. STORAGE SPACE / CAPACITY SELECTOR */}
                {capacities.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider">
                      <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                        <span>Storage Space</span>
                        <span className="text-neutral-300">/</span>
                        <strong className="text-neutral-900 font-bold">{capacities[selectedCapacityIndex]?.size}</strong>
                      </span>
                      <span className="text-[11px] font-mono-data text-neutral-400">
                        Official NVMe Storage
                      </span>
                    </div>

                    {/* Storage Capacity Pill Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {capacities.map((cap, idx) => {
                        const isSelected = idx === selectedCapacityIndex;
                        return (
                          <button
                            key={cap.size}
                            type="button"
                            onClick={() => setSelectedCapacityIndex(idx)}
                            className={`p-3.5 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 apple-tap-press cursor-pointer border text-center ${
                              isSelected
                                ? 'bg-[#161514] text-white border-[#161514] shadow-md ring-2 ring-[#161514] ring-offset-2 scale-[1.02]'
                                : 'bg-[#FAF8F5] hover:bg-neutral-100 text-neutral-800 border-neutral-200/70 hover:border-neutral-300'
                            }`}
                          >
                            <span className="text-sm sm:text-base font-bold tracking-tight">
                              {cap.size}
                            </span>
                            <span className={`text-[10px] font-mono-data uppercase font-semibold ${isSelected ? 'text-emerald-300' : 'text-neutral-400'}`}>
                              {cap.priceDelta === 0 ? 'Included' : `+$${cap.priceDelta}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. DYNAMIC CONFIGURATION SUMMARY & QUICK ACTION */}
                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]/80 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-4 sm:p-5 rounded-b-3xl">
                  <div>
                    <div className="text-[10px] font-mono-data uppercase tracking-widest text-neutral-400 font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                      <span>Configured Price ({activeFinish?.name || 'Selected'} · {activeCapacity?.size || 'Standard'})</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#161514]">
                        ${calculatedDevicePrice} <span className="text-xs font-mono-data font-normal text-neutral-400">USD</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsInstallmentOpen(true)}
                        className="text-[11px] font-mono-data text-[#059669] hover:underline font-semibold cursor-pointer"
                      >
                        • From ${Math.ceil(calculatedDevicePrice / 12)}/mo at 0% APR
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#161514] hover:bg-neutral-800 text-white text-xs font-mono-data uppercase tracking-wider font-semibold apple-tap-press transition-all shadow-sm flex items-center justify-center gap-2.5 group cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] group-hover:scale-125 transition-transform" />
                      <span>Add to Bag</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* MOBILE ONLY: Bespoke Options & Protection (Personalization, AppleCare+, Trade-In) */}
              <div className="lg:hidden space-y-4 pt-1">
                
                {/* Free Laser Engraving Studio */}
                {canEngrave && (
                  <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#161514] text-white flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="currentColor" />
                          </svg>
                        </div>
                        <span className="text-xs font-mono-data uppercase tracking-wider font-bold text-[#161514]">
                          Atelier Laser Engraving
                        </span>
                      </div>
                      <span className="text-[9px] font-mono-data uppercase bg-emerald-50 text-[#059669] px-2 py-0.5 rounded font-bold border border-emerald-100">
                        Complimentary
                      </span>
                    </div>

                    {engravingText ? (
                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-mono-data text-xs font-bold text-[#3D3B39] tracking-wider shadow-2xs shrink-0">
                            {engravingText.slice(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono-data uppercase text-neutral-400">Marking Inscription</div>
                            <div className="text-xs font-bold text-[#161514] truncate font-mono-data tracking-widest">
                              &ldquo;{engravingText}&rdquo;
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsEngravingModalOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-mono-data uppercase font-semibold text-neutral-800 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setEngravingText("")}
                            className="px-2 py-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 text-xs font-mono-data uppercase transition-colors"
                            title="Remove Engraving"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#FAF8F5]/60 rounded-xl border border-neutral-200/60">
                        <div>
                          <div className="text-xs font-semibold text-neutral-800">
                            Personalize your {product.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-sans-body">
                            Add initials, a name, or iconic Apple laser emojis for free.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEngravingModalOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-[#161514] hover:bg-neutral-800 text-white text-xs font-mono-data uppercase tracking-wider font-semibold apple-tap-press transition-all shrink-0 shadow-2xs cursor-pointer text-center"
                        >
                          Personalize →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* AppleCare+ Coverage Selector */}
                <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider">
                    <span className="text-neutral-500 font-medium">AppleCare+ Official Coverage</span>
                    <span className="text-neutral-400 text-[10px]">2-Year Warranty</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasAppleCare(false)}
                      className={`p-3 rounded-xl text-left border transition-all duration-200 apple-tap-press cursor-pointer flex items-center justify-between ${
                        !hasAppleCare 
                          ? 'border-neutral-900 bg-white ring-1 ring-neutral-900 shadow-2xs' 
                          : 'border-neutral-200 bg-[#FAF8F5]/40 hover:bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-neutral-900">Standard Apple 1-Year Warranty</div>
                        <div className="text-[11px] text-neutral-500 font-sans-body">Official Apple hardware warranty included.</div>
                      </div>
                      <span className="font-mono-data text-xs font-semibold text-neutral-400 shrink-0">Included</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasAppleCare(true)}
                      className={`p-3 rounded-xl text-left border transition-all duration-200 apple-tap-press cursor-pointer flex items-center justify-between ${
                        hasAppleCare 
                          ? 'border-neutral-900 bg-white ring-1 ring-neutral-900 shadow-2xs' 
                          : 'border-neutral-200 bg-[#FAF8F5]/40 hover:bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <span>AppleCare+ Comprehensive</span>
                          <span className="text-[9px] font-mono-data uppercase bg-emerald-100 text-[#059669] px-1.5 py-0.5 rounded font-bold">Recommended</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 font-sans-body">
                          Unlimited drops/spills & priority Apple support.
                        </div>
                      </div>
                      <span className="font-mono-data text-xs font-bold text-[#059669] shrink-0">+${appleCareFee}</span>
                    </button>
                  </div>
                </div>

                {/* Apple Trade-In Banner */}
                <div className="p-3.5 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">Apple Trade-In</div>
                      <div className="text-neutral-500 text-[11px]">Get up to $650 credit towards this device</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTradeInOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-mono-data uppercase tracking-wider font-bold border border-neutral-200 text-neutral-800 apple-tap-press transition-colors shrink-0 cursor-pointer"
                  >
                    Estimate →
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2 text-xs text-neutral-500 font-medium">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>100% Genuine factory-sealed Apple device</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Free insured courier delivery or in-store pickup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Official Apple Warranty & coverage lookup eligible</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Curatorial Storytelling Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-[11px] font-mono-data uppercase tracking-[0.24em] text-[#059669] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                <span>PRODUCT OVERVIEW</span>
              </div>
              <p className="font-serif-editorial text-2xl sm:text-3xl text-neutral-800 leading-relaxed font-normal">
                &ldquo;{product.designerNote}&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono-data text-neutral-500 pt-2 font-medium">
                <span>MATERIAL // <strong className="text-neutral-900">{product.material}</strong></span>
                <span>•</span>
                <span>DIMENSIONS // <strong className="text-neutral-900">{product.dimensions}</strong></span>
                <span>•</span>
                <span>WEIGHT // <strong className="text-neutral-900">{product.weight}</strong></span>
              </div>
            </div>

            {/* FREQUENTLY BOUGHT TOGETHER / SMART ACCESSORY BUNDLE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div>
                  <div className="text-[10px] font-mono-data uppercase tracking-widest text-[#059669] font-bold">
                    Official Apple Smart Pairing
                  </div>
                  <h3 className="font-serif-editorial text-2xl font-normal text-[#161514] mt-0.5">
                    Frequently Bought Together
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-mono-data font-bold border border-emerald-100 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                  <span>Instant 10% Bundle Savings</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 font-sans-body leading-relaxed">
                Smart recommendations for your {product.title}. Complete your setup with official charging, audio, and protective hardware. Select any combination below to receive an instant 10% discount on all selected accessories.
              </p>

              {/* 4-Card Responsive Grid: Main Device + 3 Smart Companion Accessories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                
                {/* 1. Main Device */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-[#FAF8F5]/70 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-mono-data uppercase tracking-wider text-neutral-400 font-bold">
                      THIS DEVICE
                    </span>
                    <span className="text-[9px] font-mono-data bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded font-bold">
                      Configured
                    </span>
                  </div>
                  <div className="h-16 flex items-center justify-center">
                    <img src={activeDeviceImage} alt={product.title} className="max-h-full max-w-full object-contain filter drop-shadow-xs" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#161514] truncate">{product.title}</div>
                    <div className="text-xs font-mono-data font-semibold text-neutral-900 mt-0.5">
                      ${calculatedDevicePrice}
                    </div>
                  </div>
                </div>

                {/* 2. Companion 1 */}
                <label className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 apple-tap-press ${
                  bundleItem1Checked ? 'border-neutral-900 bg-white ring-1 ring-neutral-900 shadow-sm scale-[1.01]' : 'border-neutral-200 bg-[#FAF8F5]/30 opacity-60 hover:opacity-90'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-mono-data uppercase tracking-wider text-[#059669] font-bold">
                      {companion1.badgeRole}
                    </span>
                    <input
                      type="checkbox"
                      checked={bundleItem1Checked}
                      onChange={(e) => setBundleItem1Checked(e.target.checked)}
                      className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer transition-transform duration-200"
                    />
                  </div>
                  <div className="h-16 flex items-center justify-center">
                    <img src={companion1.image} alt={companion1.title} className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#161514] line-clamp-1">{companion1.title}</div>
                    <p className="text-[10px] text-neutral-500 font-sans-body line-clamp-1 mt-0.5">{companion1.description}</p>
                    <div className="flex items-center gap-2 mt-1 font-mono-data text-xs">
                      <span className="line-through text-neutral-400">${companion1.price}</span>
                      <span className="font-bold text-[#059669]">${Math.round(companion1.price * 0.9)}</span>
                    </div>
                  </div>
                </label>

                {/* 3. Companion 2 */}
                <label className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 apple-tap-press ${
                  bundleItem2Checked ? 'border-neutral-900 bg-white ring-1 ring-neutral-900 shadow-sm scale-[1.01]' : 'border-neutral-200 bg-[#FAF8F5]/30 opacity-60 hover:opacity-90'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-mono-data uppercase tracking-wider text-[#059669] font-bold">
                      {companion2.badgeRole}
                    </span>
                    <input
                      type="checkbox"
                      checked={bundleItem2Checked}
                      onChange={(e) => setBundleItem2Checked(e.target.checked)}
                      className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer transition-transform duration-200"
                    />
                  </div>
                  <div className="h-16 flex items-center justify-center">
                    <img src={companion2.image} alt={companion2.title} className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#161514] line-clamp-1">{companion2.title}</div>
                    <p className="text-[10px] text-neutral-500 font-sans-body line-clamp-1 mt-0.5">{companion2.description}</p>
                    <div className="flex items-center gap-2 mt-1 font-mono-data text-xs">
                      <span className="line-through text-neutral-400">${companion2.price}</span>
                      <span className="font-bold text-[#059669]">${Math.round(companion2.price * 0.9)}</span>
                    </div>
                  </div>
                </label>

                {/* 4. Companion 3 */}
                <label className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 apple-tap-press ${
                  bundleItem3Checked ? 'border-neutral-900 bg-white ring-1 ring-neutral-900 shadow-sm scale-[1.01]' : 'border-neutral-200 bg-[#FAF8F5]/30 opacity-60 hover:opacity-90'
                }`}>
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-mono-data uppercase tracking-wider text-[#059669] font-bold">
                      {companion3.badgeRole}
                    </span>
                    <input
                      type="checkbox"
                      checked={bundleItem3Checked}
                      onChange={(e) => setBundleItem3Checked(e.target.checked)}
                      className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer transition-transform duration-200"
                    />
                  </div>
                  <div className="h-16 flex items-center justify-center">
                    <img src={companion3.image} alt={companion3.title} className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#161514] line-clamp-1">{companion3.title}</div>
                    <p className="text-[10px] text-neutral-500 font-sans-body line-clamp-1 mt-0.5">{companion3.description}</p>
                    <div className="flex items-center gap-2 mt-1 font-mono-data text-xs">
                      <span className="line-through text-neutral-400">${companion3.price}</span>
                      <span className="font-bold text-[#059669]">${Math.round(companion3.price * 0.9)}</span>
                    </div>
                  </div>
                </label>

              </div>

              {/* Bundle Total & Action */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono-data text-neutral-500 uppercase">
                    Kit Total ({checkedAccessoriesCount} of 3 accessories selected):
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif-editorial text-2xl font-bold text-[#161514]">
                      ${bundleTotalPrice} USD
                    </span>
                    {bundleSavings > 0 && (
                      <span className="text-xs font-mono-data text-[#059669] font-bold">
                        (You save ${bundleSavings} with 10% bundle savings)
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleAddBundleToBag}
                  className="px-6 py-3.5 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center justify-center gap-2 group shrink-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] group-hover:scale-125 transition-transform" />
                  <span>Add Device + Bundle to Bag</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* DEEP TECHNICAL SPECIFICATIONS */}
            <div className="pt-4 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif-editorial text-3xl font-medium text-[#161514] tracking-tight">
                    Technical Specifications
                  </h3>
                  <p className="text-xs font-mono-data tracking-wider uppercase text-neutral-400 mt-1.5">
                    Full Official Apple Specifications & Metrics
                  </p>
                </div>

                {/* Interactive Specs Category Pill Tabs */}
                {product.technicalDossier && product.technicalDossier.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 hide-scrollbar bg-neutral-100/80 p-1 rounded-full border border-neutral-200/50">
                    <button
                      type="button"
                      onClick={() => setActiveSpecTab('all')}
                      className={`px-3 py-1 rounded-full text-xs font-mono-data uppercase font-semibold transition-all duration-300 apple-tap-press cursor-pointer whitespace-nowrap ${
                        activeSpecTab === 'all'
                          ? 'bg-[#161514] text-white shadow-xs'
                          : 'text-neutral-600 hover:text-black hover:bg-white/60'
                      }`}
                    >
                      All
                    </button>
                    {product.technicalDossier.map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSpecTab(idx)}
                        className={`px-3 py-1 rounded-full text-xs font-mono-data uppercase font-semibold transition-all duration-300 apple-tap-press cursor-pointer whitespace-nowrap ${
                          activeSpecTab === idx
                            ? 'bg-[#161514] text-white shadow-xs'
                            : 'text-neutral-600 hover:text-black hover:bg-white/60'
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Animated Spec Panels */}
              <div key={typeof activeSpecTab === 'number' ? `tab-${activeSpecTab}` : 'tab-all'} className="space-y-6 animate-tab-panel">
                {(activeSpecTab === 'all' 
                  ? product.technicalDossier 
                  : product.technicalDossier.filter((_, idx) => idx === activeSpecTab)
                ).map((category, catIdx) => (
                  <div key={catIdx} className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-neutral-100 transition-all">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                        {category.title}
                      </h4>
                      <span className="text-[10px] font-mono-data text-neutral-400">
                        {category.specs.length} Verified Parameters
                      </span>
                    </div>
                    <div className="divide-y divide-neutral-100">
                      {category.specs.map((spec, specIdx) => (
                        <div key={specIdx} className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-sm transition-colors hover:bg-neutral-50/50 px-2 rounded-lg -mx-2">
                          <span className="text-neutral-500 font-medium sm:w-1/3 text-xs uppercase tracking-wide font-mono-data">
                            {spec.label}
                          </span>
                          <span className="text-neutral-900 font-semibold sm:w-2/3 leading-relaxed">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Purchase & Customization Console (5 cols - Desktop only, mobile has unified console directly under picture) */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-neutral-200/80">
              
              {/* Product Header */}
              <div>
                <div className="text-[10px] font-mono-data tracking-[0.24em] uppercase text-[#059669] font-semibold mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                  <span>ORIGINAL APPLE // MODEL #{product.id}</span>
                </div>
                <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#161514] tracking-tight mb-2 leading-[1.1]">
                  {product.title}
                </h1>
                <p className="text-sm text-neutral-600 font-light leading-relaxed font-sans-body">
                  {product.curatorialSubtitle}
                </p>
              </div>

              {/* FINISH / COLORWAY SELECTOR */}
              {finishes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider">
                    <span className="text-neutral-500 font-medium">Choose Color</span>
                    <div className="flex items-center gap-2">
                      <span key={activeFinish?.name} className="text-black font-bold animate-tab-panel inline-block">
                        {activeFinish?.name}
                      </span>
                      <span className="text-[11px] font-mono-data text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {activeFinish?.stockCount !== undefined ? `${activeFinish.stockCount} in stock` : "Available"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {finishes.map((finish, idx) => {
                      const isSelected = idx === selectedFinishIndex;
                      const stock = finish.stockCount ?? 6;
                      return (
                        <button
                          key={finish.id}
                          onClick={() => {
                            setSelectedFinishIndex(idx);
                            setSelectedImageOverride(null);
                          }}
                          className={`p-3 rounded-xl flex items-center justify-between gap-2 transition-all duration-300 text-left apple-tap-press cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 text-white shadow-md ring-2 ring-neutral-900 ring-offset-2 scale-[1.02] animate-swatch-pop'
                              : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-4 h-4 rounded-full border border-black/10 flex-shrink-0 shadow-sm transition-transform duration-300 ${isSelected ? 'scale-110 ring-1 ring-white/70' : ''}`}
                              style={{ backgroundColor: finish.colorCode }}
                            />
                            <span className="text-xs font-semibold truncate">
                              {finish.name.replace(' Titanium', '')}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono-data shrink-0 ${isSelected ? 'text-emerald-300' : 'text-neutral-400'}`}>
                            {stock > 0 ? `${stock} left` : 'Sold out'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STORAGE / CAPACITY SELECTOR */}
              {capacities.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider">
                    <span className="text-neutral-500 font-medium">Choose Storage</span>
                    <span key={capacities[selectedCapacityIndex]?.size} className="text-black font-bold animate-tab-panel inline-block">
                      {capacities[selectedCapacityIndex]?.size}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {capacities.map((cap, idx) => {
                      const isSelected = idx === selectedCapacityIndex;
                      return (
                        <button
                          key={cap.size}
                          onClick={() => setSelectedCapacityIndex(idx)}
                          className={`py-3 px-2 rounded-xl text-center text-xs font-bold transition-all duration-300 apple-tap-press cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 text-white shadow-md scale-[1.02] animate-swatch-pop ring-1 ring-neutral-900'
                              : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {cap.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FREE LASER ENGRAVING STUDIO */}
              {canEngrave && (
                <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#161514] text-white flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="currentColor" />
                        </svg>
                      </div>
                      <span className="text-xs font-mono-data uppercase tracking-wider font-bold text-[#161514]">
                        Atelier Laser Engraving
                      </span>
                    </div>
                    <span className="text-[9px] font-mono-data uppercase bg-emerald-50 text-[#059669] px-2 py-0.5 rounded font-bold border border-emerald-100">
                      Complimentary
                    </span>
                  </div>

                  {engravingText ? (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-mono-data text-xs font-bold text-[#3D3B39] tracking-wider shadow-2xs shrink-0">
                          {engravingText.slice(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono-data uppercase text-neutral-400">Marking Inscription</div>
                          <div className="text-xs font-bold text-[#161514] truncate font-mono-data tracking-widest">
                            &ldquo;{engravingText}&rdquo;
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsEngravingModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-mono-data uppercase font-semibold text-neutral-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setEngravingText("")}
                          className="px-2 py-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 text-xs font-mono-data uppercase transition-colors"
                          title="Remove Engraving"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#FAF8F5]/60 rounded-xl border border-neutral-200/60">
                      <div>
                        <div className="text-xs font-semibold text-neutral-800">
                          Personalize your {product.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-sans-body">
                          Add initials, a name, or iconic Apple laser emojis for free.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEngravingModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#161514] hover:bg-neutral-800 text-white text-xs font-mono-data uppercase tracking-wider font-semibold apple-tap-press transition-all shrink-0 shadow-2xs cursor-pointer"
                      >
                        Personalize →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* APPLECARE+ PROTECTION PLAN SELECTOR */}
              <div className="pt-3 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-wider">
                  <span className="text-neutral-500 font-medium">AppleCare+ Official Coverage</span>
                  <span className="text-neutral-400 text-[10px]">2-Year Warranty</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasAppleCare(false)}
                    className={`p-3 rounded-2xl text-left border transition-all duration-300 apple-tap-press cursor-pointer flex items-center justify-between ${
                      !hasAppleCare 
                        ? 'border-neutral-900 bg-white ring-1 ring-neutral-900 shadow-2xs' 
                        : 'border-neutral-200 bg-[#FAF8F5]/40 hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900">Standard Apple 1-Year Limited Warranty</div>
                      <div className="text-[11px] text-neutral-500 font-sans-body">Official Apple hardware manufacturer warranty.</div>
                    </div>
                    <span className="font-mono-data text-xs font-semibold text-neutral-400 shrink-0">Included</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasAppleCare(true)}
                    className={`p-3 rounded-2xl text-left border transition-all duration-300 apple-tap-press cursor-pointer flex items-center justify-between ${
                      hasAppleCare 
                        ? 'border-neutral-900 bg-white ring-1 ring-neutral-900 shadow-2xs' 
                        : 'border-neutral-200 bg-[#FAF8F5]/40 hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <span>AppleCare+ Comprehensive Protection</span>
                        <span className="text-[9px] font-mono-data uppercase bg-emerald-100 text-[#059669] px-1.5 py-0.5 rounded font-bold">Recommended</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-sans-body">
                        Unlimited accidental drops/spills, battery replacement, & priority 24/7 Apple support.
                      </div>
                    </div>
                    <span className="font-mono-data text-xs font-bold text-[#059669] shrink-0">+${appleCareFee}</span>
                  </button>
                </div>
              </div>

              {/* TRADE-IN VALUE ESTIMATOR BANNER */}
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-neutral-200/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Apple Trade-In</div>
                    <div className="text-neutral-500 text-[11px]">Get up to $650 credit towards this device</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTradeInOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-[11px] font-mono-data uppercase tracking-wider font-bold border border-neutral-200 text-neutral-800 apple-tap-press transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  Estimate →
                </button>
              </div>

              {/* Pricing & Checkout Action */}
              <div className="pt-4 border-t border-neutral-100 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-mono-data uppercase tracking-[0.2em] text-neutral-400 font-medium">
                    Total Configuration
                  </span>
                  <div className="text-right">
                    <div className="text-3xl font-serif-editorial font-semibold text-[#161514]">
                      ${currentTotal} <span className="text-xs font-mono-data font-normal text-neutral-400">USD</span>
                    </div>
                    <button
                      onClick={() => setIsInstallmentOpen(true)}
                      className="text-[11px] font-mono-data text-[#059669] hover:underline font-semibold flex items-center justify-end gap-1.5 mt-1 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                      <span>From ${Math.ceil(currentTotal / 12)}/mo or 0% installments</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-full bg-[#161514] hover:bg-neutral-800 text-[#FAF8F5] text-xs font-mono-data uppercase tracking-[0.2em] font-semibold apple-tap-press transition-all flex items-center justify-center gap-3 shadow-sm group cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] group-hover:scale-125 transition-transform" />
                  <span>Add to Bag</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>

                <div className="space-y-2 text-xs text-neutral-500 pt-2 font-medium">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>100% Genuine factory-sealed Apple device</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Free insured courier delivery or in-store pickup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Official Apple Warranty & coverage lookup eligible</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-Over Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      {/* Installment Financing Modal */}
      <InstallmentModal
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
        product={product}
        baseAmount={currentTotal}
      />

      {/* Apple Trade-In Modal */}
      <TradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
      />

      {/* Bespoke Laser Engraving Studio Modal */}
      {canEngrave && (
        <LaserEngravingStudioModal
          isOpen={isEngravingModalOpen}
          onClose={() => setIsEngravingModalOpen(false)}
          product={product}
          selectedFinishName={activeFinish?.name}
          initialText={engravingText}
          onSaveEngraving={(val) => setEngravingText(val)}
          onRemoveEngraving={() => setEngravingText("")}
        />
      )}

      {/* Mobile Sticky Floating Purchase Dock */}
      {showMobileStickyBar && (
        <aside
          className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-neutral-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-3 pb-safe animate-apple-fade-in transition-all"
          aria-label="Quick Purchase Action"
        >
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            {/* Device Mini Preview */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 p-1 flex items-center justify-center shrink-0 border border-neutral-200/60">
                <img
                  src={activeFinish?.heroImage || product.primaryImage}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#161514] truncate font-serif-editorial">
                  {product.title}
                </div>
                <div className="text-[10px] font-mono-data text-neutral-500 uppercase truncate">
                  {activeFinish?.name ? activeFinish.name.replace(' Titanium', '') : 'Selected'} · {activeCapacity?.size || 'Standard'}
                </div>
              </div>
            </div>

            {/* Price & Fast Action */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="font-serif-editorial text-base sm:text-lg font-bold text-[#161514] leading-tight">
                  ${calculatedDevicePrice}
                </div>
                <div className="text-[9px] font-mono-data text-[#059669] font-bold uppercase">
                  FREE SHIPPING
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="h-11 px-5 rounded-full bg-[#161514] hover:bg-neutral-800 text-white text-xs font-mono-data uppercase tracking-wider font-semibold shadow-sm apple-tap-press transition-all flex items-center gap-1.5 touch-manipulation cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                <span>Add</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
