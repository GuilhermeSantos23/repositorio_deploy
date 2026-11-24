import type { Patient } from '../types/patient';
import type { VaccinationRecord } from '../types/vaccinationRecord';
import { getMockCadernetaRecords } from '../data/mockCaderneta';
import { createId } from '../utils/id';

// Cada cidadão tem uma "fotografia" da caderneta salva localmente. Enquanto
// ela não existir, valem os registros do mock do projeto.
const STORAGE_KEY = 'vacmais-profissionais-booklets';

type StoredBooklets = Record<string, VaccinationRecord[]>;

/**
 * Boundary for caderneta operations.
 * Replace the bodies with the real caderneta API when it is integrated.
 */
export async function getPatientBooklet(patient: Patient): Promise<VaccinationRecord[]> {
  return readBooklet(patient.cpfFormatted);
}

/** Cadastro ou alteração da caderneta: substitui todos os registros do cidadão. */
export async function saveBooklet(
  patientCpf: string,
  records: VaccinationRecord[],
): Promise<VaccinationRecord[]> {
  writeBooklet(patientCpf, records);
  return records;
}

export interface SaveBookletRecordInput {
  patientCpf: string;
  record: Omit<VaccinationRecord, 'id' | 'patientCpf'>;
}

/** Acrescenta uma aplicação à caderneta (usado pela tela de Aplicações). */
export async function saveBookletRecord(
  input: SaveBookletRecordInput,
): Promise<VaccinationRecord> {
  const newRecord: VaccinationRecord = {
    id: createId('mock-booklet'),
    patientCpf: input.patientCpf,
    ...input.record,
  };

  writeBooklet(input.patientCpf, [...readBooklet(input.patientCpf), newRecord]);
  return newRecord;
}

export function removeBookletRecord(patientCpf: string, recordId: string): void {
  writeBooklet(
    patientCpf,
    readBooklet(patientCpf).filter((record) => record.id !== recordId),
  );
}

export function hasRegisteredBooklet(patientCpf: string): boolean {
  return patientCpf in readAll();
}

function readAll(): StoredBooklets {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as StoredBooklets;
  } catch {
    return {};
  }
}

function readBooklet(patientCpf: string): VaccinationRecord[] {
  return readAll()[patientCpf] ?? getMockCadernetaRecords(patientCpf);
}

function writeBooklet(patientCpf: string, records: VaccinationRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAll(), [patientCpf]: records }));
}
