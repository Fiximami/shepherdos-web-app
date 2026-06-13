"use client";

import { useMemo } from "react";

import { pickSummaryValue } from "@/lib/api/formatters";
import { fetchProfileSettings } from "@/lib/api/settings";
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
  const profileQuery = useApiData("member-profile-settings", fetchProfileSettings, {});

  const isAuthenticatedLive = status === "authenticated" && !isDemo && Boolean(user);
  const displayUser = isAuthenticatedLive && user ? user : getDemoSessionUser();
  const profileData = profileQuery.data;

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
  }, [displayUser.email, isAuthenticatedLive, profileData]);

  return {
    user: displayUser,
    isAuthenticatedLive,
    profileQuery,
    fields,
  };
}
