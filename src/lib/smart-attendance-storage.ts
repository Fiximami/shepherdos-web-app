export type SmartAttendanceStatus = "Verified" | "Late" | "Location Mismatch" | "Manual Override" | "Suspicious Pattern";

export type SmartAttendanceRecord = {
  member_id: string;
  event_id: string;
  timestamp: string;
  location: { lat: number; lng: number };
  status: SmartAttendanceStatus;
  verification_notes: string;
};

const STORAGE_KEY = "shepherdos_smart_attendance_records_v1";

export function readSmartAttendanceRecords() {
  if (typeof window === "undefined") return [] as SmartAttendanceRecord[];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [] as SmartAttendanceRecord[];
    const parsed = JSON.parse(raw) as SmartAttendanceRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as SmartAttendanceRecord[];
  }
}

export function writeSmartAttendanceRecords(records: SmartAttendanceRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function appendSmartAttendanceRecord(record: SmartAttendanceRecord) {
  const current = readSmartAttendanceRecords();
  writeSmartAttendanceRecords([record, ...current]);
}
