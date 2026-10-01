import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { StripeCheckoutSchema } from "@/lib/validations";
import { calculateVerifiedOrderPricing } from "@/lib/server-pricing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Step 1: Input validation via Zod
    const parseResult = StripeCheckoutSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid checkout payload",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      cartItems,
      customerEmail,
      customerName,
      customerPhone,
      shippingDetails,
      promoCode,
      tradeInVoucher,
    } = parseResult.data;

    // Step 2: Server-side pricing recalculation (Zero Client Trust)
    const verified = await calculateVerifiedOrderPricing({
      rawItems: cartItems,
      shippingMethod: shippingDetails?.shippingMethod || "complimentary",
      fulfillmentType: (shippingDetails?.fulfillmentType as any) || "courier",
      promoCode,
      tradeInVoucher,
    });

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const orderNumber = `CSM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingCode = `TRK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const securityPin = String(Math.floor(1000 + Math.random() * 9000));

    // If Stripe is not configured with live credentials, return simulated payment approval flow
    if (!isStripeConfigured) {
      // Save simulated order directly into central database with verified pricing in atomic transaction
      const order = await prisma.$transaction(async (tx) => {
        // Concurrency inventory deduction
        for (const item of verified.items) {
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
                stockCount: { decrement: item.quantity },
              },
            });
          }
        }

        if (verified.appliedCoupon) {
          await tx.coupon.update({
            where: { id: verified.appliedCoupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }

        return tx.order.create({
          data: {
            orderNumber,
            customerName: customerName || "Distinguished Client",
            customerEmail: customerEmail || "client@cosmo-store.com",
            customerPhone: customerPhone || "+1 (555) 019-2834",
            fulfillmentType: shippingDetails?.fulfillmentType || "courier",
            shippingMethod: shippingDetails?.shippingMethod || "complimentary",
            streetAddress: shippingDetails?.streetAddress || "Direct Courier Delivery",
            buildingNumber: shippingDetails?.buildingNumber || "Suite 400",
            city: shippingDetails?.city || "New York",
            country: shippingDetails?.country || "United States",
            postalCode: shippingDetails?.postalCode || "10001",
            courierNotes: shippingDetails?.courierNotes,
            subtotal: verified.subtotal,
            shippingCost: verified.shippingCost,
            discountAmount: verified.discountAmount,
            promoCode: verified.appliedCoupon?.code || promoCode,
            tradeInVoucher,
            totalAmount: verified.totalAmount,
            paymentMethod: "stripe_simulation",
            paymentStatus: "paid",
            cardBrand: "Apple Pay / Visa",
            cardLast4: "4242",
            trackingCode,
            securityPin,
            estimatedDelivery:
              shippingDetails?.shippingMethod === "express" ? "Tomorrow by 2:00 PM" : "2–3 Business Days",
            items: {
              create: verified.items.map((item) => ({
                productId: item.productId,
                productTitle: item.productTitle,
                productCategory: item.productCategory,
                primaryImage: item.primaryImage,
                selectedFinish: item.selectedFinish,
                capacity: item.capacity,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                appleCareName: item.appleCareName,
                appleCarePrice: item.appleCarePrice,
                engravingText: item.engravingText,
              })),
            },
          },
          include: {
            items: true,
          },
        });
      });

      return NextResponse.json({
        success: true,
        mode: "simulation",
        message: "Stripe test mode simulated successfully. Live keys can be added to .env anytime.",
        orderNumber: order.orderNumber,
        redirectUrl: `${origin}/checkout?confirmed=${order.orderNumber}`,
      });
    }

    // Build Stripe Line Items using SERVER-VERIFIED prices
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = verified.items.map((item) => {
      const itemUnitPrice = item.unitPrice + (item.appleCarePrice || 0);
      const descParts = [];
      if (item.selectedFinish) descParts.push(`Finish: ${item.selectedFinish}`);
      if (item.capacity) descParts.push(`Storage: ${item.capacity}`);
      if (item.appleCareName) descParts.push(`AppleCare+ (${item.appleCareName})`);
      if (item.engravingText) descParts.push(`Engraving: "${item.engravingText}"`);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.productTitle} // COSMO Edition`,
            description: descParts.join(" · ") || undefined,
            images: item.primaryImage.startsWith("http")
              ? [item.primaryImage]
              : undefined,
          },
          unit_amount: Math.round(itemUnitPrice * 100), // In cents
        },
        quantity: item.quantity,
      };
    });

    // Add express shipping line item if selected
    if (verified.shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Insured Express Priority Delivery (Next-Day)",
          },
          unit_amount: Math.round(verified.shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create central pending order in database
    const pendingOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || "Client",
        customerEmail: customerEmail || "client@cosmo-store.com",
        customerPhone: customerPhone || "+1 (555) 019-2834",
        fulfillmentType: shippingDetails?.fulfillmentType || "courier",
        shippingMethod: shippingDetails?.shippingMethod || "complimentary",
        streetAddress: shippingDetails?.streetAddress,
        buildingNumber: shippingDetails?.buildingNumber,
        city: shippingDetails?.city,
        country: shippingDetails?.country || "United States",
        postalCode: shippingDetails?.postalCode,
        courierNotes: shippingDetails?.courierNotes,
        subtotal: verified.subtotal,
        shippingCost: verified.shippingCost,
        discountAmount: verified.discountAmount,
        promoCode: verified.appliedCoupon?.code || promoCode,
        tradeInVoucher,
        totalAmount: verified.totalAmount,
        paymentMethod: "stripe",
        paymentStatus: "pending",
        trackingCode,
        securityPin,
        estimatedDelivery:
          shippingDetails?.shippingMethod === "express" ? "Tomorrow by 2:00 PM" : "2–3 Business Days",
        items: {
          create: verified.items.map((item) => ({
            productId: item.productId,
            productTitle: item.productTitle,
            productCategory: item.productCategory,
            primaryImage: item.primaryImage,
            selectedFinish: item.selectedFinish,
            capacity: item.capacity,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            appleCareName: item.appleCareName,
            appleCarePrice: item.appleCarePrice,
            engravingText: item.engravingText,
          })),
        },
      },
    });

    // Create real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      customer_email: customerEmail || undefined,
      client_reference_id: pendingOrder.orderNumber,
      success_url: `${origin}/checkout?session_id={CHECKOUT_SESSION_ID}&confirmed=${pendingOrder.orderNumber}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      metadata: {
        orderNumber: pendingOrder.orderNumber,
        orderId: pendingOrder.id,
      },
    });

    // Attach Stripe session ID to order
    await prisma.order.update({
      where: { id: pendingOrder.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      success: true,
      mode: "live",
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("POST /api/checkout/stripe error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize Stripe checkout" },
      { status: 500 }
    );
  }
}
