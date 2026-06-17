"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { FormToast } from "@/components/shared/form-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateForInput, updateMyProfile } from "@/lib/api/members";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  memberProfileFormSchema,
  type MemberProfileFormValues,
} from "@/lib/validations/member-profile";
import { cn } from "@/lib/utils";

type ProfileEditFormProps = {
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  disabled?: boolean;
  onSaved?: () => void;
};

function buildDefaults(values: ProfileEditFormProps): MemberProfileFormValues {
  return {
    email: values.email === "—" ? "" : values.email,
    phone: values.phone === "—" ? "" : values.phone,
    address: values.address === "—" ? "" : values.address,
    dateOfBirth: formatDateForInput(values.dateOfBirth),
  };
}

export function ProfileEditForm({
  email,
  phone,
  address,
  dateOfBirth,
  disabled = false,
  onSaved,
}: ProfileEditFormProps) {
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null,
  );
  const [optimisticValues, setOptimisticValues] = useState<MemberProfileFormValues | null>(null);

  const savedDefaults = useMemo(
    () => buildDefaults({ email, phone, address, dateOfBirth }),
    [address, dateOfBirth, email, phone],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MemberProfileFormValues>({
    resolver: zodResolver(memberProfileFormSchema),
    defaultValues: savedDefaults,
  });

  useEffect(() => {
    reset(savedDefaults);
    setOptimisticValues(null);
  }, [reset, savedDefaults]);

  const currentValues = watch();
  const baseline = optimisticValues ?? savedDefaults;
  const hasUnsavedChanges =
    currentValues.email !== baseline.email ||
    currentValues.phone !== baseline.phone ||
    currentValues.address !== baseline.address ||
    currentValues.dateOfBirth !== baseline.dateOfBirth;

  const onSubmit = handleSubmit(async (values) => {
    setToast(null);
    const previous = { ...currentValues };
    setOptimisticValues(values);
    reset(values);

    try {
      await updateMyProfile({
        email: values.email,
        phone: values.phone,
        address: values.address,
        dateOfBirth: values.dateOfBirth,
      });
      setToast({ message: "Profile updated successfully.", variant: "success" });
      setOptimisticValues(null);
      onSaved?.();
    } catch (cause) {
      setOptimisticValues(null);
      reset(previous);
      setToast({ message: getApiErrorMessage(cause), variant: "error" });
    }
  });

  const isDisabled = disabled || isSubmitting;

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {toast ? (
        <FormToast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="profile-email" className="text-sm text-white">
          Email
        </Label>
        <Input
          id="profile-email"
          type="email"
          autoComplete="email"
          disabled={isDisabled}
          aria-invalid={Boolean(errors.email)}
          className="h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-gray-500"
          {...register("email")}
        />
        {errors.email?.message ? (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-phone" className="text-sm text-white">
          Phone
        </Label>
        <Input
          id="profile-phone"
          type="tel"
          autoComplete="tel"
          disabled={isDisabled}
          aria-invalid={Boolean(errors.phone)}
          className="h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-gray-500"
          {...register("phone")}
        />
        {errors.phone?.message ? (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-dob" className="text-sm text-white">
          Date of birth
        </Label>
        <Input
          id="profile-dob"
          type="date"
          disabled={isDisabled}
          aria-invalid={Boolean(errors.dateOfBirth)}
          className="h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-gray-500"
          {...register("dateOfBirth")}
        />
        {errors.dateOfBirth?.message ? (
          <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-address" className="text-sm text-white">
          Address
        </Label>
        <Input
          id="profile-address"
          type="text"
          autoComplete="street-address"
          disabled={isDisabled}
          aria-invalid={Boolean(errors.address)}
          className="h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-gray-500"
          {...register("address")}
        />
        {errors.address?.message ? (
          <p className="text-xs text-destructive">{errors.address.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={cn(
            "text-xs",
            hasUnsavedChanges ? "text-amber-200/90" : "text-gray-400",
          )}
        >
          {hasUnsavedChanges ? "You have unsaved changes." : "All changes saved."}
        </p>
        <Button
          type="submit"
          disabled={isDisabled || !hasUnsavedChanges}
          className="h-10 rounded-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save profile"
          )}
        </Button>
      </div>
    </form>
  );
}
