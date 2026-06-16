"use client";

import { useMemo } from "react";

import { useApiData } from "@/hooks/use-api-data";
import { pickSummaryValue } from "@/lib/api/formatters";
import { EMPTY_MEMBER_SCOPE } from "@/lib/api/member-scope";
import { fetchMyMemberProfile } from "@/lib/api/members";
import {
  resolveChurchLogo,
  resolveChurchName,
  resolveDisplayName,
  resolveFirstName,
  resolveRoleLabel,
} from "@/lib/auth/display-identity";
import { getDemoSessionUser } from "@/lib/auth/map-user";
import { useAuth } from "@/providers/auth-provider";

export function useDisplayIdentity() {
  const { user, isDemo, status } = useAuth();
  const memberQuery = useApiData("member-profile-me", fetchMyMemberProfile, EMPTY_MEMBER_SCOPE);

  const isLive = status === "authenticated" && !isDemo && Boolean(user);
  const demoUser = getDemoSessionUser();
  const isLinked = memberQuery.isLive && memberQuery.data.linked;
  const profile = isLinked ? memberQuery.data.profile : {};

  const displayName = useMemo(() => {
    if (!isLive || !user) return demoUser.name;

    const profileName = pickSummaryValue(profile, ["name", "fullName"], "");
    return resolveDisplayName({
      name: profileName || user.name,
      fullName: user.name,
      email: user.email,
    });
  }, [demoUser.name, isLive, profile, user]);

  const firstName = useMemo(() => resolveFirstName(displayName), [displayName]);

  const churchName = useMemo(() => {
    if (!isLive || !user) return demoUser.churchName;
    const profileChurch = pickSummaryValue(profile, ["churchName", "church"], "");
    return resolveChurchName({ churchName: profileChurch || user.churchName }) || user.churchName;
  }, [demoUser.churchName, isLive, profile, user]);

  const churchLogo = useMemo(() => {
    if (!isLive || !user) return demoUser.churchLogo;
    return user.churchLogo;
  }, [demoUser.churchLogo, isLive, user]);

  const roleLabel = useMemo(() => {
    if (!isLive || !user) return demoUser.roleLabel;
    return resolveRoleLabel(user.role, user.roleLabel);
  }, [demoUser.roleLabel, isLive, user]);

  const email = useMemo(() => {
    if (!isLive || !user) return demoUser.email;
    return user.email || pickSummaryValue(profile, ["email"], "");
  }, [demoUser.email, isLive, profile, user]);

  return {
    displayName,
    firstName,
    churchName,
    churchLogo,
    roleLabel,
    email,
    role: isLive && user ? user.role : demoUser.role,
    permissions: isLive && user ? user.permissions : demoUser.permissions,
    isLive,
    isDemo,
    isLinked,
    memberQuery,
  };
}
