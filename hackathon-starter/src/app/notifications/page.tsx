import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { getNotifications, getUnreadCount } from "@/features/notifications/actions";

export default async function NotificationsPage() {
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(),
    getUnreadCount(),
  ]);

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <Sidebar notificationCount={unreadCount} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar crumb="Notifications" notificationCount={unreadCount} />
        <main className="flex-1 overflow-y-auto p-6">
          <NotificationList notifications={notifications} />
        </main>
      </div>
    </div>
  );
}
