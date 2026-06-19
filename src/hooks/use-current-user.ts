"use client";

import type { SessionUser } from "@/lib/api/types";
import { getDemoSessionUser, getEmptySessionUser } from "@/lib/auth/map-user";
import { useAuth } from "@/providers/auth-provider";

export function useCurrentUser(): SessionUser {
  const { user, isDemo, status } = useAuth();

  if (user) return user;
  if (isDemo) return getDemoSessionUser();
  if (status === "unauthenticated") return getEmptySessionUser();

  return getEmptySessionUser();
}

export function useSessionUserOrNull(): SessionUser | null {
  const { user, isDemo } = useAuth();

  if (user) return user;
  if (isDemo) return getDemoSessionUser();
  return null;
}
