import { z } from "zod";

import { emailSchema, passwordSchema } from "@/lib/validators";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(emailSchema)
    .transform((value) => value.toLowerCase()),
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
