// Normalizes any enum casing/format (OPEN, "Open", open) into one key
// so badge colors work regardless of exact DB casing.
function normalize(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "_");
}

export const MAINT_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  OPEN: { bg: "bg-[#F0F2F5]", text: "text-[#374151]", label: "Open" },
  PENDING_APPROVAL: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", label: "Pending Approval" },
  IN_PROGRESS: { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", label: "In Progress" },
  RESOLVED: { bg: "bg-[#DCFCE7]", text: "text-[#166534]", label: "Resolved" },
  CLOSED: { bg: "bg-[#F0F2F5]", text: "text-[#6B7280]", label: "Closed" },
};

export function getMaintStatusStyle(status: string) {
  const key = normalize(status);
  return (
    MAINT_STATUS_STYLES[key] ?? {
      bg: "bg-[#F0F2F5]",
      text: "text-[#374151]",
      label: status.replace(/_/g, " "),
    }
  );
}

export const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CRITICAL: { bg: "bg-red-100 dark:bg-red-950/60", text: "text-red-700 dark:text-red-300", label: "Critical" },
  HIGH: { bg: "bg-amber-100 dark:bg-amber-950/60", text: "text-amber-700 dark:text-amber-300", label: "High" },
  MEDIUM: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-700 dark:text-zinc-300", label: "Medium" },
  LOW: { bg: "bg-blue-100 dark:bg-blue-950/60", text: "text-blue-700 dark:text-blue-300", label: "Low" },
};

export function getPriorityStyle(priority: string) {
  const key = normalize(priority);
  return PRIORITY_STYLES[key] ?? { text: "text-[#374151]", label: priority };
}

export function formatDueDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toISOString().slice(0, 10);
}

export function isOverdue(dateStr: string | null | undefined, status: string) {
  if (!dateStr) return false;
  const closedStates = ["RESOLVED", "CLOSED"];
  if (closedStates.includes(normalize(status))) return false;
  return new Date(dateStr) < new Date();
}
