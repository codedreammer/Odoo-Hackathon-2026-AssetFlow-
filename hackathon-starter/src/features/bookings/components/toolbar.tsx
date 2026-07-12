"use client";

import { Plus } from "lucide-react";

import { BackButton, PageHeader, SearchBar } from "@/components/common";
import { Button, Input, Select } from "@/components/ui";

import {
  ALL_ASSET_FILTER,
  ALL_BOOKING_STATUS_FILTER,
} from "../hooks/use-booking-search";
import type { AssetOption, BookingStatus } from "../types";

interface ToolbarProps {
  allAssetOptions: AssetOption[];
  assetFilter: string;
  dateFilter: string;
  filteredBookingsCount: number;
  onAddClick: () => void;
  onAssetChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: BookingStatus | typeof ALL_BOOKING_STATUS_FILTER,
  ) => void;
  searchValue: string;
  statusFilter: BookingStatus | typeof ALL_BOOKING_STATUS_FILTER;
  statusOptions: { label: string; value: BookingStatus | typeof ALL_BOOKING_STATUS_FILTER }[];
  totalBookings: number;
}

export default function Toolbar({
  allAssetOptions,
  assetFilter,
  dateFilter,
  filteredBookingsCount,
  onAddClick,
  onAssetChange,
  onDateChange,
  onSearchChange,
  onStatusChange,
  searchValue,
  statusFilter,
  statusOptions,
  totalBookings,
}: ToolbarProps) {
  return (
    <div className="space-y-4">
      <PageHeader
        actions={
          <>
            <BackButton fallback="/bookings" />
            <Button className="gap-2 ml-2" onClick={onAddClick}>
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
          </>
        }
        description="Manage resource bookings, schedules, and asset reservations."
        eyebrow="Bookings"
        title="Resource Booking"
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full lg:max-w-sm">
          <SearchBar
            inputLabel="Search bookings"
            placeholder="Search asset, booked by, purpose..."
            value={searchValue}
            onValueChange={onSearchChange}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:w-[520px]">
          <Select
            aria-label="Filter bookings by status"
            options={statusOptions}
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(
                event.target.value as
                  | BookingStatus
                  | typeof ALL_BOOKING_STATUS_FILTER,
              )
            }
          />

          <Select
            aria-label="Filter bookings by asset"
            options={allAssetOptions}
            value={assetFilter}
            onChange={(event) => onAssetChange(event.target.value)}
          />

          <Input
            aria-label="Filter bookings by date"
            type="date"
            value={dateFilter}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </div>

        <div className="text-sm text-zinc-500 dark:text-zinc-400 lg:ml-auto">
          Showing {filteredBookingsCount} of {totalBookings} bookings
        </div>
      </div>
    </div>
  );
}