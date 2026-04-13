import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  const today = new Date().toISOString().slice(0, 10);
  await prisma.dailyCounter.deleteMany({ where: { date: today } });
  return NextResponse.json({ ok: true });
}
