"use client";

import type { OrderDTO } from "@/lib/types";
import PaymentSimulator from "./PaymentSimulator";
import { CURRENCY } from "@/lib/constants";

function getNumberColor(orderNumber: string): string {
  if (orderNumber.startsWith("AB")) return "text-purple-600";
  if (orderNumber.startsWith("A")) return "text-orange-500";
  return "text-teal-600";
}

interface OrderDetailPanelProps {
  order: OrderDTO;
  onPaid: () => void;
  onDeselect: () => void;
}

export default function OrderDetailPanel({
  order,
  onPaid,
  onDeselect,
}: OrderDetailPanelProps) {
  const handlePaid = () => {
    onPaid();
    onDeselect();
  };

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-5xl font-black tracking-wider ${getNumberColor(order.orderNumber)}`}>
            {order.orderNumber}
          </p>
          <span
            className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
              order.orderType === "TAKEAWAY"
                ? "bg-sky-100 text-sky-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {order.orderType === "TAKEAWAY" ? "Takeaway" : "Dine In"}
          </span>
        </div>
        <button
          onClick={onDeselect}
          className="text-stone-400 hover:text-stone-600 transition-colors text-sm font-medium mt-1"
        >
          ✕ Close
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3 border-t border-stone-100 pt-4">
        {order.items.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between text-sm">
              <span className="text-stone-700">
                {item.menuItem.name} × {item.quantity}
              </span>
              <span className="font-semibold text-stone-900">
                {item.unitPrice * item.quantity} {CURRENCY}
              </span>
            </div>
            {item.note && (
              <p className="text-xs text-stone-400 italic mt-0.5 pl-1">
                → {item.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center font-bold text-xl border-t border-stone-200 pt-4">
        <span className="text-stone-800">Total</span>
        <span className="text-orange-500 text-2xl">
          {order.totalAmount} {CURRENCY}
        </span>
      </div>

      {/* Payment */}
      <PaymentSimulator
        orderId={order.id}
        totalAmount={order.totalAmount}
        onSuccess={handlePaid}
      />
    </div>
  );
}
