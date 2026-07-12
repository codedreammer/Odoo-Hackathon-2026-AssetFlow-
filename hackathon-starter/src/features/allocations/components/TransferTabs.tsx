"use client";

import { cn } from "@/lib/cn";

interface TransferTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const tabs = [
  {
    id: "allocations",
    label: "Current Allocations",
    count: 18,
  },
  {
    id: "requests",
    label: "Transfer Requests",
    count: 4,
  },
  {
    id: "history",
    label: "Transfer History",
    count: 36,
  },
];

export default function TransferTabs({
  activeTab,
  onTabChange,
  className,
}: TransferTabsProps) {
  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-white shadow-sm", className)}>
      <div className="flex overflow-x-auto">

        {tabs.map((tab) => {

          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium transition-all",
                active
                  ? "border-black text-black"
                  : "border-transparent text-zinc-500 hover:text-black"
              )}
            >
              <span>{tab.label}</span>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  active
                    ? "bg-black text-white"
                    : "bg-zinc-100 text-zinc-600"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}