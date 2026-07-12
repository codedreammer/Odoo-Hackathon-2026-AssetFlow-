import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SettingsProfile } from "@/features/settings/components/SettingsProfile";
import { getProfile } from "@/features/settings/actions";
import { getUnreadCount } from "@/features/notifications/actions";

export default async function SettingsPage() {
  const [profile, unreadCount] = await Promise.all([
    getProfile(),
    getUnreadCount(),
  ]);

  // Fallback shell if not logged in (dev mode)
  const safeProfile = profile ?? {
    id: "",
    full_name: "Admin User",
    email: "admin@acme.com",
    phone: null,
    job_title: "System Administrator",
    role: "Administrator",
    avatar_url: null,
  };

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <Sidebar notificationCount={unreadCount} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar crumb="Settings" notificationCount={unreadCount} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-[22px] font-semibold text-[#0F1117]">Settings</h1>
          </div>
          <SettingsProfile profile={safeProfile} />
        </main>
      </div>
    </div>
  );
}
