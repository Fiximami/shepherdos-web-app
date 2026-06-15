import type { ApiAttendanceSession, ApiAuditLog, ApiFinanceTransaction, ApiMember } from "@/lib/api/types";
import { formatApiValue, formatCurrency } from "@/lib/api/formatters";

export type AdminGivingRecord = {
  id: string;
  member: string;
  category: string;
  amount: string;
  paymentMethod: string;
  date: string;
  receiptStatus: "Issued" | "Pending" | "Not requested";
  financeSync: "Synced" | "Queued" | "Retry";
};

export type MemberGivingHistoryItem = {
  id: string;
  receiptId: string | null;
  financeReference: string | null;
  category: string;
  amount: number;
  method: string;
  dateISO: string;
  status: "Completed" | "Pending";
};

export type MemberFinanceTxRow = {
  reference: string;
  category: string;
  member: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: "Cleared" | "Pending" | "Review";
};

export type MemberAttendanceSessionRow = {
  sessionName: string;
  date: string;
  branch: string;
  attendanceCount: number;
  firstTimers: number;
};

function parseAmount(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function normalizeFinanceStatus(status: string | undefined): MemberFinanceTxRow["status"] {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized.includes("pending")) return "Pending";
  if (normalized.includes("review")) return "Review";
  return "Cleared";
}

function normalizeGivingStatus(status: string | undefined): MemberGivingHistoryItem["status"] {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized.includes("pending") || normalized.includes("queued")) return "Pending";
  return "Completed";
}

function normalizeDateIso(value: unknown): string {
  const raw = formatApiValue(value, "");
  if (!raw || raw === "—") return new Date().toISOString().slice(0, 10);
  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

export type MemberRow = {
  id: string;
  name: string;
  memberId: string;
  phone: string;
  branch: string;
  ministry: string;
  department: string;
  status: "Active" | "First-Timer" | "New Convert" | "Worker" | "Inactive" | "Follow-up Needed";
  lastSeen: string;
};

export type SessionRow = {
  id: string;
  service: string;
  date: string;
  branch: string;
  department: string;
  totalPresent: number;
  firstTimers: number;
  recordedBy: string;
};

export type AttendanceRecordRow = {
  member: string;
  event: string;
  timestamp: string;
  location: string;
  status: string;
  verificationNotes: string;
};

export type AuditRow = {
  id: string;
  action: string;
  actor: string;
  entity: string;
  timestamp: string;
  details: string;
};

const memberStatuses = new Set<MemberRow["status"]>([
  "Active",
  "First-Timer",
  "New Convert",
  "Worker",
  "Inactive",
  "Follow-up Needed",
]);

function normalizeMemberStatus(status: string | undefined): MemberRow["status"] {
  if (!status) return "Active";
  const normalized = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()) as MemberRow["status"];
  return memberStatuses.has(normalized) ? normalized : "Active";
}

export function mapApiMember(member: ApiMember): MemberRow {
  return {
    id: member.id,
    name: member.name ?? member.fullName ?? "Unnamed member",
    memberId: member.memberId ?? member.membershipId ?? member.id,
    phone: member.phone ?? member.phoneNumber ?? "—",
    branch: member.branch ?? member.branchName ?? "—",
    ministry: member.ministry ?? "—",
    department: member.department ?? "—",
    status: normalizeMemberStatus(member.status),
    lastSeen: member.lastSeen ?? member.lastSeenAt ?? "—",
  };
}

export function mapApiAttendanceSession(session: ApiAttendanceSession): SessionRow {
  return {
    id: session.id,
    service: session.service ?? session.serviceName ?? "Service",
    date: session.date ?? "—",
    branch: session.branch ?? session.branchName ?? "—",
    department: session.department ?? "—",
    totalPresent: session.totalPresent ?? session.presentCount ?? 0,
    firstTimers: session.firstTimers ?? session.firstTimerCount ?? 0,
    recordedBy: session.recordedBy ?? "—",
  };
}

export function mapApiAttendanceRecord(record: Record<string, unknown>): AttendanceRecordRow {
  const locationValue = record.location;
  let location = "—";

  if (typeof locationValue === "string") {
    location = locationValue;
  } else if (locationValue && typeof locationValue === "object") {
    const coords = locationValue as { lat?: number; lng?: number };
    if (coords.lat !== undefined && coords.lng !== undefined) {
      location = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
    }
  }

  return {
    member: formatApiValue(record.member ?? record.memberName ?? record.member_id, "—"),
    event: formatApiValue(record.event ?? record.eventName ?? record.event_id ?? record.session, "—"),
    timestamp: formatApiValue(record.timestamp ?? record.checkInAt ?? record.createdAt, "—"),
    location,
    status: formatApiValue(record.status, "Recorded"),
    verificationNotes: formatApiValue(record.verificationNotes ?? record.notes ?? record.verification_notes, "—"),
  };
}

export function mapApiAuditLog(log: ApiAuditLog | null | undefined): AuditRow {
  if (!log || typeof log !== "object") {
    return {
      id: "unknown",
      action: "Updated",
      actor: "System",
      entity: "Record",
      timestamp: "—",
      details: "—",
    };
  }

  const record = log as Record<string, unknown>;
  const before = record.before ?? record.previousValue ?? record.oldValue;
  const after = record.after ?? record.newValue ?? record.updatedValue;
  const changeSummary = [before, after]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .map((value) => formatApiValue(value))
    .join(" → ");
  const fallbackDetails = changeSummary !== "" ? changeSummary : "—";

  return {
    id: String(record.id ?? record._id ?? "unknown"),
    action: formatApiValue(record.action, "Updated"),
    actor: formatApiValue(record.actor ?? record.actorName ?? record.user, "System"),
    entity: formatApiValue(record.entity ?? record.entityType ?? record.entityId, "Record"),
    timestamp: formatApiValue(record.timestamp ?? record.createdAt ?? record.created_at, "—"),
    details: formatApiValue(record.details ?? fallbackDetails, "—"),
  };
}

export function mapApiFinanceTransaction(transaction: ApiFinanceTransaction | null | undefined) {
  if (!transaction || typeof transaction !== "object") {
    return {
      id: "unknown",
      receiptId: "—",
      date: "—",
      category: "Income",
      amount: "—",
      source: "—",
      reference: "—",
      status: "Posted",
    };
  }

  const record = transaction as Record<string, unknown>;

  return {
    id: String(record.id ?? record._id ?? record.reference ?? "unknown"),
    receiptId: formatApiValue(record.receiptId ?? record.receipt_id, "—"),
    date: formatApiValue(record.date ?? record.createdAt ?? record.created_at, "—"),
    category: formatApiValue(record.category ?? record.type, "Income"),
    amount:
      typeof record.amount === "number"
        ? formatCurrency(record.amount)
        : formatApiValue(record.amount, "—"),
    source: formatApiValue(record.source ?? record.member ?? record.memberName, "—"),
    reference: formatApiValue(record.reference ?? record.financeReference, "—"),
    status: formatApiValue(record.status, "Posted"),
  };
}

export function mapMemberFinanceTransaction(transaction: ApiFinanceTransaction): MemberFinanceTxRow {
  return {
    reference: transaction.reference ?? transaction.id,
    category: transaction.category ?? "Income",
    member: transaction.source ?? "—",
    amount: parseAmount(transaction.amount),
    paymentMethod: formatApiValue((transaction as Record<string, unknown>).paymentMethod ?? transaction.source, "—"),
    date: transaction.date ?? "—",
    status: normalizeFinanceStatus(transaction.status),
  };
}

export function mapMemberAttendanceSessionRow(session: ApiAttendanceSession): MemberAttendanceSessionRow {
  const mapped = mapApiAttendanceSession(session);
  return {
    sessionName: mapped.service,
    date: mapped.date,
    branch: mapped.branch,
    attendanceCount: mapped.totalPresent,
    firstTimers: mapped.firstTimers,
  };
}

export function mapMyAttendanceHistoryItem(
  record: Record<string, unknown>,
  index: number,
): MemberAttendanceSessionRow {
  return {
    sessionName: formatApiValue(
      record.sessionName ?? record.service ?? record.serviceName ?? record.event ?? record.session,
      "Service",
    ),
    date: formatApiValue(record.date ?? record.attendedAt ?? record.timestamp ?? record.createdAt, "—"),
    branch: formatApiValue(record.branch ?? record.branchName, "—"),
    attendanceCount: 1,
    firstTimers: 0,
  };
}

export function mapAdminGivingRecord(record: Record<string, unknown>, index: number): AdminGivingRecord {
  return {
    id: String(record.id ?? `giving-${index}`),
    member: formatApiValue(record.member ?? record.memberName ?? record.donor, "Anonymous"),
    category: formatApiValue(record.category ?? record.type, "Giving"),
    amount: formatCurrency(record.amount),
    paymentMethod: formatApiValue(record.paymentMethod ?? record.method, "—"),
    date: formatApiValue(record.date ?? record.createdAt, "—"),
    receiptStatus:
      (formatApiValue(record.receiptStatus, "Pending") as AdminGivingRecord["receiptStatus"]) ?? "Pending",
    financeSync:
      (formatApiValue(record.financeSync ?? record.syncStatus, "Queued") as AdminGivingRecord["financeSync"]) ??
      "Queued",
  };
}

export function mapMemberGivingHistoryItem(
  record: Record<string, unknown>,
  index: number,
): MemberGivingHistoryItem {
  const receiptId = record.receiptId ?? record.receipt_id;
  const financeReference = record.reference ?? record.financeReference ?? record.finance_reference;

  return {
    id: String(record.id ?? `giving-${index}`),
    receiptId: receiptId ? String(receiptId) : null,
    financeReference: financeReference ? String(financeReference) : null,
    category: formatApiValue(record.category ?? record.type, "Giving"),
    amount: parseAmount(record.amount),
    method: formatApiValue(record.paymentMethod ?? record.method, "—"),
    dateISO: normalizeDateIso(record.date ?? record.createdAt),
    status: normalizeGivingStatus(formatApiValue(record.status, "Completed")),
  };
}

export function mapMemberGivingHistoryFromTransaction(
  transaction: ApiFinanceTransaction,
  index: number,
): MemberGivingHistoryItem {
  return mapMemberGivingHistoryItem(transaction as unknown as Record<string, unknown>, index);
}
