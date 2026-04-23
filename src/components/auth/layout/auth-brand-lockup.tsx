import type { ReactNode } from "react";
import { Church } from "lucide-react";

import { dashboardCopy } from "@/lib/constants/dashboard";

import { authBrandIconShellClassName } from "../auth-styles";

type AuthBrandLockupProps = {
  icon?: ReactNode;
};

export function AuthBrandLockup({
  icon = (
    <Church
      className="size-6 text-foreground/85"
      strokeWidth={1.75}
      aria-hidden
    />
  ),
}: AuthBrandLockupProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={authBrandIconShellClassName}>{icon}</div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {dashboardCopy.productName}
        </p>
        <p className="text-sm text-muted-foreground">{dashboardCopy.tagline}</p>
      </div>
    </div>
  );
}
