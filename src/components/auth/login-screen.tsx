"use client";

import { Church } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardCopy } from "@/lib/constants/dashboard";

import { LoginForm } from "./login-form";

export function LoginScreen() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40"
        aria-hidden
      >
        <div className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-900/25" />
        <div className="absolute right-0 top-1/3 h-[22rem] w-[22rem] rounded-full bg-violet-200/45 blur-3xl dark:bg-violet-900/20" />
        <div className="absolute bottom-0 left-1/3 h-[18rem] w-[18rem] rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-900/15" />
      </div>

      <div className="relative z-[1] mx-auto grid min-h-svh w-full max-w-6xl items-stretch px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,26rem)] lg:items-center lg:gap-12 lg:px-10 lg:py-0">
        <section className="mb-10 flex flex-col justify-center lg:mb-0 lg:pr-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-foreground/10 bg-card/90 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm dark:bg-card/70 dark:ring-white/10">
              <Church
                className="size-6 text-foreground/85"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {dashboardCopy.productName}
              </p>
              <p className="text-sm text-muted-foreground">{dashboardCopy.tagline}</p>
            </div>
          </div>

          <h1 className="font-heading text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            A calmer way to care for your church&apos;s day-to-day.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            ShepherdOS brings members, attendance, finances, communication, and
            growth into one gentle rhythm—so leaders can focus on people, not
            paperwork.
          </p>
          <ul className="mt-8 hidden max-w-md space-y-3 text-sm text-muted-foreground sm:block">
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/25" />
              Clear records and warm follow-up, side by side.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/25" />
              Finances and communication handled with respect and order.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/25" />
              Built for teams who serve faithfully, week after week.
            </li>
          </ul>
        </section>

        <section className="flex flex-col justify-center pb-6 lg:py-12">
          <Card className="border-0 bg-card/95 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.06] backdrop-blur-md dark:bg-card/80 dark:shadow-[0_24px_70px_-32px_rgba(0,0,0,0.65)] dark:ring-white/10">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl sm:text-[1.35rem]">Welcome back</CardTitle>
              <CardDescription className="text-[0.9375rem] leading-relaxed">
                Sign in to your church workspace. Take your time—we&apos;ll keep
                things steady on this side.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              <LoginForm className="space-y-5" />
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground sm:text-left">
            Need access? Your church administrator can invite you or reset your
            permissions.
          </p>
        </section>
      </div>
    </div>
  );
}
