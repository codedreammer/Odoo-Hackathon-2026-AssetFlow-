"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, List } from "lucide-react";

import { Error } from "@/components/common";

import { cancelBookingAction } from "../actions/booking-actions";
import { useBookingSearch } from "../hooks/use-booking-search";
import type { BookingListItem, BookingManagementData } from "../types";
import BookingCalendar from "./booking-calendar";
import BookingFormDialog from "./booking-form-dialog";
import BookingTable from "./booking-table";
import Toolbar from "./toolbar";

interface BookingScreenProps {
  initialData: BookingManagementData;
}

export function BookingScreen({ initialData }: BookingScreenProps) {
  const router = useRouter();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingListItem | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<BookingListItem | null>(null);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const {
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
  } = useBookingSearch(initialData);

  async function handleCancel(booking: BookingListItem) {
    setCancellingBooking(booking);
  }

  async function confirmCancel(booking: BookingListItem) {
    setPageError(null);
    setPendingBookingId(booking.id);

    const result = await cancelBookingAction({ id: booking.id });

    setPendingBookingId(null);
    setCancellingBooking(null);

    if (!result.success) {
      setPageError(
        result.error?.message ?? "Unable to cancel the booking right now.",
      );
      return;
    }

    router.refresh();
  }

  function cancelCancellation() {
    setCancellingBooking(null);
  }

  return (
    <>
      <BookingFormDialog
        assetOptions={initialData.assetOptions}
        mode="create"
        onOpenChange={setCreateDialogOpen}
        open={createDialogOpen}
        profileOptions={initialData.profileOptions}
      />

      <BookingFormDialog
        assetOptions={initialData.assetOptions}
        booking={editingBooking}
        mode="edit"
        onOpenChange={(open) => {
          if (!open) {
            setEditingBooking(null);
          }
        }}
        open={Boolean(editingBooking)}
        profileOptions={initialData.profileOptions}
      />

      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md mx-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Cancel Booking
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                onClick={cancelCancellation}
              >
                No, Keep Booking
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                onClick={() => confirmCancel(cancellingBooking)}
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {pageError ? (
          <Error
            className="rounded-xl"
            message={pageError}
            title="Unable to complete that action"
          />
        ) : null}

        <Toolbar
          allAssetOptions={allAssetOptions}
          assetFilter={assetFilter}
          dateFilter={dateFilter}
          filteredBookingsCount={filteredBookings.length}
          onAddClick={() => setCreateDialogOpen(true)}
          onAssetChange={setAssetFilter}
          onDateChange={setDateFilter}
          onSearchChange={setSearchValue}
          onStatusChange={setStatusFilter}
          searchValue={searchValue}
          statusFilter={statusFilter}
          statusOptions={statusOptions}
          totalBookings={initialData.bookings.length}
        />

        <div className="flex gap-2">
          <button
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
            List
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === "calendar"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
            onClick={() => setView("calendar")}
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </button>
        </div>

        {view === "list" ? (
          <BookingTable
            bookings={filteredBookings}
            onCancel={handleCancel}
            onEdit={setEditingBooking}
            pendingBookingId={pendingBookingId}
            searchValue={searchValue}
          />
        ) : (
          <BookingCalendar
            bookings={filteredBookings}
            onSelectDate={(date) => setDateFilter(date.toISOString().slice(0, 10))}
            selectedDate={dateFilter ? new Date(dateFilter) : null}
          />
        )}
      </div>
    </>
  );
}