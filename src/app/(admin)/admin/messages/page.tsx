"use client";

import { MessageSquarePlus, Send, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Unread Messages", value: "34", note: "Across official inboxes" },
  { label: "Member Inquiries", value: "12", note: "Needs a thoughtful reply" },
  { label: "Group Conversations", value: "19", note: "Ministry & teams" },
  { label: "Assigned Conversations", value: "26", note: "Someone is owning it" },
] as const;

const categories = [
  "Member Support",
  "Ministry Groups",
  "Leadership Team",
  "Prayer Follow-up",
  "Event Questions",
] as const;

type Category = (typeof categories)[number];

type Thread = {
  id: string;
  category: Category;
  subject: string;
  with: string;
  preview: string;
  unread: boolean;
  assignedTo: string | null;
  messages: { from: "member" | "leader"; name: string; text: string; time: string }[];
};

const threads: Thread[] = [
  {
    id: "t-1",
    category: "Member Support",
    subject: "Question about baptism class",
    with: "Miriam Osei",
    preview: "Hello, I would love to join the next class if there is still room…",
    unread: true,
    assignedTo: null,
    messages: [
      {
        from: "member",
        name: "Miriam Osei",
        text: "Hello, I would love to join the next baptism class if there is still room. Could someone let me know the dates?",
        time: "Yesterday · 4:12 PM",
      },
      {
        from: "leader",
        name: "Care desk",
        text: "Miriam, thank you for reaching out. We would be glad to walk with you—I'll send the schedule shortly.",
        time: "Yesterday · 5:01 PM",
      },
    ],
  },
  {
    id: "t-2",
    category: "Ministry Groups",
    subject: "Usher roster · May",
    with: "Usher team channel",
    preview: "Can we confirm who is on for the first two Sundays?",
    unread: false,
    assignedTo: "Head usher · J. Ampofo",
    messages: [
      {
        from: "member",
        name: "Kofi T.",
        text: "Can we confirm who is on for the first two Sundays in May? I may need to swap one date.",
        time: "Mon · 9:20 AM",
      },
      {
        from: "leader",
        name: "J. Ampofo",
        text: "Thanks Kofi. I will post the draft tonight—reply there with conflicts only if urgent.",
        time: "Mon · 11:45 AM",
      },
    ],
  },
  {
    id: "t-3",
    category: "Leadership Team",
    subject: "Q2 planning note",
    with: "Elders & staff",
    preview: "Sharing the one-pager before Tuesday huddle…",
    unread: true,
    assignedTo: "Exec pastor",
    messages: [
      {
        from: "leader",
        name: "Admin",
        text: "Sharing the one-pager before Tuesday huddle—no decisions needed yet, just awareness.",
        time: "Today · 8:02 AM",
      },
    ],
  },
  {
    id: "t-4",
    category: "Prayer Follow-up",
    subject: "Follow-up after visit",
    with: "Anonymous (private)",
    preview: "Thank you for praying with us last week…",
    unread: false,
    assignedTo: "Women’s care",
    messages: [
      {
        from: "member",
        name: "Member",
        text: "Thank you for praying with us last week. We felt carried.",
        time: "Sun · 6:40 PM",
      },
      {
        from: "leader",
        name: "Deborah",
        text: "We are grateful to God with you. I will check in again next Sunday unless you need anything sooner.",
        time: "Sun · 7:15 PM",
      },
    ],
  },
  {
    id: "t-5",
    category: "Event Questions",
    subject: "Youth camp transport",
    with: "Parent · Daniel K.",
    preview: "Is there a bus from North branch on departure day?",
    unread: true,
    assignedTo: null,
    messages: [
      {
        from: "member",
        name: "Daniel K.",
        text: "Is there a bus from North branch on departure day? Happy to help coordinate if useful.",
        time: "Today · 10:18 AM",
      },
    ],
  },
];

function categoryTint(cat: Category) {
  const map: Record<Category, string> = {
    "Member Support": "bg-amber-950/35 text-amber-100/95 border-amber-500/20",
    "Ministry Groups": "bg-violet-950/35 text-violet-100/95 border-violet-500/20",
    "Leadership Team": "bg-slate-800/80 text-slate-100 border-slate-500/25",
    "Prayer Follow-up": "bg-rose-950/30 text-rose-100/95 border-rose-500/20",
    "Event Questions": "bg-sky-950/35 text-sky-100/95 border-sky-500/20",
  };
  return map[cat];
}

export default function AdminMessagesPage() {
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");
  const [activeId, setActiveId] = useState(threads[0].id);
  const [feedback, setFeedback] = useState("");

  const filtered = useMemo(
    () => (categoryFilter === "All" ? threads : threads.filter((t) => t.category === categoryFilter)),
    [categoryFilter],
  );

  function selectCategory(next: Category | "All") {
    const list = next === "All" ? threads : threads.filter((t) => t.category === next);
    setCategoryFilter(next);
    if (!list.some((t) => t.id === activeId)) {
      setActiveId(list[0]?.id ?? threads[0].id);
    }
  }

  const active = useMemo(() => threads.find((t) => t.id === activeId) ?? threads[0], [activeId]);

  return (
    <main className="space-y-5">
      <AdminPageHeader
        title="Messages Management"
        description="Manage conversations from members, groups, and ministry teams with care. Official inboxes help leaders respond without losing the human touch."
        actions={
          <>
            <Button
              className="h-9 rounded-lg border border-amber-400/20 bg-gradient-to-br from-amber-950/50 to-[#1a1512] text-amber-50 shadow-none hover:from-amber-900/55 hover:to-[#221a14]"
              onClick={() => setFeedback("New Message opens the composer when connected.")}
            >
              <MessageSquarePlus className="size-4 text-amber-200/90" aria-hidden />
              New Message
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-stone-500/25 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              onClick={() => setFeedback("Create Group Message opens the group composer when connected.")}
            >
              <Users className="size-4 text-stone-300" aria-hidden />
              Create Group Message
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-stone-400">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <AdminCard key={card.label} title={card.label} className="border-stone-500/15">
            <p className="text-xl font-semibold tracking-tight text-white">{card.value}</p>
            <p className="mt-1 text-xs text-stone-500">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Inbox"
        description="Pick a category, then a thread. The right side stays for reading and gentle next steps."
        className="border-white/10 p-0 sm:p-0"
      >
        <div className="flex flex-wrap gap-1.5 border-b border-white/10 px-3 py-2.5 sm:px-4">
          <button
            type="button"
            onClick={() => selectCategory("All")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              categoryFilter === "All" ? "bg-white/10 text-white" : "text-stone-500 hover:bg-white/[0.06] hover:text-stone-300",
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => selectCategory(c)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                categoryFilter === c ? "bg-white/10 text-white" : "text-stone-500 hover:bg-white/[0.06] hover:text-stone-300",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <aside className="border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
            <ul className="max-h-[52vh] overflow-y-auto lg:max-h-[min(560px,60vh)]">
              {filtered.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b border-white/[0.06] px-3 py-3 text-left transition-colors sm:px-4",
                      activeId === t.id ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="line-clamp-1 text-sm font-medium text-white">{t.subject}</span>
                      {t.unread ? <span className="size-2 shrink-0 rounded-full bg-amber-400/90" title="Unread" /> : null}
                    </div>
                    <span className="text-xs text-stone-500">with {t.with}</span>
                    <span className="line-clamp-2 text-xs text-stone-500">{t.preview}</span>
                    <span className={cn("mt-1 inline-flex w-fit rounded-md border px-2 py-0.5 text-[10px] font-medium", categoryTint(t.category))}>
                      {t.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="flex min-h-[360px] flex-col bg-[#0a1218]/40">
            <div className="border-b border-white/10 px-4 py-3">
              <h3 className="text-sm font-semibold text-white">{active.subject}</h3>
              <p className="mt-0.5 text-xs text-stone-500">
                {active.category} · {active.with}
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {active.messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "leader" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[min(100%,420px)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                      m.from === "member"
                        ? "rounded-tl-md border border-stone-500/15 bg-[#141c24] text-stone-200"
                        : "rounded-tr-md border border-amber-500/15 bg-gradient-to-br from-amber-950/45 to-[#1a1814] text-amber-50/95",
                    )}
                  >
                    <p className="text-[11px] font-medium text-stone-500">{m.name}</p>
                    <p className="mt-1 text-[13px]">{m.text}</p>
                    <p className="mt-2 text-[10px] text-stone-500">{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <UserPlus className="size-4 text-stone-500" aria-hidden />
                  <span>
                    {active.assignedTo ? (
                      <>
                        Assigned to <span className="font-medium text-stone-300">{active.assignedTo}</span>
                      </>
                    ) : (
                      "Not assigned yet"
                    )}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-stone-500/25 bg-transparent text-xs text-stone-200 hover:bg-white/[0.06]"
                  onClick={() => setFeedback(`Assign conversation “${active.subject}” to a leader or care team when connected.`)}
                >
                  Assign
                </Button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-stone-600">
                Placeholder: route to pastoral care, ministry head, or event lead—visibility follows your church policy.
              </p>
            </div>

            <div className="flex gap-2 border-t border-white/10 px-4 py-3">
              <input
                type="text"
                readOnly
                placeholder="Write a reply when connected…"
                className="min-h-10 flex-1 rounded-xl border border-white/10 bg-[#0c141c] px-3 text-sm text-stone-400 placeholder:text-stone-600"
                aria-label="Reply placeholder"
              />
              <Button size="icon" className="h-10 w-10 shrink-0 rounded-xl" disabled aria-label="Send (disabled)">
                <Send className="size-4" aria-hidden />
              </Button>
            </div>
          </section>
        </div>
      </AdminCard>
    </main>
  );
}
