"use client";

import { useMemo } from "react";

import type { SessionUser } from "@/lib/api/types";
import { getDemoSessionUser, getEmptySessionUser } from "@/lib/auth/map-user";
import { deriveSessionIdentity, type SessionIdentity } from "@/lib/auth/session-identity";
import { useAuth } from "@/providers/auth-provider";

export type SessionIdentityState = SessionIdentity & {
  sessionUser: SessionUser;
  isLive: boolean;
  isDemo: boolean;
  isReady: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
};

function resolveSessionUser(
  user: SessionUser | null,
  isDemo: boolean,
  status: SessionIdentityState["status"],
): SessionUser {
  if (user) return user;
  if (isDemo) return getDemoSessionUser();
  if (status === "unauthenticated") return getEmptySessionUser();
  return getEmptySessionUser();
}

export function useSessionIdentity(): SessionIdentityState {
  const { user, isDemo, status } = useAuth();

  return useMemo(() => {
    const sessionUser = resolveSessionUser(user, isDemo, status);
    const identity = deriveSessionIdentity(sessionUser);
    const isLive = status === "authenticated" && !isDemo && Boolean(user);

    return {
      ...identity,
      sessionUser,
      isLive,
      isDemo,
      isReady: status !== "loading",
      status,
    };
  }, [isDemo, status, user]);
}
