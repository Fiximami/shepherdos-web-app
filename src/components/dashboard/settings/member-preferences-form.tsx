"use client";

import type { ComponentType } from "react";
import { Loader2, Mail, MessageSquare, BellRing, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FormToast } from "@/components/shared/form-toast";
import { Button } from "@/components/ui/button";
import { updateMyPreferences } from "@/lib/api/members";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { MemberPreferences } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type PreferenceKey = keyof MemberPreferences;

type PreferenceToggleProps = {
  label: string;
  description?: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  enabled: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

function PreferenceToggle({
  label,
  description,
  icon: Icon,
  enabled,
  disabled = false,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
          <Icon className="size-4 text-blue-200/90" aria-hidden />
          {label}
        </span>
        {description ? <p className="mt-1 text-xs text-gray-400">{description}</p> : null}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "rounded-full px-3 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          enabled ? "bg-primary/15 text-primary" : "bg-white/[0.08] text-gray-300",
        )}
      >
        {enabled ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
}

type MemberPreferencesFormProps = {
  preferences: MemberPreferences;
  disabled?: boolean;
  onSaved?: (preferences: MemberPreferences) => void;
};

const preferenceFields: Array<{
  key: PreferenceKey;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}> = [
  {
    key: "emailNotifications",
    label: "Email notifications",
    description: "Weekly summaries and important church updates by email.",
    icon: Mail,
  },
  {
    key: "smsNotifications",
    label: "SMS notifications",
    description: "Short reminders and alerts sent to your phone.",
    icon: Smartphone,
  },
  {
    key: "prayerUpdates",
    label: "Prayer response updates",
    description: "Notifications when someone responds to your prayer requests.",
    icon: MessageSquare,
  },
  {
    key: "eventReminders",
    label: "Event reminders",
    description: "Reminders before services and events you follow.",
    icon: BellRing,
  },
];

export function MemberPreferencesForm({
  preferences,
  disabled = false,
  onSaved,
}: MemberPreferencesFormProps) {
  const [values, setValues] = useState<MemberPreferences>(preferences);
  const [savedValues, setSavedValues] = useState<MemberPreferences>(preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null,
  );

  useEffect(() => {
    setValues(preferences);
    setSavedValues(preferences);
  }, [preferences]);

  const hasUnsavedChanges = useMemo(
    () =>
      values.emailNotifications !== savedValues.emailNotifications ||
      values.smsNotifications !== savedValues.smsNotifications ||
      values.prayerUpdates !== savedValues.prayerUpdates ||
      values.eventReminders !== savedValues.eventReminders,
    [savedValues, values],
  );

  const setPreference = (key: PreferenceKey, enabled: boolean) => {
    setValues((current) => ({ ...current, [key]: enabled }));
    setToast(null);
  };

  const handleSave = async () => {
    setToast(null);
    const previous = savedValues;
    setSavedValues(values);
    setIsSaving(true);

    try {
      const updated = await updateMyPreferences(values);
      setValues(updated);
      setSavedValues(updated);
      setToast({ message: "Preferences saved successfully.", variant: "success" });
      onSaved?.(updated);
    } catch (cause) {
      setSavedValues(previous);
      setValues(previous);
      setToast({ message: getApiErrorMessage(cause), variant: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = disabled || isSaving;

  return (
    <div className="space-y-4">
      {toast ? (
        <FormToast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      ) : null}

      {preferenceFields.map((field) => (
        <PreferenceToggle
          key={field.key}
          label={field.label}
          description={field.description}
          icon={field.icon}
          enabled={values[field.key]}
          disabled={isDisabled}
          onChange={(enabled) => setPreference(field.key, enabled)}
        />
      ))}

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
          type="button"
          onClick={() => void handleSave()}
          disabled={isDisabled || !hasUnsavedChanges}
          className="h-10 rounded-xl"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save preferences"
          )}
        </Button>
      </div>
    </div>
  );
}
