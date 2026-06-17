"use client";

import { BellRing, Globe2, Lock, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { MemberPreferencesForm } from "@/components/dashboard/settings/member-preferences-form";
import { SettingsPlaceholderRow, SettingsSectionShell } from "@/components/dashboard/settings/settings-section-shell";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { MemberLinkedNotice } from "@/components/shared/member-linked-notice";
import { useMemberProfileFields } from "@/hooks/use-member-profile-fields";

export function SettingsPageView() {
  const {
    user,
    isAuthenticatedLive,
    isLinked,
    profileQuery,
    fields,
    preferences,
    refetchProfile,
  } = useMemberProfileFields();

  const canEditPreferences = isAuthenticatedLive && isLinked && profileQuery.isLive;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Settings"
        description="Manage your account preferences in a calm and simple way, with controls designed for members."
      />

      {isAuthenticatedLive ? (
        <ApiConnectionNotice
          isLoading={profileQuery.isLoading}
          error={profileQuery.error}
          isLive={profileQuery.isLive}
          liveLabel="Account details and preferences load from /members/me."
        />
      ) : null}

      {profileQuery.isLive && !isLinked ? <MemberLinkedNotice /> : null}

      <section className="shepherd-fade-in">
        <SettingsSectionShell
          title="Account preferences"
          description="Set your personal account defaults for a smoother day-to-day church experience."
          className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]"
        >
          <SettingsPlaceholderRow label="Display name" value={user.name} />
          <SettingsPlaceholderRow label="Email" value={fields.email} />
          <SettingsPlaceholderRow label="Phone" value={fields.phone} />
          <SettingsPlaceholderRow label="Preferred service branch" value={fields.branch} />
        </SettingsSectionShell>
      </section>

      <section className="shepherd-fade-in">
        <SettingsSectionShell
          title="Notification preferences"
          description="Choose what updates you want to receive and how often."
          className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]"
        >
          {canEditPreferences ? (
            <MemberPreferencesForm preferences={preferences} onSaved={() => refetchProfile()} />
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300">
              Notification preferences are available when your member profile is linked.
            </p>
          )}
        </SettingsSectionShell>
      </section>

      <section className="shepherd-fade-in">
        <SettingsSectionShell
          title="Privacy settings"
          description="Control who can view your member profile and who can send you direct messages."
          className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]"
          preview
        >
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-8 text-center">
            <p className="text-sm font-medium text-white">Privacy controls coming soon</p>
            <p className="mt-1 text-sm text-gray-400">
              Profile visibility and direct message preferences will be connected in a future release.
            </p>
          </div>
        </SettingsSectionShell>
      </section>

      <section className="shepherd-fade-in">
        <SettingsSectionShell
          title="Language and accessibility"
          description="Placeholder for language and accessibility preferences."
          className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]"
        >
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-8 text-center">
            <Globe2 className="mx-auto size-8 text-gray-400" aria-hidden />
            <p className="mt-3 text-sm font-medium text-white">Language and readability controls</p>
            <p className="mt-1 text-sm text-gray-400">
              Language choice, text scaling, and visual accessibility options will appear here in a future update.
            </p>
          </div>
        </SettingsSectionShell>
      </section>

      <section className="shepherd-fade-in">
        <SettingsSectionShell
          title="Security"
          description="Placeholder for account protection and sign-in safety controls."
          className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]"
        >
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-8 text-center">
            <Lock className="mx-auto size-8 text-gray-400" aria-hidden />
            <p className="mt-3 text-sm font-medium text-white">Security settings placeholder</p>
            <p className="mt-1 text-sm text-gray-400">
              Password update, trusted devices, and session management will be available once backend auth is
              connected.
            </p>
          </div>
        </SettingsSectionShell>
      </section>

      <section className="shepherd-fade-in">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="inline-flex items-center gap-1.5 text-xs text-gray-300">
            <SlidersHorizontal className="size-3.5 text-blue-200/90" aria-hidden />
            Member settings only. Admin and workspace controls are available in Leadership Console.
          </p>
        </div>
      </section>
    </main>
  );
}
