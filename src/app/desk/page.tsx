"use client";

import { useState } from "react";
import type { OrderDTO } from "@/lib/types";
import Image from "next/image";
import { usePendingOrders } from "@/hooks/usePendingOrders";
import OrderList from "@/components/desk/OrderList";
import OrderDetailPanel from "@/components/desk/OrderDetailModal";
import Spinner from "@/components/ui/Spinner";

export default function DeskPage() {
  const { orders, loading, error, refetch } = usePendingOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  const handlePaid = () => {
    setSelectedOrder(null);
    refetch();
  };

  const handleDeselect = () => setSelectedOrder(null);

  return (
    <div className="h-screen bg-stone-100 flex flex-col overflow-hidden">
      {/* Top header bar */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logos/logo.png" alt="GDI logo" width={40} height={40} className="rounded-xl" />
            <div>
              <h1 className="text-2xl font-black text-stone-900">GDI</h1>
              <p className="text-sm text-stone-500">Payment Desk</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-stone-700">
              {orders.length} order{orders.length !== 1 ? "s" : ""} waiting
            </p>
            <p className="text-xs text-stone-400 mt-0.5">Auto-refreshing every 5 seconds</p>
          </div>
        </div>
      </header>

      {/* Split body */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL — order number grid */}
        <div className="w-full md:w-[55%] flex flex-col overflow-hidden border-r border-stone-200 bg-white">
          {/* Panel header */}
          <div className="px-6 pt-6 pb-4 shrink-0">
            <h2 className="text-lg font-bold text-stone-900">Orders Waiting</h2>
            <p className="text-sm text-stone-500 mt-0.5">
              Find your order number below and tap it to pay
            </p>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-20">{error}</div>
            ) : (
              <OrderList
                orders={orders}
                selectedId={selectedOrder?.id}
                onSelect={setSelectedOrder}
              />
            )}
          </div>
        </div>

        {/* RIGHT PANEL — order detail + payment (desktop only) */}
        <div className="hidden md:flex md:w-[45%] flex-col bg-stone-50">
          {selectedOrder ? (
            <div className="flex-1 overflow-y-auto p-8">
              <OrderDetailPanel
                order={selectedOrder}
                onPaid={handlePaid}
                onDeselect={handleDeselect}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400 px-8 text-center gap-3">
              <div className="text-6xl">←</div>
              <p className="text-lg font-semibold text-stone-500">
                Tap your order number
              </p>
              <p className="text-sm text-stone-400">
                Your order details and payment will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE — full-screen overlay when an order is selected */}
      {selectedOrder && (
        <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto p-6">
          <OrderDetailPanel
            order={selectedOrder}
            onPaid={handlePaid}
            onDeselect={handleDeselect}
          />
        </div>
      )}
    </div>
  );
}
