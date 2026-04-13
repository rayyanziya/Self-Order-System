"use client";

import { useState } from "react";
import type { OrderDTO } from "@/lib/types";
import { usePendingOrders } from "@/hooks/usePendingOrders";
import OrderList from "@/components/desk/OrderList";
import OrderDetailModal from "@/components/desk/OrderDetailModal";
import Spinner from "@/components/ui/Spinner";

export default function DeskPage() {
  const { orders, loading, error, refetch } = usePendingOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  const handlePaid = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      {/* Header */}
      <header className="border-b border-stone-700 px-8 py-6">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="text-3xl font-black text-white">SOS Cafe</h1>
            <p className="text-stone-400 mt-0.5">Payment Desk</p>
          </div>
          <div className="text-right">
            <p className="text-stone-400 text-sm">Tap your order number to pay</p>
            <p className="text-stone-500 text-xs mt-0.5">
              {orders.length} order{orders.length !== 1 ? "s" : ""} waiting
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-20">{error}</div>
        ) : (
          <OrderList orders={orders} onSelect={setSelectedOrder} />
        )}
      </main>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onPaid={handlePaid}
      />
    </div>
  );
}
