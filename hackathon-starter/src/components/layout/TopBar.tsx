"use client";

import { Bell, Search } from "lucide-react";

export function TopBar({
  crumb,
  notificationCount = 0,
}: {
  crumb: string;
  notificationCount?: number;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#E4E7EC] bg-white px-6">
      <div className="flex items-center gap-4">
        <span className="text-[13px] font-medium text-[#0F1117]">{crumb}</span>
        <span className="h-4 w-px bg-[#E4E7EC]" />
        <div className="flex items-center gap-2 rounded-md border border-[#E4E7EC] bg-[#FAFAFA] px-3 py-1.5">
          <Search size={14} className="text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search assets, people, tickets"
            className="w-64 bg-transparent text-[13px] text-[#0F1117] placeholder:text-[#9CA3AF] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-[#6B7280] hover:text-[#0F1117]">
          <Bell size={18} strokeWidth={1.8} />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#EF4444]" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F1117] text-[11px] font-semibold text-white">
            AD
          </div>
          <span className="text-[13px] font-medium text-[#0F1117]">Admin</span>
        </div>
      </div>
    </header>
  );
}
