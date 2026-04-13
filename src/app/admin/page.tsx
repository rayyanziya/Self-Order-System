"use client";

import { useEffect, useState, useCallback } from "react";
import type { MenuItemDTO, OrderDTO } from "@/lib/types";
import MenuItemToggle from "@/components/admin/MenuItemToggle";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { POLL_INTERVAL_MS } from "@/lib/constants";

interface DailyStats {
  total: number;
  revenue: number;
  inProgress: number;
  ready: number;
  paid: number;
}

type Category = "FOOD" | "DRINK";
type Tab = "overview" | "menu" | "settings";
type StatsRange = "today" | "week" | "month";

const emptyForm = {
  code: "",
  name: "",
  price: "",
  category: "FOOD" as Category,
  description: "",
  imagePath: "",
};

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function LiveMonitor() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [tick, setTick] = useState(0); // force re-render for time-ago

  const fetchOrders = useCallback(async () => {
    const [waiting, inProg, ready] = await Promise.all([
      fetch("/api/orders?status=WAITING_PAYMENT").then((r) => r.json()),
      fetch("/api/orders?status=IN_PROGRESS&cleared=false").then((r) => r.json()),
      fetch("/api/orders?status=READY&cleared=false").then((r) => r.json()),
    ]);
    setOrders([...waiting.orders, ...inProg.orders, ...ready.orders]);
  }, []);

  useEffect(() => {
    fetchOrders();
    const pollInterval = setInterval(fetchOrders, POLL_INTERVAL_MS);
    const tickInterval = setInterval(() => setTick((t) => t + 1), 10_000);
    return () => {
      clearInterval(pollInterval);
      clearInterval(tickInterval);
    };
  }, [fetchOrders]);

  const columns: { status: string; label: string; color: string }[] = [
    { status: "WAITING_PAYMENT", label: "Awaiting Payment", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { status: "IN_PROGRESS", label: "In Progress", color: "text-blue-700 bg-blue-50 border-blue-200" },
    { status: "READY", label: "Ready", color: "text-green-700 bg-green-50 border-green-200" },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
        Live Operations
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {columns.map(({ status, label, color }) => {
          const col = orders.filter((o) => o.status === status);
          return (
            <div key={status} className={`rounded-xl border p-3 ${color}`}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2">
                {label} ({col.length})
              </p>
              <div className="space-y-2">
                {col.length === 0 ? (
                  <p className="text-xs opacity-60">None</p>
                ) : (
                  col.map((o) => (
                    <div key={o.id} className="text-xs leading-snug">
                      <p className="font-bold">{o.orderNumber}</p>
                      <p className="opacity-75">{o.totalAmount} TL · {o.items.length} item{o.items.length !== 1 ? "s" : ""}</p>
                      <p className="opacity-60">{timeAgo(o.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-stone-400 mt-2 text-right">
        Auto-refreshes every 5 seconds
      </p>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");

  // Stats
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsRange, setStatsRange] = useState<StatsRange>("today");

  // Menu
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Settings
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchStats = useCallback(() => {
    setStatsLoading(true);
    fetch(`/api/admin/stats?range=${statsRange}`)
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setStatsLoading(false));
  }, [statsRange]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    fetch("/api/menu?all=true")
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .finally(() => setMenuLoading(false));
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

  const handleEdit = async (
    id: number,
    data: { code: string; name: string; price: string; description: string; imagePath: string }
  ) => {
    const res = await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: data.code,
        name: data.name,
        price: parseFloat(data.price),
        description: data.description || null,
        imagePath: data.imagePath || null,
      }),
    });
    if (res.ok) {
      const { item } = await res.json();
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    }
  };

  const handleDelete = async (id: number): Promise<string | null> => {
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return null;
    }
    const data = await res.json();
    return data.error ?? "Failed to remove item";
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          price: parseFloat(form.price),
          category: form.category,
          description: form.description || null,
          imagePath: form.imagePath || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? "Failed to add item");
        return;
      }
      setItems((prev) => [...prev, data.item]);
      setForm(emptyForm);
      setShowAddForm(false);
    } finally {
      setAdding(false);
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

  const handleClearOrders = async () => {
    setClearing(true);
    try {
      await fetch("/api/admin/clear-orders", { method: "DELETE" });
      setClearConfirm(false);
      fetchStats();
    } finally {
      setClearing(false);
    }
  };

  const statCards = stats
    ? [
        { label: "Orders", value: stats.total },
        { label: "Revenue", value: `${stats.revenue.toLocaleString()} TL` },
        { label: "In Progress", value: stats.inProgress },
        { label: "Ready / Paid", value: stats.ready + stats.paid },
      ]
    : [];

  const rangeLabels: Record<StatsRange, string> = {
    today: "Today",
    week: "This Week",
    month: "This Month",
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "menu", label: "Menu" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Staff access only — do not share this URL with customers.
          </p>
          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  tab === key
                    ? "bg-orange-500 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Range toggle */}
            <div className="flex gap-1">
              {(["today", "week", "month"] as StatsRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setStatsRange(r)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                    statsRange === r
                      ? "bg-stone-800 text-white border-stone-800"
                      : "border-stone-300 text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {rangeLabels[r]}
                </button>
              ))}
            </div>

            {/* Stats cards */}
            {statsLoading ? (
              <div className="flex justify-center py-8">
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
                    <p className="text-2xl font-bold text-stone-900">{card.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Live Operations */}
            <LiveMonitor />
          </div>
        )}

        {/* ── MENU TAB ── */}
        {tab === "menu" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
                Menu Items
              </h2>
              <button
                onClick={() => { setShowAddForm((v) => !v); setAddError(null); setForm(emptyForm); }}
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                {showAddForm ? "Cancel" : "+ Add Item"}
              </button>
            </div>

            {/* Add Item Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddItem}
                className="bg-white rounded-xl border border-stone-200 p-4 space-y-3"
              >
                <p className="text-sm font-semibold text-stone-800">New Menu Item</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. A003"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      required
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Category *</label>
                    <div className="flex rounded-lg border border-stone-200 overflow-hidden">
                      {(["FOOD", "DRINK"] as Category[]).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`flex-1 py-2 text-sm font-medium transition-colors ${
                            form.category === cat
                              ? "bg-orange-500 text-white"
                              : "bg-white text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          {cat === "FOOD" ? "Food" : "Drink"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-500 block mb-1">Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Nasi Goreng"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-500 block mb-1">Price (TL) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 150"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-500 block mb-1">Description (optional)</label>
                  <input
                    type="text"
                    placeholder="Short description for customers"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-500 block mb-1">Image path (optional)</label>
                  <input
                    type="text"
                    placeholder="/images/filename.jpg"
                    value={form.imagePath}
                    onChange={(e) => setForm({ ...form, imagePath: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                  <p className="text-xs text-stone-400 mt-1">
                    Place the image file in <code className="bg-stone-100 px-1 rounded">public/images/</code> first
                  </p>
                </div>

                {addError && <p className="text-xs text-red-500">{addError}</p>}

                <Button type="submit" variant="primary" size="sm" loading={adding} className="w-full">
                  Add Item
                </Button>
              </form>
            )}

            {menuLoading ? (
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
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    loading={togglingId === item.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div className="space-y-4">
            {/* Reset Order Counter */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-2">
              <h2 className="text-sm font-semibold text-stone-900">Order Number Counter</h2>
              <p className="text-xs text-stone-500">
                Reset at the end of the day so tomorrow&apos;s orders start from -001 again.
              </p>
              {resetConfirm ? (
                <div className="flex gap-2 pt-1">
                  <Button variant="danger" size="sm" onClick={handleResetCounter} loading={resetting}>
                    Confirm Reset
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setResetConfirm(false)} disabled={resetting}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setResetConfirm(true)} className="mt-1">
                  Reset Order Counter
                </Button>
              )}
            </div>

            {/* Clear All Orders */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <p className="text-xs text-red-600 font-medium">Development utility</p>
              <p className="text-xs text-red-500">
                Deletes all orders and resets stats to zero. Use during testing only.
              </p>
              {clearConfirm ? (
                <div className="flex gap-2">
                  <Button variant="danger" size="sm" onClick={handleClearOrders} loading={clearing}>
                    Confirm — Delete All Orders
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setClearConfirm(false)} disabled={clearing}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="danger" size="sm" onClick={() => setClearConfirm(true)}>
                  Clear All Orders
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
