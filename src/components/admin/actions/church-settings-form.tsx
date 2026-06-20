"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { FormToast } from "@/components/shared/form-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pickSummaryValue } from "@/lib/api/formatters";
import { getApiErrorMessage } from "@/lib/api/errors";
import { updateChurchSettings, updateGivingSettings } from "@/lib/api/settings";
import { hasPermission } from "@/lib/permissions";

type ToastState = { message: string; variant: "success" | "error" } | null;

type ChurchSettingsFormProps = {
  churchName: string;
  churchEmail: string;
  churchPhone: string;
  churchAddress: string;
  defaultCurrency: string;
  onSaved: () => void;
};

export function ChurchSettingsForm({
  churchName,
  churchEmail,
  churchPhone,
  churchAddress,
  defaultCurrency,
  onSaved,
}: ChurchSettingsFormProps) {
  const canManageSettings = hasPermission("settings:manage");
  const [name, setName] = useState(churchName);
  const [email, setEmail] = useState(churchEmail === "—" ? "" : churchEmail);
  const [phone, setPhone] = useState(churchPhone === "—" ? "" : churchPhone);
  const [address, setAddress] = useState(churchAddress === "—" ? "" : churchAddress);
  const [currency, setCurrency] = useState(defaultCurrency === "—" ? "GHS" : defaultCurrency);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    setName(churchName);
    setEmail(churchEmail === "—" ? "" : churchEmail);
    setPhone(churchPhone === "—" ? "" : churchPhone);
    setAddress(churchAddress === "—" ? "" : churchAddress);
    setCurrency(defaultCurrency === "—" ? "GHS" : defaultCurrency);
  }, [churchAddress, churchEmail, churchName, churchPhone, defaultCurrency]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canManageSettings) return;

    setIsSubmitting(true);
    setToast(null);
    try {
      await Promise.all([
        updateChurchSettings({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
        }),
        updateGivingSettings({
          defaultCurrency: currency.trim() || undefined,
          currency: currency.trim() || undefined,
        }),
      ]);
      setToast({ message: "Settings saved successfully.", variant: "success" });
      onSaved();
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!canManageSettings) {
    return (
      <p className="text-xs text-slate-400">
        Church settings are read-only until `settings:manage` permission is granted.
      </p>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {toast ? (
        <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="settings-church-name">Church name</Label>
        <Input id="settings-church-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="settings-church-email">Contact email</Label>
          <Input
            id="settings-church-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-church-phone">Contact phone</Label>
          <Input id="settings-church-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="settings-church-address">Address</Label>
        <Input id="settings-church-address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="settings-default-currency">Default currency</Label>
        <Input
          id="settings-default-currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          placeholder="GHS"
        />
        <p className="text-[11px] text-slate-600">Saved via PATCH /settings/giving.</p>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          "Save settings"
        )}
      </Button>
    </form>
  );
}

export function readDefaultCurrency(settings: Record<string, unknown>): string {
  return pickSummaryValue(settings, ["defaultCurrency", "currency", "default_currency"], "GHS");
}
