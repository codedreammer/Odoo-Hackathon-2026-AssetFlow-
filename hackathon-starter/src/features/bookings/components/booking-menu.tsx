"use client";

import { Edit, MoreHorizontal, XCircle } from "lucide-react";

import { Dropdown } from "@/components/ui";

import type { BookingListItem } from "../types";

interface BookingMenuProps {
  booking: BookingListItem;
  disabled?: boolean;
  onCancel: (booking: BookingListItem) => void;
  onEdit: (booking: BookingListItem) => void;
}

export default function BookingMenu({
  booking,
  disabled = false,
  onCancel,
  onEdit,
}: BookingMenuProps) {
  const isCancelled = booking.status === "CANCELLED";

  const menuItems = [
    {
      label: (
        <span className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Booking
        </span>
      ),
      onSelect: () => onEdit(booking),
      disabled: disabled || isCancelled,
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          Cancel Booking
        </span>
      ),
      onSelect: () => onCancel(booking),
      destructive: true,
      disabled: disabled || isCancelled,
    },
  ];

  return (
    <Dropdown
      align="end"
      items={menuItems}
      label={<MoreHorizontal className="h-5 w-5" />}
      triggerClassName="h-8 w-8 p-0"
    />
  );
}