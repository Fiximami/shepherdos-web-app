"use client";

import {
  HeartHandshake,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const prayerRequests = [
  {
    summary: "Healing and rest for a parent after surgery",
    context: "Shared by a household · Main Campus",
    submitted: "Today · morning",
    status: "Being prayed for" as const,
  },
  {
    summary: "Wisdom for a young adult starting a new role",
    context: "Youth ministry · confidential",
    submitted: "Yesterday",
    status: "With pastoral team" as const,
  },
  {
    summary: "Peace for a family navigating relocation",
    context: "Care team · North Branch",
    submitted: "2 days ago",
    status: "Follow-up scheduled" as const,
  },
] as const;

const testimonies = [
  {
    title: "Provision after a difficult season",
    excerpt:
      "A family shared how the church walked beside them through job loss—meals, prayer, and patient listening when words were few.",
    shared: "Apr 21 · Sunday service",
    branch: "Main Campus",
  },
  {
    title: "A first-time guest felt welcomed",
    excerpt:
      "Someone wrote in to say the greeting at the door and the clarity of the service helped them return the next week.",
    shared: "Apr 18 · Guest follow-up",
    branch: "South Branch",
  },
  {
    title: "Youth baptism celebration",
    excerpt:
      "Three young people shared short testimonies of faith; leaders noted how mentors showed up consistently beforehand.",
    shared: "Apr 14 · Youth night",
    branch: "Main Campus",
  },
] as const;

const followUpActivity = [
  {
    who: "Ruth E. & care partner",
    what: "Home visit after prolonged illness",
    when: "Apr 24 · 4:00 PM",
    note: "Prayed together; next check-in in one week.",
  },
  {
    who: "David A. · follow-up line",
    what: "Return call to first-time guest",
    when: "Apr 23 · 11:20 AM",
    note: "Guest plans to join midweek prayer.",
  },
  {
    who: "Deborah A. · ministry lead",
    what: "Coffee with new connect group member",
    when: "Apr 22 · 6:15 PM",
    note: "Exploring serving on hospitality rotation.",
  },
  {
    who: "Finance + pastoral triad",
    what: "Joint conversation on benevolence request",
    when: "Apr 20 · 2:00 PM",
    note: "Decision recorded with dignity and clarity.",
  },
] as const;

export function EngagementPageView() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Engagement"
        description="Prayer, gratitude, and follow-up in one view—so leaders can see where care is moving and where a gentle next step still waits."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Open prayer requests"
          value="11"
          detail="Held with respect; names limited to who needs to know"
          icon={HeartHandshake}
        />
        <SummaryCard
          label="Testimonies this month"
          value="7"
          detail="Shared in services, groups, or pastoral notes"
          icon={Sparkles}
        />
        <SummaryCard
          label="Follow-ups in motion"
          value="16"
          detail="Visits, calls, and scheduled conversations"
          icon={MessageCircle}
        />
        <SummaryCard
          label="Care touches this week"
          value="42"
          detail="Across pastors, leaders, and trained volunteers"
          icon={Users}
        />
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Prayer requests</CardTitle>
            <CardDescription>
              Summaries only—written the way your team would speak in a leaders&apos; meeting,
              not like a public ticket list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {prayerRequests.map((item) => (
              <div
                key={item.summary}
                className="rounded-xl border border-border/70 bg-background/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-foreground sm:text-base">
                    {item.summary}
                  </h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      item.status === "Being prayed for" &&
                        "bg-violet-500/10 text-violet-800 dark:text-violet-300",
                      item.status === "With pastoral team" &&
                        "bg-sky-500/10 text-sky-800 dark:text-sky-300",
                      item.status === "Follow-up scheduled" &&
                        "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.context}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.submitted}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Testimonies</CardTitle>
            <CardDescription>
              Stories of God&apos;s faithfulness in your church family—shared with humility
              and space to breathe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {testimonies.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/70 bg-background/70 p-4"
              >
                <h3 className="text-sm font-medium text-foreground sm:text-base">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.shared} · {item.branch}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Follow-up activity</CardTitle>
            <CardDescription>
              Recent care-shaped moments—not a backlog to clear, but a trail of faithfulness
              you can encourage and learn from.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {followUpActivity.map((row) => (
              <div
                key={`${row.who}-${row.when}`}
                className="rounded-xl border border-border/60 bg-background/60 px-4 py-3"
              >
                <p className="font-medium text-foreground">{row.what}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{row.who}</p>
                <p className="mt-1 text-xs text-muted-foreground">{row.when}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{row.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
