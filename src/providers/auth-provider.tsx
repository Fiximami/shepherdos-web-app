"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchCurrentUser, logout as clearAuthSession } from "@/lib/api/auth";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { SessionUser } from "@/lib/api/types";
import {
  disableDemoMode,
  getAccessToken,
  hasAuthenticatedSession,
  isDemoModeEnabled,
} from "@/lib/api/token-storage";
import { getDemoSessionUser, mapApiUserToSession } from "@/lib/auth/map-user";
import { setSessionUser } from "@/lib/auth/session-store";
import { routes } from "@/lib/constants/navigation";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: SessionUser | null;
  status: AuthStatus;
  error: string | null;
  isDemo: boolean;
  refresh: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const applyUser = useCallback((nextUser: SessionUser | null) => {
    setUser(nextUser);
    setSessionUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    clearAuthSession();
    disableDemoMode();
    applyUser(null);
    setIsDemo(false);
    setStatus("unauthenticated");
    router.replace(routes.auth.login);
  }, [applyUser, router]);

  const refresh = useCallback(async () => {
    if (isDemoModeEnabled()) {
      applyUser(getDemoSessionUser());
      setIsDemo(true);
      setStatus("authenticated");
      setError(null);
      return;
    }

    if (!getAccessToken()) {
      applyUser(null);
      setIsDemo(false);
      setStatus("unauthenticated");
      return;
    }

    try {
      const apiUser = await fetchCurrentUser();
      applyUser(mapApiUserToSession(apiUser));
      setIsDemo(false);
      setStatus("authenticated");
      setError(null);
    } catch (cause) {
      applyUser(null);
      setIsDemo(false);
      setStatus("unauthenticated");
      setError(getApiErrorMessage(cause));
    }
  }, [applyUser]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
    });

    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      applyUser(null);
      setStatus("unauthenticated");
      return;
    }

    void refresh();
  }, [applyUser, refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      error,
      isDemo,
      refresh,
      signOut,
    }),
    [error, isDemo, refresh, signOut, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
