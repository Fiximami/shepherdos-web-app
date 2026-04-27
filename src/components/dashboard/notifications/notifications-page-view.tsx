"use client";

import { BellRing, CalendarDays, HandCoins, HeartHandshake, Megaphone } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NotificationCategory = "Announcements" | "Events" | "Prayer" | "Giving";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  time: string;
  unread: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "New church announcement",
    description: "Midweek prayer location has been moved to Hall B for this Wednesday.",
    category: "Announcements",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n-2",
    title: "Event reminder",
    description: "Community outreach walk begins Saturday at 8:00 AM. Registration is still open.",
    category: "Events",
    time: "3h ago",
    unread: true,
  },
  {
    id: "n-3",
    title: "Prayer response update",
    description: "A care leader has responded to your recent prayer request with encouragement.",
    category: "Prayer",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n-4",
    title: "Giving receipt available",
    description: "Your offering contribution receipt for this week is now available in your giving history.",
    category: "Giving",
    time: "2 days ago",
    unread: false,
  },
];

const filters = ["All", "Announcements", "Events", "Prayer", "Giving"] as const;
type NotificationFilter = (typeof filters)[number];

const categoryIcons = {
  Announcements: Megaphone,
  Events: CalendarDays,
  Prayer: HeartHandshake,
  Giving: HandCoins,
} as const;

export function NotificationsPageView() {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("All");
  const [feedback, setFeedback] = useState("");

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") {
      return items;
    }
    return items.filter((item) => item.category === activeFilter);
  }, [activeFilter, items]);

  const unreadCount = items.filter((item) => item.unread).length;

  const markAllAsRead = () => {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
    setFeedback("All notifications marked as read in this preview.");
  };

  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.12)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title="Notifications"
            description="Stay up to date with church announcements, event reminders, prayer responses, giving receipts, and community alerts."
          />
        </div>
      </section>

      <Card className="shepherd-fade-in border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg">Your notifications</CardTitle>
              <CardDescription>Unread: {unreadCount}</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" className="h-8 rounded-lg" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    isActive
                      ? "border-primary/35 bg-primary/12 text-white"
                      : "border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]",
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-10 text-center">
              <p className="text-sm font-medium text-white">No notifications in this view.</p>
              <p className="mt-1 text-sm text-gray-400">
                New updates will appear here as announcements and reminders are shared.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredItems.map((item) => {
                const CategoryIcon = categoryIcons[item.category];

                return (
                  <article
                    key={item.id}
                    className={cn(
                      "rounded-xl border px-4 py-3 transition-colors",
                      item.unread
                        ? "border-blue-300/30 bg-blue-300/[0.08]"
                        : "border-white/10 bg-white/[0.04]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-gray-400">
                          <CategoryIcon className="size-3.5" aria-hidden />
                          {item.category}
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-gray-300">{item.description}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-gray-400">{item.time}</p>
                        {item.unread ? (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/12 px-2 py-0.5 text-[11px] text-primary">
                            <BellRing className="size-3" aria-hidden />
                            Unread
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {feedback ? <p className="text-xs text-gray-300">{feedback}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}
