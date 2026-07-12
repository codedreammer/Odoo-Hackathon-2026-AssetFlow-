"use client";

import { useState, useCallback } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCircle2,
  CheckCheck,
  Info,
  XCircle,
} from "lucide-react";
import { type Notification } from "@/features/notifications/actions";
import {
  formatRelativeTime,
  getNotificationVariant,
  VARIANT_STYLES,
  type NotificationIconVariant,
} from "@/lib/notification-ui";

// ─── Icon per variant ────────────────────────────────────────────────────────

function NotifIcon({
  variant,
  className,
}: {
  variant: NotificationIconVariant;
  className?: string;
}) {
  const props = { size: 18, strokeWidth: 1.8, className };
  switch (variant) {
    case "warning":
      return <AlertTriangle {...props} />;
    case "error":
      return <XCircle {...props} />;
    case "success":
      return <CheckCircle2 {...props} />;
    case "info":
      return <Info {...props} />;
    case "calendar":
      return <CalendarClock {...props} />;
    default:
      return <Bell {...props} />;
  }
}

// ─── Single notification row ─────────────────────────────────────────────────

function NotificationRow({
  notif,
  onMarkRead,
}: {
  notif: Notification;
  onMarkRead: (id: string) => void;
}) {
  const variant = getNotificationVariant(notif.type);
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`group relative flex gap-4 border-b border-[#F0F2F5] px-6 py-4 transition-colors hover:bg-[#F8F9FB] ${
        !notif.is_read ? "bg-[#FAFBFF]" : "bg-white"
      }`}
      id={`notif-${notif.id}`}
    >
      {/* Unread dot */}
      {!notif.is_read && (
        <span className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#4F46E5]" />
      )}

      {/* Icon circle */}
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${styles.bg} ${styles.border}`}
      >
        <NotifIcon variant={variant} className={styles.icon} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={`text-[13px] font-semibold leading-snug ${notif.is_read ? "text-[#374151]" : "text-[#0F1117]"}`}>
              {notif.title}
              {!notif.is_read && (
                <span className="ml-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-[#4F46E5]" />
              )}
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[#6B7280]">{notif.message}</p>
          </div>
          <span className="flex-shrink-0 text-[11px] text-[#9CA3AF]">
            {formatRelativeTime(notif.created_at)}
          </span>
        </div>
      </div>

      {/* Mark read button — appears on hover when unread */}
      {!notif.is_read && (
        <button
          onClick={() => onMarkRead(notif.id)}
          title="Mark as read"
          className="absolute right-5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#9CA3AF] opacity-0 transition-opacity hover:bg-[#F3F4F6] hover:text-[#4F46E5] group-hover:opacity-100"
        >
          <CheckCheck size={15} />
        </button>
      )}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F4F6]">
        <Bell size={24} className="text-[#9CA3AF]" strokeWidth={1.5} />
      </div>
      <p className="text-[14px] font-medium text-[#374151]">You're all caught up</p>
      <p className="mt-1 text-[12px] text-[#9CA3AF]">No notifications to show right now.</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NotificationList({
  notifications: initial,
}: {
  notifications: Notification[];
}) {
  const [notifications, setNotifications] = useState<Notification[]>(initial);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const total = notifications.length;

  const markOneRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }, []);

  const markAllRead = useCallback(async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setMarkingAll(false);
  }, [markingAll, unreadCount]);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#0F1117]">Notifications</h1>
          {total > 0 && (
            <p className="mt-1 text-[13px] text-[#6B7280]">
              {unreadCount > 0 ? (
                <>
                  <span className="font-medium text-[#0F1117]">{unreadCount} unread</span>
                  {" · "}
                </>
              ) : null}
              {total} total
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            id="mark-all-read-btn"
            onClick={markAllRead}
            disabled={markingAll}
            className="flex items-center gap-1.5 rounded-md border border-[#E4E7EC] px-3.5 py-2 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#FAFAFA] disabled:opacity-50"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification card */}
      <div className="overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y-0">
            {notifications.map((notif) => (
              <NotificationRow
                key={notif.id}
                notif={notif}
                onMarkRead={markOneRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
