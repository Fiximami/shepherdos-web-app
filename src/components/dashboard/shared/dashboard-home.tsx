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
import { CommunityFeed } from "@/components/feed/community-feed";
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

export function DashboardHome() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_28px_60px_-42px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="pointer-events-none absolute -left-10 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.15)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title="Welcome back"
            description="Your member dashboard keeps church life close and clear with upcoming moments, care updates, and community highlights in one calm place."
          />
        </div>
      </section>

      <section className="shepherd-fade-in grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CalendarDays className="size-4 text-amber-200/90" aria-hidden />
              Upcoming events
            </CardTitle>
            <CardDescription>What is coming next in your church rhythm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-sm font-medium text-white">{event.title}</p>
                <p className="text-xs text-gray-400">
                  {event.when} · {event.place}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <HeartHandshake className="size-4 text-blue-200/90" aria-hidden />
              Prayer requests summary
            </CardTitle>
            <CardDescription>Care moments that need gentle attention this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {prayerSummary.map((line) => (
              <p key={line} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300">
                {line}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Gift className="size-4 text-amber-200/90" aria-hidden />
              Giving summary
            </CardTitle>
            <CardDescription>A simple stewardship snapshot for your personal view this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-gray-400">This month</p>
                <p className="mt-1 text-lg font-semibold text-white">₦45,000</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-gray-400">Last gift</p>
                <p className="mt-1 text-lg font-semibold text-white">₦10,000</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-gray-400">Category</p>
                <p className="mt-1 text-lg font-semibold text-white">Offering</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="celebrations" className="shepherd-fade-in">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <PartyPopper className="size-4 text-amber-200/90" aria-hidden />
              My celebrations preview
            </CardTitle>
            <CardDescription>Joyful moments from your church family this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {celebrations.map((item) => (
              <p key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="community-feed" className="shepherd-fade-in">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MessageCircleHeart className="size-4 text-blue-200/90" aria-hidden />
              Community feed preview
            </CardTitle>
            <CardDescription>
              Shared moments from church life to keep you connected and encouraged.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <CommunityFeed maxPosts={4} showViewAllLink viewAllHref="/engagement" />
          </CardContent>
        </Card>
      </section>

      <section id="notifications" className="shepherd-fade-in">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="size-4 text-blue-200/90" aria-hidden />
              Notifications preview
            </CardTitle>
            <CardDescription>A quick glance at recent updates relevant to you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {notifications.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-white">{item.title}</p>
                  <span className="shrink-0 text-xs text-gray-400">{item.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
