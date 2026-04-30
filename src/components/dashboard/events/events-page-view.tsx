"use client";

import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  LocateFixed,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appendSmartAttendanceRecord, readSmartAttendanceRecords } from "@/lib/smart-attendance-storage";
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
  startsAtISO: string;
  endsAtISO: string;
  checkInOpenMinutesBefore: number;
  checkInCloseMinutesAfter: number;
  locationLat: number;
  locationLng: number;
  allowedRadiusMeters: number;
};

type AttendanceStatus = "Verified" | "Late" | "Location Mismatch" | "Manual Override" | "Suspicious Pattern";

type AttendanceRecord = {
  member_id: string;
  event_id: string;
  timestamp: string;
  location: { lat: number; lng: number };
  status: AttendanceStatus;
  verification_notes: string;
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
    startsAtISO: "2026-04-27T09:00:00",
    endsAtISO: "2026-04-27T11:00:00",
    checkInOpenMinutesBefore: 30,
    checkInCloseMinutesAfter: 20,
    locationLat: 5.6037,
    locationLng: -0.187,
    allowedRadiusMeters: 250,
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
    startsAtISO: "2026-05-02T18:30:00",
    endsAtISO: "2026-05-02T20:00:00",
    checkInOpenMinutesBefore: 20,
    checkInCloseMinutesAfter: 15,
    locationLat: 5.6168,
    locationLng: -0.2059,
    allowedRadiusMeters: 250,
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
    startsAtISO: "2026-05-03T08:00:00",
    endsAtISO: "2026-05-03T10:00:00",
    checkInOpenMinutesBefore: 25,
    checkInCloseMinutesAfter: 30,
    locationLat: 5.5902,
    locationLng: -0.2214,
    allowedRadiusMeters: 320,
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
    startsAtISO: "2026-05-07T18:00:00",
    endsAtISO: "2026-05-07T19:30:00",
    checkInOpenMinutesBefore: 20,
    checkInCloseMinutesAfter: 20,
    locationLat: 5.6031,
    locationLng: -0.1888,
    allowedRadiusMeters: 250,
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
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [calendarFeedback, setCalendarFeedback] = useState("");
  const [pendingCheckIn, setPendingCheckIn] = useState<{
    event: MemberEvent;
    timestampISO: string;
    location: { lat: number; lng: number };
    status: AttendanceStatus;
    notes: string;
  } | null>(null);

  useEffect(() => {
    const existing = readSmartAttendanceRecords();
    if (existing.length > 0) {
      setAttendanceRecords(existing);
    }
  }, []);

  const selectedEvent = useMemo(
    () => memberEvents.find((event) => event.id === selectedEventId) ?? featuredEvent,
    [featuredEvent, selectedEventId],
  );

  const suspiciousCount = useMemo(
    () => attendanceRecords.filter((r) => r.status === "Location Mismatch" || r.status === "Suspicious Pattern").length,
    [attendanceRecords],
  );
  const trustScore = useMemo(() => {
    if (attendanceRecords.length === 0) return 100;
    return Math.max(
      0,
      Math.round(
        attendanceRecords.reduce((score, record) => {
          if (record.status === "Verified") return score + 4;
          if (record.status === "Late") return score + 1;
          if (record.status === "Manual Override") return score - 2;
          if (record.status === "Location Mismatch") return score - 10;
          return score - 14;
        }, 70) / attendanceRecords.length,
      ) * 10,
    );
  }, [attendanceRecords]);
  const trustTone =
    trustScore >= 75
      ? "border-emerald-500/25 bg-emerald-950/30 text-emerald-100"
      : trustScore >= 50
        ? "border-amber-500/25 bg-amber-950/30 text-amber-100"
        : "border-rose-500/25 bg-rose-950/30 text-rose-100";

  function distanceInMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const r = 6371000;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * r * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  async function detectLocation(event: MemberEvent) {
    if ("geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 }),
        );
        return { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch {
        // fallback mock location near event point
      }
    }
    return {
      lat: event.locationLat + (Math.random() - 0.5) * 0.004,
      lng: event.locationLng + (Math.random() - 0.5) * 0.004,
    };
  }

  async function startCheckIn(event: MemberEvent) {
    const now = new Date();
    const startsAt = new Date(event.startsAtISO);
    const endsAt = new Date(event.endsAtISO);
    const openAt = new Date(startsAt.getTime() - event.checkInOpenMinutesBefore * 60_000);
    const closeAt = new Date(endsAt.getTime() + event.checkInCloseMinutesAfter * 60_000);
    const location = await detectLocation(event);
    const metersAway = distanceInMeters(location.lat, location.lng, event.locationLat, event.locationLng);

    let status: AttendanceStatus = "Verified";
    const notes: string[] = [];

    if (metersAway > event.allowedRadiusMeters) {
      status = "Location Mismatch";
      notes.push(`Outside location radius (${Math.round(metersAway)}m from event).`);
    }

    if (now < openAt || now > closeAt) {
      status = status === "Location Mismatch" ? "Suspicious Pattern" : "Late";
      notes.push("Outside standard check-in time window.");
    }

    const recentByMember = attendanceRecords.filter((r) => r.member_id === "member-001").slice(0, 3);
    if (recentByMember.length >= 2 && recentByMember.every((r) => r.status === "Location Mismatch")) {
      status = "Suspicious Pattern";
      notes.push("Repeated location mismatch detected.");
    }

    setPendingCheckIn({
      event,
      timestampISO: now.toISOString(),
      location,
      status,
      notes: notes.length > 0 ? notes.join(" ") : "Check-in validated within expected rules.",
    });
  }

  function confirmCheckIn() {
    if (!pendingCheckIn) return;
    const record: AttendanceRecord = {
      member_id: "member-001",
      event_id: pendingCheckIn.event.id,
      timestamp: pendingCheckIn.timestampISO,
      location: pendingCheckIn.location,
      status: pendingCheckIn.status,
      verification_notes: pendingCheckIn.notes,
    };
    setAttendanceRecords((cur) => [record, ...cur]);
    appendSmartAttendanceRecord(record);
    setCalendarFeedback(`Attendance marked for "${pendingCheckIn.event.title}" as ${pendingCheckIn.status}.`);
    setPendingCheckIn(null);
  }

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
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/5 px-3 py-2.5">
            <p className="text-xs text-amber-100/90">
              Attendance check-in is enabled. Use <span className="font-semibold">Mark Present</span> to validate your presence by time and location.
            </p>
            <Button type="button" size="sm" className="h-8 rounded-lg" onClick={() => startCheckIn(selectedEvent)}>
              <LocateFixed className="size-3.5" aria-hidden />
              Mark Present for selected event
            </Button>
          </div>
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
              <Button size="sm" variant="outline" className="h-9 rounded-lg" onClick={() => startCheckIn(featuredEvent)}>
                <LocateFixed className="size-3.5" aria-hidden />
                Mark Present
              </Button>
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
                        variant="outline"
                        className="h-8 rounded-lg px-3 text-xs"
                        onClick={() => startCheckIn(event)}
                      >
                        <LocateFixed className="size-3.5" aria-hidden />
                        Mark Present
                      </Button>
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

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Smart check-in records</CardTitle>
              <CardDescription>
                Trust-based attendance validation using time window and approximate location checks. Flagged records: {suspiciousCount}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className={cn("rounded-xl border px-3.5 py-3", trustTone)}>
                <p className="text-xs uppercase tracking-wide opacity-85">Member trust score</p>
                <p className="mt-1 text-lg font-semibold">{trustScore}%</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/25">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      trustScore >= 75 ? "bg-emerald-400/70" : trustScore >= 50 ? "bg-amber-400/70" : "bg-rose-400/70",
                    )}
                    style={{ width: `${trustScore}%` }}
                  />
                </div>
              </div>
              {attendanceRecords.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-5 text-center text-xs text-gray-400">
                  Use “Mark Present” on an event to create a validated attendance record.
                </div>
              ) : (
                attendanceRecords.map((record, idx) => (
                  <article key={`${record.event_id}-${record.timestamp}-${idx}`} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
                    <p className="text-sm font-medium text-white">{memberEvents.find((e) => e.id === record.event_id)?.title ?? record.event_id}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(record.timestamp).toLocaleString("en-GB")} · {record.location.lat.toFixed(4)}, {record.location.lng.toFixed(4)}
                    </p>
                    <p className="mt-1 text-[11px] text-amber-100/90">{record.status}</p>
                  </article>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {pendingCheckIn ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0d1b2b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="text-sm font-semibold text-white">Confirm Check-In</p>
              <button
                type="button"
                onClick={() => setPendingCheckIn(null)}
                className="rounded-md border border-white/15 px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.06]"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 p-5 text-sm text-slate-300">
              <p><span className="text-slate-500">Event:</span> {pendingCheckIn.event.title}</p>
              <p><span className="text-slate-500">Detected time:</span> {new Date(pendingCheckIn.timestampISO).toLocaleString("en-GB")}</p>
              <p>
                <span className="text-slate-500">Detected location:</span>{" "}
                {pendingCheckIn.location.lat.toFixed(4)}, {pendingCheckIn.location.lng.toFixed(4)}
              </p>
              <p><span className="text-slate-500">Validation:</span> {pendingCheckIn.status}</p>
              <p className="text-xs text-slate-400">{pendingCheckIn.notes}</p>
              <Button type="button" className="h-9 rounded-lg" onClick={confirmCheckIn}>
                Confirm attendance
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
