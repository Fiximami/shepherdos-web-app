"use client";

import { useMemo } from "react";

import { useSessionIdentity } from "@/hooks/use-session-identity";
import {
  formatMemberWorkspaceLabel,
  formatPageWorkspaceLabel,
  formatWorkspaceName,
  getPlatformName,
  resolveTenantDisplayName,
} from "@/lib/tenant/workspace-identity";

export function useDisplayIdentity() {
  const identity = useSessionIdentity();

  const tenantDisplayName = useMemo(
    () => resolveTenantDisplayName(identity.churchName),
    [identity.churchName],
  );

  const workspaceName = useMemo(
    () => formatWorkspaceName(identity.churchName),
    [identity.churchName],
  );

  const memberWorkspaceLabel = useMemo(
    () => formatMemberWorkspaceLabel(identity.churchName),
    [identity.churchName],
  );

  return {
    ...identity,
    tenantDisplayName,
    platformName: getPlatformName(),
    workspaceName,
    memberWorkspaceLabel,
    formatPageWorkspaceLabel: (pageTitle: string) =>
      formatPageWorkspaceLabel(pageTitle, identity.churchName),
    isLinked: false,
    memberQuery: null,
  };
}
