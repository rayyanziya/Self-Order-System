import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/orderNumber";

interface OrderItemInput {
  menuItemId: number;
  quantity: number;
  note?: string | null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items: OrderItemInput[] = body.items;
  const orderType: string =
    body.orderType === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN";

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "items must be a non-empty array" },
      { status: 400 }
    );
  }

  // Fetch menu items to validate and snapshot prices
  const menuItemIds = items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, available: true },
  });

  if (menuItems.length !== menuItemIds.length) {
    return NextResponse.json(
      { error: "One or more items are unavailable or not found" },
      { status: 400 }
    );
  }

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

  const hasFood = items.some(
    (i) => menuItemMap.get(i.menuItemId)?.category === "FOOD"
  );
  const hasDrink = items.some(
    (i) => menuItemMap.get(i.menuItemId)?.category === "DRINK"
  );

  const totalAmount = items.reduce((sum, i) => {
    const menu = menuItemMap.get(i.menuItemId)!;
    return sum + menu.price * i.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const orderNumber = await generateOrderNumber(hasFood, hasDrink, tx);

    return tx.order.create({
      data: {
        orderNumber,
        orderType,
        totalAmount,
        status: "WAITING_PAYMENT",
        items: {
          create: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            unitPrice: menuItemMap.get(i.menuItemId)!.price,
            note: i.note ?? null,
          })),
        },
      },
      include: {
        items: { include: { menuItem: { select: { name: true, code: true } } } },
      },
    });
  });

  return NextResponse.json({ order }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const excludeCleared = req.nextUrl.searchParams.get("cleared") === "false";

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(excludeCleared ? { cleared: false } : {}),
    },
    include: {
      items: { include: { menuItem: { select: { name: true, code: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
