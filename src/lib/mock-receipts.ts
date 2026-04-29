export type ReceiptCategory =
  | "Tithe"
  | "Offering"
  | "Special Donation"
  | "Welfare"
  | "Pledge"
  | "Project Support"
  | "Missions / Outreach";

export type ReceiptPaymentMethod = "Mobile Money" | "Card" | "Bank Transfer";

export type ReceiptRecord = {
  receiptId: string;
  transactionId: string;
  financeReference: string;
  dateISO: string;
  amount: number;
  category: ReceiptCategory;
  paymentMethod: ReceiptPaymentMethod;
  createdBy: string;
};

export const receiptRecords: ReceiptRecord[] = [
  {
    receiptId: "RCPT-2026-004122",
    transactionId: "g-1",
    financeReference: "INC-2026-08912",
    dateISO: "2026-04-22",
    amount: 2400,
    category: "Tithe",
    paymentMethod: "Mobile Money",
    createdBy: "Member Portal · John Doe",
  },
  {
    receiptId: "RCPT-2026-004087",
    transactionId: "g-2",
    financeReference: "INC-2026-08876",
    dateISO: "2026-04-18",
    amount: 350,
    category: "Offering",
    paymentMethod: "Card",
    createdBy: "Member Portal · John Doe",
  },
  {
    receiptId: "RCPT-2026-003995",
    transactionId: "g-3",
    financeReference: "INC-2026-08793",
    dateISO: "2026-04-10",
    amount: 200,
    category: "Welfare",
    paymentMethod: "Bank Transfer",
    createdBy: "Member Portal · John Doe",
  },
  {
    receiptId: "RCPT-2026-003872",
    transactionId: "g-4",
    financeReference: "INC-2026-08698",
    dateISO: "2026-03-28",
    amount: 500,
    category: "Missions / Outreach",
    paymentMethod: "Mobile Money",
    createdBy: "Member Portal · John Doe",
  },
  {
    receiptId: "RCPT-2026-002455",
    transactionId: "g-5",
    financeReference: "INC-2026-07802",
    dateISO: "2026-02-14",
    amount: 600,
    category: "Pledge",
    paymentMethod: "Card",
    createdBy: "Member Portal · John Doe",
  },
];

export function buildReceiptId(seed: number) {
  const suffix = String(seed).slice(-6).padStart(6, "0");
  return `RCPT-2026-${suffix}`;
}
