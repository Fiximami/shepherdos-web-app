"use client";

import { Church } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { authElevatedCardClassName } from "./auth-styles";
import { LoginForm } from "./login-form";
import { AuthAmbientBackdrop } from "./layout/auth-ambient-backdrop";
import { AuthBrandLockup } from "./layout/auth-brand-lockup";

export function LoginScreen() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <AuthAmbientBackdrop />

      <div className="relative z-[1] mx-auto grid min-h-svh w-full max-w-6xl items-stretch px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,26rem)] lg:items-center lg:gap-12 lg:px-10 lg:py-0">
        <section className="mb-10 flex flex-col justify-center lg:mb-0 lg:pr-6">
          <div className="mb-8">
            <AuthBrandLockup
              icon={
                <Church
                  className="size-6 text-foreground/85"
                  strokeWidth={1.75}
                  aria-hidden
                />
              }
            />
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
          <Card className={authElevatedCardClassName}>
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
