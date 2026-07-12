"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { format } from "date-fns";

import type { BookingListItem } from "../types";

interface BookingCalendarProps {
  bookings: BookingListItem[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function BookingCalendar({
  bookings,
  onSelectDate,
  selectedDate,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, BookingListItem[]>();
    bookings.forEach((booking) => {
      const dayKey = format(new Date(booking.start_time), "yyyy-MM-dd");
      if (!map.has(dayKey)) map.set(dayKey, []);
      map.get(dayKey)!.push(booking);
    });
    return map;
  }, [bookings]);

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();

  const days: (Date | null)[] = Array.from({ length: startDay }, () => null);
  for (let d = 1; d <= endOfMonth.getDate(); d++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
  }

  const prevMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <Card className="rounded-2xl">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-px mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square border border-zinc-100 dark:border-zinc-900"
                />
              );
            }

            const dayKey = format(day, "yyyy-MM-dd");
            const dayBookings = bookingsByDay.get(dayKey) || [];
            const isSelected = selectedDate && format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <button
                key={dayKey}
                type="button"
                className={`
                  aspect-square border p-2 text-left transition-colors
                  ${isSelected
                    ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                    : "border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }
                  ${isToday ? "font-semibold text-zinc-900 dark:text-zinc-50" : ""}
                `}
                onClick={() => onSelectDate(day)}
              >
                <span className="text-sm">{day.getDate()}</span>
{dayBookings.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-[10px] w-full text-center">
                      {dayBookings.length}
                    </Badge>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default BookingCalendar;