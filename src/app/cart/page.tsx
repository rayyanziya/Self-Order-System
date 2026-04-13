"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { OrderType } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import CartItemComponent from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { cartItems, total, removeItem, updateQuantity, updateNote, clearCart } = useCart();
  const [orderType, setOrderType] = useState<OrderType>("DINE_IN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          items: cartItems.map((c) => ({
            menuItemId: c.menuItem.id,
            quantity: c.quantity,
            note: c.note ?? null,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to place order");
      }

      const { order } = await res.json();
      clearCart();
      router.push(`/order/${order.id}/confirmed`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/menu" className="text-stone-500 hover:text-stone-700 text-2xl leading-none">
            ←
          </Link>
          <h1 className="text-xl font-bold text-stone-900">Your Cart</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-lg mb-4">Your cart is empty</p>
            <Link href="/menu" className="text-orange-500 hover:text-orange-600 font-medium">
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="bg-white rounded-2xl border border-stone-200 px-4">
              {cartItems.map((item) => (
                <CartItemComponent
                  key={item.menuItem.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQty={updateQuantity}
                  onUpdateNote={updateNote}
                />
              ))}
            </div>

            {/* Dine In / Takeaway toggle */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-stone-600 px-1">How will you dine?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrderType("DINE_IN")}
                  className={`py-4 rounded-xl font-semibold text-base transition-all border-2 ${
                    orderType === "DINE_IN"
                      ? "bg-orange-500 border-orange-500 text-white shadow-md"
                      : "bg-white border-stone-200 text-stone-600 hover:border-orange-300"
                  }`}
                >
                  Dine In
                </button>
                <button
                  onClick={() => setOrderType("TAKEAWAY")}
                  className={`py-4 rounded-xl font-semibold text-base transition-all border-2 ${
                    orderType === "TAKEAWAY"
                      ? "bg-orange-500 border-orange-500 text-white shadow-md"
                      : "bg-white border-stone-200 text-stone-600 hover:border-orange-300"
                  }`}
                >
                  Takeaway
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <CartSummary total={total} onCheckout={handleCheckout} loading={loading} />
          </>
        )}
      </main>
    </div>
  );
}
