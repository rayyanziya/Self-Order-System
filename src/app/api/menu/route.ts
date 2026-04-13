import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "true";

  const items = await prisma.menuItem.findMany({
    where: showAll ? undefined : { available: true },
    orderBy: [{ category: "desc" }, { code: "asc" }],
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, name, price, category, description, imagePath } = body;

  if (!code || !name || !price || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!["FOOD", "DRINK"].includes(category)) {
    return NextResponse.json({ error: "category must be FOOD or DRINK" }, { status: 400 });
  }

  try {
    const item = await prisma.menuItem.create({
      data: {
        code: String(code).toUpperCase(),
        name,
        price: Number(price),
        category,
        description: description || null,
        imagePath: imagePath || null,
        available: true,
      },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Code already exists" }, { status: 409 });
  }
}
