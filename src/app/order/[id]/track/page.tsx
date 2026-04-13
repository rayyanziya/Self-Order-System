"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useOrderStatus } from "@/hooks/useOrderStatus";
import OrderStatusTracker from "@/components/order/OrderStatusTracker";
import OrderNumberBadge from "@/components/order/OrderNumberBadge";
import Spinner from "@/components/ui/Spinner";
import StatusBanner from "@/components/ui/StatusBanner";

export default function TrackPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const { order, loading, error } = useOrderStatus(orderId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <StatusBanner type="error" message={error ?? "Order not found"} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-stone-900">Order Status</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
        {/* Order number */}
        <div className="flex justify-center">
          <OrderNumberBadge number={order.orderNumber} />
        </div>

        {/* Ready banner + receipt link */}
        {order.status === "READY" && (
          <div className="space-y-3">
            <StatusBanner
              type="success"
              message="Your order is ready! Please collect it from the desk."
              className="text-center text-base py-4"
            />
            <Link
              href={`/order/${orderId}/receipt`}
              target="_blank"
              className="block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-center transition-colors text-sm"
            >
              View Receipt
            </Link>
          </div>
        )}

        {/* Tracker */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <OrderStatusTracker status={order.status} />
        </div>

        {order.status !== "READY" && (
          <p className="text-center text-xs text-stone-400">
            This page updates automatically every 5 seconds.
          </p>
        )}

        <Link
          href="/menu"
          className="block text-center text-sm text-stone-500 hover:text-stone-700"
        >
          Back to menu
        </Link>
      </main>
    </div>
  );
}
