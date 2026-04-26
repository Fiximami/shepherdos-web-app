"use client";

import { ArrowLeft, BarChart3, Megaphone, Receipt, UserCircle2, Users } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const leadershipModules = [
  {
    label: "Members",
    description: "Care records, first-timers, workers, and structured follow-up visibility.",
    icon: Users,
  },
  {
    label: "Attendance",
    description: "Participation trends to help leaders notice rhythm shifts early.",
    icon: UserCircle2,
  },
  {
    label: "Finance",
    description: "Giving, approvals, and stewardship snapshots for accountable oversight.",
    icon: Receipt,
  },
  {
    label: "Communication",
    description: "Announcements and message planning for coordinated church updates.",
    icon: Megaphone,
  },
  {
    label: "Reports",
    description: "Leadership summaries for meetings, planning, and ministry reviews.",
    icon: BarChart3,
  },
] as const;

export function AdminWorkspaceView() {
  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Leadership Console"
        description="A focused workspace for church leadership decisions—structured, calm, and clear enough for confident oversight."
        actions={
          <Button asChild variant="outline" className="h-10 rounded-xl">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" aria-hidden />
              Return to Member Dashboard
            </Link>
          </Button>
        }
      />

      <section className="rounded-2xl border border-border/70 bg-card/45 p-4 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.5)] sm:p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Leadership workspace modules
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leadershipModules.map((module, index) => (
            <Card
              key={module.label}
              className={cn(
                "border-border/70 bg-card/80 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.55)]",
                index === 4 && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <module.icon className="size-4 text-primary" aria-hidden />
                  {module.label}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Module view is available in this leadership workspace.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
