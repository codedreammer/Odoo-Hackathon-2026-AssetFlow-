import type { ActionResponse } from "@/types";

import type { SignupFormValues } from "../schemas/signup-schema";

export type SignupFieldErrors = Partial<
  Record<keyof SignupFormValues, string[] | undefined>
>;

export type SignupActionState = ActionResponse<{ redirectTo: string }> & {
  fieldErrors?: SignupFieldErrors;
};

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
