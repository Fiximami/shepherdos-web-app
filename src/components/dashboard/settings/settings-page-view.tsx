"use client";

import { Building2, CreditCard, Palette, Shield, SlidersHorizontal } from "lucide-react";
import { useRef } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import {
  SettingsPlaceholderRow,
  SettingsSectionShell,
} from "@/components/dashboard/settings/settings-section-shell";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "branding", label: "Church branding", icon: Palette },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "payments", label: "Payment settings", icon: CreditCard },
  { id: "roles", label: "Roles & permissions", icon: Shield },
] as const;

export function SettingsPageView() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Settings"
        description="Shape how your church workspace looks and behaves—clear areas, sensible defaults, and room to grow without digging through developer menus."
      />

      <section className="mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Jump to a category
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                type="button"
                variant="outline"
                className="h-10 gap-2 rounded-xl border-border/80 bg-background/70"
                onClick={() => scrollTo(cat.id)}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {cat.label}
              </Button>
            );
          })}
        </div>
      </section>

      <div className="space-y-6">
        <div
          ref={(el) => {
            sectionRefs.current.branding = el;
          }}
          id="settings-branding"
          className="scroll-mt-24"
        >
          <SettingsSectionShell
            title="Church branding"
            description="How ShepherdOS presents your church to members and visitors—in due course you will upload a logo and choose accent colors here."
          >
            <SettingsPlaceholderRow label="Church display name" value="Grace Community Church" />
            <SettingsPlaceholderRow label="Short tagline" value="Rooted in Christ · Serving our city" />
            <SettingsPlaceholderRow label="Logo" value="Not uploaded yet (preview)" />
            <SettingsPlaceholderRow label="Primary accent" value="Warm navy · suggested palette" />
            <SettingsPlaceholderRow label="Public URL slug" value="grace-community" />
          </SettingsSectionShell>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.preferences = el;
          }}
          id="settings-preferences"
          className="scroll-mt-24"
        >
          <SettingsSectionShell
            title="Workspace preferences"
            description="Day-to-day rhythms for your team—defaults that keep everyone aligned without fuss."
          >
            <SettingsPlaceholderRow label="Default language" value="English (UK)" />
            <SettingsPlaceholderRow label="Time zone" value="Africa/Lagos" />
            <SettingsPlaceholderRow label="First day of week" value="Monday" />
            <SettingsPlaceholderRow label="Date format" value="DD Mon YYYY" />
            <SettingsPlaceholderRow label="Notification tone" value="Calm summaries, not constant pings" />
          </SettingsSectionShell>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.payments = el;
          }}
          id="settings-payments"
          className="scroll-mt-24"
        >
          <SettingsSectionShell
            title="Payment settings"
            description="When you are ready, connect how your church receives tithes, offerings, and project giving—handled with the same care as your finance desk."
          >
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
              <Building2 className="mx-auto size-8 text-muted-foreground" aria-hidden />
              <p className="mt-3 text-sm font-medium text-foreground">Payment connection</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Provider setup, settlement accounts, and receipt wording will live here. Nothing
                is connected in this preview build.
              </p>
            </div>
          </SettingsSectionShell>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.roles = el;
          }}
          id="settings-roles"
          className="scroll-mt-24"
        >
          <SettingsSectionShell
            title="Roles & permissions"
            description="Who can see finances, send announcements, or manage members—structured so trust stays high and surprises stay low."
          >
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
              <Shield className="mx-auto size-8 text-muted-foreground" aria-hidden />
              <p className="mt-3 text-sm font-medium text-foreground">Access model</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fine-grained role editing will open here. For now, imagine pastors, finance
                officers, secretaries, and ministry leads each with a clear lane.
              </p>
            </div>
            <div className="space-y-2 border-t border-border/60 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Example roles (read-only preview)
              </p>
              <SettingsPlaceholderRow label="Church owner" value="Full workspace oversight" />
              <SettingsPlaceholderRow label="Finance officer" value="Giving, expenses, approvals" />
              <SettingsPlaceholderRow label="Secretary" value="Members, events, communication" />
              <SettingsPlaceholderRow label="Ministry leader" value="Team rosters and engagement" />
            </div>
          </SettingsSectionShell>
        </div>
      </div>
    </main>
  );
}
