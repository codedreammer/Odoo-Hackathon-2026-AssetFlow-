// Status → dot color + label styling
export const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  AVAILABLE: { dot: "bg-[#3B82F6]", label: "Available" },
  ALLOCATED: { dot: "bg-[#22C55E]", label: "Allocated" },
  RESERVED: { dot: "bg-[#8B5CF6]", label: "Reserved" },
  UNDER_MAINTENANCE: { dot: "bg-[#F59E0B]", label: "Under Maintenance" },
  LOST: { dot: "bg-[#EF4444]", label: "Lost" },
  RETIRED: { dot: "bg-[#9CA3AF]", label: "Retired" },
  DISPOSED: { dot: "bg-[#6B7280]", label: "Disposed" },
};

export function getStatusStyle(status: string) {
  return (
    STATUS_STYLES[status] ?? {
      dot: "bg-[#9CA3AF]",
      label: status.replace(/_/g, " "),
    }
  );
}

// Deterministic pastel avatar color from a name, so the same person
// always gets the same badge color across the app.
const AVATAR_PALETTE = [
  { bg: "bg-[#E0EDFF]", text: "text-[#1D4ED8]" },
  { bg: "bg-[#FCE7F3]", text: "text-[#BE185D]" },
  { bg: "bg-[#DCFCE7]", text: "text-[#166534]" },
  { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  { bg: "bg-[#EDE9FE]", text: "text-[#5B21B6]" },
  { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
  { bg: "bg-[#E0F2FE]", text: "text-[#075985]" },
];

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarStyle(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

export function formatCurrency(value: number | null | undefined) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
