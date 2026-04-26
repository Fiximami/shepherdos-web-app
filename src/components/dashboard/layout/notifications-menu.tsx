"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  title: string;
  meta: string;
  leadershipOnly?: boolean;
  read?: boolean;
};

const mockNotifications: NotificationItem[] = [
  { id: "n-1", title: "New announcement posted", meta: "Communication · 1h ago", read: false },
  { id: "n-2", title: "Event reminder for this weekend", meta: "Events · 3h ago", read: false },
  { id: "n-3", title: "Prayer request received", meta: "Engagement · Yesterday", read: false },
  {
    id: "n-4",
    title: "Finance approval pending",
    meta: "Finance · 2h ago",
    leadershipOnly: true,
    read: false,
  },
  {
    id: "n-5",
    title: "New member joined",
    meta: "Members · Yesterday",
    leadershipOnly: true,
    read: true,
  },
];

const leadershipRoles = new Set(["admin", "owner", "pastor", "finance", "leader"]);

export function NotificationsMenu({ role }: { role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [readState, setReadState] = useState<Record<string, boolean>>({});

  const visibleItems = useMemo(() => {
    const leadership = leadershipRoles.has(role);
    return mockNotifications.filter((item) => (item.leadershipOnly ? leadership : true));
  }, [role]);

  const unreadCount = visibleItems.filter((item) => !(readState[item.id] ?? item.read)).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="relative rounded-xl text-gray-300 hover:bg-white/10 hover:text-white"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
      >
        <Bell className="size-4" aria-hidden />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
        ) : null}
      </Button>

      {isOpen ? (
        <div
          className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-white/10 bg-[#102338]/95 p-2 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="mb-1 flex items-center justify-between gap-2 px-2 py-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Notifications</p>
            <button
              type="button"
              onClick={() => {
                const updated = visibleItems.reduce<Record<string, boolean>>((acc, item) => {
                  acc[item.id] = true;
                  return acc;
                }, {});
                setReadState((current) => ({ ...current, ...updated }));
              }}
              className="text-[11px] text-gray-300 transition-colors hover:text-white"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-1">
            {visibleItems.map((item) => {
              const isRead = readState[item.id] ?? item.read ?? false;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg border border-transparent px-3 py-2 transition-colors",
                    isRead ? "bg-white/[0.03]" : "bg-white/[0.08] border-white/10",
                  )}
                >
                  <p className="text-sm text-white">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.meta}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-right">
            <Link
              href="/engagement"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
