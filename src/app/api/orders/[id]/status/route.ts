import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  if (body.status !== "READY") {
    return NextResponse.json(
      { error: "Only READY is a valid status transition from this endpoint" },
      { status: 400 }
    );
  }

  const existing = await prisma.order.findUnique({ where: { id: orderId } });

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (existing.status !== "IN_PROGRESS") {
    return NextResponse.json(
      { error: "Order must be IN_PROGRESS to mark as READY" },
      { status: 409 }
    );
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "READY" },
    include: {
      items: { include: { menuItem: { select: { name: true, code: true } } } },
    },
  });

  return NextResponse.json({ order });
}
