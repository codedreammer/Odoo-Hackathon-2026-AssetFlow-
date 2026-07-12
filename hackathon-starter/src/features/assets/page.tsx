import { Container, DashboardLayout } from "@/components/layout";
import { Error } from "@/components/common";

import { AssetScreen } from "./components/asset-screen";
import { getAssetManagementData } from "./services/asset.service";

export default async function AssetsPage() {
  const result = await getAssetManagementData();

  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        {result.success ? (
          <AssetScreen initialData={result.data} />
        ) : (
          <Error
            message={result.error?.message}
            title="Unable to load assets"
          />
        )}
      </Container>
    </DashboardLayout>
  );
}
