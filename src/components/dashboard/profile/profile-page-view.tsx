"use client";

import {
  BadgeCheck,
  Church,
  HandHeart,
  Mail,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SettingsPlaceholderRow } from "@/components/dashboard/settings/settings-section-shell";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { MemberLinkedNotice } from "@/components/shared/member-linked-notice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemberProfileFields } from "@/hooks/use-member-profile-fields";

const ministryInvolvement = [
  { team: "Ushering Team", role: "Weekend rotation volunteer", schedule: "2nd & 4th Sundays" },
  { team: "Prayer Support", role: "Prayer chain responder", schedule: "Midweek slots" },
] as const;

const skillsAndInterests = [
  "Hospitality and first-timer care",
  "Youth mentorship",
  "Music coordination",
  "Community outreach support",
] as const;

export function ProfilePageView() {
  const { user, isAuthenticatedLive, isLinked, profileQuery, fields } = useMemberProfileFields();

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="My Profile"
        description="A calm personal space for your identity, church life, and service journey in the ShepherdOS member portal."
      />

      {isAuthenticatedLive ? (
        <ApiConnectionNotice
          isLoading={profileQuery.isLoading}
          error={profileQuery.error}
          isLive={profileQuery.isLive}
          liveLabel="Showing your member profile from /members/me."
        />
      ) : null}

      {profileQuery.isLive && !isLinked ? <MemberLinkedNotice /> : null}

      <section className="shepherd-fade-in">
        <Card className="relative overflow-hidden border-white/10 bg-white/[0.06] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.15)_0%,rgba(250,204,21,0)_74%)]" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_74%)]" />
          <CardContent className="relative z-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-xl font-semibold text-white"
              aria-hidden
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                {user.name}
              </h2>
              <p className="text-sm text-gray-300">
                {fields.membershipStatus} · {fields.branch}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="size-3.5 shrink-0 text-blue-200/90" aria-hidden />
                {fields.email}
              </p>
              <p className="text-xs text-gray-400">Member ID · {fields.memberId}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Identity</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-amber-100">
                <Sparkles className="size-3.5 text-amber-200/90" aria-hidden />
                Shepherded with care
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in rounded-xl border-t border-white/10 pt-2">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_16px_36px_-30px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <UserRound className="size-4 text-blue-200/90" aria-hidden />
              Personal information
            </CardTitle>
            <CardDescription>
              Your personal details used for care, communication, and church support touchpoints.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingsPlaceholderRow label="Full name" value={user.name} />
            <SettingsPlaceholderRow label="Email" value={fields.email} />
            <SettingsPlaceholderRow label="Phone" value={fields.phone} />
            <SettingsPlaceholderRow label="Date of birth" value={fields.dateOfBirth} />
            <SettingsPlaceholderRow label="Address" value={fields.address} />
            <SettingsPlaceholderRow label="Emergency contact" value={fields.emergencyContact} />
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in rounded-xl border-t border-white/10 pt-2">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_16px_36px_-30px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Church className="size-4 text-amber-200/90" aria-hidden />
              Church information
            </CardTitle>
            <CardDescription>
              Key church-related details that help you stay connected to your local community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingsPlaceholderRow label="Church name" value={user.churchName} />
            <SettingsPlaceholderRow label="Home branch" value={fields.branch} />
            <SettingsPlaceholderRow label="Membership status" value={fields.membershipStatus} />
            <SettingsPlaceholderRow label="Joined church" value={fields.joinedDate} />
            <SettingsPlaceholderRow label="Fellowship unit" value={fields.fellowshipUnit} />
            <SettingsPlaceholderRow label="Pastoral oversight" value={fields.pastor} />
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in rounded-xl border-t border-white/10 pt-2">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_16px_36px_-30px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <HandHeart className="size-4 text-blue-200/90" aria-hidden />
              Ministry involvement
            </CardTitle>
            <CardDescription>
              Areas where you currently serve and support church life with consistency.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {ministryInvolvement.map((item) => (
              <div key={item.team} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-sm font-medium text-white">{item.team}</p>
                <p className="text-xs text-gray-300">{item.role}</p>
                <p className="mt-1 text-xs text-gray-400">{item.schedule}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in rounded-xl border-t border-white/10 pt-2">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_16px_36px_-30px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BadgeCheck className="size-4 text-amber-200/90" aria-hidden />
              Skills and interests
            </CardTitle>
            <CardDescription>
              Gifts and interests that can help leaders connect you to meaningful service opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {skillsAndInterests.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-gray-300"
              >
                {skill}
              </span>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in rounded-xl border-t border-white/10 pt-2">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_16px_36px_-30px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="size-4 text-blue-200/90" aria-hidden />
              Security and account
            </CardTitle>
            <CardDescription>
              Password, devices, and account protection controls will appear here once connected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-8 text-center">
              <p className="text-sm font-medium text-white">Security center placeholder</p>
              <p className="mt-1 text-sm text-gray-400">
                Password updates, two-step verification, trusted devices, and active sessions will be available
                in a future backend-connected release.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
