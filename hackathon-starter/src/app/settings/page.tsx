import { Suspense } from "react";
import { SettingsPage } from "@/features/settings";
import { PageSkeleton } from "@/components/common";

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton variant="card" />}>
      <SettingsPage />
    </Suspense>
  );
}