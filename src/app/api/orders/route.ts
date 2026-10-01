import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { CreateOrderSchema } from "@/lib/validations";
import { calculateVerifiedOrderPricing } from "@/lib/server-pricing";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 50));
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (query) {
      where.OR = [
        { orderNumber: { contains: query } },
        { customerName: { contains: query } },
        { customerEmail: { contains: query } },
        { trackingCode: { contains: query } },
      ];
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      totalCount,
      count: orders.length,
      page,
      limit,
      orders,
    });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Step 1: Runtime input validation with Zod
    const parseResult = CreateOrderSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order data format",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Step 2: Zero-Trust Server-Side Price & Discount Recalculation
    let verifiedPricing;
    try {
      verifiedPricing = await calculateVerifiedOrderPricing({
        rawItems: data.items,
        shippingMethod: data.shippingMethod,
        fulfillmentType: data.fulfillmentType,
        promoCode: data.promoCode,
        tradeInVoucher: data.tradeInVoucher,
      });
    } catch (pricingError: any) {
      return NextResponse.json(
        {
          success: false,
          error: pricingError.message || "Failed to verify item pricing against official catalog",
        },
        { status: 400 }
      );
    }

    const generatedOrderNumber = data.orderNumber || `CSM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedTrackingCode = data.trackingCode || `TRK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedPin = data.securityPin || String(Math.floor(1000 + Math.random() * 9000));

    // Step 3: Concurrency & Atomic Database Transaction
    // Wraps order creation, inventory decrements, and coupon updates in an ACID transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Concurrency check and inventory allocation
      for (const item of verifiedPricing.items) {
        if (item.selectedFinish) {
          await tx.inventoryRecord.upsert({
            where: {
              productId_finishId: {
                productId: item.productId,
                finishId: item.selectedFinish.toLowerCase().replace(/\s+/g, "-"),
              },
            },
            create: {
              productId: item.productId,
              finishId: item.selectedFinish.toLowerCase().replace(/\s+/g, "-"),
              stockCount: Math.max(0, 10 - item.quantity),
            },
            update: {
              stockCount: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // If coupon was verified and used, increment its usage counter
      if (verifiedPricing.appliedCoupon) {
        await tx.coupon.update({
          where: { id: verifiedPricing.appliedCoupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Create permanent verified order
      const order = await tx.order.create({
        data: {
          orderNumber: generatedOrderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          fulfillmentType: data.fulfillmentType,
          shippingMethod: data.shippingMethod,
          streetAddress: data.streetAddress,
          buildingNumber: data.buildingNumber,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
          courierNotes: data.courierNotes,
          pickupBranch: data.pickupBranch,
          // Server-verified financials (never trusting client subtotal/total)
          subtotal: verifiedPricing.subtotal,
          shippingCost: verifiedPricing.shippingCost,
          discountAmount: verifiedPricing.discountAmount,
          promoCode: verifiedPricing.appliedCoupon?.code || data.promoCode,
          tradeInVoucher: data.tradeInVoucher,
          totalAmount: verifiedPricing.totalAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          cardBrand: data.cardBrand,
          cardLast4: data.cardLast4,
          installmentMonths: data.installmentMonths,
          trackingCode: generatedTrackingCode,
          securityPin: generatedPin,
          estimatedDelivery:
            data.estimatedDelivery ||
            (data.shippingMethod === "express" ? "Tomorrow by 2:00 PM" : "2–3 Business Days"),
          items: {
            create: verifiedPricing.items.map((it) => ({
              productId: it.productId,
              productTitle: it.productTitle,
              productCategory: it.productCategory,
              primaryImage: it.primaryImage,
              selectedFinish: it.selectedFinish,
              capacity: it.capacity,
              unitPrice: it.unitPrice,
              quantity: it.quantity,
              appleCareName: it.appleCareName,
              appleCarePrice: it.appleCarePrice,
              engravingText: it.engravingText,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    // Step 4: Asynchronous email delivery with error isolation
    sendOrderConfirmationEmail({
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      customerPhone: newOrder.customerPhone,
      createdAt: newOrder.createdAt,
      status: newOrder.status,
      fulfillmentType: newOrder.fulfillmentType,
      shippingMethod: newOrder.shippingMethod,
      streetAddress: newOrder.streetAddress,
      city: newOrder.city,
      country: newOrder.country,
      trackingCode: newOrder.trackingCode,
      securityPin: newOrder.securityPin,
      subtotal: newOrder.subtotal,
      discountAmount: newOrder.discountAmount,
      shippingCost: newOrder.shippingCost,
      totalAmount: newOrder.totalAmount,
      paymentMethod: newOrder.paymentMethod,
      items: newOrder.items.map((i) => ({
        productTitle: i.productTitle,
        primaryImage: i.primaryImage,
        selectedFinish: i.selectedFinish,
        capacity: i.capacity,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        appleCareName: i.appleCareName,
        appleCarePrice: i.appleCarePrice,
        engravingText: i.engravingText,
      })),
    }).catch((err) => console.error("Email dispatch notification failed:", err));

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
