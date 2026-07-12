import { dashboardData } from "./data";
import {
  DashboardHeader,
  AlertBanner,
  StatsGrid,
  AssetTrendChart,
  DepartmentBreakdown,
  CategoryBreakdown,
  RecentAssetsTable,
  MaintenanceQueue,
} from "./components";

export default function DashboardPage() {
  const { org, alert, stats, trend, departments, categories, recentAssets, maintenanceQueue } =
    dashboardData;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-7 pb-14 pt-6">
      <DashboardHeader org={org} />
      <AlertBanner alert={alert} />
      <StatsGrid stats={stats} />
      <AssetTrendChart data={trend} />

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DepartmentBreakdown departments={departments} />
        <CategoryBreakdown categories={categories} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <RecentAssetsTable assets={recentAssets} />
        <MaintenanceQueue tickets={maintenanceQueue} />
      </div>
    </div>
  );
}
