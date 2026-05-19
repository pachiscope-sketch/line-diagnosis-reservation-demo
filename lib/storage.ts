import type {
  CustomerRecord,
  DiagnosisRecord,
  ReservationRecord
} from "@/lib/types";

const diagnosisKey = "line-demo-diagnoses";
const reservationKey = "line-demo-reservations";
const customerKey = "line-demo-customers";

export function loadDiagnoses() {
  return loadRecords<DiagnosisRecord>(diagnosisKey);
}

export function saveDiagnosis(record: DiagnosisRecord) {
  saveRecords(diagnosisKey, [record, ...loadDiagnoses()]);
}

export function replaceDiagnoses(records: DiagnosisRecord[]) {
  saveRecords(diagnosisKey, records);
}

export function loadReservations() {
  return loadRecords<ReservationRecord>(reservationKey);
}

export function saveReservation(record: ReservationRecord) {
  saveRecords(reservationKey, [record, ...loadReservations()]);
}

export function replaceReservations(records: ReservationRecord[]) {
  saveRecords(reservationKey, records);
}

export function loadCustomers() {
  return loadRecords<CustomerRecord>(customerKey);
}

export function saveCustomer(record: CustomerRecord) {
  const existing = loadCustomers().filter(
    (customer) => customer.lineUserId !== record.lineUserId
  );
  saveRecords(customerKey, [record, ...existing]);
}

export function replaceCustomers(records: CustomerRecord[]) {
  saveRecords(customerKey, records);
}

export function findCustomerByLineUserId(lineUserId: string) {
  return loadCustomers().find((customer) => customer.lineUserId === lineUserId);
}

export function clearLocalDemoData() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(diagnosisKey);
  window.localStorage.removeItem(reservationKey);
  window.localStorage.removeItem(customerKey);
}

function loadRecords<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function saveRecords<T>(key: string, records: T[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(records));
}
