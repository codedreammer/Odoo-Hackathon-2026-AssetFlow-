"use client";

import {
  DashboardHeader,
  AlertBanner,
  StatsGrid,
  AssetTrendChart,
  DepartmentBreakdown,
  CategoryBreakdown,
  RecentAssetsTable,
  MaintenanceQueue,
} from "./index";
import type { DashboardData } from "../types";

interface DashboardScreenProps {
  initialData: DashboardData;
}

export function DashboardScreen({ initialData }: DashboardScreenProps) {
  const { org, alert, stats, trend, departments, categories, recentAssets, maintenanceQueue } =
    initialData;

  const handleSync = () => {
    window.location.reload();
  };

  const handleRegisterAsset = () => {
    // Navigate to asset registration or open asset form
    window.location.href = "/assets";
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-7 pb-14 pt-6">
      <DashboardHeader
        org={org}
        onSync={handleSync}
        onRegisterAsset={handleRegisterAsset}
      />
      <AlertBanner alert={alert} />
      <StatsGrid stats={stats} />
      {trend && trend.length > 0 && <AssetTrendChart data={trend} />}

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
