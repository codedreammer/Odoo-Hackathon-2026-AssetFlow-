export type TrendDirection = "up" | "down" | "neutral";

export interface StatCard {
  label: string;
  value: string;
  delta: string;
  trend: TrendDirection;
}

export interface AlertItem {
  count: number;
  items: string[];
}

export interface AssetTrendPoint {
  month: string;
  active: number;
  maintenance: number;
}

export interface DepartmentCount {
  name: string;
  count: number;
}

export interface CategoryCount {
  name: string;
  count: number;
  color: string;
}

export type AssetStatus = "active" | "available" | "maint";

export interface RecentAsset {
  id: string;
  name: string;
  category: string;
  assignee: string | null;
  initials: string | null;
  avatarColor: string | null;
  status: AssetStatus;
  statusLabel: string;
  value: string;
}

export type MaintenanceBadgeVariant = "progress" | "pending" | "open";
export type MaintenancePriority = "Critical" | "High" | "Medium" | "Low";

export interface MaintenanceTicket {
  asset: string;
  type: string;
  badge: string;
  badgeVariant: MaintenanceBadgeVariant;
  priority: MaintenancePriority;
  due: string;
}

export interface DashboardOrg {
  name: string;
  date: string;
  user: string;
}

export interface DashboardData {
  org: DashboardOrg;
  alert: AlertItem;
  stats: StatCard[];
  trend: AssetTrendPoint[];
  departments: DepartmentCount[];
  categories: CategoryCount[];
  recentAssets: RecentAsset[];
  maintenanceQueue: MaintenanceTicket[];
}
