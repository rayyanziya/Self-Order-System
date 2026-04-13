import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") ?? "today";

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (range === "week") {
    // Go back to Monday of the current week
    const day = start.getDay(); // 0 = Sunday
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - diff);
  } else if (range === "month") {
    start.setDate(1);
  }

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: start },
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
