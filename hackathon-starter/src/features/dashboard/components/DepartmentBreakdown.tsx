import type { DepartmentCount } from "../types";

export function DepartmentBreakdown({ departments }: { departments: DepartmentCount[] }) {
  const max = Math.max(...departments.map((d) => d.count));

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-[15px] font-bold text-neutral-900">By department</h2>
        <p className="mt-0.5 text-xs text-neutral-400">Asset count</p>
      </div>
      <div className="flex flex-col gap-3.5">
        {departments.map((dept) => (
          <div key={dept.name} className="grid grid-cols-[82px_1fr_34px] items-center gap-2.5">
            <span className="text-sm font-medium text-neutral-500">{dept.name}</span>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#3B63F5] to-[#6E8CFF]"
                style={{ width: `${(dept.count / max) * 100}%` }}
              />
            </div>
            <span className="text-right text-xs font-bold tabular-nums text-neutral-500">
              {dept.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
