export const routes = {
  auth: {
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  app: {
    dashboard: "/dashboard",
    members: "/members",
    attendance: "/attendance",
    finance: "/finance",
    communication: "/communication",
    events: "/events",
    analytics: "/analytics",
    engagement: "/engagement",
    settings: "/settings",
    profile: "/profile",
  },
} as const;

export type AuthRoute = (typeof routes.auth)[keyof typeof routes.auth];
export type AppRoute = (typeof routes.app)[keyof typeof routes.app];

export const primaryNav = [
  { label: "Overview", href: routes.app.dashboard },
  { label: "Members", href: routes.app.members },
  { label: "Attendance", href: routes.app.attendance },
  { label: "Finance", href: routes.app.finance },
  { label: "Communication", href: routes.app.communication },
  { label: "Events", href: routes.app.events },
  { label: "Analytics", href: routes.app.analytics },
  { label: "Engagement", href: routes.app.engagement },
] as const;

export const accountNav = [
  { label: "Profile", href: routes.app.profile },
  { label: "Settings", href: routes.app.settings },
] as const;
