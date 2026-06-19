"use client";

import { useMemo } from "react";

import { useSessionUserOrNull } from "@/hooks/use-current-user";
import {
  canAccessLeadershipConsole,
  getUserRoles,
  hasLeadershipAccessPermission,
} from "@/lib/auth/leadership-access";
import { useAuth } from "@/providers/auth-provider";

export function useLeadershipAccess() {
  const { status } = useAuth();
  const sessionUser = useSessionUserOrNull();

  return useMemo(() => {
    const roles = sessionUser ? getUserRoles(sessionUser) : [];
    const canAccess = sessionUser ? canAccessLeadershipConsole(sessionUser) : false;

    return {
      sessionUser,
      status,
      isReady: status !== "loading",
      roles,
      canAccessLeadershipConsole: canAccess,
      showLeadershipConsole: status !== "loading" && canAccess,
      hasLeadershipAccessPermission: sessionUser
        ? hasLeadershipAccessPermission(sessionUser.permissions)
        : false,
    };
  }, [sessionUser, status]);
}
