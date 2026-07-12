"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  Box,
  CalendarClock,
  ChevronLeft,
  ClipboardCheck,
  LayoutGrid,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Asset Registry", href: "/assets", icon: Box },
  { label: "Allocations", href: "/allocations", icon: ArrowLeftRight },
  { label: "Resource Booking", href: "/booking", icon: CalendarClock },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Audit", href: "/audit", icon: ClipboardCheck },
  { label: "People", href: "/people", icon: Users },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

export function Sidebar({ notificationCount = 0 }: { notificationCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[240px] flex-col bg-[#0B0D12] text-[#9CA3AF]">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4F46E5] text-white">
          <Box size={16} strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold text-white">AssetFlow</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors ${
                active
                  ? "bg-[#1E2130] font-medium text-white"
                  : "text-[#9CA3AF] hover:bg-[#15171D] hover:text-white"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </Link>
          );
        })}

        <Link
          href="/notifications"
          className={`flex items-center justify-between rounded-md px-3 py-2 text-[13px] transition-colors ${
            pathname === "/notifications"
              ? "bg-[#1E2130] font-medium text-white"
              : "text-[#9CA3AF] hover:bg-[#15171D] hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Bell size={16} strokeWidth={2} />
            Notifications
          </span>
          {notificationCount > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </Link>
      </nav>

      <div className="border-t border-[#1A1C23] px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-[#9CA3AF] hover:bg-[#15171D] hover:text-white"
        >
          <Settings size={16} strokeWidth={2} />
          Settings
        </Link>

        <div className="mt-2 flex items-center gap-2.5 rounded-md px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4F46E5] text-[11px] font-semibold text-white">
            AD
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-[13px] font-medium text-white">Admin User</p>
            <p className="text-[11px] text-[#6B7280]">Administrator</p>
          </div>
          <ChevronLeft size={14} className="text-[#6B7280]" />
        </div>
      </div>
    </aside>
  );
}
