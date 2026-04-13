"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MenuItemDTO, OrderDTO } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import CategoryFilter from "@/components/menu/CategoryFilter";
import MenuGrid from "@/components/menu/MenuGrid";
import Spinner from "@/components/ui/Spinner";

type FilterTab = "ALL" | "FOOD" | "DRINK";

function statusLabel(status: string): { text: string; sub: string } {
  if (status === "WAITING_PAYMENT")
    return { text: "waiting for payment", sub: "Please head to the payment desk" };
  if (status === "IN_PROGRESS")
    return { text: "is being prepared", sub: "Kitchen is working on your order" };
  return { text: "is ready!", sub: "Please collect at the counter" };
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("ALL");

  const [activeOrder, setActiveOrder] = useState<OrderDTO | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const { cartItems, itemCount, addItem, updateQuantity } = useCart();

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const savedId = localStorage.getItem("sos_active_order_id");
    if (!savedId) return;
    fetch(`/api/orders/${savedId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.order) {
          setActiveOrder(data.order);
        } else {
          localStorage.removeItem("sos_active_order_id");
        }
      });
  }, []);

  const handleDismiss = () => {
    localStorage.removeItem("sos_active_order_id");
    setDismissed(true);
  };

  const filtered =
    filter === "ALL" ? items : items.filter((i) => i.category === filter);

  const isReady = activeOrder?.status === "READY";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logos/logo.png" alt="GDI logo" width={36} height={36} className="rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-stone-900">GDI</h1>
              <p className="text-xs text-stone-500">Indonesian Street Food</p>
            </div>
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
        {/* Active order banner */}
        {activeOrder && !dismissed && (
          <div
            className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 ${
              isReady
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${
                  isReady ? "bg-green-500" : "bg-blue-500"
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">
                  Order {activeOrder.orderNumber}{" "}
                  {statusLabel(activeOrder.status).text}
                </p>
                <p className="text-xs text-stone-500">
                  {statusLabel(activeOrder.status).sub}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/order/${activeOrder.id}/track`}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg text-white ${
                  isReady
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Track
              </Link>
              <button
                onClick={handleDismiss}
                className="text-stone-400 hover:text-stone-600 text-xl leading-none"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        )}

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
