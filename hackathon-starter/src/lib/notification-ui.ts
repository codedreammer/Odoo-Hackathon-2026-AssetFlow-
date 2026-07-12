// Notification type → icon variant + color scheme
export type NotificationIconVariant =
  | "warning"
  | "error"
  | "success"
  | "info"
  | "calendar"
  | "default";

const TYPE_MAP: Record<string, NotificationIconVariant> = {
  // Maintenance
  maintenance_approval: "warning",
  maintenance_overdue: "warning",
  maintenance_completed: "success",
  // Audit
  audit_missing: "error",
  audit_completed: "success",
  // Transfer
  transfer_approved: "success",
  transfer_rejected: "error",
  transfer_requested: "info",
  // Warranty / Expiry
  warranty_expiring: "calendar",
  lease_expiring: "calendar",
  // Booking
  booking_conflict: "error",
  booking_approved: "success",
  booking_cancelled: "error",
};

export function getNotificationVariant(type: string): NotificationIconVariant {
  for (const [key, variant] of Object.entries(TYPE_MAP)) {
    if (type?.toLowerCase().includes(key)) return variant;
  }
  return "default";
}

export const VARIANT_STYLES: Record<
  NotificationIconVariant,
  { icon: string; bg: string; border: string; dot: string }
> = {
  warning: {
    icon: "text-[#F59E0B]",
    bg: "bg-[#FFFBEB]",
    border: "border-[#FDE68A]",
    dot: "bg-[#F59E0B]",
  },
  error: {
    icon: "text-[#EF4444]",
    bg: "bg-[#FEF2F2]",
    border: "border-[#FECACA]",
    dot: "bg-[#EF4444]",
  },
  success: {
    icon: "text-[#22C55E]",
    bg: "bg-[#F0FDF4]",
    border: "border-[#BBF7D0]",
    dot: "bg-[#22C55E]",
  },
  info: {
    icon: "text-[#3B82F6]",
    bg: "bg-[#EFF6FF]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#3B82F6]",
  },
  calendar: {
    icon: "text-[#8B5CF6]",
    bg: "bg-[#F5F3FF]",
    border: "border-[#DDD6FE]",
    dot: "bg-[#8B5CF6]",
  },
  default: {
    icon: "text-[#6B7280]",
    bg: "bg-[#F9FAFB]",
    border: "border-[#E4E7EC]",
    dot: "bg-[#9CA3AF]",
  },
};

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
