import { z } from "zod";

/**
 * Item schema for orders and checkout sessions.
 * Enforces strictly positive integers for quantity to prevent negative-quantity attacks.
 */
export const CreateOrderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productTitle: z.string().optional(),
  productCategory: z.string().optional(),
  primaryImage: z.string().optional(),
  selectedFinish: z.string().max(100).optional().nullable(),
  capacity: z.string().max(50).optional().nullable(),
  unitPrice: z.number().nonnegative().optional(), // Client advisory only; recalculated on server
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(20, "Quantity cannot exceed 20 units per device"),
  appleCareName: z.string().max(150).optional().nullable(),
  appleCarePrice: z.number().nonnegative().optional().nullable(),
  engravingText: z.string().max(50, "Engraving cannot exceed 50 characters").optional().nullable(),
  // Support client nested objects if passed from old checkout
  product: z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
      category: z.string().optional(),
      basePrice: z.number().optional(),
      primaryImage: z.string().optional(),
    })
    .optional(),
  appleCarePlan: z
    .object({
      name: z.string().optional(),
      price: z.number().optional(),
      duration: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;

/**
 * Order creation schema for POST /api/orders.
 * Sanitizes input and validates all customer and fulfillment fields.
 */
export const CreateOrderSchema = z.object({
  orderNumber: z.string().max(50).optional(),
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name cannot exceed 100 characters"),
  customerEmail: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters"),
  customerPhone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .max(30, "Phone number cannot exceed 30 digits"),
  fulfillmentType: z
    .enum(["courier", "delivery", "pickup"])
    .default("courier"),
  shippingMethod: z
    .enum(["complimentary", "express", "pickup"])
    .default("complimentary"),
  streetAddress: z.string().max(250).optional().nullable(),
  buildingNumber: z.string().max(50).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).default("United States"),
  postalCode: z.string().max(30).optional().nullable(),
  courierNotes: z.string().max(500).optional().nullable(),
  pickupBranch: z.string().max(100).optional().nullable(),
  
  // Financial fields (Advisory from client; strictly verified by server)
  subtotal: z.number().nonnegative().optional(),
  shippingCost: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  promoCode: z.string().trim().max(50).optional().nullable(),
  tradeInVoucher: z.string().trim().max(50).optional().nullable(),
  totalAmount: z.number().nonnegative().optional(),
  
  // Payment
  paymentMethod: z
    .enum(["card", "stripe", "apple_pay", "installments", "cod", "stripe_simulation"])
    .default("card"),
  paymentStatus: z
    .enum(["paid", "pending", "failed"])
    .default("paid"),
  cardBrand: z.string().max(50).optional().nullable(),
  cardLast4: z
    .string()
    .regex(/^\d{4}$/, "Card last 4 must be 4 digits")
    .optional()
    .nullable(),
  installmentMonths: z
    .number()
    .int()
    .min(3)
    .max(36)
    .optional()
    .nullable(),

  // Tracking
  trackingCode: z.string().max(50).optional(),
  securityPin: z.string().max(10).optional(),
  estimatedDelivery: z.string().max(100).optional(),

  // Line items
  items: z
    .array(CreateOrderItemSchema)
    .min(1, "Order must contain at least 1 item")
    .max(50, "Order cannot contain more than 50 line items"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

/**
 * Stripe checkout initialization schema for POST /api/checkout/stripe
 */
export const StripeCheckoutSchema = z.object({
  cartItems: z
    .array(CreateOrderItemSchema)
    .min(1, "Shopping bag is empty"),
  customerEmail: z.string().trim().email().optional().nullable(),
  customerName: z.string().trim().max(100).optional().nullable(),
  customerPhone: z.string().trim().max(30).optional().nullable(),
  shippingDetails: z
    .object({
      fulfillmentType: z.string().optional(),
      shippingMethod: z.enum(["complimentary", "express", "pickup"]).optional(),
      streetAddress: z.string().max(250).optional().nullable(),
      buildingNumber: z.string().max(50).optional().nullable(),
      city: z.string().max(100).optional().nullable(),
      country: z.string().max(100).optional().nullable(),
      postalCode: z.string().max(30).optional().nullable(),
      courierNotes: z.string().max(500).optional().nullable(),
    })
    .optional()
    .nullable(),
  discountAmount: z.number().nonnegative().optional(),
  promoCode: z.string().trim().max(50).optional().nullable(),
  tradeInVoucher: z.string().trim().max(50).optional().nullable(),
});

export type StripeCheckoutInput = z.infer<typeof StripeCheckoutSchema>;

/**
 * Order status update schema for PATCH /api/orders/[id]
 */
export const OrderStatusUpdateSchema = z.object({
  status: z.enum([
    "vault_allocated",
    "quality_inspected",
    "payment_verified",
    "courier_dispatched",
    "out_for_delivery",
    "delivered",
  ]),
  statusLabel: z.string().max(100).optional(),
  courierName: z.string().max(100).optional(),
  courierVehicle: z.string().max(100).optional(),
  courierPhone: z.string().max(30).optional(),
  trackingCode: z.string().max(50).optional(),
  securityPin: z.string().max(10).optional(),
  estimatedDelivery: z.string().max(100).optional(),
});

export type OrderStatusUpdateInput = z.infer<typeof OrderStatusUpdateSchema>;
