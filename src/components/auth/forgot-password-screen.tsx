"use client";

import { KeyRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { authElevatedCardClassName } from "./auth-styles";
import { ForgotPasswordForm } from "./forgot-password-form";
import { AuthAmbientBackdrop } from "./layout/auth-ambient-backdrop";
import { AuthBrandLockup } from "./layout/auth-brand-lockup";

export function ForgotPasswordScreen() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-transparent">
      <AuthAmbientBackdrop />

      <div className="relative z-[1] mx-auto flex min-h-svh w-full max-w-lg flex-col px-4 py-10 sm:px-6 sm:py-14 lg:max-w-xl lg:py-16">
        <header className="mb-8 sm:mb-10">
          <AuthBrandLockup
            icon={
              <KeyRound
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
              Regain access to your workspace
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
              Enter the email you use with ShepherdOS. We&apos;ll send a secure link
              so you can set a new password and return to serving with confidence.
            </p>
          </div>

          <Card className={authElevatedCardClassName}>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl sm:text-[1.35rem]">
                Reset your password
              </CardTitle>
              <CardDescription className="text-[0.9375rem] leading-relaxed">
                One step—then check your inbox (and spam, just in case). Your
                church data stays protected throughout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              <ForgotPasswordForm className="space-y-5" />
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground sm:text-left">
            Still stuck? Ask your church administrator—they can confirm which email
            is tied to your access.
          </p>
        </main>
      </div>
    </div>
  );
}
