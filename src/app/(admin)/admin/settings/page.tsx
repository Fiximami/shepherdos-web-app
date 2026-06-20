"use client";

import {
  Building2,
  Church,
  CreditCard,
  Database,
  GitBranch,
  Layers,
  Lock,
  Megaphone,
  Palette,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import {
  ChurchSettingsForm,
  readDefaultCurrency,
} from "@/components/admin/actions/church-settings-form";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { PreviewSectionNotice, previewDescription } from "@/components/shared/preview-section-notice";
import { useApiData } from "@/hooks/use-api-data";
import { formatApiValue, pickSummaryValue } from "@/lib/api/formatters";
import { fetchChurchSettings, fetchGivingSettings, fetchProfileSettings, fetchSettings } from "@/lib/api/settings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDisplayIdentity } from "@/hooks/use-display-identity";
import { cn } from "@/lib/utils";

const settingCategories = [
  { title: "Church Profile", description: "Legal name, contact, and public details shown to members.", icon: Church },
  { title: "Branding", description: "Logo and colours used across the app and printed materials.", icon: Palette },
  { title: "Branches", description: "Campuses or locations people belong to.", icon: GitBranch },
  { title: "Departments / Ministries", description: "How your church organises teams and serving areas.", icon: Layers },
  { title: "Roles & Permissions", description: "Who can see and change sensitive information.", icon: Shield },
  { title: "Service Times", description: "When services run—used for reminders and schedules.", icon: Clock },
  { title: "Communication Preferences", description: "Defaults for emails, SMS, and in-app messages.", icon: Megaphone },
  { title: "Payment Settings", description: "How online giving and receipts connect to your providers.", icon: CreditCard },
  { title: "Security & Access", description: "Sign-in rules and who can access admin tools.", icon: Lock },
  { title: "Data & Backup Placeholder", description: "Where backups and exports will be managed when available.", icon: Database },
] as const;

const roleRows = [
  {
    role: "Owner",
    summary: "Full control of the workspace, billing, and who is invited as admin.",
  },
  {
    role: "Church Admin",
    summary: "Day-to-day configuration: members, events, and most modules except the most sensitive finance approvals if you restrict them.",
  },
  {
    role: "Pastor",
    summary: "Pastoral visibility: care, prayer, announcements, and oversight of ministry health.",
  },
  {
    role: "Finance Officer",
    summary: "Giving summaries, exports, and finance-linked views—without needing every other admin task.",
  },
  {
    role: "Department Leader",
    summary: "Their ministry’s people, rotas, and messages—not the whole church directory unless you allow it.",
  },
  {
    role: "Worker",
    summary: "Serving teams: rosters and team chat—no access to finance or full member records by default.",
  },
  {
    role: "Member",
    summary: "Personal dashboard, giving, events, and community—no admin screens.",
  },
] as const;

const brandColors = [
  { label: "Primary", hex: "#1e3a5f", swatch: "bg-[#1e3a5f]" },
  { label: "Accent", hex: "#c4a35a", swatch: "bg-[#c4a35a]" },
  { label: "Surface", hex: "#0f172a", swatch: "bg-[#0f172a]" },
] as const;

export default function AdminSettingsPage() {
  const [feedback, setFeedback] = useState("");
  const currentUser = useCurrentUser();
  const { displayName } = useDisplayIdentity();
  const settingsQuery = useApiData("admin-settings", fetchSettings, {});
  const churchSettingsQuery = useApiData("admin-settings-church", fetchChurchSettings, {});
  const profileSettingsQuery = useApiData("admin-settings-profile", fetchProfileSettings, {});
  const givingSettingsQuery = useApiData("admin-settings-giving", fetchGivingSettings, {});

  const churchSettings = churchSettingsQuery.data;
  const workspaceSettings = settingsQuery.data;
  const profileSettings = profileSettingsQuery.data;
  const givingSettings = givingSettingsQuery.data;

  const churchName =
    formatApiValue(
      churchSettings.name ?? churchSettings.churchName ?? workspaceSettings.churchName,
      currentUser.churchName,
    ) || currentUser.churchName;

  const churchEmail = pickSummaryValue(
    { ...workspaceSettings, ...churchSettings },
    ["email", "contactEmail", "churchEmail"],
    "—",
  );
  const churchPhone = pickSummaryValue(
    { ...workspaceSettings, ...churchSettings },
    ["phone", "phoneNumber", "contactPhone"],
    "—",
  );
  const churchAddress = pickSummaryValue(
    { ...workspaceSettings, ...churchSettings },
    ["address", "location"],
    "—",
  );
  const adminContactName = pickSummaryValue(profileSettings, ["name", "fullName", "adminName"], displayName);
  const adminContactEmail = pickSummaryValue(profileSettings, ["email"], currentUser.email);

  const settingsLive =
    settingsQuery.isLive ||
    churchSettingsQuery.isLive ||
    profileSettingsQuery.isLive ||
    givingSettingsQuery.isLive;

  return (
    <main className="space-y-5">
      <ApiConnectionNotice
        isLoading={
          settingsQuery.isLoading ||
          churchSettingsQuery.isLoading ||
          profileSettingsQuery.isLoading ||
          givingSettingsQuery.isLoading
        }
        error={
          settingsQuery.error ??
          churchSettingsQuery.error ??
          profileSettingsQuery.error ??
          givingSettingsQuery.error
        }
        isLive={settingsLive}
        liveLabel="Showing live settings from /settings, /settings/church, and /settings/profile."
      />

      <AdminPageHeader
        title="System Settings"
        description="Configure your church workspace, roles, branding, and operating structure. Changes here affect how leaders and members experience ShepherdOS."
      />

      {feedback ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400">{feedback}</p>
      ) : null}

      <AdminCard
        title="Settings categories"
        description={previewDescription("Pick an area to open its full screen when your workspace is connected.")}
        className="border-white/10"
      >
        <PreviewSectionNotice message="Category tiles are navigation placeholders. Only church/profile fields below load from the settings API today." />
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {settingCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.title}
                type="button"
                onClick={() => setFeedback(`“${cat.title}” opens its dedicated settings when connected.`)}
                className={cn(
                  "flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-left transition-colors",
                  "hover:border-sky-400/25 hover:bg-white/[0.05]",
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0c1420]">
                  <Icon className="size-4 text-sky-300/85" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">{cat.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-500">{cat.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard
          title="Church branding"
          description={
            churchSettingsQuery.isLive || settingsQuery.isLive
              ? "Church profile fields from /settings/church and /settings."
              : "Church profile fields — sign in to load /settings/church."
          }
          className="border-white/10"
        >
          <div className="space-y-4">
            <ChurchSettingsForm
              churchName={churchName}
              churchEmail={churchEmail}
              churchPhone={churchPhone}
              churchAddress={churchAddress}
              defaultCurrency={readDefaultCurrency({ ...workspaceSettings, ...givingSettings })}
              onSaved={() => {
                void settingsQuery.refetch();
                void churchSettingsQuery.refetch();
                void givingSettingsQuery.refetch();
              }}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="admin-name">
                  Admin contact
                </label>
                <input
                  id="admin-name"
                  readOnly
                  value={adminContactName}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0c1420] px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="admin-email">
                  Admin email
                </label>
                <input
                  id="admin-email"
                  readOnly
                  value={adminContactEmail}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0c1420] px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Logo</p>
              <PreviewSectionNotice message="Preview only — logo upload is not connected to the settings API yet." />
              <button
                type="button"
                onClick={() => setFeedback("Logo upload will open when connected.")}
                className="mt-2 flex w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#0c1420]/80 px-4 py-8 text-center transition-colors hover:border-sky-400/30"
              >
                <Building2 className="size-8 text-slate-600" aria-hidden />
                <span className="text-xs text-slate-500">Upload a square image (PNG or SVG). We will resize it for you.</span>
                <span className="text-[11px] font-medium text-sky-400/90">Choose file</span>
              </button>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Colours</p>
              <PreviewSectionNotice message="Preview only — brand colours are illustrative until theme settings are saved via API." />
              <ul className="mt-3 flex flex-wrap gap-3">
                {brandColors.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0c1420] px-3 py-2">
                    <span className={cn("size-8 rounded-md ring-1 ring-white/10", c.swatch)} title={c.hex} />
                    <span className="text-xs">
                      <span className="block font-medium text-white">{c.label}</span>
                      <span className="font-mono text-slate-500">{c.hex}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Roles and permissions"
          description={previewDescription("A simple map of who can do what. Fine-grained toggles will appear when your directory is connected.")}
          className="border-white/10"
        >
          <PreviewSectionNotice message="Preview only — role definitions are not loaded from the settings API yet." />
          <ul className="mt-3 divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#0c1420]/60">
            {roleRows.map((row) => (
              <li key={row.role} className="flex gap-3 px-3 py-3 first:rounded-t-xl last:rounded-b-xl">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <Users className="size-4 text-slate-500" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{row.role}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{row.summary}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setFeedback("Edit permissions matrix opens when connected.")}
            className="mt-3 text-xs font-medium text-sky-400/90 hover:text-sky-300"
          >
            Open permission matrix →
          </button>
        </AdminCard>
      </div>
    </main>
  );
}
