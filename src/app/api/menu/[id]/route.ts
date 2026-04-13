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
  const { name, price, description, imagePath, code } = body;
  const item = await prisma.menuItem.update({
    where: { id: menuItemId },
    data: {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price: Number(price) }),
      ...(description !== undefined && { description }),
      ...(imagePath !== undefined && { imagePath }),
      ...(code !== undefined && { code: String(code).toUpperCase() }),
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const menuItemId = parseInt(id, 10);

  if (isNaN(menuItemId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const usageCount = await prisma.orderItem.count({ where: { menuItemId } });
  if (usageCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete: item has been ordered. Disable it instead." },
      { status: 409 }
    );
  }

  await prisma.menuItem.delete({ where: { id: menuItemId } });
  return NextResponse.json({ ok: true });
}
