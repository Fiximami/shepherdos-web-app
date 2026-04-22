import type { ReactNode } from "react";

type PageSurfaceProps = {
  heading: string;
  children?: ReactNode;
};

export function PageSurface({ heading, children }: PageSurfaceProps) {
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-lg font-medium text-foreground">{heading}</h1>
      {children ?? (
        <p className="mt-2 text-sm text-muted-foreground">
          This screen will be implemented in a later milestone.
        </p>
      )}
    </main>
  );
}
