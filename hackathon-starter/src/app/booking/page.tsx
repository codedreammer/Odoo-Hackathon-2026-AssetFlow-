import { Suspense } from "react";
import { Container, DashboardLayout } from "@/components/layout";
import { Error, PageSkeleton } from "@/components/common";

import { BookingScreen } from "@/features/bookings/components/booking-screen";
import { getBookingManagementData } from "@/features/bookings/services/booking.service";

export default async function BookingPage() {
  const result = await getBookingManagementData();

  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <Suspense fallback={<PageSkeleton variant="table" />}>
          {result.success ? (
            <BookingScreen initialData={result.data} />
          ) : (
            <Error
              message={result.error?.message}
              title="Unable to load bookings"
            />
          )}
        </Suspense>
      </Container>
    </DashboardLayout>
  );
}