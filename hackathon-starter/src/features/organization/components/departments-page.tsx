import { Suspense } from "react";
import { Container, DashboardLayout } from "@/components/layout";
import { Error, PageSkeleton } from "@/components/common";

import { getDepartmentManagementData } from "../services/department.service";
import { DepartmentsScreen } from "./departments-screen";

export async function DepartmentsPage() {
  const result = await getDepartmentManagementData();

  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <Suspense fallback={<PageSkeleton variant="table" />}>
          {result.success ? (
            <DepartmentsScreen initialData={result.data} />
          ) : (
            <Error
              message={result.error?.message}
              title="Unable to load departments"
            />
          )}
        </Suspense>
      </Container>
    </DashboardLayout>
  );
}
