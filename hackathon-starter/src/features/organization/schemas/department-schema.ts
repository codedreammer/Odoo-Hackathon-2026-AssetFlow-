import { z } from "zod";

import { requiredStringSchema, uuidSchema } from "@/lib/validators";

const optionalUuidField = z.union([uuidSchema, z.literal(""), z.null()]);

export const departmentFormSchema = z.object({
  name: requiredStringSchema("Department name").max(
    120,
    "Department name must not exceed 120 characters",
  ),
  parent_department_id: optionalUuidField.default(""),
  head_id: optionalUuidField.default(""),
  status: z.enum(["true", "false"]),
});

export const departmentCreateSchema = departmentFormSchema;

export const departmentUpdateSchema = departmentFormSchema.extend({
  id: uuidSchema,
});

export const departmentToggleSchema = z.object({
  id: uuidSchema,
  status: z.boolean(),
});

export type DepartmentFormValues = z.input<typeof departmentFormSchema>;

export function normalizeDepartmentFormValues(values: DepartmentFormValues) {
  return {
    name: values.name.trim(),
    parent_department_id: values.parent_department_id || null,
    head_id: values.head_id || null,
    status: values.status === "true",
  };
}
