"use client";

import type { OrderDTO } from "@/lib/types";

function getBorderColor(orderNumber: string): string {
  if (orderNumber.startsWith("AB")) return "hover:border-purple-400";
  if (orderNumber.startsWith("A")) return "hover:border-orange-400";
  return "hover:border-teal-400";
}

function getTextColor(orderNumber: string): string {
  if (orderNumber.startsWith("AB")) return "text-purple-700";
  if (orderNumber.startsWith("A")) return "text-orange-600";
  return "text-teal-700";
}

interface OrderListProps {
  orders: OrderDTO[];
  onSelect: (order: OrderDTO) => void;
}

export default function OrderList({ orders, onSelect }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-stone-400">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-medium">No pending orders</p>
        <p className="text-sm mt-1">Waiting for customers...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <button
          key={order.id}
          onClick={() => onSelect(order)}
          className={`bg-white border-2 border-stone-200 ${getBorderColor(order.orderNumber)} rounded-2xl p-6 text-center transition-all hover:shadow-md active:scale-95`}
        >
          <p className={`text-4xl font-black tracking-wider ${getTextColor(order.orderNumber)}`}>
            {order.orderNumber}
          </p>
          <p className="text-sm text-stone-500 mt-2">
            {order.totalAmount} TL · {order.items.length} item
            {order.items.length !== 1 ? "s" : ""}
          </p>
        </button>
      ))}
    </div>
  );
}
