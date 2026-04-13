"use client";

type FilterTab = "ALL" | "FOOD" | "DRINK";

interface CategoryFilterProps {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

const tabs: { value: FilterTab; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "FOOD", label: "Food" },
  { value: "DRINK", label: "Drink" },
];

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === tab.value
              ? "bg-orange-500 text-white"
              : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
