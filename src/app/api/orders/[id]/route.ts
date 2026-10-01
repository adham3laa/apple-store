import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatusUpdateSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id).trim();

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: cleanId }, { orderNumber: cleanId }, { trackingCode: cleanId }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cleanId = decodeURIComponent(id).trim();

    // Validate update payload
    const validation = OrderStatusUpdateSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order status update data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [{ id: cleanId }, { orderNumber: cleanId }],
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.statusLabel && { statusLabel: validatedData.statusLabel }),
        ...(validatedData.courierName && { courierName: validatedData.courierName }),
        ...(validatedData.courierVehicle && { courierVehicle: validatedData.courierVehicle }),
        ...(validatedData.courierPhone && { courierPhone: validatedData.courierPhone }),
        ...(validatedData.trackingCode && { trackingCode: validatedData.trackingCode }),
        ...(validatedData.securityPin && { securityPin: validatedData.securityPin }),
        ...(validatedData.estimatedDelivery && { estimatedDelivery: validatedData.estimatedDelivery }),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
