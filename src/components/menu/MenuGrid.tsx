"use client";

import type { MenuItemDTO, CartItem } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";

interface MenuGridProps {
  items: MenuItemDTO[];
  cartItems: CartItem[];
  onAdd: (item: MenuItemDTO) => void;
  onUpdateQty: (menuItemId: number, qty: number) => void;
}

export default function MenuGrid({
  items,
  cartItems,
  onAdd,
  onUpdateQty,
}: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400">
        No items available in this category.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          cartItem={cartItems.find((c) => c.menuItem.id === item.id)}
          onAdd={onAdd}
          onUpdateQty={onUpdateQty}
        />
      ))}
    </div>
  );
}
