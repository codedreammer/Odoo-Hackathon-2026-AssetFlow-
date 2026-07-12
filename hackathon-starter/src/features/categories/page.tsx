import DashboardHeader from "./components/header/DashboardHeader";
import AlertBanner from "./components/header/AlertBanner";
import StatsCards from "./components/cards/StatsCards";
import AssetOverview from "./components/charts/AssetOverview";
import DepartmentDistribution from "./components/charts/DepartmentDistribution";
import QuickActions from "./components/quick-actions/QuickActions";

const DashboardPage = () => {
  return (
    <main className="min-h-screen bg-gray-50">

      <DashboardHeader />

      <AlertBanner />

      <div className="space-y-8 px-8">

        <StatsCards />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <AssetOverview />
          </div>

          <DepartmentDistribution />

        </div>

        <QuickActions />

      </div>

    </main>
  );
};

export default DashboardPage;