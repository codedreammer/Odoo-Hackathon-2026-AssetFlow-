"use client";

import { useDeferredValue, useState } from "react";

import type { BookingListItem, BookingManagementData, BookingStatus } from "../types";

export const ALL_BOOKING_STATUS_FILTER = "ALL_STATUSES";
export const ALL_ASSET_FILTER = "ALL_ASSETS";

export function useBookingSearch(data: BookingManagementData) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    BookingStatus | typeof ALL_BOOKING_STATUS_FILTER
  >(ALL_BOOKING_STATUS_FILTER);
  const [assetFilter, setAssetFilter] = useState(ALL_ASSET_FILTER);
  const [dateFilter, setDateFilter] = useState("");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredBookings = data.bookings.filter((booking) => {
    const matchesStatus =
      statusFilter === ALL_BOOKING_STATUS_FILTER || booking.status === statusFilter;

    const matchesAsset =
      assetFilter === ALL_ASSET_FILTER || booking.asset_id === assetFilter;

    const matchesDate =
      !dateFilter || booking.start_time.startsWith(dateFilter);

    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      (booking.asset_name ?? "").toLowerCase().includes(normalizedSearchValue) ||
      (booking.employee_name ?? "").toLowerCase().includes(normalizedSearchValue) ||
      (booking.purpose ?? "").toLowerCase().includes(normalizedSearchValue);

    return matchesStatus && matchesAsset && matchesDate && matchesSearch;
  });

  const allAssetOptions = [
    { label: "All assets", value: ALL_ASSET_FILTER },
    ...data.assetOptions,
  ];

  const statusOptions: { label: string; value: BookingStatus | typeof ALL_BOOKING_STATUS_FILTER }[] = [
    { label: "All statuses", value: ALL_BOOKING_STATUS_FILTER },
    ...["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].map((status) => ({
      label: status.replace(/_/g, " "),
      value: status as BookingStatus,
    })),
  ];

  return {
    allAssetOptions,
    assetFilter,
    dateFilter,
    filteredBookings,
    searchValue,
    setAssetFilter,
    setDateFilter,
    setSearchValue,
    setStatusFilter,
    statusFilter,
    statusOptions,
  };
}