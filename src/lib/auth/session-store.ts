import type { SessionUser } from "@/lib/api/types";

let currentUser: SessionUser | null = null;

export function setSessionUser(user: SessionUser | null) {
  currentUser = user;
}

export function getSessionUser(): SessionUser | null {
  return currentUser;
}
