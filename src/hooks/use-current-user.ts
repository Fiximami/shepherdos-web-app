"use client";

import type { SessionUser } from "@/lib/api/types";
import { getDemoSessionUser } from "@/lib/auth/map-user";
import { useAuth } from "@/providers/auth-provider";

export function useCurrentUser(): SessionUser {
  const { user } = useAuth();
  return user ?? getDemoSessionUser();
}
