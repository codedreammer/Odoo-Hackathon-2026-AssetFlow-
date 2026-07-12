import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { AssetRegistry } from "@/features/assets/components/AssetRegistry";
import { getAssets } from "@/features/assets/actions";

export default async function AssetsPage() {
  const assets = await getAssets();

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <Sidebar notificationCount={3} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar crumb="Asset Registry" notificationCount={3} />
        <main className="flex-1 overflow-y-auto p-6">
          <AssetRegistry assets={assets} />
        </main>
      </div>
    </div>
  );
}
