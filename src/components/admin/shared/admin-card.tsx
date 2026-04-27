import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function AdminCard({ title, description, children, className }: AdminCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_16px_34px_-28px_rgba(0,0,0,0.75)] transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:border-white/20",
        className,
      )}
    >
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {description ? <p className="mt-1 text-xs text-gray-400">{description}</p> : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </section>
  );
}
