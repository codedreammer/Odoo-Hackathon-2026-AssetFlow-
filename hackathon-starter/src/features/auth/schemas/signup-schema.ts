import { z } from "zod";

import { emailSchema, passwordSchema, requiredStringSchema } from "@/lib/validators";

export const signupSchema = z
  .object({
    fullName: requiredStringSchema("Full name").max(
      120,
      "Full name must not exceed 120 characters",
    ),
    email: z
      .string()
      .trim()
      .pipe(emailSchema)
      .transform((value) => value.toLowerCase()),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
