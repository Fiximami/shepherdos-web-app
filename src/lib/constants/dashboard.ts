import { getProductName, getProductTagline } from "@/lib/config/product";

export const dashboardCopy = {
  get productName() {
    return getProductName();
  },
  get tagline() {
    return getProductTagline();
  },
} as const;

export const dashboardSections = {
  overview: "overview",
  pastoralCare: "pastoral_care",
  operations: "operations",
  growth: "growth",
} as const;

export type DashboardSection =
  (typeof dashboardSections)[keyof typeof dashboardSections];

export const dashboardSectionLabels: Record<DashboardSection, string> = {
  [dashboardSections.overview]: "Overview",
  [dashboardSections.pastoralCare]: "Pastoral care",
  [dashboardSections.operations]: "Operations",
  [dashboardSections.growth]: "Growth",
};
