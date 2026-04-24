import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SettingsSectionShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function SettingsSectionShell({
  title,
  description,
  children,
  className,
}: SettingsSectionShellProps) {
  return (
    <Card
      className={cn(
        "border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

type SettingsPlaceholderRowProps = {
  label: string;
  value: string;
};

export function SettingsPlaceholderRow({ label, value }: SettingsPlaceholderRowProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-background/65 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}
