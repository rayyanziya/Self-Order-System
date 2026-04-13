"use client";

type KitchenFilter = "IN_PROGRESS" | "READY";

interface KitchenFiltersProps {
  active: KitchenFilter;
  onChange: (f: KitchenFilter) => void;
  inProgressCount: number;
  readyCount: number;
}

export default function KitchenFilters({
  active,
  onChange,
  inProgressCount,
  readyCount,
}: KitchenFiltersProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange("IN_PROGRESS")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          active === "IN_PROGRESS"
            ? "bg-blue-600 text-white"
            : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-50"
        }`}
      >
        In Progress
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
            active === "IN_PROGRESS"
              ? "bg-white text-blue-600"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {inProgressCount}
        </span>
      </button>

      <button
        onClick={() => onChange("READY")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          active === "READY"
            ? "bg-green-600 text-white"
            : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-50"
        }`}
      >
        Ready
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
            active === "READY"
              ? "bg-white text-green-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {readyCount}
        </span>
      </button>
    </div>
  );
}
