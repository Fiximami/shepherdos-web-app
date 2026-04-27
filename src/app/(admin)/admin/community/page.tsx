"use client";

import { Flag, Megaphone, MessageSquareHeart, Pin, ShieldCheck, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Posts Today", value: "86", note: "Across branches and groups" },
  { label: "Testimonies Shared", value: "19", note: "This week" },
  { label: "Reported Posts", value: "4", note: "Needs careful moderation" },
  { label: "Pending Review", value: "11", note: "Awaiting leader decision" },
  { label: "Official Announcements", value: "7", note: "Pinned and active" },
] as const;

const tabs = [
  { id: "all" as const, label: "All Posts" },
  { id: "announcements" as const, label: "Announcements" },
  { id: "testimonies" as const, label: "Testimonies" },
  { id: "prayer" as const, label: "Prayer Updates" },
  { id: "reported" as const, label: "Reported" },
  { id: "pending" as const, label: "Pending Review" },
] as const;

type TabId = (typeof tabs)[number]["id"];
type PostType = "Announcement" | "Testimony" | "Prayer update" | "General";
type PostStatus = "Visible" | "Pending review" | "Reported" | "Pinned";

type PostRow = {
  id: string;
  author: string;
  role: string;
  postType: PostType;
  contentPreview: string;
  engagement: string;
  status: PostStatus;
  tab: TabId[];
};

const posts: PostRow[] = [
  {
    id: "p-1",
    author: "Lydia Mensah",
    role: "Admin",
    postType: "Announcement",
    contentPreview: "Service starts 30 mins earlier this Sunday due to outreach commissioning.",
    engagement: "126 reactions · 32 comments",
    status: "Pinned",
    tab: ["all", "announcements"],
  },
  {
    id: "p-2",
    author: "Daniel Okoro",
    role: "Member",
    postType: "Testimony",
    contentPreview: "God opened a job door after prayer; sharing to encourage the church family.",
    engagement: "84 reactions · 19 comments",
    status: "Visible",
    tab: ["all", "testimonies"],
  },
  {
    id: "p-3",
    author: "Grace Afolabi",
    role: "Worker",
    postType: "Prayer update",
    contentPreview: "Please keep my mother in prayer after surgery this week.",
    engagement: "49 prayers · 8 comments",
    status: "Visible",
    tab: ["all", "prayer"],
  },
  {
    id: "p-4",
    author: "Unknown User",
    role: "Member",
    postType: "General",
    contentPreview: "Post reported for inappropriate language. Awaiting moderation guidance.",
    engagement: "3 reports · 2 comments",
    status: "Reported",
    tab: ["all", "reported", "pending"],
  },
  {
    id: "p-5",
    author: "Ama Boateng",
    role: "Member",
    postType: "Testimony",
    contentPreview: "Draft testimony awaiting approval before broader visibility.",
    engagement: "0 reactions · 0 comments",
    status: "Pending review",
    tab: ["all", "testimonies", "pending"],
  },
];

function statusClass(status: PostStatus) {
  const map: Record<PostStatus, string> = {
    Visible: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    "Pending review": "border-amber-500/25 bg-amber-950/35 text-amber-100",
    Reported: "border-red-500/25 bg-red-950/35 text-red-100",
    Pinned: "border-sky-500/25 bg-sky-950/35 text-sky-100",
  };
  return map[status];
}

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [feedback, setFeedback] = useState("");

  const filteredPosts = useMemo(() => posts.filter((post) => post.tab.includes(activeTab)), [activeTab]);

  return (
    <main className="space-y-5">
      <AdminPageHeader
        title="Community Feed Management"
        description="Guide shared church life with moderation, visibility, and care."
        actions={
          <>
            <Button
              className="h-9 rounded-lg"
              onClick={() => setFeedback("Create Official Feed Post opens the publisher when connected.")}
            >
              <Megaphone className="size-4" aria-hidden />
              Create Official Feed Post
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-white/15 bg-white/[0.06] text-white"
              onClick={() => {
                setActiveTab("reported");
                setFeedback("Review Reports selected. Showing reported and pending items.");
              }}
            >
              <Flag className="size-4" aria-hidden />
              Review Reports
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-gray-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <AdminCard key={card.label} title={card.label}>
            <p className="text-xl font-semibold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-gray-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Feed moderation"
        description="Members can share posts, while leadership keeps the space safe, uplifting, and well-guided."
      >
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#0c1820]/50 p-1" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150",
                activeTab === tab.id
                  ? "bg-[#133251] text-white ring-1 ring-white/20"
                  : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-gray-400">
              <tr>
                {["Author", "Role", "Post Type", "Content Preview", "Engagement", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-t border-white/[0.06] bg-white/[0.02]">
                  <td className="px-3 py-2.5 font-medium text-white">{post.author}</td>
                  <td className="px-3 py-2.5 text-gray-400">{post.role}</td>
                  <td className="px-3 py-2.5 text-gray-300">{post.postType}</td>
                  <td className="max-w-[320px] px-3 py-2.5 text-gray-300">{post.contentPreview}</td>
                  <td className="px-3 py-2.5 text-gray-400">{post.engagement}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusClass(post.status))}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex max-w-[360px] flex-wrap gap-1">
                      {(
                        [
                          "View Post",
                          "Pin",
                          "Hide",
                          "Approve",
                          "Remove",
                          "Mark as Announcement",
                        ] as const
                      ).map((action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => setFeedback(`${action}: ${post.author}'s post`)}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-gray-300 hover:border-white/25 hover:bg-white/[0.08]"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard
        title="Community health"
        description="Moderation supports people and spiritual growth, not punishment."
        className="border-[#356b4d]/25 bg-gradient-to-b from-[#11261a]/40 to-transparent"
      >
        <ul className="space-y-2">
          <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-300">
            <div className="flex items-center gap-2 font-medium text-white">
              <MessageSquareHeart className="size-4 text-emerald-300/80" aria-hidden />
              Testimonies increased this week.
            </div>
            <p className="mt-1 text-xs text-gray-400">Members are sharing more encouragement stories after prayer nights.</p>
          </li>
          <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-300">
            <div className="flex items-center gap-2 font-medium text-white">
              <ShieldCheck className="size-4 text-amber-200/80" aria-hidden />
              2 reported posts need review.
            </div>
            <p className="mt-1 text-xs text-gray-400">Address gently and quickly to keep trust strong in the community.</p>
          </li>
          <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-300">
            <div className="flex items-center gap-2 font-medium text-white">
              <Pin className="size-4 text-sky-300/80" aria-hidden />
              Official updates remain visible.
            </div>
            <p className="mt-1 text-xs text-gray-400">Pinned announcements are helping members locate key information quickly.</p>
          </li>
          <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-300">
            <div className="flex items-center gap-2 font-medium text-white">
              <Users className="size-4 text-violet-300/80" aria-hidden />
              Care-focused moderation continues.
            </div>
            <p className="mt-1 text-xs text-gray-400">Leaders are balancing clarity, accountability, and pastoral warmth.</p>
          </li>
        </ul>
      </AdminCard>
    </main>
  );
}
