"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { OrderDTO } from "@/lib/types";
import KitchenOrderCard from "@/components/kitchen/KitchenOrderCard";
import KitchenFilters from "@/components/kitchen/KitchenFilters";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { POLL_INTERVAL_MS } from "@/lib/constants";

type KitchenFilter = "IN_PROGRESS" | "READY";

export default function KitchenPage() {
  const [allOrders, setAllOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<KitchenFilter>("IN_PROGRESS");
  const [actionId, setActionId] = useState<number | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("kitchen_sound") !== "false";
    }
    return true;
  });

  const soundEnabledRef = useRef(soundEnabled);
  const knownIds = useRef<Set<number>>(new Set());
  const isFirstLoad = useRef(true);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEnabledRef.current = next;
      localStorage.setItem("kitchen_sound", String(next));
      return next;
    });
  };

  const fetchOrders = useCallback(async () => {
    try {
      const [inProg, ready] = await Promise.all([
        fetch("/api/orders?status=IN_PROGRESS&cleared=false").then((r) => r.json()),
        fetch("/api/orders?status=READY&cleared=false").then((r) => r.json()),
      ]);
      const incoming: OrderDTO[] = [...inProg.orders, ...ready.orders];

      // Detect new IN_PROGRESS orders not previously seen
      const newIds = incoming
        .filter((o) => o.status === "IN_PROGRESS" && !knownIds.current.has(o.id))
        .map((o) => o.id);

      if (!isFirstLoad.current && newIds.length > 0 && soundEnabledRef.current) {
        new Audio("/sounds/chime.mp3").play().catch(() => {});
      }

      incoming.forEach((o) => knownIds.current.add(o.id));
      isFirstLoad.current = false;

      setAllOrders(incoming);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleMarkReady = async (orderId: number) => {
    setActionId(orderId);
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READY" }),
      });
      await fetchOrders();
    } finally {
      setActionId(null);
    }
  };

  const handleClearAll = async () => {
    setClearingAll(true);
    try {
      await fetch("/api/orders/clear-all", { method: "PATCH" });
      setAllOrders((prev) => prev.filter((o) => o.status !== "READY"));
    } finally {
      setClearingAll(false);
    }
  };

  const handleClear = async (orderId: number) => {
    setActionId(orderId);
    try {
      await fetch(`/api/orders/${orderId}/clear`, { method: "PATCH" });
      setAllOrders((prev) => prev.filter((o) => o.id !== orderId));
    } finally {
      setActionId(null);
    }
  };

  const inProgressOrders = allOrders.filter((o) => o.status === "IN_PROGRESS");
  const readyOrders = allOrders.filter((o) => o.status === "READY");
  const displayed = filter === "IN_PROGRESS" ? inProgressOrders : readyOrders;

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Kitchen Dashboard</h1>
              <p className="text-sm text-stone-500">GDI — Staff only</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSound}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  soundEnabled
                    ? "border-orange-300 text-orange-600 bg-orange-50"
                    : "border-stone-300 text-stone-400 bg-white"
                }`}
              >
                {soundEnabled ? "🔔 Sound On" : "🔕 Sound Off"}
              </button>
              <KitchenFilters
                active={filter}
                onChange={setFilter}
                inProgressCount={inProgressOrders.length}
                readyCount={readyOrders.length}
              />
              {filter === "READY" && readyOrders.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  loading={clearingAll}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg font-medium">
              No {filter === "IN_PROGRESS" ? "in-progress" : "ready"} orders
            </p>
            {filter === "READY" && (
              <p className="text-sm mt-1">All caught up!</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((order) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                onMarkReady={
                  order.status === "IN_PROGRESS" ? handleMarkReady : undefined
                }
                onClear={order.status === "READY" ? handleClear : undefined}
                loading={actionId === order.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
