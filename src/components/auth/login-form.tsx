"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/constants/navigation";
import { loginFormSchema, type LoginFormValues } from "@/lib/validations/login";

type LoginFormProps = {
  className?: string;
};

async function submitLogin(values: LoginFormValues): Promise<void> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, 900));
  throw new Error("SIGN_IN_NOT_CONFIGURED");
}

export function LoginForm({ className }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearErrors("root");
    try {
      await submitLogin(values);
    } catch (cause) {
      const message =
        cause instanceof Error && cause.message === "SIGN_IN_NOT_CONFIGURED"
          ? "Sign-in is not connected in this build yet. Your details were not sent anywhere."
          : "Something went wrong. Please try again in a moment.";
      setError("root", { message });
    }
  });

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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@yourchurch.org"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="h-11 rounded-xl px-3.5 text-base md:text-sm"
          {...register("email")}
        />
        {errors.email?.message ? (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="password">Password</Label>
          <Link
            href={routes.auth.forgotPassword}
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="h-11 rounded-xl px-3.5 text-base md:text-sm"
          {...register("password")}
        />
        {errors.password?.message ? (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-2 h-11 w-full rounded-xl text-[0.9375rem] shadow-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <Button asChild type="button" variant="outline" size="lg" className="h-11 w-full rounded-xl">
        <Link href={routes.app.dashboard}>Continue to Demo Dashboard</Link>
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Demo access only — authentication will be connected later.
      </p>
    </form>
  );
}
