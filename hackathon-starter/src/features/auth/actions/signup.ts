"use server";

import { signupSchema } from "../schemas/signup-schema";
import { signUpEmployee } from "../services/auth.service";
import type { SignupActionState } from "../types/auth";

export async function signUpAction(input: unknown): Promise<SignupActionState> {
  try {
    const parsedValues = signupSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Please correct the highlighted fields and try again.",
        },
        fieldErrors: parsedValues.error.flatten().fieldErrors,
      };
    }

    const result = await signUpEmployee(parsedValues.data);

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error ?? "Unable to create your account.",
        },
      };
    }

    return {
      success: true,
      data: {
        redirectTo: "/login",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while creating your account. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}
