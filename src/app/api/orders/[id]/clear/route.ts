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

  if (existing.status !== "READY") {
    return NextResponse.json(
      { error: "Only READY orders can be cleared" },
      { status: 409 }
    );
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { cleared: true },
  });

  return NextResponse.json({ order });
}
