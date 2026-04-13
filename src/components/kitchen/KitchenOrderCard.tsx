"use client";

import type { OrderDTO } from "@/lib/types";
import Button from "@/components/ui/Button";
import { CURRENCY } from "@/lib/constants";

interface KitchenOrderCardProps {
  order: OrderDTO;
  onMarkReady?: (orderId: number) => void;
  onClear?: (orderId: number) => void;
  loading?: boolean;
}

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  return `${mins} mins ago`;
}

function getNumberColor(n: string) {
  if (n.startsWith("AB")) return "text-purple-700";
  if (n.startsWith("A")) return "text-orange-600";
  return "text-teal-700";
}

export default function KitchenOrderCard({
  order,
  onMarkReady,
  onClear,
  loading = false,
}: KitchenOrderCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 p-5 space-y-4 ${
        order.status === "READY"
          ? "border-green-300 bg-green-50"
          : "border-blue-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-2xl font-black ${getNumberColor(order.orderNumber)}`}>
            {order.orderNumber}
          </p>
          <p className="text-xs text-stone-400 mt-0.5">{timeAgo(order.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              order.status === "READY"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {order.status === "READY" ? "Ready" : "In Progress"}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              order.orderType === "TAKEAWAY"
                ? "bg-sky-100 text-sky-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {order.orderType === "TAKEAWAY" ? "Takeaway" : "Dine In"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between text-sm">
              <span className="text-stone-700">
                {item.menuItem.name} × {item.quantity}
              </span>
              <span className="text-stone-500">
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

      <div className="flex justify-between text-sm font-semibold border-t border-stone-100 pt-2">
        <span>Total</span>
        <span className="text-orange-600">
          {order.totalAmount} {CURRENCY}
        </span>
      </div>

      {order.status === "IN_PROGRESS" && onMarkReady && (
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={() => onMarkReady(order.id)}
          loading={loading}
        >
          Mark as Ready
        </Button>
      )}

      {order.status === "READY" && onClear && (
        <Button
          variant="ghost"
          size="md"
          className="w-full text-stone-500"
          onClick={() => onClear(order.id)}
          loading={loading}
        >
          Clear
        </Button>
      )}

      <a
        href={`/order/${order.id}/receipt`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs text-stone-400 hover:text-orange-500 transition-colors pt-1"
      >
        Print Receipt ↗
      </a>
    </div>
  );
}
