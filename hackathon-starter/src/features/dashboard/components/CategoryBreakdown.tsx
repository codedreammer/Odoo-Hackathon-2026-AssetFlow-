import type { CategoryCount } from "../types";

export function CategoryBreakdown({ categories }: { categories: CategoryCount[] }) {
  const total = categories.reduce((sum, c) => sum + c.count, 0);

  let cursor = 0;
  const segments = categories.map((cat) => {
    const pct = (cat.count / total) * 100;
    const segment = { ...cat, pct, offset: cursor };
    cursor += pct;
    return segment;
  });

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-[15px] font-bold text-neutral-900">By category</h2>
        <p className="mt-0.5 text-xs text-neutral-400">{total} total</p>
      </div>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 42 42" className="h-[140px] w-[140px] shrink-0 -rotate-90">
          <circle cx="21" cy="21" r="15.9" fill="none" stroke="#EEF0F4" strokeWidth={6} />
          {segments.map((seg) => (
            <circle
              key={seg.name}
              cx="21"
              cy="21"
              r="15.9"
              fill="none"
              stroke={seg.color}
              strokeWidth={6}
              strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
              strokeDashoffset={-seg.offset}
            />
          ))}
        </svg>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: cat.color }} />
              {cat.name}
              <b className="ml-3.5 pl-3.5 font-bold tabular-nums text-neutral-900">{cat.count}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
