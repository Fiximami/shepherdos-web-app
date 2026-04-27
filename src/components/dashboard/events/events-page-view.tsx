"use client";

import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MemberEvent = {
  id: string;
  title: string;
  category: "Service" | "Prayer" | "Community" | "Training";
  when: string;
  location: string;
  summary: string;
  details: string;
  featured?: boolean;
};

const memberEvents: MemberEvent[] = [
  {
    id: "event-1",
    title: "Sunday Celebration — Guest Sunday",
    category: "Service",
    when: "Sun, Apr 27 · 9:00 AM",
    location: "Main Campus · Sanctuary",
    summary: "A welcoming Sunday for members, first-timers, and invited guests.",
    details:
      "Join us for worship, a short welcome flow for guests, and a community prayer moment after service.",
    featured: true,
  },
  {
    id: "event-2",
    title: "Youth retreat — final briefing",
    category: "Training",
    when: "Fri, May 2 · 6:30 PM",
    location: "North Branch · Hall B",
    summary: "Final practical briefing for all registered youth retreat participants.",
    details:
      "Includes transport notes, parent Q&A, team prayer, and final volunteer assignments before departure.",
  },
  {
    id: "event-3",
    title: "Community outreach — neighborhood walk",
    category: "Community",
    when: "Sat, May 3 · 8:00 AM",
    location: "South Branch · Courtyard",
    summary: "A warm community touchpoint through prayer, care packs, and home visits.",
    details:
      "Meet by 7:30 AM for team grouping. Outreach teams will walk selected streets and pray with families.",
  },
  {
    id: "event-4",
    title: "Midweek prayer encounter",
    category: "Prayer",
    when: "Wed, May 7 · 6:00 PM",
    location: "Main Campus · Prayer Hall",
    summary: "A focused evening of worship and intercession for families and communities.",
    details:
      "Bring your prayer notes. The final 20 minutes will be dedicated to healing and thanksgiving requests.",
  },
] as const;

const calendarPreview = [
  {
    day: "Sun",
    dateLabel: "Apr 27",
    items: ["Guest Sunday · Main Campus", "Welcome huddle · 7:30 AM"],
  },
  {
    day: "Wed",
    dateLabel: "May 7",
    items: ["Midweek prayer · North Branch"],
  },
  { day: "Fri", dateLabel: "May 2", items: ["Youth retreat briefing"] },
  { day: "Sat", dateLabel: "May 3", items: ["Neighborhood outreach walk"] },
  { day: "Thu", dateLabel: "May 8", items: ["Care team prayer coverage"] },
] as const;

export function EventsPageView() {
  const featuredEvent = memberEvents.find((event) => event.featured) ?? memberEvents[0];
  const [selectedEventId, setSelectedEventId] = useState(featuredEvent.id);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([featuredEvent.id]);
  const [calendarFeedback, setCalendarFeedback] = useState("");

  const selectedEvent = useMemo(
    () => memberEvents.find((event) => event.id === selectedEventId) ?? featuredEvent,
    [featuredEvent, selectedEventId],
  );

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title="Events"
            description="Discover upcoming church gatherings, register in a few steps, and stay connected to moments that strengthen faith and community."
          />
        </div>
      </section>

      <section className="shepherd-fade-in">
        <Card className="border-amber-200/20 bg-white/[0.06] shadow-[0_20px_46px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="size-4 text-amber-200/90" aria-hidden />
              Featured upcoming event
            </CardTitle>
            <CardDescription>
              A highlighted moment we encourage members to prepare for this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs uppercase tracking-wide text-amber-100/80">{featuredEvent.category}</p>
              <h3 className="mt-1 text-base font-semibold text-white">{featuredEvent.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-300">
                <Clock3 className="size-3.5" aria-hidden />
                {featuredEvent.when}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-300">
                <MapPin className="size-3.5" aria-hidden />
                {featuredEvent.location}
              </p>
              <p className="mt-2 text-sm text-gray-300">{featuredEvent.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="h-9 rounded-lg"
                onClick={() =>
                  setRegisteredEventIds((current) =>
                    current.includes(featuredEvent.id) ? current : [featuredEvent.id, ...current],
                  )
                }
              >
                Register
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-lg"
                onClick={() => setSelectedEventId(featuredEvent.id)}
              >
                View details
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-lg"
                onClick={() => setCalendarFeedback(`"${featuredEvent.title}" will be connected to calendar sync soon.`)}
              >
                Add to calendar
              </Button>
            </div>
            {calendarFeedback ? (
              <p className="text-xs text-gray-400">{calendarFeedback}</p>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Event list</CardTitle>
              <CardDescription>Browse upcoming gatherings and register quickly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {memberEvents.map((event) => {
                const isRegistered = registeredEventIds.includes(event.id);
                const isSelected = selectedEventId === event.id;

                return (
                  <article
                    key={event.id}
                    className={cn(
                      "rounded-xl border bg-white/[0.04] p-4 transition-[transform,border-color,box-shadow] duration-250 ease-out hover:-translate-y-[1px] hover:shadow-[0_14px_30px_-24px_rgba(0,0,0,0.7)]",
                      isSelected ? "border-blue-300/40" : "border-white/10 hover:border-white/20",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-gray-400">{event.category}</p>
                        <h3 className="text-sm font-semibold text-white sm:text-base">{event.title}</h3>
                        <p className="mt-1 text-xs text-gray-300">{event.when}</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-300">
                          <MapPin className="size-3.5" aria-hidden />
                          {event.location}
                        </p>
                        <p className="mt-2 text-sm text-gray-300">{event.summary}</p>
                      </div>
                      {isRegistered ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[11px] text-emerald-200">
                          <CheckCircle2 className="size-3.5" aria-hidden />
                          Registered
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 rounded-lg px-3 text-xs"
                        onClick={() =>
                          setRegisteredEventIds((current) =>
                            current.includes(event.id) ? current : [event.id, ...current],
                          )
                        }
                      >
                        Register
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg px-3 text-xs"
                        onClick={() => setSelectedEventId(event.id)}
                      >
                        View details
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg px-3 text-xs"
                        onClick={() => setCalendarFeedback(`"${event.title}" will be connected to calendar sync soon.`)}
                      >
                        Add to calendar
                      </Button>
                    </div>
                  </article>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CalendarDays className="size-4 text-blue-200/90" aria-hidden />
                Calendar preview
              </CardTitle>
              <CardDescription>A light weekly glance to help you plan your rhythm.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {calendarPreview.map((day) => (
                  <div key={`${day.day}-${day.dateLabel}`} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      {day.day} · {day.dateLabel}
                    </p>
                    <ul className="mt-1.5 space-y-1 text-sm text-gray-300">
                      {day.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">My registrations</CardTitle>
              <CardDescription>Your confirmed event list in this preview build.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {registeredEventIds.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-6 text-center">
                  <p className="text-sm font-medium text-white">No registrations yet</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Start with one event above and it will appear here.
                  </p>
                </div>
              ) : (
                registeredEventIds.map((eventId) => {
                  const event = memberEvents.find((item) => item.id === eventId);
                  if (!event) {
                    return null;
                  }
                  return (
                    <article key={event.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
                      <p className="text-sm font-medium text-white">{event.title}</p>
                      <p className="mt-1 text-xs text-gray-400">{event.when}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-200">
                        <CheckCircle2 className="size-3.5" aria-hidden />
                        Registered
                      </p>
                    </article>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <HeartHandshake className="size-4 text-amber-200/90" aria-hidden />
                Event details preview
              </CardTitle>
              <CardDescription>Use “View details” from any event to focus this panel.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">{selectedEvent.category}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{selectedEvent.title}</h3>
                <p className="mt-1 text-xs text-gray-300">{selectedEvent.when}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-300">
                  <MapPin className="size-3.5" aria-hidden />
                  {selectedEvent.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{selectedEvent.details}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 h-8 rounded-lg px-3 text-xs"
                  onClick={() => setSelectedEventId(selectedEvent.id)}
                >
                  Keep this selected
                  <ArrowRight className="size-3.5" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
