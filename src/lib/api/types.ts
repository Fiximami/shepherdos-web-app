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
  roles?: string[];
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
  churchSlug?: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  roleLabel: string;
  churchName: string;
  churchLogo: string;
  churchSlug: string;
  permissions: string[];
};

export type MembersSummary = Record<string, unknown>;
export type AttendanceSummary = Record<string, unknown>;

export type AttendanceCheckInResult = {
  status: string;
  message: string;
  lastCheckInAt: string;
  sessionName: string;
  checkedInToday: boolean;
};

export type ApiPrayerRequest = {
  id?: string;
  title?: string;
  content?: string;
  message?: string;
  body?: string;
  status?: string;
  submittedAt?: string;
  createdAt?: string;
  date?: string;
};

export type PrayerRequestCreate = {
  title: string;
  content: string;
};

export type ApiCounsellingRequest = {
  id?: string;
  category?: string;
  type?: string;
  title?: string;
  description?: string;
  note?: string;
  status?: string;
  submittedAt?: string;
  createdAt?: string;
  date?: string;
};

export type CounsellingRequestCreate = {
  category: string;
  title: string;
  description: string;
};

export type ApiEventRegistration = {
  id?: string;
  eventId?: string;
  event_id?: string;
  eventName?: string;
  name?: string;
  title?: string;
  status?: string;
  registrationStatus?: string;
  eventDate?: string;
  date?: string;
  startsAt?: string;
  startDate?: string;
  createdAt?: string;
};

export type EventRegistrationResult = {
  status: string;
  message: string;
  eventId: string;
  registrationStatus: string;
};

export type ApiGivingStatement = {
  id?: string;
  period?: string;
  statementPeriod?: string;
  label?: string;
  totalAmount?: number | string;
  amount?: number | string;
  total?: number | string;
  generatedAt?: string;
  generatedDate?: string;
  createdAt?: string;
  date?: string;
};

export type ApiGivingReceipt = {
  id?: string;
  receiptId?: string;
  receipt_id?: string;
  givingId?: string;
  reference?: string;
  financeReference?: string;
  finance_reference?: string;
  date?: string;
  createdAt?: string;
  amount?: number | string;
  category?: string;
  type?: string;
  paymentMethod?: string;
  method?: string;
  memberName?: string;
  member?: string;
  churchName?: string;
  church?: string;
  status?: string;
};

export type ApiPledge = {
  id?: string;
  title?: string;
  name?: string;
  amount?: number | string;
  targetAmount?: number | string;
  target?: number | string;
  paidAmount?: number | string;
  paid?: number | string;
  progress?: number | string;
  targetDate?: string;
  dueDate?: string;
  endDate?: string;
  status?: string;
};

export type PledgeCreate = {
  title: string;
  amount: number;
  targetDate: string;
};

export type PledgeUpdate = {
  paidAmount: number;
};

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

export type MemberProfileUpdate = {
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
};

export type MemberPreferences = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  prayerUpdates: boolean;
  eventReminders: boolean;
};

export type MemberPreferencesUpdate = Partial<MemberPreferences>;

export type MemberCreate = {
  name: string;
  email?: string;
  phone?: string;
  branch?: string;
  ministry?: string;
  department?: string;
  status?: string;
};

export type MemberUpdate = Partial<MemberCreate>;

export type AttendanceSessionCreate = {
  serviceName: string;
  date: string;
  branch?: string;
  department?: string;
};

export type AttendanceSessionUpdate = Partial<AttendanceSessionCreate>;

export type AttendanceRecordCreate = {
  sessionId: string;
  memberId?: string;
  totalPresent?: number;
  firstTimers?: number;
  presentCount?: number;
};

export type FinanceTransactionCreate = {
  type: "income" | "expense";
  category: string;
  amount: number;
  date?: string;
  reference?: string;
  source?: string;
  description?: string;
  department?: string;
};

export type FinanceTransactionStatusUpdate = {
  status: "approved" | "rejected" | "pending";
  reason?: string;
};

export type ChurchSettingsUpdate = {
  name?: string;
  churchName?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type GivingSettingsUpdate = {
  defaultCurrency?: string;
  currency?: string;
};

export type MemberScopeResult<T = Record<string, unknown>> = {
  linked: boolean;
  summary: Record<string, unknown>;
  items: T[];
  profile: Record<string, unknown>;
};
