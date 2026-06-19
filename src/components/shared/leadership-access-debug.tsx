"use client";

import {
  canAccessLeadershipConsole,
  getUserRoles,
  hasLeadershipAccessPermission,
} from "@/lib/auth/leadership-access";
import type { LeadershipUser } from "@/lib/auth/leadership-access";
import { isAlphaDeployment } from "@/lib/config/product";

type LeadershipAccessDebugProps = {
  user: LeadershipUser;
  authStatus?: string;
  className?: string;
};

export function LeadershipAccessDebug({
  user,
  authStatus,
  className,
}: LeadershipAccessDebugProps) {
  if (!isAlphaDeployment()) {
    return null;
  }

  const roles = getUserRoles(user);
  const leadershipAccess = canAccessLeadershipConsole(user);
  const hasLeadershipPermission = hasLeadershipAccessPermission(user.permissions);

  return (
    <div
      className={
        className ??
        "rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 font-mono text-[10px] leading-relaxed text-amber-100/90"
      }
    >
      {authStatus ? <p>authStatus: {authStatus}</p> : null}
      <p>role: {user.role}</p>
      <p>roles: [{roles.join(", ")}]</p>
      <p>permissions: {user.permissions.length}</p>
      <p>has leadership.access: {String(hasLeadershipPermission)}</p>
      <p>canAccessLeadershipConsole: {String(leadershipAccess)}</p>
      <p>showLeadershipConsole: {String(leadershipAccess)}</p>
    </div>
  );
}
