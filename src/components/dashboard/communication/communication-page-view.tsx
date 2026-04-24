"use client";

import {
  ArrowRight,
  Bell,
  CalendarClock,
  Megaphone,
  Radio,
  Send,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const recentAnnouncements = [
  {
    title: "Easter week schedule and hospitality",
    channel: "App + email",
    publishedAt: "Today, 8:15 AM",
    excerpt:
      "Ushering and welcome teams have updated arrival times; members see this on their home feed.",
  },
  {
    title: "Youth retreat payment reminder",
    channel: "SMS + in-app",
    publishedAt: "Yesterday",
    excerpt:
      "A gentle nudge for families with balances—wording reviewed by youth pastors for tone.",
  },
  {
    title: "Midweek prayer: new room assignment",
    channel: "Announcement only",
    publishedAt: "3 days ago",
    excerpt:
      "North hall for April; leaders notified first so they can answer questions calmly.",
  },
] as const;

const scheduledMessages = [
  {
    title: "Sunday giving thank-you",
    when: "Sun, 6:30 PM",
    audience: "All branches",
    status: "Queued",
  },
  {
    title: "Leaders digest — attendance snapshot",
    when: "Mon, 7:00 AM",
    audience: "Pastors & secretaries",
    status: "Scheduled",
  },
  {
    title: "Volunteer appreciation note",
    when: "Wed, 12:00 PM",
    audience: "Hosts & ushers",
    status: "Draft",
  },
] as const;

const quickActions = [
  { label: "Draft this week's bulletin", icon: Megaphone },
  { label: "Notify ministry leads", icon: Send },
  { label: "Post midweek reminder", icon: Bell },
  { label: "Archive older notices", icon: Radio },
] as const;

export function CommunicationPageView() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Communication"
        description="Keep announcements, reminders, and coordinated updates in one calm place—so your church hears what matters, when it matters, without noise."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button className="h-10 rounded-xl">
              <Megaphone className="size-4" aria-hidden />
              Create Announcement
            </Button>
            <Button variant="outline" className="h-10 rounded-xl">
              <Send className="size-4" aria-hidden />
              Send Broadcast
            </Button>
            <Button variant="outline" className="h-10 rounded-xl">
              <CalendarClock className="size-4" aria-hidden />
              Schedule Reminder
            </Button>
          </div>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active Announcements"
          value="12"
          detail="Live across app, email, and foyer screens"
          icon={Megaphone}
        />
        <SummaryCard
          label="Messages Sent This Week"
          value="486"
          detail="Includes reminders and leader notices"
          icon={Send}
        />
        <SummaryCard
          label="Scheduled Messages"
          value="5"
          detail="Waiting on the calendar to send"
          icon={CalendarClock}
        />
        <SummaryCard
          label="Unread Member Notices"
          value="38"
          detail="Worth a gentle follow-up when you have margin"
          icon={Bell}
        />
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent announcements</CardTitle>
            <CardDescription>
              What went out recently—enough context to stay aligned, without digging
              through old threads.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnnouncements.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/70 bg-background/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-foreground sm:text-base">
                    {item.title}
                  </h3>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.publishedAt}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.channel}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Scheduled messages</CardTitle>
            <CardDescription>
              A quiet queue of what is still to go out—review tone and audience before the
              clock sends them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledMessages.map((row) => (
              <div
                key={row.title}
                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{row.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {row.when} · {row.audience}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {row.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Quick actions</CardTitle>
            <CardDescription>
              Shortcuts for common communication rhythms—no compose screens here yet,
              just the shape of how your team will work.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-11 justify-between rounded-xl border-border/80 bg-background/70 px-4"
              >
                <span className="inline-flex items-center gap-2">
                  <action.icon className="size-4 text-primary" aria-hidden />
                  {action.label}
                </span>
                <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
              </Button>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
