import { BackButton, PageHeader } from "@/components/common";
import { Container, DashboardLayout } from "@/components/layout";
import { Error } from "@/components/common";

import { SettingsProfile } from "./components/SettingsProfile";
import { getProfile } from "./actions";
import { getUnreadCount } from "@/features/notifications/actions";

export async function SettingsPage() {
  const [profile, unreadCount] = await Promise.all([
    getProfile(),
    getUnreadCount(),
  ]);

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
    <DashboardLayout>
      <Container size="xl" className="space-y-6">
        <PageHeader
          actions={<BackButton />}
          title="Settings"
        />
        <SettingsProfile profile={safeProfile} />
      </Container>
    </DashboardLayout>
  );
}