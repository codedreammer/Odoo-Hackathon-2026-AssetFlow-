import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  CreateProfilePayload,
  LoginUserInput,
  LoginUserResult,
  SignUpEmployeeInput,
  SignUpEmployeeResult,
} from "../types/auth";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

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

function isInvalidCredentialsError(error: { code?: string; message: string; status?: number }) {
  const normalizedMessage = error.message.toLowerCase();

  return (
    error.code === "invalid_credentials" ||
    error.status === 400 ||
    error.status === 401 ||
    normalizedMessage.includes("invalid login credentials")
  );
}

export async function signUpEmployee({
  fullName,
  email,
  password,
}: SignUpEmployeeInput): Promise<SignUpEmployeeResult> {
  const supabase = await createClient();
  const normalizedEmail = normalizeEmail(email);
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

export async function loginUser({
  email,
  password,
}: LoginUserInput): Promise<LoginUserResult> {
  const supabase = await createClient();
  const normalizedEmail = normalizeEmail(email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    return {
      success: false,
      error: isInvalidCredentialsError(error)
        ? "Invalid email or password."
        : "Unable to log you in right now. Please try again.",
    };
  }

  if (!data.user || !data.session) {
    return {
      success: false,
      error: "Unable to log you in right now. Please try again.",
    };
  }

  return {
    success: true,
  };
}
