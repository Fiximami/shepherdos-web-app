"use client";

import { ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { authElevatedCardClassName } from "./auth-styles";
import { AuthAmbientBackdrop } from "./layout/auth-ambient-backdrop";
import { AuthBrandLockup } from "./layout/auth-brand-lockup";
import { ResetPasswordForm } from "./reset-password-form";

export function ResetPasswordScreen() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <AuthAmbientBackdrop />

      <div className="relative z-[1] mx-auto flex min-h-svh w-full max-w-lg flex-col px-4 py-10 sm:px-6 sm:py-14 lg:max-w-xl lg:py-16">
        <header className="mb-8 sm:mb-10">
          <AuthBrandLockup
            icon={
              <ShieldCheck
                className="size-6 text-foreground/85"
                strokeWidth={1.75}
                aria-hidden
              />
            }
          />
        </header>

        <main className="flex flex-1 flex-col justify-center pb-8">
          <div className="mb-6 space-y-3 sm:mb-8">
            <h1 className="font-heading text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              Choose a fresh password you can trust
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
              You&apos;re almost back inside your church workspace. Pick something
              memorable for you—and hard for others to guess—then you can carry on
              with clarity and peace of mind.
            </p>
          </div>

          <Card className={authElevatedCardClassName}>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl sm:text-[1.35rem]">
                Set your new password
              </CardTitle>
              <CardDescription className="text-[0.9375rem] leading-relaxed">
                Enter it twice so we know it landed just right. ShepherdOS will keep
                your access steady and your people&apos;s information respectfully
                guarded.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              <ResetPasswordForm className="space-y-5" />
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground sm:text-left">
            Link feeling unfamiliar? Request a new reset from the sign-in page and
            your administrator can help if you need it.
          </p>
        </main>
      </div>
    </div>
  );
}
