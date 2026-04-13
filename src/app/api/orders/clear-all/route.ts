import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH() {
  const result = await prisma.order.updateMany({
    where: { status: "READY", cleared: false },
    data: { cleared: true },
  });
  return NextResponse.json({ cleared: result.count });
}
