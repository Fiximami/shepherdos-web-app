"use client";

import { LogOut, Settings, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { resolveRoleLabel } from "@/lib/auth/display-identity";
import {
  canAccessLeadershipConsole,
  getUserRoles,
} from "@/lib/auth/leadership-access";
import { isAlphaDeployment } from "@/lib/config/product";
import { routes } from "@/lib/constants/navigation";
import { useAuth } from "@/providers/auth-provider";

type UserMenuProps = {
  name: string;
  role: string;
  roleLabel?: string;
  workspace: string;
};

export function UserMenu({ name, role, roleLabel, workspace }: UserMenuProps) {
  const { signOut } = useAuth();
  const currentUser = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  const resolvedRoleLabel = useMemo(
    () => resolveRoleLabel(role, roleLabel),
    [role, roleLabel],
  );

  const roles = useMemo(() => getUserRoles(currentUser), [currentUser]);
  const leadershipAccess = useMemo(
    () => canAccessLeadershipConsole(currentUser),
    [currentUser],
  );
  const showAlphaDebug = isAlphaDeployment();

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        className="flex min-w-[180px] items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-left transition-[background-color,border-color,transform] duration-250 ease-out hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.1]"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <UserCircle2 className="size-4 text-gray-400" aria-hidden />
          <div className="leading-tight">
            <p className="text-xs font-semibold text-white">{name}</p>
            <p className="text-[11px] text-gray-400">{resolvedRoleLabel}</p>
          </div>
        </div>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
          Active
        </span>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-white/10 bg-[#102338]/95 p-2 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="mb-2 rounded-lg bg-white/[0.05] px-3 py-2">
            <p className="text-sm font-medium text-white">{name}</p>
            <p className="text-xs text-gray-400">{resolvedRoleLabel}</p>
            <p className="mt-1 text-[11px] text-gray-400">{workspace}</p>
          </div>

          <div className="space-y-1">
            <Link
              href={routes.app.profile}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-white/[0.08]"
            >
              <UserCircle2 className="size-4 text-gray-300" aria-hidden />
              My Profile
            </Link>
            <Link
              href={routes.app.settings}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-white/[0.08]"
            >
              <Settings className="size-4 text-gray-300" aria-hidden />
              Settings
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/[0.08]"
            >
              <LogOut className="size-4 text-gray-300" aria-hidden />
              Logout
            </button>
          </div>

          {showAlphaDebug ? (
            <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 font-mono text-[10px] leading-relaxed text-amber-100/90">
              <p>role: {currentUser.role}</p>
              <p>roles: [{roles.join(", ")}]</p>
              <p>permissions: {currentUser.permissions.length}</p>
              <p>canAccessLeadershipConsole: {String(leadershipAccess)}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
