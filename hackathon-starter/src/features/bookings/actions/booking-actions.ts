"use server";

import { revalidatePath } from "next/cache";

import {
  bookingCreateSchema,
  bookingUpdateSchema,
  bookingStatusSchema,
  normalizeBookingFormValues,
  normalizeBookingUpdateFormValues,
} from "../schemas/booking-schema";
import {
  cancelBooking,
  createBooking,
  updateBooking,
} from "../services/booking.service";
import type {
  BookingCancelActionState,
  BookingMutationActionState,
} from "../types";

const REVALIDATE_PATHS = ["/booking", "/", "/dashboard"];

function revalidateBookingPaths() {
  REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
}

export async function createBookingAction(
  input: unknown,
): Promise<BookingMutationActionState> {
  try {
    const parsedValues = bookingCreateSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Please correct the highlighted fields and try again.",
        },
        fieldErrors: parsedValues.error.flatten().fieldErrors,
      };
    }

    const result = await createBooking(normalizeBookingFormValues(parsedValues.data));

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error?.message ?? "Unable to create booking.",
        },
      };
    }

    revalidateBookingPaths();

    return {
      success: true,
      data: {
        bookingId: result.data.bookingId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while creating the booking. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}

export async function updateBookingAction(
  input: unknown,
): Promise<BookingMutationActionState> {
  try {
    const parsedValues = bookingUpdateSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Please correct the highlighted fields and try again.",
        },
        fieldErrors: parsedValues.error.flatten().fieldErrors,
      };
    }

    const result = await updateBooking(
      normalizeBookingUpdateFormValues(parsedValues.data),
    );

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error?.message ?? "Unable to update booking.",
        },
      };
    }

    revalidateBookingPaths();

    return {
      success: true,
      data: {
        bookingId: result.data.bookingId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while updating the booking. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}

export async function cancelBookingAction(
  input: unknown,
): Promise<BookingCancelActionState> {
  try {
    const parsedValues = bookingStatusSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Unable to cancel booking.",
          details: parsedValues.error.flatten().formErrors.join(", "),
        },
      };
    }

    const result = await cancelBooking({ id: parsedValues.data.id });

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error?.message ?? "Unable to cancel booking.",
        },
      };
    }

    revalidateBookingPaths();

    return {
      success: true,
      data: {
        bookingId: result.data.bookingId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while cancelling the booking. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}