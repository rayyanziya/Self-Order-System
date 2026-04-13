"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { OrderDTO } from "@/lib/types";
import OrderNumberBadge from "@/components/order/OrderNumberBadge";
import Spinner from "@/components/ui/Spinner";

export default function ConfirmedPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-stone-900">Order Placed!</h1>
          <p className="text-stone-500 mt-1">
            Your order number is below. Head to the payment desk to pay.
          </p>
        </div>

        <OrderNumberBadge number={order.orderNumber} />

        <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-sm text-teal-800 text-center">
          Go to the payment desk, find your number on the screen, and tap it to pay.
        </div>

        <Link
          href={`/order/${orderId}/track`}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-center transition-colors"
        >
          Track My Order
        </Link>
      </main>
    </div>
  );
}
