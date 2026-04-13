"use client";

import { useState, useEffect, useCallback } from "react";
import type { OrderDTO } from "@/lib/types";
import { POLL_INTERVAL_MS } from "@/lib/constants";

export function usePendingOrders() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders/pending");
      if (!res.ok) throw new Error("Failed to fetch pending orders");
      const data = await res.json();
      setOrders(data.orders);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
