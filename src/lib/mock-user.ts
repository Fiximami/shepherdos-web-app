export const availablePermissions = [
  "members:create",
  "members:update",
  "announcements:create",
  "messages:send",
  "events:create",
  "attendance:record",
  "followups:assign",
  "counselling:view",
  "counselling:manage",
  "feed:create",
  "payments:create",
  "prayer:create",
  "events:register",
  "invites:create",
  "finance:record",
  "finance:approve",
  "finance:report",
  "settings:manage",
  "users:manage",
] as const;

export type Permission = (typeof availablePermissions)[number];

type MockUser = {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  churchName: string;
  churchLogo: string;
  permissions: Permission[];
};

// Temporary mock permissions until backend auth and role permissions are connected.
export const mockUser: MockUser = {
  id: "user_001",
  name: "John Doe",
  role: "church_admin",
  roleLabel: "Church Admin",
  churchName: "Grace Community Church",
  churchLogo: "/images/branding/shepherdos-logo.png",
  permissions: [
    "members:create",
    "members:update",
    "announcements:create",
    "messages:send",
    "events:create",
    "attendance:record",
    "followups:assign",
    "counselling:view",
    "counselling:manage",
    "feed:create",
    "payments:create",
    "prayer:create",
    "events:register",
    "invites:create",
    "finance:record",
    "finance:approve",
  ],
};