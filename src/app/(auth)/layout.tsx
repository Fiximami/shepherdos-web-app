import type { ReactNode } from "react";

type AuthGroupLayoutProps = {
  children: ReactNode;
};

export default function AuthGroupLayout({ children }: AuthGroupLayoutProps) {
  return <div className="min-h-svh bg-transparent">{children}</div>;
}
