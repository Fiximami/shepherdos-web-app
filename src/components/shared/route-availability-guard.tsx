"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import {
  getUnavailableRedirect,
  isPathAvailable,
  type AlphaRouteScope,
} from "@/lib/config/alpha-routes";

type RouteAvailabilityGuardProps = {
  children: ReactNode;
  scope: AlphaRouteScope;
};

export function RouteAvailabilityGuard({ children, scope }: RouteAvailabilityGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAvailable = isPathAvailable(pathname, scope);

  useEffect(() => {
    if (!isAvailable) {
      router.replace(getUnavailableRedirect(scope, pathname));
    }
  }, [isAvailable, pathname, router, scope]);

  if (!isAvailable) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 px-4 py-3 text-sm shadow-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Redirecting…
        </div>
      </div>
    );
  }

  return children;
}
