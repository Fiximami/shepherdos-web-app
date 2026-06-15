"use client";

import {
  Bell,
  CalendarCheck2,
  CalendarDays,
  Gift,
  HeartHandshake,
  MessageCircleHeart,
  PartyPopper,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";
import { CommunityFeed } from "@/components/feed/community-feed";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { MemberLinkedNotice } from "@/components/shared/member-linked-notice";
import { PreviewSectionNotice } from "@/components/shared/preview-section-notice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiData } from "@/hooks/use-api-data";
import { useMemberProfileFields } from "@/hooks/use-member-profile-fields";
import { fetchMyAttendance } from "@/lib/api/attendance";
import { pickSummaryCurrency, pickSummaryValue } from "@/lib/api/formatters";
import { fetchMyGiving } from "@/lib/api/giving";
import { EMPTY_MEMBER_SCOPE } from "@/lib/api/member-scope";
import { useAuth } from "@/providers/auth-provider";

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

const demoGivingSummary = {
  thisMonth: "GHS 2,400",
  lastGift: "GHS 350",
  category: "Tithe",
} as const;

const demoAttendanceCards = [
  { label: "Attendance this week", value: "2", detail: "Your recorded services", icon: CalendarDays },
  { label: "Attendance this month", value: "8", detail: "Your participation snapshot", icon: CalendarCheck2 },
  { label: "Your branch", value: "Main Campus", detail: "Active member", icon: UserRound },
] as const;

export function DashboardHome() {
  const { isDemo } = useAuth();
  const { user, isAuthenticatedLive, isLinked, memberQuery, fields } = useMemberProfileFields();
  const attendanceQuery = useApiData("member-dashboard-attendance-me", fetchMyAttendance, EMPTY_MEMBER_SCOPE);
  const givingQuery = useApiData("member-dashboard-giving-me", fetchMyGiving, EMPTY_MEMBER_SCOPE);

  const welcomeName = user.name.split(" ")[0];
  const liveDataLoading = attendanceQuery.isLoading || givingQuery.isLoading || memberQuery.isLoading;
  const liveDataError = attendanceQuery.error ?? givingQuery.error ?? memberQuery.error;
  const liveDataConnected = attendanceQuery.isLive || givingQuery.isLive || memberQuery.isLive;
  const showUnlinked =
    isAuthenticatedLive &&
    liveDataConnected &&
    !isLinked &&
    !attendanceQuery.data.linked &&
    !givingQuery.data.linked;

  const givingSummary = useMemo(() => {
    if (isDemo) return demoGivingSummary;
    if (!givingQuery.isLive || !givingQuery.data.linked) {
      return { thisMonth: "—", lastGift: "—", category: "—" };
    }

    return {
      thisMonth: pickSummaryCurrency(givingQuery.data.summary, [
        "givingThisMonth",
        "monthTotal",
        "totalThisMonth",
        "total",
      ]),
      lastGift: pickSummaryCurrency(givingQuery.data.summary, [
        "lastGift",
        "lastContribution",
        "lastTransactionAmount",
      ]),
      category: pickSummaryValue(givingQuery.data.summary, ["lastGiftCategory", "lastCategory"], "—"),
    };
  }, [givingQuery.data, givingQuery.isLive, isDemo]);

  const attendanceCards = useMemo(() => {
    if (isDemo) {
      return demoAttendanceCards.map((card) => ({
        ...card,
        value: card.label === "Your branch" ? fields.branch : card.value,
        detail: card.label === "Your branch" ? fields.membershipStatus : card.detail,
      }));
    }

    if (!attendanceQuery.isLive || !attendanceQuery.data.linked) {
      return [
        {
          label: "Attendance this week",
          value: "—",
          detail: "Your recorded services",
          icon: CalendarDays,
        },
        {
          label: "Attendance this month",
          value: "—",
          detail: "Your participation snapshot",
          icon: CalendarCheck2,
        },
        {
          label: "Your branch",
          value: fields.branch,
          detail: fields.membershipStatus,
          icon: UserRound,
        },
      ];
    }

    return [
      {
        label: "Attendance this week",
        value: pickSummaryValue(attendanceQuery.data.summary, ["thisWeek", "weekCount", "sessionsThisWeek"], "0"),
        detail: "Your recorded services",
        icon: CalendarDays,
      },
      {
        label: "Attendance this month",
        value: pickSummaryValue(attendanceQuery.data.summary, ["thisMonth", "monthCount", "sessionsThisMonth"], "0"),
        detail: "Your participation snapshot",
        icon: CalendarCheck2,
      },
      {
        label: "Your branch",
        value: fields.branch,
        detail: fields.membershipStatus,
        icon: UserRound,
      },
    ];
  }, [attendanceQuery.data, attendanceQuery.isLive, fields.branch, fields.membershipStatus, isDemo]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_28px_60px_-42px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="pointer-events-none absolute -left-10 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.15)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title={`Welcome back${welcomeName ? `, ${welcomeName}` : ""}`}
            description="Your member dashboard keeps church life close and clear with upcoming moments, care updates, and community highlights in one calm place."
          />
        </div>
      </section>

      {isAuthenticatedLive ? (
        <ApiConnectionNotice
          isLoading={liveDataLoading}
          error={liveDataError}
          isLive={liveDataConnected}
          liveLabel="Showing your personal data from /members/me, /attendance/me, and /giving/me."
        />
      ) : null}

      {showUnlinked ? <MemberLinkedNotice /> : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {attendanceCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            detail={card.detail}
            icon={card.icon}
          />
        ))}
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
            <PreviewSectionNotice message="Preview only — events are not connected to a member endpoint yet." />
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
            <PreviewSectionNotice message="Preview only — prayer summaries are not connected yet." />
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
                <p className="mt-1 text-lg font-semibold text-white">{givingSummary.thisMonth}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-gray-400">Last gift</p>
                <p className="mt-1 text-lg font-semibold text-white">{givingSummary.lastGift}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-gray-400">Category</p>
                <p className="mt-1 text-lg font-semibold text-white">{givingSummary.category}</p>
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
            <PreviewSectionNotice />
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
            <PreviewSectionNotice />
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
            <PreviewSectionNotice />
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
