import { Container, DashboardLayout } from "@/components/layout";
import { PageSkeleton } from "@/components/common";
import { Suspense } from "react";

import { MaintenancePage as FeatureMaintenancePage } from "@/features/maintenance";
import { getMaintenanceRequests } from "@/features/maintenance/actions";

export default async function MaintenancePage() {
  const requests = await getMaintenanceRequests();

  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <Suspense fallback={<PageSkeleton variant="table" />}>
          <FeatureMaintenancePage initialRequests={requests} />
        </Suspense>
      </Container>
    </DashboardLayout>
  );
}