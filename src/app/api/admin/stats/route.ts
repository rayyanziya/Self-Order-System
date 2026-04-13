import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startOfDay },
      status: { not: "WAITING_PAYMENT" },
    },
    select: { status: true, totalAmount: true },
  });

  const total = orders.length;
  const revenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const inProgress = orders.filter((o) => o.status === "IN_PROGRESS").length;
  const ready = orders.filter((o) => o.status === "READY").length;
  const paid = orders.filter((o) => o.status === "PAID").length;

  return NextResponse.json({ total, revenue, inProgress, ready, paid });
}
