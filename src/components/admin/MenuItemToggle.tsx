"use client";

import type { MenuItemDTO } from "@/lib/types";
import { CURRENCY } from "@/lib/constants";

interface MenuItemToggleProps {
  item: MenuItemDTO;
  onToggle: (id: number, available: boolean) => void;
  loading: boolean;
}

export default function MenuItemToggle({
  item,
  onToggle,
  loading,
}: MenuItemToggleProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 bg-white rounded-xl border px-4 py-3 transition-opacity ${
        !item.available ? "opacity-50" : ""
      } ${item.available ? "border-stone-200" : "border-stone-300"}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-400">{item.code}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
              item.category === "FOOD"
                ? "bg-orange-100 text-orange-700"
                : "bg-teal-100 text-teal-700"
            }`}
          >
            {item.category}
          </span>
        </div>
        <p className="font-medium text-stone-900 mt-0.5">{item.name}</p>
        <p className="text-sm text-stone-500">
          {item.price} {CURRENCY}
        </p>
      </div>

      <button
        onClick={() => onToggle(item.id, !item.available)}
        disabled={loading}
        className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:cursor-not-allowed ${
          item.available ? "bg-orange-500" : "bg-stone-300"
        }`}
        aria-label={item.available ? "Disable item" : "Enable item"}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            item.available ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
