export const churchRoles = {
  churchOwner: "church_owner",
  admin: "admin",
  pastor: "pastor",
  elder: "elder",
  financeOfficer: "finance_officer",
  secretary: "secretary",
  ministryLeader: "ministry_leader",
  member: "member",
} as const;

export type ChurchRole = (typeof churchRoles)[keyof typeof churchRoles];

export const churchRoleLabels: Record<ChurchRole, string> = {
  [churchRoles.churchOwner]: "Church owner",
  [churchRoles.admin]: "Administrator",
  [churchRoles.pastor]: "Pastor",
  [churchRoles.elder]: "Elder",
  [churchRoles.financeOfficer]: "Finance officer",
  [churchRoles.secretary]: "Church secretary",
  [churchRoles.ministryLeader]: "Ministry leader",
  [churchRoles.member]: "Member",
};
