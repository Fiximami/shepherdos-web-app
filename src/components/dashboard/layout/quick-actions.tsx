"use client";

import { CalendarDays, ClipboardList, HandCoins, Megaphone, PlusCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/navigation";

type Role = string;

type QuickAction = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  href?: string;
  leadershipOnly?: boolean;
  placeholderMessage?: string;
};

const actions: QuickAction[] = [
  {
    id: "add-member",
    label: "Add Member",
    icon: UserPlus,
    leadershipOnly: true,
    placeholderMessage: "Add Member form will be connected soon.",
  },
  {
    id: "record-attendance",
    label: "Record Attendance",
    icon: ClipboardList,
    href: routes.app.attendance,
    leadershipOnly: true,
  },
  {
    id: "create-announcement",
    label: "Create Announcement",
    icon: Megaphone,
    href: routes.app.communication,
    leadershipOnly: true,
  },
  {
    id: "record-transaction",
    label: "Record Transaction",
    icon: HandCoins,
    href: routes.app.finance,
    leadershipOnly: true,
  },
  {
    id: "add-event",
    label: "Add Event",
    icon: CalendarDays,
    href: routes.app.events,
    leadershipOnly: true,
  },
  {
    id: "create-feed-post",
    label: "Create Feed Post",
    icon: PlusCircle,
    href: routes.app.engagement,
  },
];

const leadershipRoles = new Set(["admin", "owner", "pastor", "finance", "leader"]);

export function QuickActions({ role }: { role: Role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const visibleActions = useMemo(() => {
    const isLeadership = leadershipRoles.has(role);
    return actions.filter((action) => (action.leadershipOnly ? isLeadership : true));
  }, [role]);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="h-10 gap-1.5 rounded-xl border-primary/20 bg-white/[0.07] text-white/90 hover:bg-white/[0.12]"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <PlusCircle className="size-4" aria-hidden />
        Quick actions
      </Button>

      {isOpen ? (
        <div
          className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-white/10 bg-[#102338]/95 p-2 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          onMouseLeave={() => setIsOpen(false)}
          role="menu"
        >
          <p className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Quick actions
          </p>
          <div className="space-y-1">
            {visibleActions.map((action) => {
              const Icon = action.icon;
              if (action.href) {
                return (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-white/[0.08]"
                  >
                    <Icon className="size-4 text-gray-300" aria-hidden />
                    {action.label}
                  </Link>
                );
              }

              return (
                <button
                  key={action.id}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/[0.08]"
                  onClick={() => setFeedback(action.placeholderMessage ?? "Action coming soon.")}
                >
                  <Icon className="size-4 text-gray-300" aria-hidden />
                  {action.label}
                </button>
              );
            })}
          </div>
          {feedback ? (
            <p className="mt-2 rounded-lg bg-white/[0.05] px-3 py-2 text-xs text-gray-300">{feedback}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
