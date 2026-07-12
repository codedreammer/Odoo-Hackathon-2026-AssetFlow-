import { Suspense } from "react";
import { Container, DashboardLayout } from "@/components/layout";
import { Error, PageSkeleton } from "@/components/common";

import { PeopleScreen } from "@/features/people/components/people-screen";
import { getPeopleManagementData } from "@/features/people/services/employee.service";

export default async function Page() {
  const result = await getPeopleManagementData();

  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <Suspense fallback={<PageSkeleton variant="table" />}>
          {result.success ? (
            <PeopleScreen initialData={result.data} />
          ) : (
            <Error
              message={result.error?.message}
              title="Unable to load people"
            />
          )}
        </Suspense>
      </Container>
    </DashboardLayout>
  );
}