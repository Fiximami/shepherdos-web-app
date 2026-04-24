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
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/reset-password";

type ResetPasswordFormProps = {
  className?: string;
};

async function submitNewPassword(values: ResetPasswordFormValues): Promise<void> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, 900));
}

export function ResetPasswordForm({ className }: ResetPasswordFormProps) {
  const [isComplete, setIsComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearErrors("root");
    try {
      await submitNewPassword(values);
      setIsComplete(true);
      reset({ newPassword: "", confirmPassword: "" });
    } catch {
      setError("root", {
        message:
          "We could not save your new password just now. Please try again in a moment.",
      });
    }
  });

  if (isComplete) {
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
              <p className="font-medium leading-snug">Your password is updated</p>
              <p className="text-muted-foreground leading-relaxed">
                When sign-in is connected, you can use your new password right away
                to return to your church workspace—calmly, and with the same care as
                before.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Preview: nothing was saved on a server in this build; this confirms
                the experience your people will have once the flow is live.
              </p>
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="h-11 w-full rounded-xl text-[0.9375rem] shadow-sm">
          <Link href={routes.auth.login}>Continue to sign in</Link>
        </Button>
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
        <Label htmlFor="reset-password-new">New password</Label>
        <Input
          id="reset-password-new"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={errors.newPassword ? true : undefined}
          aria-describedby={
            errors.newPassword ? "reset-password-new-error" : undefined
          }
          className="h-11 rounded-xl px-3.5 text-base md:text-sm"
          {...register("newPassword")}
        />
        {errors.newPassword?.message ? (
          <p id="reset-password-new-error" className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-password-confirm">Confirm new password</Label>
        <Input
          id="reset-password-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={
            errors.confirmPassword ? "reset-password-confirm-error" : undefined
          }
          className="h-11 rounded-xl px-3.5 text-base md:text-sm"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword?.message ? (
          <p id="reset-password-confirm-error" className="text-sm text-destructive">
            {errors.confirmPassword.message}
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
            Saving your password…
          </>
        ) : (
          "Save new password"
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
