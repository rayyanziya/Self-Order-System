import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE() {
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
  ]);
  return NextResponse.json({ ok: true });
}
