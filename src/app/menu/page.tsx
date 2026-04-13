"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MenuItemDTO } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import CategoryFilter from "@/components/menu/CategoryFilter";
import MenuGrid from "@/components/menu/MenuGrid";
import Spinner from "@/components/ui/Spinner";

type FilterTab = "ALL" | "FOOD" | "DRINK";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("ALL");

  const { cartItems, itemCount, addItem, updateQuantity } = useCart();

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "ALL" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-900">SOS Cafe</h1>
            <p className="text-xs text-stone-500">Indonesian Street Food</p>
          </div>
          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <CategoryFilter active={filter} onChange={setFilter} />

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <MenuGrid
            items={filtered}
            cartItems={cartItems}
            onAdd={addItem}
            onUpdateQty={updateQuantity}
          />
        )}
      </main>
    </div>
  );
}
