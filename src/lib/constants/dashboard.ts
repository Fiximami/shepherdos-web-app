export const dashboardCopy = {
  productName: "ShepherdOS",
  tagline: "Church operations, cared for well.",
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
