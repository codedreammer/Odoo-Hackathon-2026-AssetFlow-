import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  CreateProfilePayload,
  SignUpEmployeeInput,
  SignUpEmployeeResult,
} from "../types/auth";

function getEmailRedirectTo() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    return undefined;
  }

  try {
    return new URL("/login", appUrl).toString();
  } catch {
    return undefined;
  }
}

export async function signUpEmployee({
  fullName,
  email,
  password,
}: SignUpEmployeeInput): Promise<SignUpEmployeeResult> {
  const supabase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullName = fullName.trim();

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingProfileError) {
    return {
      success: false,
      error: "Unable to validate your signup details right now.",
    };
  }

  if (existingProfile) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  const emailRedirectTo = getEmailRedirectTo();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: normalizedFullName,
      },
      ...(emailRedirectTo ? { emailRedirectTo } : {}),
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  const user = data.user;

  if (!user?.id || !user.email) {
    return {
      success: false,
      error: "We couldn't create your account. Please try again.",
    };
  }

  const profilePayload: CreateProfilePayload = {
    id: user.id,
    full_name: normalizedFullName,
    email: user.email.toLowerCase(),
    role: "EMPLOYEE",
    active: true,
    department_id: null,
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .insert(profilePayload);

  if (profileError) {
    return {
      success: false,
      error:
        "Your account was created, but we couldn't finish your profile setup. Please try signing in again.",
    };
  }

  return {
    success: true,
  };
}
