import { Suspense } from "react";
import { NotificationsPage } from "@/features/notifications";
import { PageSkeleton } from "@/components/common";

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton variant="table" />}>
      <NotificationsPage />
    </Suspense>
  );
}