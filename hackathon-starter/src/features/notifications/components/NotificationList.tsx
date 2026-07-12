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

import { BackButton, PageHeader } from "@/components/common";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";

function NotifIcon({
  variant,
  className,
}: {
  variant: NotificationIconVariant;
  className?: string;
}) {
  const props = { size: 18, strokeWidth: 2, className };
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
      className={`group relative flex gap-4 border-b border-zinc-200 px-6 py-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50 ${
        !notif.is_read ? "bg-blue-50/50 dark:bg-blue-950/20" : "bg-white dark:bg-zinc-950"
      }`}
      id={`notif-${notif.id}`}
    >
      {!notif.is_read && (
        <span className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-600" />
      )}

      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${styles.bg} ${styles.border}`}>
        <NotifIcon variant={variant} className={styles.icon} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={`text-sm font-semibold leading-snug ${notif.is_read ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-950 dark:text-zinc-50"}`}>
              {notif.title}
              {!notif.is_read && (
                <span className="ml-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-blue-600" />
              )}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{notif.message}</p>
          </div>
          <span className="flex-shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
            {formatRelativeTime(notif.created_at)}
          </span>
        </div>
      </div>

      {!notif.is_read && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 group-hover:opacity-100"
          onClick={() => onMarkRead(notif.id)}
          aria-label="Mark as read"
        >
          <CheckCheck size={15} />
        </Button>
      )}
    </div>
  );
}

interface NotificationListProps {
  initialNotifications: Notification[];
  unreadCount: number;
}

export function NotificationList({ initialNotifications, unreadCount }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [markingAll, setMarkingAll] = useState(false);

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
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            <BackButton fallback="/notifications" />
            {unreadCount > 0 ? (
              <Button
                variant="outline"
                size="sm"
                disabled={markingAll}
                onClick={markAllRead}
                className="gap-1.5 ml-4"
              >
                <CheckCheck size={14} />
                <span>{markingAll ? <Spinner size="sm" /> : "Mark all read"}</span>
              </Button>
            ) : null}
          </>
        }
        description={
          total > 0
            ? (
              <>
                {unreadCount > 0 && (
                  <>
                    <span className="font-medium text-zinc-950 dark:text-zinc-50">{unreadCount} unread</span>
                    <span className="mx-2 text-zinc-500 dark:text-zinc-400">·</span>
                  </>
                )}
                <span>{total} total</span>
              </>
            )
            : null
        }
        title="Notifications"
      />

      <Card className="overflow-hidden">
        {notifications.length === 0 ? (
          <EmptyState
            className="p-12"
            icon={<Bell className="h-12 w-12 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />}
            title="You're all caught up"
            description="No notifications to show right now."
          />
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {notifications.map((notif) => (
              <NotificationRow key={notif.id} notif={notif} onMarkRead={markOneRead} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}