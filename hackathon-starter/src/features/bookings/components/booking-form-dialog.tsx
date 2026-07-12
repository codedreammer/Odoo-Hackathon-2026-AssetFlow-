"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  Input,
  Select,
  Spinner,
} from "@/components/ui";

import {
  createBookingAction,
  updateBookingAction,
} from "../actions/booking-actions";
import {
  bookingFormSchema,
  bookingUpdateSchema,
  normalizeBookingFormValues,
  normalizeBookingUpdateFormValues,
} from "../schemas/booking-schema";
import type {
  AssetOption,
  BookingFormValues,
  BookingListItem,
  BookingMutationActionState,
  ProfileOption,
} from "../types";

interface BookingFormDialogProps {
  assetOptions: AssetOption[];
  booking?: BookingListItem | null;
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  open: boolean;
  profileOptions: ProfileOption[];
}

function getDefaultValues(booking?: BookingListItem | null): BookingFormValues {
  if (!booking) {
    return {
      asset_id: "",
      employee_id: "",
      department_id: undefined,
      booking_date: "",
      start_time: "",
      end_time: "",
      purpose: "",
      status: "UPCOMING",
    };
  }

  const startDate = new Date(booking.start_time);
  const endDate = new Date(booking.end_time);

  return {
    asset_id: booking.asset_id,
    employee_id: booking.employee_id,
    department_id: booking.department_id || undefined,
    booking_date: startDate.toISOString().slice(0, 10),
    start_time: startDate.toTimeString().slice(0, 5),
    end_time: endDate.toTimeString().slice(0, 5),
    purpose: booking.purpose ?? "",
    status: booking.status,
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

export default function BookingFormDialog({
  assetOptions,
  booking,
  mode,
  onOpenChange,
  open,
  profileOptions,
}: BookingFormDialogProps) {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onBlur",
    defaultValues: getDefaultValues(booking),
  });

  useEffect(() => {
    reset(getDefaultValues(booking));
    clearErrors();
  }, [booking, clearErrors, open, reset]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSubmissionError(null);
      clearErrors();
    }

    onOpenChange(nextOpen);
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionError(null);
    clearErrors();

    let result: BookingMutationActionState;

    if (mode === "create") {
      result = await createBookingAction(normalizeBookingFormValues(values));
    } else {
      result = await updateBookingAction(
        normalizeBookingUpdateFormValues(values as BookingFormValues & { id: string })
      );
    }

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [fieldName, messages] of Object.entries(
          result.fieldErrors,
        ) as Array<[keyof BookingFormValues | "id", string[] | undefined]>) {
          const message = messages?.[0];

          if (!message || fieldName === "id") {
            continue;
          }

          setError(fieldName, {
            type: "server",
            message,
          });
        }
      }

      setSubmissionError(
        result.error?.message ??
          (mode === "create"
            ? "Unable to create the booking."
            : "Unable to update the booking."),
      );
      return;
    }

    handleOpenChange(false);
    router.refresh();
  });

  return (
    <Dialog
      description={
        mode === "create"
          ? "Create a new resource booking with the selected asset, date, and time."
          : "Update the booking details, date, time, and status."
      }
      onOpenChange={handleOpenChange}
      open={open}
      size="lg"
      title={mode === "create" ? "New Booking" : "Edit Booking"}
    >
      <form className="space-y-5" noValidate onSubmit={onSubmit}>
        {submissionError ? (
          <Alert variant="destructive">
            <AlertTitle>
              {mode === "create" ? "Booking failed" : "Update failed"}
            </AlertTitle>
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-asset`}
              >
                Asset
              </label>
              <Select
                id={`${mode}-asset`}
                aria-invalid={errors.asset_id ? "true" : "false"}
                disabled={isSubmitting}
                options={assetOptions}
                placeholder="Select asset"
                {...register("asset_id")}
              />
              <FieldError message={errors.asset_id?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-employee`}
              >
                Booked By
              </label>
              <Select
                id={`${mode}-employee`}
                aria-invalid={errors.employee_id ? "true" : "false"}
                disabled={isSubmitting}
                options={profileOptions}
                placeholder="Select employee"
                {...register("employee_id")}
              />
              <FieldError message={errors.employee_id?.message} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-booking-date`}
              >
                Booking Date
              </label>
              <Input
                id={`${mode}-booking-date`}
                type="date"
                aria-invalid={errors.booking_date ? "true" : "false"}
                disabled={isSubmitting}
                {...register("booking_date")}
              />
              <FieldError message={errors.booking_date?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-start-time`}
              >
                Start Time
              </label>
              <Input
                id={`${mode}-start-time`}
                type="time"
                aria-invalid={errors.start_time ? "true" : "false"}
                disabled={isSubmitting}
                {...register("start_time")}
              />
              <FieldError message={errors.start_time?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-end-time`}
              >
                End Time
              </label>
              <Input
                id={`${mode}-end-time`}
                type="time"
                aria-invalid={errors.end_time ? "true" : "false"}
                disabled={isSubmitting}
                {...register("end_time")}
              />
              <FieldError message={errors.end_time?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              htmlFor={`${mode}-purpose`}
            >
              Purpose
            </label>
            <Input
              id={`${mode}-purpose`}
              placeholder="Enter booking purpose"
              aria-invalid={errors.purpose ? "true" : "false"}
              disabled={isSubmitting}
              {...register("purpose")}
            />
            <FieldError message={errors.purpose?.message} />
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-status`}
              >
                Status
              </label>
              <Select
                id={`${mode}-status`}
                aria-invalid={errors.status ? "true" : "false"}
                disabled={isSubmitting}
                options={[
                  { label: "Upcoming", value: "UPCOMING" },
                  { label: "Ongoing", value: "ONGOING" },
                  { label: "Completed", value: "COMPLETED" },
                  { label: "Cancelled", value: "CANCELLED" },
                ]}
                {...register("status")}
              />
              <FieldError message={errors.status?.message} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner label="Saving booking" size="sm" /> : null}
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
              ? "Create Booking"
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}