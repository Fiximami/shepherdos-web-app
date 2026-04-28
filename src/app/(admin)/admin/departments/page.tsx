"use client";

import { HeartHandshake, Layers, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Total Departments", value: "14", note: "Structured ministry areas" },
  { label: "Total Groups", value: "52", note: "Teams, cells, and fellowships" },
  { label: "Active Leaders", value: "38", note: "Named responsibility today" },
  { label: "Members Assigned", value: "876", note: "Across departments & groups" },
  { label: "Groups Without Leaders", value: "5", note: "Needs a gentle assignment" },
] as const;

type DeptBudget = "Healthy" | "Watch" | "Tight";
type Activity = "Active" | "Seasonal" | "Paused";

type DeptRow = {
  id: string;
  name: string;
  deptType: string;
  leader: string;
  members: number;
  budgetStatus: DeptBudget;
  activity: Activity;
};

const departments: DeptRow[] = [
  { id: "d-1", name: "Worship & Arts", deptType: "Department", leader: "Ruth Eze", members: 64, budgetStatus: "Healthy", activity: "Active" },
  { id: "d-2", name: "Operations & Facilities", deptType: "Department", leader: "Kofi Boateng", members: 28, budgetStatus: "Watch", activity: "Active" },
  { id: "d-3", name: "Pastoral Care", deptType: "Department", leader: "Ps. Joseph Boateng", members: 22, budgetStatus: "Healthy", activity: "Active" },
  { id: "d-4", name: "Children & Sunday School", deptType: "Department", leader: "Ama Mensah", members: 41, budgetStatus: "Tight", activity: "Active" },
  { id: "d-5", name: "Finance & Stewardship", deptType: "Department", leader: "A. Mensah", members: 9, budgetStatus: "Healthy", activity: "Active" },
];

const tabs = [
  { id: "ministries" as const, label: "Ministries" },
  { id: "service" as const, label: "Service Teams" },
  { id: "fellowship" as const, label: "Fellowship Groups" },
  { id: "language" as const, label: "Language Groups" },
  { id: "sunday" as const, label: "Sunday School" },
  { id: "committees" as const, label: "Special Committees" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type GroupDetail = {
  id: string;
  tab: TabId;
  name: string;
  purpose: string;
  leader: string;
  members: number;
  allocated: string;
  spent: string;
  remaining: string;
  financeStatus: "On track" | "Review" | "Paused";
  attendanceNote: string;
  commChannel: string;
};

const groups: GroupDetail[] = [
  {
    id: "g-youth",
    tab: "ministries",
    name: "Youth Ministry",
    purpose: "Disciple teens and young adults through teaching, camps, and mentoring.",
    leader: "Samuel Okoro",
    members: 118,
    allocated: "GHS 62,000",
    spent: "GHS 48,200",
    remaining: "GHS 13,800",
    financeStatus: "On track",
    attendanceNote: "Avg. 94 present at weekly youth night (Apr).",
    commChannel: "WhatsApp + in-app youth channel",
  },
  {
    id: "g-women",
    tab: "ministries",
    name: "Women’s Ministry",
    purpose: "Bible study, prayer, and seasonal retreats for women across branches.",
    leader: "Deborah Afolabi",
    members: 156,
    allocated: "GHS 48,000",
    spent: "GHS 39,400",
    remaining: "GHS 8,600",
    financeStatus: "On track",
    attendanceNote: "Quarterly gathering · 210 registered last event.",
    commChannel: "Email circle + SMS for urgent prayer",
  },
  {
    id: "g-men",
    tab: "ministries",
    name: "Men’s Ministry",
    purpose: "Brotherhood, accountability, and service projects.",
    leader: "Daniel Kwarteng",
    members: 72,
    allocated: "GHS 28,000",
    spent: "GHS 22,100",
    remaining: "GHS 5,900",
    financeStatus: "Review",
    attendanceNote: "Breakfast · 58 attended (Mar).",
    commChannel: "In-app group + calendar invites",
  },
  {
    id: "g-choir",
    tab: "service",
    name: "Choir",
    purpose: "Lead the congregation in worship with excellence and humility.",
    leader: "Grace Nwosu",
    members: 34,
    allocated: "GHS 18,000",
    spent: "GHS 14,200",
    remaining: "GHS 3,800",
    financeStatus: "On track",
    attendanceNote: "Roster coverage: 92% Sundays staffed.",
    commChannel: "Media team shared thread",
  },
  {
    id: "g-media",
    tab: "service",
    name: "Media Team",
    purpose: "Sound, streaming, and slides so every service is heard clearly.",
    leader: "— Unassigned",
    members: 19,
    allocated: "GHS 24,000",
    spent: "GHS 21,800",
    remaining: "GHS 2,200",
    financeStatus: "Review",
    attendanceNote: "Two services per Sunday rotation.",
    commChannel: "Slack-style channel (placeholder)",
  },
  {
    id: "g-ushers",
    tab: "service",
    name: "Ushering Team",
    purpose: "Welcome guests, seat with care, and support orderly flow.",
    leader: "J. Ampofo",
    members: 42,
    allocated: "GHS 12,000",
    spent: "GHS 9,400",
    remaining: "GHS 2,600",
    financeStatus: "On track",
    attendanceNote: "Full coverage main campus · North branch needs 3 more.",
    commChannel: "SMS reminders + printed roster",
  },
  {
    id: "g-cell",
    tab: "fellowship",
    name: "Small Groups / Cell Groups",
    purpose: "Weekly homes for prayer, scripture, and mutual care.",
    leader: "Hosts collective (12 hosts)",
    members: 240,
    allocated: "GHS 15,000",
    spent: "GHS 8,900",
    remaining: "GHS 6,100",
    financeStatus: "On track",
    attendanceNote: "18 active cells · avg. 11 per cell.",
    commChannel: "In-app cell chat",
  },
  {
    id: "g-fr",
    tab: "language",
    name: "French-Speaking Fellowship",
    purpose: "Worship and teaching in French once a month with translation support.",
    leader: "P. Mensah",
    members: 28,
    allocated: "GHS 6,000",
    spent: "GHS 4,100",
    remaining: "GHS 1,900",
    financeStatus: "On track",
    attendanceNote: "Last service · 31 present.",
    commChannel: "WhatsApp broadcast list",
  },
  {
    id: "g-ss",
    tab: "sunday",
    name: "Sunday School · Ages 6–12",
    purpose: "Age-appropriate Bible lessons and safe classrooms.",
    leader: "Ama Mensah",
    members: 55,
    allocated: "GHS 10,000",
    spent: "GHS 7,200",
    remaining: "GHS 2,800",
    financeStatus: "On track",
    attendanceNote: "Two services · roll call digital (preview).",
    commChannel: "Parents email list",
  },
  {
    id: "g-build",
    tab: "committees",
    name: "Building Committee",
    purpose: "Oversee facility projects with transparency to the church.",
    leader: "Trustee · Lydia Mensah",
    members: 9,
    allocated: "GHS 120,000",
    spent: "GHS 88,400",
    remaining: "GHS 31,600",
    financeStatus: "Review",
    attendanceNote: "Meets monthly · quorum met.",
    commChannel: "Board portal (placeholder)",
  },
];

function budgetDeptBadge(s: DeptBudget) {
  const map: Record<DeptBudget, string> = {
    Healthy: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    Watch: "border-amber-500/25 bg-amber-950/35 text-amber-50",
    Tight: "border-rose-500/20 bg-rose-950/30 text-rose-100",
  };
  return map[s];
}

function financeGroupBadge(s: GroupDetail["financeStatus"]) {
  const map: Record<GroupDetail["financeStatus"], string> = {
    "On track": "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    Review: "border-amber-500/25 bg-amber-950/35 text-amber-50",
    Paused: "border-slate-500/25 bg-slate-900/45 text-slate-300",
  };
  return map[s];
}

export default function AdminDepartmentsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("ministries");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("g-youth");
  const [feedback, setFeedback] = useState("");

  const tabGroups = useMemo(() => groups.filter((g) => g.tab === activeTab), [activeTab]);

  const selectedGroup = useMemo(
    () => tabGroups.find((g) => g.id === selectedGroupId) ?? tabGroups[0] ?? groups[0],
    [tabGroups, selectedGroupId],
  );

  function selectTab(id: TabId) {
    const list = groups.filter((g) => g.tab === id);
    setActiveTab(id);
    setSelectedGroupId(list[0]?.id ?? groups[0].id);
  }

  return (
    <main className="space-y-5 text-[#f4f0eb]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(251,191,36,0.06),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(244,114,182,0.05),transparent_48%)]"
        aria-hidden
      />

      <AdminPageHeader
        title="Departments & Groups"
        description="Organize ministries, teams, and groups so every part of the church can be managed with clarity—from choir and media to welfare, language fellowships, and small groups."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              className="h-9 rounded-lg border border-amber-400/25 bg-gradient-to-br from-amber-950/50 to-[#1a1510] text-amber-50 shadow-none hover:from-amber-900/55 hover:to-[#221a12]"
              onClick={() => setFeedback("Add Department will open the composer when connected.")}
            >
              <Layers className="size-4 text-amber-200/90" aria-hidden />
              Add Department
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-stone-500/25 bg-[#1c1612]/80 text-[#f4f0eb] hover:bg-[#261f1a]"
              onClick={() => setFeedback("Add Group will open the group wizard when connected.")}
            >
              <Users className="size-4 text-amber-200/75" aria-hidden />
              Add Group
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-stone-500/20 bg-[#1c1612]/80 text-[#f4f0eb] hover:bg-[#261f1a]"
              onClick={() => setFeedback("Assign Leader will open role assignment when connected.")}
            >
              <UserPlus className="size-4 text-stone-300" aria-hidden />
              Assign Leader
            </Button>
          </div>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-stone-500/20 bg-[#1c1612]/90 px-3 py-2 text-xs text-stone-400">{feedback}</p>
      ) : null}

      <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-stone-500">
        ShepherdOS recognises real church life: <span className="text-stone-400">Choir, Media, Youth, Women’s & Men’s ministries, Sunday School, language-based groups, Welfare, Prayer, Ushering, Protocol, Evangelism, and small groups</span>—all part of one family, not corporate “org units.”
      </p>

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <AdminCard key={card.label} title={card.label} className="border-stone-500/15 bg-gradient-to-b from-[#231c18]/90 to-[#181310]/90">
            <p className="text-xl font-semibold tracking-tight text-[#fef7ed]">{card.value}</p>
            <p className="mt-1 text-xs text-stone-500">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard title="Departments" description="High-level ministry areas that carry budget and reporting responsibility." className="border-stone-500/15 bg-[#1a1511]/95">
        <div className="overflow-x-auto rounded-xl border border-stone-500/15 bg-[#14100d]/80">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="border-b border-stone-500/15 bg-[#1c1612] text-stone-500">
              <tr>
                {["Department Name", "Department Type", "Leader", "Members", "Budget Status", "Activity Status", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {departments.map((row) => (
                <tr key={row.id} className="border-t border-stone-500/10">
                  <td className="px-3 py-2.5 font-medium text-[#fef7ed]">{row.name}</td>
                  <td className="px-3 py-2.5 text-stone-400">{row.deptType}</td>
                  <td className="px-3 py-2.5 text-stone-400">{row.leader}</td>
                  <td className="px-3 py-2.5 tabular-nums text-stone-300">{row.members}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", budgetDeptBadge(row.budgetStatus))}>
                      {row.budgetStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-stone-400">{row.activity}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setFeedback(`View department: ${row.name}`)}
                        className="rounded-md border border-stone-500/20 bg-[#1c1612] px-2 py-1 text-[11px] text-stone-300 hover:border-amber-400/25"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedback(`Edit department: ${row.name}`)}
                        className="rounded-md border border-stone-500/20 bg-[#1c1612] px-2 py-1 text-[11px] text-stone-300 hover:border-amber-400/25"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <AdminCard title="Group categories" description="Browse how people gather to serve, learn, and belong." className="border-stone-500/15 bg-[#1a1511]/95">
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-stone-500/15 bg-[#14100d]/60 p-1" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => selectTab(t.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  activeTab === t.id
                    ? "bg-amber-950/50 text-amber-50 ring-1 ring-amber-400/25"
                    : "text-stone-500 hover:bg-white/[0.04] hover:text-stone-300",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <ul className="mt-3 max-h-[min(420px,50vh)] space-y-1.5 overflow-y-auto pr-1">
            {tabGroups.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => setSelectedGroupId(g.id)}
                  className={cn(
                    "flex w-full flex-col rounded-lg border px-3 py-2.5 text-left transition-colors",
                    selectedGroup?.id === g.id
                      ? "border-amber-400/30 bg-amber-950/25"
                      : "border-stone-500/10 bg-[#14100d]/60 hover:border-stone-500/20",
                  )}
                >
                  <span className="text-sm font-medium text-[#fef7ed]">{g.name}</span>
                  <span className="mt-0.5 line-clamp-1 text-xs text-stone-500">{g.purpose}</span>
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>

        <div className="space-y-4">
          <AdminCard title="Group details" description="Purpose, people, rhythm, and stewardship signals in one glance." className="border-stone-500/15 bg-[#1a1511]/95">
            <div className="space-y-4 rounded-xl border border-stone-500/15 bg-[#14100d]/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedGroup.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">{selectedGroup.purpose}</p>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-600">Assigned leader</dt>
                  <dd className="mt-1 text-sm text-stone-200">{selectedGroup.leader}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-600">Members</dt>
                  <dd className="mt-1 text-sm tabular-nums text-stone-200">{selectedGroup.members.toLocaleString()}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-600">Attendance</dt>
                  <dd className="mt-1 text-sm text-stone-400">{selectedGroup.attendanceNote}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-stone-600">Communication channel</dt>
                  <dd className="mt-1 text-sm text-stone-400">{selectedGroup.commChannel}</dd>
                </div>
              </dl>

              <div className="border-t border-stone-500/15 pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-200/80">Budget connection</p>
                <p className="mt-1 text-xs text-stone-600">Linked to Finance envelopes—illustrative figures only.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-stone-500/15 bg-[#1c1612] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-stone-600">Allocated</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-white">{selectedGroup.allocated}</p>
                  </div>
                  <div className="rounded-lg border border-stone-500/15 bg-[#1c1612] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-stone-600">Spent</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-stone-300">{selectedGroup.spent}</p>
                  </div>
                  <div className="rounded-lg border border-stone-500/15 bg-[#1c1612] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-stone-600">Remaining</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-amber-100/90">{selectedGroup.remaining}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-stone-600">Finance status:</span>
                  <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", financeGroupBadge(selectedGroup.financeStatus))}>
                    {selectedGroup.financeStatus}
                  </span>
                </div>
              </div>
            </div>
          </AdminCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <AdminCard title="Member assignment" description="Add or move members into this group with consent and branch awareness." className="border-dashed border-stone-500/25 bg-[#14100d]/80">
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-stone-500/15 bg-[#1c1612]/60 px-4 py-8 text-center">
                <Users className="size-8 text-stone-600" aria-hidden />
                <p className="text-sm font-medium text-stone-300">Search members & assign</p>
                <p className="max-w-xs text-xs text-stone-600">Placeholder: roster import, household linking, and age filters for Sunday School.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 border-stone-500/25 text-stone-200 hover:bg-white/[0.06]"
                  onClick={() => setFeedback("Member assignment workspace opens when connected.")}
                >
                  Open assignment
                </Button>
              </div>
            </AdminCard>

            <AdminCard title="Leadership assignment" description="Name who carries spiritual and practical oversight—not a corporate reporting line." className="border-dashed border-stone-500/25 bg-[#14100d]/80">
              <ul className="space-y-2 text-sm">
                {(
                  [
                    ["Leader", "Primary pastoral or ministry head"],
                    ["Assistant leader", "Supports teaching, care, and continuity"],
                    ["Finance representative", "Aligns spend with approved budget"],
                    ["Communication representative", "Keeps the group informed with care"],
                  ] as const
                ).map(([role, hint]) => (
                  <li key={role} className="flex items-start justify-between gap-2 rounded-lg border border-stone-500/10 bg-[#1c1612]/50 px-3 py-2">
                    <div>
                      <p className="font-medium text-[#fef7ed]">{role}</p>
                      <p className="mt-0.5 text-xs text-stone-600">{hint}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeedback(`Assign ${role} for ${selectedGroup.name} when connected.`)}
                      className="shrink-0 text-xs font-medium text-amber-200/90 hover:text-amber-100"
                    >
                      Assign
                    </button>
                  </li>
                ))}
              </ul>
            </AdminCard>
          </div>
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-lg border border-stone-500/15 bg-[#14100d]/85 px-3 py-2.5 text-xs text-stone-600">
        <HeartHandshake className="mt-0.5 size-4 shrink-0 text-amber-200/60" aria-hidden />
        <span>
          Structure exists to serve people and mission. Keep rosters kind, budgets honest, and communication gentle—this page is
          for shepherds and stewards, not performance reviews.
        </span>
      </p>
    </main>
  );
}
