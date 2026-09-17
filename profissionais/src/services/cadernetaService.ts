import type { Patient } from '../types/patient';
import type { VaccinationRecord } from '../types/vaccinationRecord';
import { getMockCadernetaRecords } from '../data/mockCaderneta';

const STORAGE_KEY = 'vacmais-profissionais-booklet-records';
const REGISTERED_PATIENTS_KEY = 'vacmais-profissionais-registered-booklets';

/**
 * Boundary for caderneta operations.
 *
 * The initial records come from the project mock. New records are kept in
 * localStorage until the real caderneta API is integrated.
 */
export async function getPatientBooklet(patient: Patient): Promise<VaccinationRecord[]> {
  const mockRecords = getMockCadernetaRecords(patient.cpfFormatted);
  const savedRecords = readSavedRecords().filter(
    (record) => record.patientCpf === patient.cpfFormatted,
  );

  const recordsById = new Map(mockRecords.map((record) => [record.id, record]));
  savedRecords.forEach((record) => recordsById.set(record.id, record));

  return Array.from(recordsById.values());
}

export interface SaveBookletRecordInput {
  patientCpf: string;
  record: Omit<VaccinationRecord, 'id' | 'patientCpf'>;
}

export async function saveBookletRecord(
  input: SaveBookletRecordInput,
): Promise<VaccinationRecord> {
  const newRecord: VaccinationRecord = {
    id: `mock-booklet-${Date.now()}`,
    patientCpf: input.patientCpf,
    ...input.record,
  };

  const savedRecords = readSavedRecords();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedRecords, newRecord]));

  const registeredPatients = readRegisteredPatients();
  if (!registeredPatients.includes(input.patientCpf)) {
    localStorage.setItem(
      REGISTERED_PATIENTS_KEY,
      JSON.stringify([...registeredPatients, input.patientCpf]),
    );
  }

  return newRecord;
}


export async function updateBookletRecord(
  record: VaccinationRecord,
): Promise<VaccinationRecord> {
  const savedRecords = readSavedRecords();
  const exists = savedRecords.some((savedRecord) => savedRecord.id === record.id);
  const updatedRecords = exists
    ? savedRecords.map((savedRecord) => (savedRecord.id === record.id ? record : savedRecord))
    : [...savedRecords, record];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

  const registeredPatients = readRegisteredPatients();
  if (!registeredPatients.includes(record.patientCpf)) {
    localStorage.setItem(
      REGISTERED_PATIENTS_KEY,
      JSON.stringify([...registeredPatients, record.patientCpf]),
    );
  }

  return record;
}

export function hasRegisteredBooklet(patientCpf: string): boolean {
  return readRegisteredPatients().includes(patientCpf);
}

function readRegisteredPatients(): string[] {
  const saved = localStorage.getItem(REGISTERED_PATIENTS_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved) as string[];
  } catch {
    return [];
  }
}

function readSavedRecords(): VaccinationRecord[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved) as VaccinationRecord[];
  } catch {
    return [];
  }
}
