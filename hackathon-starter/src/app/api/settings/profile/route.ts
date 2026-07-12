import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// PATCH /api/settings/profile  — update profile fields
export async function PATCH(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: body.full_name ?? null,
      phone: body.phone ?? null,
      job_title: body.job_title ?? null,
    })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// PATCH /api/settings/password  — handled separately via Supabase Auth
// See: /api/settings/password/route.ts
