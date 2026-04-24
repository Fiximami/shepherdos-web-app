"use client";

import { Mail, Shield } from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SettingsPlaceholderRow } from "@/components/dashboard/settings/settings-section-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProfilePageView() {
  return (
    <main className="mx-auto w-full max-w-3xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Profile"
        description="Your place in this church workspace—who you are to the community, how you serve, and how your account stays secure."
      />

      <section className="mb-6">
        <Card className="overflow-hidden border-border/70 bg-card/85 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-xl font-semibold text-primary"
              aria-hidden
            >
              JM
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Judith Mensah
              </h2>
              <p className="text-sm text-muted-foreground">
                Church secretary · Main Campus
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-3.5 shrink-0" aria-hidden />
                judith.mensah@gracecommunity.org
              </p>
              <p className="text-xs text-muted-foreground">Member ID · SHP-1044</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="space-y-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Account information</CardTitle>
            <CardDescription>
              Details your church uses to reach you and keep records accurate. Changes
              here will be available once your administrator enables editing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingsPlaceholderRow label="Preferred name" value="Judith Mensah" />
            <SettingsPlaceholderRow label="Email" value="judith.mensah@gracecommunity.org" />
            <SettingsPlaceholderRow label="Phone" value="+234 803 221 9044" />
            <SettingsPlaceholderRow label="Home branch" value="Main Campus" />
            <SettingsPlaceholderRow label="Joined" value="12 September 2019" />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="size-4 text-muted-foreground" aria-hidden />
              Role & access
            </CardTitle>
            <CardDescription>
              What you can see and do reflects how your pastors and admins have entrusted
              you—always open to a calm conversation if something needs adjusting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingsPlaceholderRow label="Primary role" value="Church secretary" />
            <SettingsPlaceholderRow
              label="Workspace areas"
              value="Members, events, communication, attendance (read)"
            />
            <SettingsPlaceholderRow label="Branches visible" value="Main Campus, North Branch" />
            <SettingsPlaceholderRow label="Finance access" value="Not enabled for this account" />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Security</CardTitle>
            <CardDescription>
              Password changes and extra sign-in protection will live here when your church
              turns them on for the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
              <p className="text-sm font-medium text-foreground">Sign-in & sessions</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Password updates, two-step verification, and active devices will appear in
                this space. Nothing to configure in this preview build.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
