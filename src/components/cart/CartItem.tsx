"use client";

import { useState } from "react";
import type { CartItem as CartItemType } from "@/lib/types";
import { CURRENCY } from "@/lib/constants";

interface CartItemProps {
  item: CartItemType;
  onRemove: (menuItemId: number) => void;
  onUpdateQty: (menuItemId: number, qty: number) => void;
  onUpdateNote: (menuItemId: number, note: string) => void;
}

export default function CartItem({
  item,
  onRemove,
  onUpdateQty,
  onUpdateNote,
}: CartItemProps) {
  const { menuItem, quantity, note } = item;
  const [showNote, setShowNote] = useState(!!note);

  return (
    <div className="py-4 border-b border-stone-100 last:border-0 space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="font-medium text-stone-900">{menuItem.name}</p>
          <p className="text-sm text-stone-500">
            {menuItem.price} {CURRENCY} each
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQty(menuItem.id, quantity - 1)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center"
          >
            -
          </button>
          <span className="w-5 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => onUpdateQty(menuItem.id, quantity + 1)}
            className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center"
          >
            +
          </button>
        </div>

        <div className="text-right min-w-[70px]">
          <p className="font-semibold text-stone-900">
            {menuItem.price * quantity} {CURRENCY}
          </p>
          <button
            onClick={() => onRemove(menuItem.id)}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Note section */}
      {showNote ? (
        <input
          type="text"
          value={note ?? ""}
          onChange={(e) => onUpdateNote(menuItem.id, e.target.value)}
          placeholder={
            menuItem.category === "DRINK"
              ? "e.g. less sugar, more ice..."
              : "e.g. extra spicy, no onion..."
          }
          className="w-full text-sm border border-stone-200 rounded-lg px-3 py-1.5 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          autoFocus
        />
      ) : (
        <button
          onClick={() => setShowNote(true)}
          className="text-xs text-stone-400 hover:text-orange-500 transition-colors"
        >
          + Add note for kitchen
        </button>
      )}
    </div>
  );
}
