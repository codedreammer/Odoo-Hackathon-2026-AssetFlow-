import type { ActionResponse } from "@/types";

import type { LoginFormValues } from "../schemas/login-schema";
import type { SignupFormValues } from "../schemas/signup-schema";

type FormFieldErrors<TFormValues> = Partial<
  Record<keyof TFormValues, string[] | undefined>
>;

type AuthActionState<TFormValues> = ActionResponse<{ redirectTo: string }> & {
  fieldErrors?: FormFieldErrors<TFormValues>;
};

export type LoginFieldErrors = FormFieldErrors<LoginFormValues>;
export type SignupFieldErrors = FormFieldErrors<SignupFormValues>;

export type LoginActionState = AuthActionState<LoginFormValues>;
export type SignupActionState = AuthActionState<SignupFormValues>;

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserResult {
  success: boolean;
  error?: string;
}

export interface SignUpEmployeeInput {
  fullName: string;
  email: string;
  password: string;
}

export interface CreateProfilePayload {
  id: string;
  full_name: string;
  email: string;
  role: "EMPLOYEE";
  active: boolean;
  department_id: null;
}

export interface SignUpEmployeeResult {
  success: boolean;
  error?: string;
}
