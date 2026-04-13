"use client";

import Image from "next/image";
import type { MenuItemDTO, CartItem } from "@/lib/types";
import { CURRENCY } from "@/lib/constants";

interface MenuItemCardProps {
  item: MenuItemDTO;
  cartItem?: CartItem;
  onAdd: (item: MenuItemDTO) => void;
  onUpdateQty: (menuItemId: number, qty: number) => void;
}

export default function MenuItemCard({
  item,
  cartItem,
  onAdd,
  onUpdateQty,
}: MenuItemCardProps) {
  const qty = cartItem?.quantity ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Food image */}
      {item.imagePath && (
        <div className="relative w-full h-40">
          <Image
            src={item.imagePath}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-stone-900">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-stone-500 mt-0.5">{item.description}</p>
            )}
          </div>
          <span className="shrink-0 text-orange-600 font-bold text-base whitespace-nowrap">
            {item.price} {CURRENCY}
          </span>
        </div>

        <div className="flex items-center justify-end">
          {qty === 0 ? (
            <button
              onClick={() => onAdd(item)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Add
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateQty(item.id, qty - 1)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-base font-semibold w-4 text-center">{qty}</span>
              <button
                onClick={() => onAdd(item)}
                className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
