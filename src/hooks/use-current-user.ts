"use client";

import type { SessionUser } from "@/lib/api/types";
import { useSessionIdentity } from "@/hooks/use-session-identity";

export function useCurrentUser(): SessionUser {
  return useSessionIdentity().sessionUser;
}

export function useSessionUserOrNull(): SessionUser | null {
  const { sessionUser, isReady } = useSessionIdentity();
  return isReady ? sessionUser : null;
}
