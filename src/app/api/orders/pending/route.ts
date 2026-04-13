import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    where: { status: "WAITING_PAYMENT" },
    include: {
      items: { include: { menuItem: { select: { name: true, code: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ orders });
}
