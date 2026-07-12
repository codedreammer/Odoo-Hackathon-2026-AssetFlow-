import { Suspense } from "react";
import { Container, DashboardLayout } from "@/components/layout";
import { Error, PageSkeleton } from "@/components/common";

import { NotificationList } from "./components/NotificationList";
import { getNotifications, getUnreadCount } from "./actions";

export default async function NotificationsPage() {
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(),
    getUnreadCount(),
  ]);

  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <Suspense fallback={<PageSkeleton variant="table" />}>
          <NotificationList initialNotifications={notifications} unreadCount={unreadCount} />
        </Suspense>
      </Container>
    </DashboardLayout>
  );
}