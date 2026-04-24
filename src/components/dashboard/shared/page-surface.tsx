import type { ReactNode } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";

type PageSurfaceProps = {
  heading: string;
  children?: ReactNode;
};

export function PageSurface({ heading, children }: PageSurfaceProps) {
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <PageHeader title={heading} />
      {children ?? (
        <p className="-mt-2 text-sm text-muted-foreground">
          This screen will be implemented in a later milestone.
        </p>
      )}
    </main>
  );
}
