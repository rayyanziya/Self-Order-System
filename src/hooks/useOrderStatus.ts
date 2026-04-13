"use client";

import { useState, useEffect } from "react";
import type { OrderDTO } from "@/lib/types";
import { POLL_INTERVAL_MS } from "@/lib/constants";

export function useOrderStatus(orderId: number | null) {
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        if (!cancelled) {
          setOrder(data.order);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrder();

    const interval = setInterval(() => {
      // Stop polling once order is ready
      if (order?.status === "READY") return;
      fetchOrder();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [orderId, order?.status]);

  return { order, loading, error };
}
