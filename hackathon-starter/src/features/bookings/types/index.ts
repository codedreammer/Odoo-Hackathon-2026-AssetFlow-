import type { ActionResponse } from "@/types";
import type { BookingFormValues, BookingUpdateFormValues } from "../schemas/booking-schema";

export const BOOKING_STATUS_VALUES = [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
] as const;

export type BookingStatus = (typeof BOOKING_STATUS_VALUES)[number];

export interface AssetOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface ProfileOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface BookingRecord {
  id: string;
  asset_id: string;
  employee_id: string;
  department_id: string | null;
  start_time: string;
  end_time: string;
  purpose: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface BookingListItem extends BookingRecord {
  asset_name: string | null;
  employee_name: string | null;
}

export interface BookingManagementData {
  bookings: BookingListItem[];
  assetOptions: AssetOption[];
  profileOptions: ProfileOption[];
}

export interface CreateBookingInput {
  asset_id: string;
  employee_id: string;
  department_id: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
}

export interface UpdateBookingInput {
  id: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  purpose?: string | null;
  status?: BookingStatus;
}

export interface CancelBookingInput {
  id: string;
}

export type BookingFieldErrorKey = keyof CreateBookingInput | "id";

export type BookingFieldErrors = Partial<
  Record<BookingFieldErrorKey, string[] | undefined>
>;

export type BookingMutationActionState = {
  success: boolean;
  data?: { bookingId: string };
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  fieldErrors?: BookingFieldErrors;
};

export type BookingCancelActionState = {
  success: boolean;
  data?: { bookingId: string };
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export function isCancelledBooking(status: BookingStatus): boolean {
  return status === "CANCELLED";
}

export type { BookingFormValues, BookingUpdateFormValues };