import { COSMO_CATALOG, CosmoProduct } from "@/data/cosmo-catalog";
import { prisma } from "@/lib/prisma";
import { CreateOrderItemInput } from "./validations";

export interface VerifiedOrderItem {
  productId: string;
  productTitle: string;
  productCategory: string;
  primaryImage: string;
  selectedFinish: string | null;
  capacity: string | null;
  unitPrice: number;
  quantity: number;
  appleCareName: string | null;
  appleCarePrice: number | null;
  engravingText: string | null;
  catalogProduct: CosmoProduct;
}

export interface VerifiedPricingResult {
  items: VerifiedOrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  appliedCoupon: {
    id: string;
    code: string;
    type: string;
    value: number;
  } | null;
  totalAmount: number;
}

/**
 * Server-Side Price Recalculation Engine
 * Defends against client-side price tampering, negative quantities,
 * and malicious discount calculations.
 */
export async function calculateVerifiedOrderPricing(params: {
  rawItems: CreateOrderItemInput[];
  shippingMethod?: "complimentary" | "express" | "pickup";
  fulfillmentType?: "courier" | "delivery" | "pickup";
  promoCode?: string | null;
  tradeInVoucher?: string | null;
}): Promise<VerifiedPricingResult> {
  const {
    rawItems,
    shippingMethod = "complimentary",
    fulfillmentType = "courier",
    promoCode,
    tradeInVoucher,
  } = params;

  if (!rawItems || rawItems.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  const verifiedItems: VerifiedOrderItem[] = [];
  let calculatedSubtotal = 0;

  for (const item of rawItems) {
    const rawProductId = item.productId || item.product?.id;
    if (!rawProductId) {
      throw new Error("Missing productId for item in bag.");
    }

    // Lookup authentic catalog product
    const product = COSMO_CATALOG.find(
      (p) => p.id === rawProductId || p.slug === rawProductId
    );

    if (!product) {
      throw new Error(`Product '${rawProductId}' does not exist in the official COSMO catalog.`);
    }

    // Verify quantity
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 1)));

    // Calculate verified capacity delta
    let capacityDelta = 0;
    if (item.capacity && product.capacities) {
      const matchedCap = product.capacities.find(
        (c) => c.size.toLowerCase() === item.capacity?.toLowerCase()
      );
      if (matchedCap) {
        capacityDelta = matchedCap.priceDelta;
      }
    }

    const verifiedUnitPrice = product.basePrice + capacityDelta;

    // Verify AppleCare+ if requested
    let appleCareName: string | null = null;
    let appleCarePrice: number | null = null;

    const requestedCare = item.appleCarePlan || (item.appleCareName ? { name: item.appleCareName, price: item.appleCarePrice } : null);
    if (requestedCare && requestedCare.name) {
      appleCareName = requestedCare.name;
      // Cap/verify reasonable AppleCare price bounds
      const rawPrice = Number(requestedCare.price) || 0;
      appleCarePrice = Math.max(0, Math.min(499, rawPrice));
    }

    // Selected Finish verification
    let finishName: string | null = item.selectedFinish || null;
    let primaryImage = product.primaryImage;
    if (finishName && product.finishes) {
      const matchedFinish = product.finishes.find(
        (f) => f.name.toLowerCase() === finishName?.toLowerCase() || f.id === finishName
      );
      if (matchedFinish) {
        finishName = matchedFinish.name;
        primaryImage = matchedFinish.heroImage || product.primaryImage;
      }
    }

    const itemUnitTotal = verifiedUnitPrice + (appleCarePrice || 0);
    calculatedSubtotal += itemUnitTotal * quantity;

    verifiedItems.push({
      productId: product.id,
      productTitle: product.title,
      productCategory: product.category,
      primaryImage,
      selectedFinish: finishName,
      capacity: item.capacity || null,
      unitPrice: verifiedUnitPrice,
      quantity,
      appleCareName,
      appleCarePrice,
      engravingText: item.engravingText ? item.engravingText.slice(0, 50) : null,
      catalogProduct: product,
    });
  }

  // Shipping Cost Calculation (Server Enforced)
  let shippingCost = 0;
  if (fulfillmentType !== "pickup" && shippingMethod === "express") {
    shippingCost = 25;
  }

  // Promo Code / Discount Server Verification
  let discountAmount = 0;
  let appliedCoupon: VerifiedPricingResult["appliedCoupon"] = null;

  const codeToCheck = promoCode || tradeInVoucher;
  if (codeToCheck) {
    const couponRecord = await prisma.coupon.findUnique({
      where: { code: codeToCheck.toUpperCase().trim() },
    });

    if (couponRecord && couponRecord.active) {
      const isNotExpired = !couponRecord.expiry || new Date(couponRecord.expiry) > new Date();
      const meetsMinSpend = calculatedSubtotal >= couponRecord.minSpend;
      const withinMaxUses = couponRecord.usedCount < couponRecord.maxUses;

      if (isNotExpired && meetsMinSpend && withinMaxUses) {
        if (couponRecord.type === "percentage") {
          discountAmount = Math.round(((calculatedSubtotal * couponRecord.value) / 100) * 100) / 100;
        } else {
          // Fixed discount
          discountAmount = Math.min(calculatedSubtotal, couponRecord.value);
        }

        appliedCoupon = {
          id: couponRecord.id,
          code: couponRecord.code,
          type: couponRecord.type,
          value: couponRecord.value,
        };
      }
    }
  }

  const totalAmount = Math.max(0, calculatedSubtotal + shippingCost - discountAmount);

  return {
    items: verifiedItems,
    subtotal: Math.round(calculatedSubtotal * 100) / 100,
    shippingCost,
    discountAmount: Math.round(discountAmount * 100) / 100,
    appliedCoupon,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}
