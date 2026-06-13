import type { Permission } from "@/lib/mock-user";

export type LoginRequest = {
  email: string;
  password: string;
  churchSlug: string;
};

export type LoginResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  user?: ApiUser;
};

export type ApiUser = {
  id?: string;
  email?: string;
  name?: string;
  fullName?: string;
  role?: string;
  roleLabel?: string;
  permissions?: string[];
  church?: {
    id?: string;
    name?: string;
    slug?: string;
    logoUrl?: string;
    logo?: string;
  };
  churchName?: string;
  churchLogo?: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  churchName: string;
  churchLogo: string;
  permissions: Permission[];
};

export type MembersSummary = Record<string, unknown>;
export type AttendanceSummary = Record<string, unknown>;
export type FinanceSummary = Record<string, unknown>;

export type ApiListResponse<T> = {
  data?: T[];
  items?: T[];
  results?: T[];
  total?: number;
  meta?: { total?: number };
};

export type ApiMember = {
  id: string;
  name?: string;
  fullName?: string;
  memberId?: string;
  membershipId?: string;
  phone?: string;
  phoneNumber?: string;
  branch?: string;
  branchName?: string;
  ministry?: string;
  department?: string;
  status?: string;
  lastSeen?: string;
  lastSeenAt?: string;
};

export type ApiAttendanceSession = {
  id: string;
  service?: string;
  serviceName?: string;
  date?: string;
  branch?: string;
  branchName?: string;
  department?: string;
  totalPresent?: number;
  presentCount?: number;
  firstTimers?: number;
  firstTimerCount?: number;
  recordedBy?: string;
};

export type ApiFinanceTransaction = {
  id: string;
  date?: string;
  category?: string;
  amount?: number | string;
  source?: string;
  reference?: string;
  status?: string;
  receiptId?: string;
};

export type ApiAuditLog = {
  id: string;
  action?: string;
  actor?: string;
  actorName?: string;
  entity?: string;
  entityType?: string;
  timestamp?: string;
  createdAt?: string;
  before?: string;
  after?: string;
  details?: string;
};

export type ApiSettings = Record<string, unknown>;
