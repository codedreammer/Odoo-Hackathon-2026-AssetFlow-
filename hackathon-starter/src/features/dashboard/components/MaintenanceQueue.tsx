import type { MaintenanceBadgeVariant, MaintenancePriority, MaintenanceTicket } from "../types";

const badgeStyles: Record<MaintenanceBadgeVariant, string> = {
  progress: "bg-[#EBF0FF] text-[#3B63F5]",
  pending: "bg-amber-50 text-amber-600",
  open: "bg-neutral-100 text-neutral-500",
};

const priorityStyles: Record<MaintenancePriority, string> = {
  Critical: "text-red-600",
  High: "text-amber-600",
  Medium: "text-neutral-500",
  Low: "text-neutral-400",
};

export function MaintenanceQueue({ tickets }: { tickets: MaintenanceTicket[] }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-neutral-900">Maintenance queue</h2>
        <a className="cursor-pointer text-xs font-bold text-[#3B63F5]">All</a>
      </div>
      <div>
        {tickets.map((ticket, i) => (
          <div
            key={`${ticket.asset}-${i}`}
            className="flex items-center justify-between gap-3.5 border-b border-neutral-200 py-3.5 last:border-none last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900">{ticket.asset}</p>
              <p className="mt-0.5 text-xs text-neutral-400">{ticket.type}</p>
              <span
                className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${badgeStyles[ticket.badgeVariant]}`}
              >
                {ticket.badge}
              </span>
            </div>
            <div className="shrink-0 text-right">
              <p className={`text-xs font-bold ${priorityStyles[ticket.priority]}`}>{ticket.priority}</p>
              <p className="mt-1.5 font-mono text-[11px] text-neutral-400">Due {ticket.due}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
