import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  role: string | null;
  avatar_url: string | null;
};

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, job_title, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (error) {
    // Row may not exist yet — return a shell with the auth email
    return {
      id: user.id,
      full_name: null,
      email: user.email ?? null,
      phone: null,
      job_title: null,
      role: null,
      avatar_url: null,
    };
  }

  return data as Profile;
}
