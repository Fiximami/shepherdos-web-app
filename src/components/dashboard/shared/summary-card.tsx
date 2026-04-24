import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  className?: string;
};

export function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
  className,
}: SummaryCardProps) {
  return (
    <Card
      className={cn(
        "border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.6)]",
        className,
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Icon className="size-4" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
