import type { ReactNode } from "react";

type AuthPageSurfaceProps = {
  heading: string;
  children?: ReactNode;
};

export function AuthPageSurface({ heading, children }: AuthPageSurfaceProps) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-6 py-10">
      <h1 className="text-lg font-medium text-foreground">{heading}</h1>
      {children ?? (
        <p className="mt-2 text-sm text-muted-foreground">
          This screen will be implemented in a later milestone.
        </p>
      )}
    </main>
  );
}
