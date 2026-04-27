"use client";

import type { ReactNode } from "react";
import { Lightbulb, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Growth Rate", value: "+4.2%", note: "Net new members vs churn (rolling quarter)" },
  { label: "Engagement Score", value: "76", note: "Composite index · 100 scale" },
  { label: "Attendance Trend", value: "+2.1%", note: "Participation vs prior month" },
  { label: "Giving Trend", value: "+6.8%", note: "Recorded contributions" },
  { label: "Follow-up Completion", value: "84%", note: "Care tasks closed on time" },
] as const;

const attendanceSeries = [
  { m: "Nov", v: 11800 },
  { m: "Dec", v: 12400 },
  { m: "Jan", v: 12100 },
  { m: "Feb", v: 12650 },
  { m: "Mar", v: 12880 },
  { m: "Apr", v: 12740 },
];

const givingSeries = [
  { m: "Nov", v: 248 },
  { m: "Dec", v: 312 },
  { m: "Jan", v: 276 },
  { m: "Feb", v: 289 },
  { m: "Mar", v: 301 },
  { m: "Apr", v: 318 },
];

const engagementSeries = [
  { m: "Nov", v: 68 },
  { m: "Dec", v: 72 },
  { m: "Jan", v: 70 },
  { m: "Feb", v: 74 },
  { m: "Mar", v: 75 },
  { m: "Apr", v: 76 },
];

const ministryBars = [
  { name: "Youth", h: 88 },
  { name: "Worship", h: 92 },
  { name: "Outreach", h: 71 },
  { name: "Hosts", h: 85 },
  { name: "Prayer", h: 79 },
];

const commSeries = [
  { m: "Nov", r: 42 },
  { m: "Dec", r: 48 },
  { m: "Jan", r: 45 },
  { m: "Feb", r: 51 },
  { m: "Mar", r: 53 },
  { m: "Apr", r: 55 },
];

const careSeries = [
  { m: "Nov", c: 72 },
  { m: "Dec", c: 70 },
  { m: "Jan", c: 74 },
  { m: "Feb", c: 78 },
  { m: "Mar", c: 81 },
  { m: "Apr", c: 84 },
];

const smartInsights = [
  "Midweek attendance dropped by 12% this month.",
  "New convert follow-up completion improved by 18%.",
] as const;

const chartTooltip = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(17, 28, 38, 0.94)",
    fontSize: 12,
    color: "#e2e8f0",
  },
};

function num(v: unknown) {
  return typeof v === "number" ? v : Number(v ?? 0);
}

export default function AdminAnalyticsPage() {
  return (
    <main className="space-y-5">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_-10%,rgba(56,189,248,0.06),transparent_45%),radial-gradient(ellipse_at_70%_110%,rgba(167,139,250,0.05),transparent_50%)]"
        aria-hidden
      />

      <AdminPageHeader
        title="Analytics"
        description="Turn church activity into clear insight and wise action."
      />

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <AdminCard key={card.label} title={card.label} className="border-white/[0.08] bg-white/[0.03]">
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-semibold tracking-tight text-white">{card.value}</p>
              {card.label !== "Engagement Score" && card.label !== "Follow-up Completion" ? (
                <TrendingUp className="size-4 text-teal-400/50" aria-hidden />
              ) : null}
            </div>
            <p className="mt-1 text-xs text-slate-500">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <InsightCard title="Attendance Trends" description="Participation over recent months—watch the curve, not only the headline.">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceSeries} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="anAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(45 212 191 / 0.35)" />
                    <stop offset="100%" stopColor="rgb(45 212 191 / 0)" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...chartTooltip} formatter={(v) => [`${num(v).toLocaleString()}`, "Attendance"]} />
                <Area type="monotone" dataKey="v" stroke="rgb(45 212 191 / 0.6)" fill="url(#anAtt)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </InsightCard>

        <InsightCard title="Giving Trends" description="Contribution movement (thousands GHS, mock)—stewardship signal, not surveillance.">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={givingSeries} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="anGive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(167 139 250 / 0.35)" />
                    <stop offset="100%" stopColor="rgb(167 139 250 / 0)" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...chartTooltip} formatter={(v) => [`GHS ${num(v)}k`, "Giving"]} />
                <Area type="monotone" dataKey="v" stroke="rgb(167 139 250 / 0.55)" fill="url(#anGive)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </InsightCard>

        <InsightCard title="Member Engagement" description="Blended signals from opens, serves, and small groups (illustrative index).">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementSeries} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <XAxis dataKey="m" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[60, 85]} />
                <Tooltip {...chartTooltip} formatter={(v) => [num(v), "Score"]} />
                <Line type="monotone" dataKey="v" stroke="rgb(148 163 184 / 0.85)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </InsightCard>

        <InsightCard title="Ministry Participation" description="Relative serving intensity by area—use for encouragement and capacity.">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ministryBars} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip {...chartTooltip} formatter={(v) => [`${num(v)}`, "Participation"]} />
                <Bar dataKey="h" fill="rgb(56 189 248 / 0.35)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </InsightCard>

        <InsightCard title="Communication Reach" description="Approximate reach index for official sends (mock).">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commSeries} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <XAxis dataKey="m" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...chartTooltip} formatter={(v) => [`${num(v)}%`, "Reach"]} />
                <Line type="monotone" dataKey="r" stroke="rgb(94 234 212 / 0.5)" strokeWidth={1.5} dot={{ r: 2, fill: "rgb(94 234 212 / 0.6)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </InsightCard>

        <InsightCard title="Care Follow-up" description="Share of care tasks completed within agreed windows.">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={careSeries} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="anCare" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(251 191 36 / 0.22)" />
                    <stop offset="100%" stopColor="rgb(251 191 36 / 0)" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[60, 90]} />
                <Tooltip {...chartTooltip} formatter={(v) => [`${num(v)}%`, "Completion"]} />
                <Area type="monotone" dataKey="c" stroke="rgb(251 191 36 / 0.45)" fill="url(#anCare)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </InsightCard>
      </div>

      <AdminCard
        title="Smart insights"
        description="Plain-language highlights—confirm with context before acting."
        className="border-amber-400/10 bg-gradient-to-br from-amber-950/10 via-transparent to-sky-950/10"
      >
        <ul className="space-y-2.5">
          {smartInsights.map((line) => (
            <li
              key={line}
              className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-slate-300"
            >
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-200/70" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </AdminCard>
    </main>
  );
}

function InsightCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <AdminCard title={title} description={description} className={cn("border-white/[0.07] bg-white/[0.025]")}>
      {children}
    </AdminCard>
  );
}
