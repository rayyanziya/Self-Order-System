import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({ where: { id: orderId } });

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (existing.status !== "WAITING_PAYMENT") {
    return NextResponse.json(
      { error: "Order is not awaiting payment" },
      { status: 409 }
    );
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "IN_PROGRESS",
      paidAt: new Date(),
    },
    include: {
      items: { include: { menuItem: { select: { name: true, code: true } } } },
    },
  });

  return NextResponse.json({ order });
}
