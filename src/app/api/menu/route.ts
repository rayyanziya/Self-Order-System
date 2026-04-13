import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "true";

  const items = await prisma.menuItem.findMany({
    where: showAll ? undefined : { available: true },
    orderBy: [{ category: "asc" }, { code: "asc" }],
  });

  return NextResponse.json({ items });
}
