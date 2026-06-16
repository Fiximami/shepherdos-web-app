"use client";

import { useMemo } from "react";

import { pickSummaryValue } from "@/lib/api/formatters";
import { EMPTY_MEMBER_SCOPE } from "@/lib/api/member-scope";
import { fetchMyMemberProfile } from "@/lib/api/members";
import { resolveDisplayName } from "@/lib/auth/display-identity";
import { getDemoSessionUser } from "@/lib/auth/map-user";
import { useApiData } from "@/hooks/use-api-data";
import { useAuth } from "@/providers/auth-provider";

const demoProfileFields = {
  memberId: "SHP-1044",
  email: "john.doe@gracecommunity.org",
  phone: "+233 24 111 2233",
  dateOfBirth: "08 March 1993",
  address: "Airport Residential Area, Accra",
  joinedDate: "12 September 2019",
  emergencyContact: "Mary Doe · +233 24 999 1200",
  branch: "Main Campus",
  fellowshipUnit: "Family Connect Circle",
  pastor: "Ps. Emmanuel Boateng",
  membershipStatus: "Active member",
} as const;

export function useMemberProfileFields() {
  const { user, isDemo, status } = useAuth();
  const memberQuery = useApiData("member-profile-me", fetchMyMemberProfile, EMPTY_MEMBER_SCOPE);

  const isAuthenticatedLive = status === "authenticated" && !isDemo && Boolean(user);
  const demoUser = getDemoSessionUser();
  const profileData = memberQuery.data.profile;
  const isLinked = memberQuery.isLive && memberQuery.data.linked;

  const displayName = useMemo(() => {
    if (!isAuthenticatedLive || !user) return demoUser.name;

    const profileName = isLinked ? pickSummaryValue(profileData, ["name", "fullName"], "") : "";
    return resolveDisplayName({
      name: profileName || user.name,
      fullName: user.name,
      email: user.email,
    });
  }, [demoUser.name, isAuthenticatedLive, isLinked, profileData, user]);

  const displayUser = useMemo(() => {
    if (!isAuthenticatedLive || !user) return demoUser;
    return { ...user, name: displayName };
  }, [demoUser, displayName, isAuthenticatedLive, user]);

  const fields = useMemo(() => {
    if (!isAuthenticatedLive) {
      return {
        memberId: demoProfileFields.memberId,
        email: demoProfileFields.email,
        phone: demoProfileFields.phone,
        dateOfBirth: demoProfileFields.dateOfBirth,
        address: demoProfileFields.address,
        joinedDate: demoProfileFields.joinedDate,
        emergencyContact: demoProfileFields.emergencyContact,
        branch: demoProfileFields.branch,
        fellowshipUnit: demoProfileFields.fellowshipUnit,
        pastor: demoProfileFields.pastor,
        membershipStatus: demoProfileFields.membershipStatus,
      };
    }

    if (!isLinked) {
      return {
        memberId: "—",
        email: displayUser.email || "—",
        phone: "—",
        dateOfBirth: "—",
        address: "—",
        joinedDate: "—",
        emergencyContact: "—",
        branch: "—",
        fellowshipUnit: "—",
        pastor: "—",
        membershipStatus: "Not linked",
      };
    }

    return {
      memberId: pickSummaryValue(profileData, ["memberId", "membershipId", "id"], "—"),
      email: pickSummaryValue(profileData, ["email"], displayUser.email || "—"),
      phone: pickSummaryValue(profileData, ["phone", "phoneNumber"], "—"),
      dateOfBirth: pickSummaryValue(profileData, ["dateOfBirth", "dob", "birthDate"], "—"),
      address: pickSummaryValue(profileData, ["address"], "—"),
      joinedDate: pickSummaryValue(profileData, ["joinedDate", "joinedAt", "membershipDate"], "—"),
      emergencyContact: pickSummaryValue(profileData, ["emergencyContact", "emergencyPhone"], "—"),
      branch: pickSummaryValue(profileData, ["branch", "branchName", "homeBranch"], "—"),
      fellowshipUnit: pickSummaryValue(profileData, ["fellowshipUnit", "group", "cellGroup"], "—"),
      pastor: pickSummaryValue(profileData, ["pastor", "pastoralOversight"], "—"),
      membershipStatus: pickSummaryValue(profileData, ["membershipStatus", "status"], "Active member"),
    };
  }, [displayUser.email, isAuthenticatedLive, isLinked, profileData]);

  return {
    user: displayUser,
    displayName,
    isAuthenticatedLive,
    isLinked,
    memberQuery,
    profileQuery: memberQuery,
    fields,
  };
}
