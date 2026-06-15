"use client";

import { BellRing, Globe2, Lock, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SettingsPlaceholderRow, SettingsSectionShell } from "@/components/dashboard/settings/settings-section-shell";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { MemberLinkedNotice } from "@/components/shared/member-linked-notice";
import { useMemberProfileFields } from "@/hooks/use-member-profile-fields";

export function SettingsPageView() {
  const { user, isAuthenticatedLive, isLinked, profileQuery, fields } = useMemberProfileFields();
  const [allowEmailUpdates, setAllowEmailUpdates] = useState(true);
  const [allowPushReminders, setAllowPushReminders] = useState(true);
  const [allowPrayerUpdates, setAllowPrayerUpdates] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState<"Members" | "Leaders only">("Members");
  const [messageRequests, setMessageRequests] = useState<"Anyone in church" | "Known contacts only">(
    "Known contacts only",
  );

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
          liveLabel="Account details use /members/me when your profile is linked."
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
          <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-white">Weekly summary emails</span>
            <button
              type="button"
              onClick={() => setAllowEmailUpdates((value) => !value)}
              className={`rounded-full px-3 py-1 text-xs ${
                allowEmailUpdates ? "bg-primary/15 text-primary" : "bg-white/[0.08] text-gray-300"
              }`}
            >
              {allowEmailUpdates ? "Enabled" : "Disabled"}
            </button>
          </div>
        </SettingsSectionShell>
      </section>

      <section className="shepherd-fade-in">
        <SettingsSectionShell
          title="Notification preferences"
          description="Choose what updates you want to receive and how often."
          className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]"
        >
          <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
              <BellRing className="size-4 text-blue-200/90" aria-hidden />
              Event reminders
            </span>
            <button
              type="button"
              onClick={() => setAllowPushReminders((value) => !value)}
              className={`rounded-full px-3 py-1 text-xs ${
                allowPushReminders ? "bg-primary/15 text-primary" : "bg-white/[0.08] text-gray-300"
              }`}
            >
              {allowPushReminders ? "Enabled" : "Disabled"}
            </button>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
              <ShieldCheck className="size-4 text-blue-200/90" aria-hidden />
              Prayer response updates
            </span>
            <button
              type="button"
              onClick={() => setAllowPrayerUpdates((value) => !value)}
              className={`rounded-full px-3 py-1 text-xs ${
                allowPrayerUpdates ? "bg-primary/15 text-primary" : "bg-white/[0.08] text-gray-300"
              }`}
            >
              {allowPrayerUpdates ? "Enabled" : "Disabled"}
            </button>
          </div>
          <SettingsPlaceholderRow label="Community feed digest" value="Twice per week" />
        </SettingsSectionShell>
      </section>

      <section className="shepherd-fade-in">
        <SettingsSectionShell
          title="Privacy settings"
          description="Control who can view your member profile and who can send you direct messages."
          className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]"
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-sm font-medium text-white">Profile visibility</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["Members", "Leaders only"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setProfileVisibility(option)}
                  className={`rounded-lg border px-3 py-1.5 text-xs ${
                    profileVisibility === option
                      ? "border-primary/35 bg-primary/12 text-white"
                      : "border-white/10 bg-white/[0.04] text-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-sm font-medium text-white">Direct message requests</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["Anyone in church", "Known contacts only"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMessageRequests(option)}
                  className={`rounded-lg border px-3 py-1.5 text-xs ${
                    messageRequests === option
                      ? "border-primary/35 bg-primary/12 text-white"
                      : "border-white/10 bg-white/[0.04] text-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
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
