"use client";

import {
  Bell,
  CalendarDays,
  Gift,
  HeartHandshake,
  MessageCircleHeart,
  PartyPopper,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const upcomingEvents = [
  { title: "Sunday Celebration Service", when: "Tomorrow · 9:00 AM", place: "Main Campus" },
  { title: "Midweek Prayer Gathering", when: "Wed · 6:30 PM", place: "North Branch" },
  { title: "Community Outreach Walk", when: "Sat · 8:00 AM", place: "South Branch" },
] as const;

const prayerSummary = [
  "11 prayer requests are currently being covered by care teams this week.",
  "3 requests need a follow-up call before Tuesday evening.",
] as const;

const celebrations = [
  "Happy birthday to Miriam (Choir) and Daniel (Youth)!",
  "2-year membership milestone for the Aina family.",
  "Baptism thanksgiving testimonies coming up this Sunday.",
] as const;

const notifications = [
  { title: "Reminder: youth retreat briefing moved to Friday", time: "2h ago" },
  { title: "You were tagged in a follow-up note for a first-time guest", time: "Yesterday" },
  { title: "Service team rota for next week is available", time: "2 days ago" },
] as const;

const communityFeed = [
  {
    author: "Grace Community Team",
    message: "Thank you to everyone who served at outreach this weekend. 18 families were visited.",
    time: "Today",
  },
  {
    author: "Hospitality Ministry",
    message: "New volunteers orientation starts after service next Sunday.",
    time: "Yesterday",
  },
] as const;

export function DashboardHome() {
  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Welcome back"
        description="Your member dashboard keeps church life close and clear—upcoming moments, care updates, and community highlights in one calm place."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CalendarDays className="size-4 text-primary" aria-hidden />
              Upcoming events
            </CardTitle>
            <CardDescription>What is coming next in your church rhythm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="rounded-xl border border-border/60 bg-background/65 px-4 py-3">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.when} · {event.place}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <HeartHandshake className="size-4 text-primary" aria-hidden />
              Prayer requests summary
            </CardTitle>
            <CardDescription>Care moments that need gentle attention this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {prayerSummary.map((line) => (
              <p key={line} className="rounded-lg border border-border/60 bg-background/65 px-3 py-2 text-sm text-muted-foreground">
                {line}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Gift className="size-4 text-primary" aria-hidden />
              Giving summary
            </CardTitle>
            <CardDescription>
              A simple stewardship snapshot for your personal view this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-background/65 px-4 py-3">
                <p className="text-xs text-muted-foreground">This month</p>
                <p className="mt-1 text-lg font-semibold text-foreground">₦45,000</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/65 px-4 py-3">
                <p className="text-xs text-muted-foreground">Last gift</p>
                <p className="mt-1 text-lg font-semibold text-foreground">₦10,000</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/65 px-4 py-3">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="mt-1 text-lg font-semibold text-foreground">Offering</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <PartyPopper className="size-4 text-primary" aria-hidden />
              My celebrations
            </CardTitle>
            <CardDescription>
              Joyful moments from your church family this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {celebrations.map((item) => (
              <p key={item} className="rounded-lg border border-border/60 bg-background/65 px-3 py-2 text-sm text-muted-foreground">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="size-4 text-primary" aria-hidden />
              Notifications preview
            </CardTitle>
            <CardDescription>
              A quick glance at recent updates relevant to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {notifications.map((item) => (
              <div key={item.title} className="rounded-xl border border-border/60 bg-background/65 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground">{item.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MessageCircleHeart className="size-4 text-primary" aria-hidden />
              Community feed preview
            </CardTitle>
            <CardDescription>
              Shared moments from church life to keep you connected and encouraged.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {communityFeed.map((post) => (
              <div key={post.message} className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{post.author}</p>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{post.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
