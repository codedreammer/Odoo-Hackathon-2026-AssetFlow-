import { z } from "zod";
import { requiredStringSchema, uuidSchema } from "@/lib/validators";
import { BOOKING_STATUS_VALUES } from "../types";
import type { UpdateBookingInput } from "../types";

const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format");

const timeField = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)");

export const bookingFormSchema = z.object({
  asset_id: uuidSchema,
  employee_id: uuidSchema,
  department_id: z.union([uuidSchema, z.literal(""), z.null()]).optional(),
  booking_date: requiredStringSchema("Booking date"),
  start_time: requiredStringSchema("Start time").max(5, "Invalid time format"),
  end_time: requiredStringSchema("End time").max(5, "Invalid time format"),
  purpose: z
    .string()
    .trim()
    .min(1, "Purpose is required")
    .max(500, "Purpose must not exceed 500 characters"),
  status: z.enum(BOOKING_STATUS_VALUES).default("UPCOMING"),
});

export const bookingCreateSchema = bookingFormSchema;

export const bookingUpdateSchema = bookingFormSchema.extend({
  id: uuidSchema,
});

export const bookingStatusSchema = z.object({
  id: uuidSchema,
  status: z.enum(BOOKING_STATUS_VALUES),
});

export type BookingFormValues = z.input<typeof bookingFormSchema>;
export type BookingUpdateFormValues = z.input<typeof bookingUpdateSchema>;

export function normalizeBookingFormValues(values: BookingFormValues) {
  return {
    asset_id: values.asset_id,
    employee_id: values.employee_id,
    department_id: values.department_id || null,
    booking_date: values.booking_date,
    start_time: values.start_time,
    end_time: values.end_time,
    purpose: values.purpose.trim(),
    status: values.status,
  };
}

export function normalizeBookingUpdateFormValues(values: BookingUpdateFormValues) {
  const { id, ...rest } = values;
  const normalized = normalizeBookingFormValues(rest);
  return {
    id,
    ...normalized,
  } as UpdateBookingInput;
}