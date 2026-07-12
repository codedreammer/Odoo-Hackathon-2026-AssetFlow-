import type { DashboardData } from "./types";

/**
 * Placeholder dashboard data.
 *
 * Swap this for a real fetch once the Supabase tables are wired up —
 * e.g. `services/dashboard.service.ts` exporting `getDashboardData()`
 * with the same `DashboardData` shape, called from an async Server
 * Component (`page.tsx`) or a React Query hook.
 */
export const dashboardData: DashboardData = {
  org: {
    name: "Acme Corporation",
    date: "Mon, Jan 13, 2025",
    user: "Alex",
  },

  alert: {
    count: 3,
    items: [
      "MNT-001 is overdue",
      "AST-009 was not scanned in Jan audit",
      "Conference Room A has a booking conflict on Jan 15",
    ],
  },

  stats: [
    { label: "Total Assets", value: "231", delta: "+12 this month", trend: "up" },
    { label: "Active Allocations", value: "184", delta: "+6 this week", trend: "up" },
    { label: "Open Maintenance", value: "6", delta: "2 overdue", trend: "down" },
    { label: "Asset Value", value: "$148.6k", delta: "+$12k vs Dec", trend: "up" },
    { label: "Audit Score", value: "98.2%", delta: "+1.4pp vs Q3", trend: "up" },
    { label: "Unassigned Assets", value: "14", delta: "Available pool", trend: "neutral" },
  ],

  trend: [
    { month: "Aug", active: 178, maintenance: 180 },
    { month: "Sep", active: 184, maintenance: 186 },
    { month: "Oct", active: 192, maintenance: 195 },
    { month: "Nov", active: 208, maintenance: 210 },
    { month: "Dec", active: 222, maintenance: 218 },
    { month: "Jan", active: 231, maintenance: 226 },
  ],

  departments: [
    { name: "Engineering", count: 86 },
    { name: "Operations", count: 64 },
    { name: "Sales", count: 51 },
    { name: "Marketing", count: 18 },
    { name: "IT", count: 12 },
  ],

  categories: [
    { name: "Laptops", count: 81, color: "#3B63F5" },
    { name: "Vehicles", count: 51, color: "#D9A441" },
    { name: "Furniture", count: 42, color: "#0F9D58" },
    { name: "Servers", count: 32, color: "#7C5CFC" },
    { name: "Other", count: 25, color: "#9CA1AC" },
  ],

  recentAssets: [
    {
      id: "AST-001",
      name: 'MacBook Pro 16" M3 Max',
      category: "Laptop",
      assignee: "Sarah Chen",
      initials: "SC",
      avatarColor: "#3B63F5",
      status: "active",
      statusLabel: "Active",
      value: "$3,499",
    },
    {
      id: "AST-002",
      name: "Dell XPS 15 9530",
      category: "Laptop",
      assignee: "James Park",
      initials: "JP",
      avatarColor: "#D4372B",
      status: "active",
      statusLabel: "Active",
      value: "$2,199",
    },
    {
      id: "AST-003",
      name: "Toyota Camry 2023 XSE",
      category: "Vehicle",
      assignee: null,
      initials: null,
      avatarColor: null,
      status: "available",
      statusLabel: "Available",
      value: "$28,500",
    },
    {
      id: "AST-004",
      name: "Herman Miller Aeron (Size B)",
      category: "Furniture",
      assignee: "Maya Obi",
      initials: "MO",
      avatarColor: "#3B63F5",
      status: "active",
      statusLabel: "Active",
      value: "$1,895",
    },
    {
      id: "AST-005",
      name: "Dell PowerEdge R750 Server",
      category: "Server",
      assignee: "IT Team",
      initials: "IT",
      avatarColor: "#0F9D58",
      status: "maint",
      statusLabel: "In Maintenance",
      value: "$12,400",
    },
  ],

  maintenanceQueue: [
    { asset: "Dell PowerEdge R750", type: "Hardware Repair", badge: "In Progress", badgeVariant: "progress", priority: "Critical", due: "2025-01-12" },
    { asset: "HP LaserJet M507", type: "Preventive Service", badge: "Pending Approval", badgeVariant: "pending", priority: "Medium", due: "2025-01-20" },
    { asset: "Toyota Camry 2023", type: "Routine Service", badge: "Open", badgeVariant: "open", priority: "Low", due: "2025-01-25" },
    { asset: "Ford Transit Custom", type: "Insurance Renewal", badge: "Open", badgeVariant: "open", priority: "High", due: "2025-01-31" },
  ],
};
