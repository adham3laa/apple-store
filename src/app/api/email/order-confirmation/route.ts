import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber } = body;

    if (!orderNumber) {
      return NextResponse.json({ error: "orderNumber is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const result = await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      createdAt: order.createdAt,
      status: order.status,
      fulfillmentType: order.fulfillmentType,
      shippingMethod: order.shippingMethod,
      streetAddress: order.streetAddress,
      city: order.city,
      country: order.country,
      trackingCode: order.trackingCode,
      securityPin: order.securityPin,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingCost: order.shippingCost,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      items: order.items.map((i) => ({
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
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("POST /api/email/order-confirmation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
