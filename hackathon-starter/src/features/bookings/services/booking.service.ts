import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AssetOption,
  BookingListItem,
  BookingManagementData,
  CreateBookingInput,
  ProfileOption,
  UpdateBookingInput,
  CancelBookingInput,
} from "../types";

function formatBookingError(message: string) {
  return {
    success: false as const,
    error: {
      message,
    },
  };
}

function mapBookingData(
  bookings: Array<{
    id: string;
    asset_id: string;
    employee_id: string;
    department_id: string | null;
    start_time: string;
    end_time: string;
    purpose: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    assets: { id: string; name: string; asset_tag: string } | { id: string; name: string; asset_tag: string }[] | null;
    profiles: { id: string; full_name: string } | { id: string; full_name: string }[] | null;
  }>,
  assetOptions: AssetOption[],
  profileOptions: ProfileOption[],
): BookingManagementData {
  const bookingList: BookingListItem[] = bookings.map((booking) => {
    const asset = Array.isArray(booking.assets)
      ? booking.assets[0]
      : booking.assets;
    const profile = Array.isArray(booking.profiles)
      ? booking.profiles[0]
      : booking.profiles;

    return {
      id: booking.id,
      asset_id: booking.asset_id,
      employee_id: booking.employee_id,
      department_id: booking.department_id,
      start_time: booking.start_time,
      end_time: booking.end_time,
      purpose: booking.purpose,
      status: booking.status as BookingListItem["status"],
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      asset_name: asset?.name ?? null,
      asset_tag: asset?.asset_tag ?? null,
      employee_name: profile?.full_name ?? null,
    };
  });

  return {
    bookings: bookingList,
    assetOptions,
    profileOptions,
  };
}

export async function getBookingManagementData() {
  const supabase = await createClient();

  const [bookingsResult, assetsResult, profilesResult] = await Promise.all([
    supabase
      .from("resource_bookings")
      .select(
        `
          id,
          asset_id,
          employee_id,
          department_id,
          start_time,
          end_time,
          purpose,
          status,
          created_at,
          updated_at,
          assets ( id, name, asset_tag ),
          profiles ( id, full_name )
        `
      )
      .order("start_time", { ascending: true }),
    supabase
      .from("assets")
      .select("id, name, asset_tag, is_bookable")
      .eq("is_bookable", true)
      .order("name"),
    supabase
      .from("profiles")
      .select("id, full_name")
      .order("full_name"),
  ]);

  if (bookingsResult.error) {
    return {
      success: false as const,
      error: {
        message: "Unable to load bookings right now.",
        details: bookingsResult.error.message,
      },
    };
  }

  if (assetsResult.error) {
    return {
      success: false as const,
      error: {
        message: "Unable to load assets right now.",
        details: assetsResult.error.message,
      },
    };
  }

  if (profilesResult.error) {
    return {
      success: false as const,
      error: {
        message: "Unable to load people right now.",
        details: profilesResult.error.message,
      },
    };
  }

  const assetOptions: AssetOption[] = (assetsResult.data as Array<{ id: string; name: string }>).map(
    (asset) => ({
      label: asset.name,
      value: asset.id,
    }),
  );

  const profileOptions: ProfileOption[] = (profilesResult.data as Array<{ id: string; full_name: string }>).map(
    (profile) => ({
      label: profile.full_name,
      value: profile.id,
    }),
  );

  const rawBookings = bookingsResult.data as Array<{
    id: string;
    asset_id: string;
    employee_id: string;
    department_id: string | null;
    start_time: string;
    end_time: string;
    purpose: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    assets: { id: string; name: string; asset_tag: string } | { id: string; name: string; asset_tag: string }[] | null;
    profiles: { id: string; full_name: string } | { id: string; full_name: string }[] | null;
  }>;

  return {
    success: true as const,
    data: mapBookingData(
      rawBookings,
      assetOptions,
      profileOptions,
    ),
  };
}

async function hasTimeConflict(
  assetId: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string,
): Promise<boolean> {
  const supabase = await createClient();

  let query = supabase
    .from("resource_bookings")
    .select("id")
    .eq("asset_id", assetId)
    .neq("status", "CANCELLED")
    .lt("start_time", endTime)
    .gt("end_time", startTime);

  if (excludeBookingId) {
    query = query.neq("id", excludeBookingId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export async function createBooking(input: CreateBookingInput) {
  const supabase = await createClient();

  const startTime = `${input.booking_date}T${input.start_time}:00`;
  const endTime = `${input.booking_date}T${input.end_time}:00`;

  if (new Date(startTime) >= new Date(endTime)) {
    return formatBookingError("End time must be after start time.");
  }

  if (await hasTimeConflict(input.asset_id, startTime, endTime)) {
    return formatBookingError(
      "This asset is already booked during the selected time.",
    );
  }

  const { data, error } = await supabase
    .from("resource_bookings")
    .insert({
      ...input,
      start_time: startTime,
      end_time: endTime,
      status: "UPCOMING",
    })
    .select("id")
    .single();

  if (error) {
    return formatBookingError("Unable to create the booking right now.");
  }

  return {
    success: true as const,
    data: { bookingId: data.id },
  };
}

export async function updateBooking(input: UpdateBookingInput) {
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("resource_bookings")
    .select("*")
    .eq("id", input.id)
    .single();

  if (fetchError || !existing) {
    return formatBookingError("Booking not found.");
  }

  if (existing.status === "CANCELLED") {
    return formatBookingError("Cannot update a cancelled booking.");
  }

  const bookingDate = input.booking_date || existing.start_time.slice(0, 10);
  const startTime = input.start_time
    ? `${bookingDate}T${input.start_time}:00`
    : existing.start_time;
  const endTime = input.end_time
    ? `${bookingDate}T${input.end_time}:00`
    : existing.end_time;

  if (new Date(startTime) >= new Date(endTime)) {
    return formatBookingError("End time must be after start time.");
  }

  if (await hasTimeConflict(existing.asset_id, startTime, endTime, input.id)) {
    return formatBookingError(
      "This asset is already booked during the selected time.",
    );
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.booking_date || input.start_time) {
    updatePayload.start_time = startTime;
  }
  if (input.booking_date || input.end_time) {
    updatePayload.end_time = endTime;
  }
  if (input.purpose !== undefined) {
    updatePayload.purpose = input.purpose?.trim() || null;
  }
  if (input.status) {
    updatePayload.status = input.status;
  }

  const { data, error } = await supabase
    .from("resource_bookings")
    .update(updatePayload)
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) {
    return formatBookingError("Unable to update the booking right now.");
  }

  return {
    success: true as const,
    data: { bookingId: data.id },
  };
}

export async function cancelBooking(input: CancelBookingInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("resource_bookings")
    .update({
      status: "CANCELLED",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) {
    return formatBookingError("Unable to cancel the booking right now.");
  }

  return {
    success: true as const,
    data: { bookingId: data.id },
  };
}