"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/constants/navigation";
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/forgot-password";

type ForgotPasswordFormProps = {
  className?: string;
};

async function requestPasswordReset(values: ForgotPasswordFormValues): Promise<void> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, 950));
}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearErrors("root");
    try {
      await requestPasswordReset(values);
      setSentToEmail(values.email);
      reset({ email: "" });
    } catch {
      setError("root", {
        message:
          "We could not complete that request just now. Please wait a moment and try again.",
      });
    }
  });

  if (sentToEmail) {
    return (
      <div className={className}>
        <div
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-4 text-sm text-foreground dark:border-emerald-400/15 dark:bg-emerald-400/[0.07]"
          role="status"
        >
          <div className="flex gap-3">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-400"
              aria-hidden
            />
            <div className="space-y-2">
              <p className="font-medium leading-snug">Request received</p>
              <p className="text-muted-foreground leading-relaxed">
                If <span className="font-medium text-foreground">{sentToEmail}</span>{" "}
                belongs to a ShepherdOS workspace, you will receive a secure link
                to choose a new password. Most messages arrive within a few minutes.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Preview: email is not sent from this build yet—this step only
                confirms what people will see once delivery is connected.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 w-full rounded-xl"
          onClick={() => setSentToEmail(null)}
        >
          Use a different email
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={routes.auth.login}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className={className} onSubmit={onSubmit} noValidate>
      {errors.root?.message ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {errors.root.message}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="forgot-password-email">Email</Label>
        <Input
          id="forgot-password-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@yourchurch.org"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "forgot-password-email-error" : undefined}
          className="h-11 rounded-xl px-3.5 text-base md:text-sm"
          {...register("email")}
        />
        {errors.email?.message ? (
          <p id="forgot-password-email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full rounded-xl text-[0.9375rem] shadow-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Sending instructions…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={routes.auth.login}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
