"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { OrderDTO } from "@/lib/types";
import Spinner from "@/components/ui/Spinner";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReceiptPage() {
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
        <p className="text-stone-400">Receipt not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Print button — hidden when printing */}
      <div className="print:hidden sticky top-0 bg-white border-b border-stone-200 px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-stone-500">Order Receipt</span>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Receipt */}
      <div className="max-w-sm mx-auto px-6 py-8 font-mono text-sm text-stone-900">
        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-xl font-bold tracking-widest uppercase">GDI</h1>
          <p className="text-xs text-stone-500">Indonesian Street Food · Istanbul</p>
          <p className="text-xs text-stone-400">{formatDateTime(order.createdAt)}</p>
        </div>

        <div className="border-t border-dashed border-stone-300 my-4" />

        {/* Order info */}
        <div className="flex justify-between text-xs mb-1">
          <span className="text-stone-500">Order No.</span>
          <span className="font-bold">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between text-xs mb-4">
          <span className="text-stone-500">Service</span>
          <span className="font-semibold">
            {order.orderType === "TAKEAWAY" ? "Takeaway" : "Dine In"}
          </span>
        </div>

        <div className="border-t border-dashed border-stone-300 my-4" />

        {/* Items */}
        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between">
                <span>
                  {item.menuItem.name} × {item.quantity}
                </span>
                <span>{item.unitPrice * item.quantity} TL</span>
              </div>
              {item.note && (
                <p className="text-xs text-stone-400 italic pl-2 mt-0.5">
                  → {item.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-stone-300 my-4" />

        {/* Total */}
        <div className="flex justify-between font-bold text-base mb-6">
          <span>TOTAL</span>
          <span>{order.totalAmount} TL</span>
        </div>

        <div className="border-t border-dashed border-stone-300 my-4" />

        {/* Footer */}
        <div className="text-center space-y-1 text-xs text-stone-400">
          <p>Thank you for dining with us!</p>
          <p>Terima kasih · Teşekkür ederiz</p>
        </div>
      </div>
    </>
  );
}
