"use client";

import { Cake, CalendarHeart, Heart, PartyPopper, Sparkles } from "lucide-react";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Birthdays This Week", value: "18", note: "Across all branches" },
  { label: "Anniversaries This Month", value: "24", note: "Wedding & ministry years" },
  { label: "Ministry Milestones", value: "7", note: "Service anniversaries & ordinations" },
  { label: "Scheduled Greetings", value: "34", note: "Automated sends in queue" },
] as const;

const calendarMonth = { year: 2026, monthIndex: 3, label: "April 2026" };

type CelebrationKind = "Birthday" | "Anniversary" | "Ministry milestone";

const upcoming = [
  {
    id: "c-1",
    member: "Deborah Mensah",
    celebrationType: "Birthday" as const,
    date: "2026-04-28",
    groupMinistry: "Women’s fellowship",
  },
  {
    id: "c-2",
    member: "Ps. Joseph & Ama Boateng",
    celebrationType: "Anniversary" as const,
    date: "2026-04-29",
    groupMinistry: "Marriage ministry",
  },
  {
    id: "c-3",
    member: "Samuel Okoro",
    celebrationType: "Ministry milestone" as const,
    date: "2026-05-02",
    groupMinistry: "Youth · 10 years serving",
  },
  {
    id: "c-4",
    member: "Ruth Eze",
    celebrationType: "Birthday" as const,
    date: "2026-04-30",
    groupMinistry: "Worship team",
  },
] as const;

const celebrationDates = new Set<string>(upcoming.map((u) => u.date));

const templates = [
  {
    title: "Birthday blessing",
    icon: Cake,
    accent: "from-rose-500/15 to-amber-500/10",
    body: "May the Lord bless you and keep you on this special day. We thank God for your life in our church family and pray the year ahead is filled with peace, strength, and joy in Christ.",
  },
  {
    title: "Anniversary message",
    icon: Heart,
    accent: "from-amber-500/15 to-rose-500/10",
    body: "We celebrate God’s faithfulness in your journey together. May your home continue to reflect His love, patience, and kindness—and may the church be blessed by your example.",
  },
  {
    title: "Ministry milestone note",
    icon: Sparkles,
    accent: "from-violet-500/12 to-amber-500/10",
    body: "Thank you for years of faithful service. Your labour in the Lord is not in vain; we honour this milestone with gratitude and pray for renewed strength for the path ahead.",
  },
] as const;

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function startWeekday(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay();
}

function kindIcon(kind: CelebrationKind) {
  if (kind === "Birthday") return Cake;
  if (kind === "Anniversary") return Heart;
  return PartyPopper;
}

export default function AdminCelebrationsPage() {
  const [feedback, setFeedback] = useState("");

  const { year, monthIndex, label } = calendarMonth;
  const totalDays = daysInMonth(year, monthIndex);
  const pad = startWeekday(year, monthIndex);
  const cells = Array.from({ length: pad + totalDays }, (_, i) => {
    if (i < pad) return { type: "empty" as const };
    const day = i - pad + 1;
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasCelebration = celebrationDates.has(iso);
    return { type: "day" as const, day, iso, hasCelebration };
  });

  return (
    <main className="space-y-5">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(251,113,133,0.07),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(251,191,36,0.06),transparent_45%)]"
        aria-hidden
      />

      <AdminPageHeader
        title="Celebrations Management"
        description="Help the church celebrate people and milestones with care—birthdays, anniversaries, ministry years, and thoughtful automated greetings."
        actions={
          <>
            <Button
              className="h-9 rounded-lg border border-rose-400/25 bg-gradient-to-br from-rose-950/60 to-[#1a1418] text-rose-50 shadow-none hover:from-rose-900/65 hover:to-[#221a1c]"
              onClick={() => setFeedback("Schedule Greeting opens the composer when connected.")}
            >
              <CalendarHeart className="size-4 text-rose-200/90" aria-hidden />
              Schedule Greeting
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-amber-400/25 bg-white/[0.05] text-white hover:bg-white/[0.09]"
              onClick={() => setFeedback("Create Celebration Post opens the feed publisher when connected.")}
            >
              <PartyPopper className="size-4 text-amber-200/85" aria-hidden />
              Create Celebration Post
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-rose-400/15 bg-rose-950/20 px-3 py-2 text-xs text-slate-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <AdminCard
            key={card.label}
            title={card.label}
            className="border-rose-400/10 bg-gradient-to-b from-rose-950/12 to-transparent"
          >
            <p className="text-xl font-semibold tracking-tight text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Celebration calendar"
        description="A gentle overview of April—highlighted days match upcoming entries in this preview."
        className="border-white/10"
      >
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-full max-w-[280px] rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CalendarHeart className="size-4 text-rose-300/85" aria-hidden />
              {label}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((c, idx) =>
                c.type === "empty" ? (
                  <div key={`e-${idx}`} className="aspect-square rounded-lg" />
                ) : (
                  <div
                    key={c.iso}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-lg text-xs tabular-nums transition-colors",
                      c.hasCelebration
                        ? "bg-gradient-to-b from-rose-500/20 to-amber-500/10 font-semibold text-rose-50 ring-1 ring-amber-400/25"
                        : "text-slate-400 hover:bg-white/[0.05]",
                    )}
                    title={c.hasCelebration ? "Celebration this day" : undefined}
                  >
                    {c.day}
                  </div>
                ),
              )}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">Soft highlights only—dignified, not noisy.</p>
          </div>
          <div className="min-w-0 flex-1 space-y-2 text-sm text-slate-400">
            <p className="font-medium text-white">This week at a glance</p>
            <ul className="space-y-2">
              {upcoming.slice(0, 3).map((u) => {
                const Icon = kindIcon(u.celebrationType);
                return (
                  <li key={u.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                    <Icon className="size-4 shrink-0 text-amber-200/75" aria-hidden />
                    <span className="text-slate-300">
                      <span className="font-medium text-white">{u.member}</span> · {u.celebrationType}
                      <span className="text-slate-500">
                        {" "}
                        ·{" "}
                        {new Date(u.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Upcoming celebrations" description="Who, what, when—and a simple next step for leaders." className="border-white/10">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
              <tr>
                {["Member", "Celebration Type", "Date", "Group/Ministry", "Action"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcoming.map((row) => {
                const Icon = kindIcon(row.celebrationType);
                return (
                  <tr key={row.id} className="border-t border-white/[0.06] bg-white/[0.02]">
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-2 font-medium text-white">
                        <Icon className="size-4 text-rose-300/70" aria-hidden />
                        {row.member}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">{row.celebrationType}</td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-400">
                      {new Date(row.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400">{row.groupMinistry}</td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => setFeedback(`Open care actions for ${row.member} (${row.celebrationType})`)}
                        className="rounded-md border border-amber-400/20 bg-amber-950/25 px-2.5 py-1 text-[11px] font-medium text-amber-100 hover:border-amber-400/35"
                      >
                        Greet & plan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard
        title="Message templates"
        description="Warm defaults leaders can personalise—automated, never impersonal when sent with a name."
        className="border-amber-400/10 bg-gradient-to-b from-amber-950/8 to-transparent"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {templates.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className={cn(
                  "relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_14px_36px_-24px_rgba(0,0,0,0.55)]",
                )}
              >
                <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80", t.accent)} aria-hidden />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-black/20">
                      <Icon className="size-4 text-amber-100/90" aria-hidden />
                    </span>
                    <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200/90">{t.body}</p>
                  <button
                    type="button"
                    onClick={() => setFeedback(`Use template: ${t.title}`)}
                    className="mt-3 text-[11px] font-medium text-amber-200/90 hover:text-amber-100"
                  >
                    Use in greeting →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>
    </main>
  );
}
