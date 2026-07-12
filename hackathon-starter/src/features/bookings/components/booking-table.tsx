"use client";

import { NoData } from "@/components/common";
import { Badge, Card } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatDate, formatDateTime } from "@/lib/format-date";

import type { BookingListItem } from "../types";
import BookingMenu from "./booking-menu";

interface BookingTableProps {
  bookings: BookingListItem[];
  onCancel: (booking: BookingListItem) => void;
  onEdit: (booking: BookingListItem) => void;
  pendingBookingId: string | null;
  searchValue: string;
}

function getStatusVariant(status: BookingListItem["status"]) {
  switch (status) {
    case "UPCOMING":
      return "secondary";
    case "ONGOING":
      return "default";
    case "COMPLETED":
      return "outline";
    case "CANCELLED":
    default:
      return "destructive";
  }
}

function getStatusLabel(status: BookingListItem["status"]) {
  return status.replace(/_/g, " ");
}

export default function BookingTable({
  bookings,
  onCancel,
  onEdit,
  pendingBookingId,
  searchValue,
}: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <Card className="rounded-2xl p-6">
        <NoData
          description={
            searchValue
              ? `No bookings match "${searchValue}".`
              : "Create a new booking to get started."
          }
          title={searchValue ? "No matching bookings" : "No bookings yet"}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Booking ID</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Booked By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const statusVariant = getStatusVariant(booking.status);
            const startDate = new Date(booking.start_time);
            const endDate = new Date(booking.end_time);

            return (
              <TableRow key={booking.id} className="hover:bg-zinc-50">
                <TableCell>
                  <p className="font-mono text-sm text-zinc-500">
                    {booking.id.slice(0, 8)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {booking.asset_name ?? "Unknown Asset"}
                    </h3>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {booking.employee_name ?? "Unknown User"}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {formatDate(startDate)}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {formatDateTime(startDate).split(" ").slice(1).join(" ")}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {formatDateTime(endDate).split(" ").slice(1).join(" ")}
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-zinc-600 dark:text-zinc-300">
                  {booking.purpose ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant}>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <BookingMenu
                    booking={booking}
                    disabled={pendingBookingId === booking.id}
                    onCancel={onCancel}
                    onEdit={onEdit}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}