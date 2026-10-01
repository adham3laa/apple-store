import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event: any;

    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        console.error("⚠️ Stripe webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      // Development mode / fallback
      try {
        event = JSON.parse(rawBody);
      } catch (e) {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
      }
    }

    if (!event || !event.id) {
      return NextResponse.json({ error: "Malformed event payload" }, { status: 400 });
    }

    // Enterprise Webhook Deduplication Ledger (Idempotency Guard)
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { id: event.id },
    });

    if (existingEvent) {
      // Event has already been processed by this server; Fast-ACK to avoid re-execution
      return NextResponse.json(
        { received: true, deduplicated: true, processedAt: existingEvent.processedAt },
        { status: 200 }
      );
    }

    // Record this webhook event in the ledger
    await prisma.webhookEvent.create({
      data: {
        id: event.id,
        eventType: event.type || "unknown",
      },
    });

    // Handle event types
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderNumber = session.client_reference_id || session.metadata?.orderNumber;

      if (orderNumber) {
        const existingOrder = await prisma.order.findUnique({
          where: { orderNumber },
        });

        if (existingOrder) {
          const updatedOrder = await prisma.order.update({
            where: { orderNumber },
            data: {
              paymentStatus: "paid",
              status: "payment_verified",
              statusLabel: "Payment Verified (Vault Allocated)",
              stripePaymentIntentId: (session.payment_intent as string) || undefined,
            },
            include: {
              items: true,
            },
          });

          // Trigger confirmation email asynchronously (do not block Stripe ACK)
          sendOrderConfirmationEmail({
            orderNumber: updatedOrder.orderNumber,
            customerName: updatedOrder.customerName,
            customerEmail: updatedOrder.customerEmail,
            customerPhone: updatedOrder.customerPhone,
            createdAt: updatedOrder.createdAt,
            status: updatedOrder.status,
            fulfillmentType: updatedOrder.fulfillmentType,
            shippingMethod: updatedOrder.shippingMethod,
            streetAddress: updatedOrder.streetAddress,
            city: updatedOrder.city,
            country: updatedOrder.country,
            trackingCode: updatedOrder.trackingCode,
            securityPin: updatedOrder.securityPin,
            subtotal: updatedOrder.subtotal,
            discountAmount: updatedOrder.discountAmount,
            shippingCost: updatedOrder.shippingCost,
            totalAmount: updatedOrder.totalAmount,
            paymentMethod: "Stripe (Apple Pay / Card)",
            items: updatedOrder.items.map((i) => ({
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
          }).catch((err) => console.error("Email dispatch failed on webhook:", err));

          console.log(`✅ Order ${orderNumber} verified and idempotent ledger updated.`);
        } else {
          console.warn(`Webhook received for non-existent order number: ${orderNumber}`);
        }
      }
    }

    // Fast-ACK 200 OK
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json({ error: error.message || "Webhook error" }, { status: 500 });
  }
}
