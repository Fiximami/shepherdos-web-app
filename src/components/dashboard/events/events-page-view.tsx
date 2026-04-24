"use client";

import {
  CalendarDays,
  CalendarPlus,
  MapPin,
  Ticket,
  Users,
  UserPlus,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const upcomingEvents = [
  {
    title: "Sunday Celebration — Guest Sunday",
    when: "Sun, Apr 27 · 9:00 AM",
    location: "Main Campus · Sanctuary",
    branch: "Main Campus",
    registered: 412,
    capacity: 520,
  },
  {
    title: "Youth retreat — final briefing",
    when: "Fri, May 2 · 6:30 PM",
    location: "North Branch · Hall B",
    branch: "North Branch",
    registered: 58,
    capacity: 60,
  },
  {
    title: "Community outreach — neighborhood walk",
    when: "Sat, May 3 · 8:00 AM",
    location: "South Branch · Courtyard",
    branch: "South Branch",
    registered: 44,
    capacity: 80,
  },
  {
    title: "Leaders training — communication rhythm",
    when: "Thu, May 8 · 5:00 PM",
    location: "Main Campus · Conference room",
    branch: "Main Campus",
    registered: 31,
    capacity: 40,
  },
] as const;

type TimelineDay = {
  day: string;
  dateLabel: string;
  items: readonly string[];
};

const timelineWeek: TimelineDay[] = [
  {
    day: "Sun",
    dateLabel: "Apr 27",
    items: ["Guest Sunday · Main Campus", "Hospitality huddle · 7:30 AM"],
  },
  {
    day: "Wed",
    dateLabel: "Apr 30",
    items: ["Midweek prayer · North Branch"],
  },
  { day: "Fri", dateLabel: "May 2", items: ["Youth retreat briefing"] },
  { day: "Sat", dateLabel: "May 3", items: ["Neighborhood outreach walk"] },
  { day: "Thu", dateLabel: "May 8", items: ["Leaders training session"] },
];

const recentRegistrations = [
  {
    member: "Samuel Okoro",
    event: "Guest Sunday",
    registeredAt: "2026-04-24 · 10:12 AM",
    status: "Confirmed" as const,
  },
  {
    member: "Deborah Afolabi",
    event: "Youth retreat",
    registeredAt: "2026-04-24 · 9:05 AM",
    status: "Confirmed" as const,
  },
  {
    member: "Moses Bassey",
    event: "Neighborhood outreach",
    registeredAt: "2026-04-23 · 4:40 PM",
    status: "Waitlist" as const,
  },
  {
    member: "Grace Nwosu",
    event: "Leaders training",
    registeredAt: "2026-04-23 · 2:18 PM",
    status: "Confirmed" as const,
  },
] as const;

export function EventsPageView() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Events"
        description="See what is ahead, who is planning to come, and where a little coordination can make gatherings feel welcoming—not rushed."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button className="h-10 rounded-xl">
              <CalendarPlus className="size-4" aria-hidden />
              Add event
            </Button>
            <Button variant="outline" className="h-10 rounded-xl">
              <CalendarDays className="size-4" aria-hidden />
              Export schedule
            </Button>
          </div>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Upcoming (next 14 days)"
          value="9"
          detail="Services, trainings, and outreach on the calendar"
          icon={CalendarDays}
        />
        <SummaryCard
          label="Open for registration"
          value="4"
          detail="Still welcoming sign-ups"
          icon={Ticket}
        />
        <SummaryCard
          label="Registrations this week"
          value="64"
          detail="Across branches and age groups"
          icon={UserPlus}
        />
        <SummaryCard
          label="Events this month"
          value="18"
          detail="Including recurring gatherings"
          icon={Users}
        />
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Upcoming events</CardTitle>
            <CardDescription>
              The next few gatherings your teams are stewarding—capacity and place kept
              visible so nothing slips quietly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="rounded-xl border border-border/70 bg-background/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-foreground sm:text-base">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{event.when}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      {event.location}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium tabular-nums text-foreground">
                      {event.registered}/{event.capacity}
                    </p>
                    <p className="text-xs text-muted-foreground">registered</p>
                    <p className="mt-1 text-xs text-muted-foreground">{event.branch}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">This week at a glance</CardTitle>
            <CardDescription>
              A simple timeline view—no external calendar yet, just the rhythm your
              leaders need to stay coordinated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-1">
              <div
                className="absolute left-[15px] top-2 bottom-2 w-px bg-border/80"
                aria-hidden
              />
              <div className="space-y-5">
                {timelineWeek.map((day) => (
                  <div key={`${day.day}-${day.dateLabel}`} className="relative flex gap-4 pl-1">
                    <div
                      className="relative z-[1] mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-card text-xs font-semibold text-foreground"
                      aria-hidden
                    >
                      {day.day.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1 rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {day.day} · {day.dateLabel}
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                        {day.items.map((item) => (
                          <li key={item} className="leading-snug">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent registrations</CardTitle>
            <CardDescription>
              Fresh sign-ups so hosts and follow-up teams can greet people by name.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentRegistrations.map((row) => (
              <div
                key={`${row.member}-${row.event}`}
                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{row.member}</p>
                  <p className="text-sm text-muted-foreground">{row.event}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.registeredAt}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium",
                    row.status === "Confirmed" &&
                      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                    row.status === "Waitlist" &&
                      "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                  )}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
