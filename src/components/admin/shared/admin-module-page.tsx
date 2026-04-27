import { Activity, ClipboardCheck, Sparkles } from "lucide-react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";

type ModulePanel = {
  title: string;
  description: string;
  items: string[];
};

type AdminModulePageProps = {
  title: string;
  description: string;
  summary: Array<{ label: string; value: string; note: string }>;
  panels: ModulePanel[];
};

export function AdminModulePage({ title, description, summary, panels }: AdminModulePageProps) {
  return (
    <main className="space-y-5">
      <AdminPageHeader title={title} description={description} />

      <section className="grid gap-3 md:grid-cols-3">
        {summary.map((card) => (
          <AdminCard key={card.label} title={card.label} description={card.note}>
            <p className="text-lg font-semibold text-white">{card.value}</p>
          </AdminCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {panels.map((panel, index) => (
          <AdminCard
            key={panel.title}
            title={panel.title}
            description={panel.description}
            className={index === 0 ? "xl:col-span-2" : ""}
          >
            <ul className="space-y-2">
              {panel.items.map((item, itemIndex) => (
                <li key={item} className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-300">
                  {itemIndex % 3 === 0 ? (
                    <Sparkles className="mt-0.5 size-3.5 shrink-0 text-amber-200/80" aria-hidden />
                  ) : itemIndex % 3 === 1 ? (
                    <Activity className="mt-0.5 size-3.5 shrink-0 text-blue-200/80" aria-hidden />
                  ) : (
                    <ClipboardCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-200/80" aria-hidden />
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </AdminCard>
        ))}
      </section>
    </main>
  );
}
