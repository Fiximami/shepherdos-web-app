"use client";

import {
  CalendarDays,
  ClipboardList,
  HandCoins,
  Handshake,
  HeartHandshake,
  Megaphone,
  PlusCircle,
  ReceiptText,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/navigation";
import type { Permission } from "@/lib/mock-user";

type QuickAction = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  permission: Permission;
  href?: string;
  placeholderMessage?: string;
};

const actionCatalog: Record<string, QuickAction> = {
  addMember: {
    id: "add-member",
    label: "Add Member",
    icon: UserPlus,
    permission: "members:create",
    placeholderMessage: "Add Member form will be connected soon.",
  },
  createAnnouncement: {
    id: "create-announcement",
    label: "Create Announcement",
    icon: Megaphone,
    permission: "announcements:create",
    href: routes.app.communication,
  },
  addEvent: {
    id: "add-event",
    label: "Add Event",
    icon: CalendarDays,
    permission: "events:create",
    href: routes.app.events,
  },
  recordAttendance: {
    id: "record-attendance",
    label: "Record Attendance",
    icon: ClipboardList,
    permission: "attendance:record",
    href: routes.app.attendance,
  },
  assignFollowUp: {
    id: "assign-follow-up",
    label: "Assign Follow-up",
    icon: Handshake,
    permission: "followups:assign",
    href: routes.app.engagement,
  },
  recordTransaction: {
    id: "record-transaction",
    label: "Record Transaction",
    icon: HandCoins,
    permission: "finance:record",
    href: "/admin/finance",
  },
  reviewGiving: {
    id: "review-giving",
    label: "Review Giving",
    icon: ReceiptText,
    permission: "payments:create",
    href: "/admin/giving",
  },
  approveExpense: {
    id: "approve-expense",
    label: "Approve Expense",
    icon: ReceiptText,
    permission: "finance:approve",
    placeholderMessage: "Expense approval flow will be connected soon.",
  },
  exportFinanceReport: {
    id: "export-finance-report",
    label: "Export Finance Report",
    icon: ReceiptText,
    permission: "finance:report",
    placeholderMessage: "Finance report export will be connected soon.",
  },
  addFirstTimer: {
    id: "add-first-timer",
    label: "Add First-Timer",
    icon: Users,
    permission: "members:create",
    placeholderMessage: "First-Timer quick add will be connected soon.",
  },
  createFeedPost: {
    id: "create-feed-post",
    label: "Create Feed Post",
    icon: PlusCircle,
    permission: "feed:create",
    href: routes.app.engagement,
  },
  giveOrPay: {
    id: "give-or-make-payment",
    label: "Give / Make Payment",
    icon: HandCoins,
    permission: "payments:create",
    href: routes.app.giving,
  },
  submitPrayerRequest: {
    id: "submit-prayer-request",
    label: "Submit Prayer Request",
    icon: HeartHandshake,
    permission: "prayer:create",
    href: routes.app.prayerRequests,
  },
  registerForEvent: {
    id: "register-for-event",
    label: "Register for Event",
    icon: CalendarDays,
    permission: "events:register",
    href: routes.app.events,
  },
  inviteSomeone: {
    id: "invite-someone",
    label: "Invite Someone",
    icon: UserPlus,
    permission: "invites:create",
    placeholderMessage: "Invite flow will be connected soon.",
  },
};

const actionOrder = [
  "addMember",
  "createAnnouncement",
  "addEvent",
  "recordAttendance",
  "assignFollowUp",
  "recordTransaction",
  "reviewGiving",
  "approveExpense",
  "exportFinanceReport",
  "addFirstTimer",
  "createFeedPost",
  "giveOrPay",
  "submitPrayerRequest",
  "registerForEvent",
  "inviteSomeone",
] as const;

export function QuickActions({
  permissions,
}: {
  permissions: readonly Permission[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const visibleActions = useMemo(() => {
    const allowed = new Set(permissions);
    return actionOrder
      .map((id) => actionCatalog[id])
      .filter((action) => allowed.has(action.permission));
  }, [permissions]);

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
