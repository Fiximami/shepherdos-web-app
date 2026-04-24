"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MembersSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MembersSearchInput({ value, onChange }: MembersSearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by name, member ID, or phone"
      className="h-10 rounded-xl bg-background/80 px-3"
    />
  );
}

type MembersSelectFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  label: string;
};

export function MembersSelectFilter({
  value,
  onChange,
  options,
  label,
}: MembersSelectFilterProps) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/75 px-3 h-10">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 bg-transparent text-sm text-foreground outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type MembersExportButtonProps = {
  onClick?: () => void;
};

export function MembersExportButton({ onClick }: MembersExportButtonProps) {
  return (
    <Button variant="outline" className="h-10 rounded-xl" onClick={onClick}>
      <Download className="size-4" aria-hidden />
      Export
    </Button>
  );
}
