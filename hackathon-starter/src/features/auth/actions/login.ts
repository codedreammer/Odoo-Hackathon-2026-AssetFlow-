"use server";

import { loginSchema } from "../schemas/login-schema";
import { loginUser } from "../services/auth.service";
import type { LoginActionState } from "../types/auth";

export async function loginAction(input: unknown): Promise<LoginActionState> {
  try {
    const parsedValues = loginSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Please correct the highlighted fields and try again.",
        },
        fieldErrors: parsedValues.error.flatten().fieldErrors,
      };
    }

    const result = await loginUser(parsedValues.data);

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error ?? "Unable to log you in right now. Please try again.",
        },
      };
    }

    return {
      success: true,
      data: {
        redirectTo: "/dashboard",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Something went wrong while logging you in. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}
