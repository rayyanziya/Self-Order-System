import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const menuItemId = parseInt(id, 10);

  if (isNaN(menuItemId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  if (typeof body.available !== "boolean") {
    return NextResponse.json(
      { error: "available must be a boolean" },
      { status: 400 }
    );
  }

  const item = await prisma.menuItem.update({
    where: { id: menuItemId },
    data: { available: body.available },
  });

  return NextResponse.json({ item });
}
