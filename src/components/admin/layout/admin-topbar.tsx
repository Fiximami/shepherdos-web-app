"use client";

import { ShieldCheck } from "lucide-react";

import { mockUser } from "@/lib/mock-user";

export function AdminTopbar() {
  return (
    <header className="sticky top-3 z-20 flex h-[4.25rem] items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#10263d]/80 px-4 shadow-[0_18px_42px_-30px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:px-6">
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-white">Leadership Console</p>
        <p className="truncate text-xs text-gray-400">
          Structured oversight for people, stewardship, communication, and mission momentum.
        </p>
      </div>
      <span className="hidden items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary sm:inline-flex">
        <ShieldCheck className="size-3.5" aria-hidden />
        {mockUser.roleLabel}
      </span>
    </header>
  );
}
