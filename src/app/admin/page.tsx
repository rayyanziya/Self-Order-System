"use client";

import { useEffect, useState } from "react";
import type { MenuItemDTO } from "@/lib/types";
import MenuItemToggle from "@/components/admin/MenuItemToggle";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

interface DailyStats {
  total: number;
  revenue: number;
  inProgress: number;
  ready: number;
  paid: number;
}

export default function AdminPage() {
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const [stats, setStats] = useState<DailyStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch("/api/menu?all=true")
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  const fetchStats = () => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setStatsLoading(false));
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (id: number, available: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/menu/${id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available }),
      });
      if (res.ok) {
        const { item } = await res.json();
        setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      }
    } finally {
      setTogglingId(null);
    }
  };

  const handleResetCounter = async () => {
    setResetting(true);
    try {
      await fetch("/api/admin/reset-counter", { method: "POST" });
      setResetConfirm(false);
    } finally {
      setResetting(false);
    }
  };

  const statCards = stats
    ? [
        { label: "Orders Today", value: stats.total },
        {
          label: "Revenue",
          value: `${stats.revenue.toLocaleString()} TL`,
        },
        { label: "In Progress", value: stats.inProgress },
        { label: "Ready / Paid", value: stats.ready + stats.paid },
      ]
    : [];

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Staff access only — do not share this URL with customers.
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Daily Stats */}
        <section>
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Today&apos;s Overview
          </h2>
          {statsLoading ? (
            <div className="flex justify-center py-6">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-xl border border-stone-200 p-4"
                >
                  <p className="text-xs text-stone-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-stone-900">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reset Order Counter */}
        <section className="bg-white rounded-xl border border-stone-200 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-stone-900">
            Order Number Counter
          </h2>
          <p className="text-xs text-stone-500">
            Reset at the end of the day so tomorrow&apos;s orders start from -001 again.
          </p>
          {resetConfirm ? (
            <div className="flex gap-2 pt-1">
              <Button
                variant="danger"
                size="sm"
                onClick={handleResetCounter}
                loading={resetting}
              >
                Confirm Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResetConfirm(false)}
                disabled={resetting}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setResetConfirm(true)}
              className="mt-1"
            >
              Reset Order Counter
            </Button>
          )}
        </section>

        {/* Menu Management */}
        <section>
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Menu Items
          </h2>
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-stone-500">
                Toggle items to show or hide them from the customer menu.
              </p>
              {items.map((item) => (
                <MenuItemToggle
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  loading={togglingId === item.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
