import { getAssets } from "@/features/assets/actions";
import { AssetDirectory } from "@/features/assets/components/AssetDirectory";

export default async function AssetsPage() {
  const assets = await getAssets();
  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <AssetDirectory assets={assets} />
    </div>
  );
}
