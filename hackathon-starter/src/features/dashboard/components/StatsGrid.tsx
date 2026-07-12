import type { StatCard, TrendDirection } from "../types";

const trendColor: Record<TrendDirection, string> = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-neutral-500",
};

export function StatsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-neutral-400">
            {stat.label}
          </p>
          <p className="mb-1.5 text-2xl font-extrabold tracking-tight text-neutral-900">
            {stat.value}
          </p>
          <p className={`text-xs font-semibold ${trendColor[stat.trend]}`}>{stat.delta}</p>
        </div>
      ))}
    </div>
  );
}
