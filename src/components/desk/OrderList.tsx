"use client";

import type { OrderDTO } from "@/lib/types";

function getCardColor(orderNumber: string): string {
  if (orderNumber.startsWith("AB")) return "bg-purple-600 hover:bg-purple-700";
  if (orderNumber.startsWith("A")) return "bg-orange-500 hover:bg-orange-600";
  return "bg-teal-600 hover:bg-teal-700";
}

interface OrderListProps {
  orders: OrderDTO[];
  selectedId?: number;
  onSelect: (order: OrderDTO) => void;
}

export default function OrderList({ orders, selectedId, onSelect }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-stone-400">
        <div className="text-5xl mb-4">✓</div>
        <p className="text-lg font-medium text-stone-500">No orders waiting</p>
        <p className="text-sm mt-1">All caught up!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2">
      {orders.map((order) => {
        const isSelected = order.id === selectedId;
        return (
          <button
            key={order.id}
            onClick={() => onSelect(order)}
            className={`${getCardColor(order.orderNumber)} text-white rounded-2xl p-6 text-center transition-all active:scale-95
              ${isSelected
                ? "ring-4 ring-offset-2 ring-white shadow-xl scale-105"
                : "hover:brightness-110 shadow-md"
              }`}
          >
            <p className="text-5xl font-black tracking-wider leading-none">
              {order.orderNumber}
            </p>
            <p className="text-sm opacity-80 mt-3 font-medium">
              {order.totalAmount} TL
            </p>
            <p className="text-xs opacity-60 mt-1">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </p>
          </button>
        );
      })}
    </div>
  );
}
