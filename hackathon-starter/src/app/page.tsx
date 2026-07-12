import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import { DashboardScreen } from "@/features/dashboard/components/dashboard-screen";
import { Error } from "@/components/common";

export default async function Home() {
  const result = await getDashboardData();

  if (!result.success || !result.data) {
    return (
      <div className="flex h-screen bg-[#F7F8FA]">
        <Sidebar notificationCount={3} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar crumb="Dashboard" notificationCount={3} />
          <main className="flex-1 overflow-y-auto p-6">
            <Error
              message={result.error?.message || "Failed to load dashboard data."}
              title="Error Loading Dashboard"
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <Sidebar notificationCount={3} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar crumb="Dashboard" notificationCount={3} />
        <main className="flex-1 overflow-y-auto">
          <DashboardScreen initialData={result.data} />
        </main>
      </div>
    </div>
  );
}