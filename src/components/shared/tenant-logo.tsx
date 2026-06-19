"use client";

import Image from "next/image";
import { useState } from "react";

import { Church } from "lucide-react";

import { resolveTenantDisplayName, resolveTenantLogoUrl } from "@/lib/tenant/workspace-identity";
import { cn } from "@/lib/utils";

type TenantLogoProps = {
  churchName?: string | null;
  churchLogo?: string | null;
  size?: number;
  className?: string;
  imageClassName?: string;
};

export function TenantLogo({
  churchName,
  churchLogo,
  size = 40,
  className,
  imageClassName,
}: TenantLogoProps) {
  const [logoMissing, setLogoMissing] = useState(false);
  const logoUrl = resolveTenantLogoUrl(churchLogo);
  const displayName = resolveTenantDisplayName(churchName);
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg border border-white/12 bg-white/[0.08] p-1",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {!logoMissing ? (
        <Image
          src={logoUrl}
          alt={churchName?.trim() ? `${churchName} logo` : `${displayName} logo`}
          fill
          sizes={`${size}px`}
          className={cn("object-contain", imageClassName)}
          onError={() => setLogoMissing(true)}
        />
      ) : churchName?.trim() ? (
        <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
          {initials}
        </span>
      ) : (
        <span className="flex h-full w-full items-center justify-center text-primary">
          <Church className="size-4" aria-hidden />
        </span>
      )}
    </div>
  );
}
