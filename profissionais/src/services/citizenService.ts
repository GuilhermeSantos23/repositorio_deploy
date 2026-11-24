import type { Patient } from '../types/patient';

const STORAGE_KEY = 'vacmais-profissionais-citizens';

/** Dados do cadastro do cidadão preenchidos pelo profissional. */
export type CitizenRegistration = Pick<
  Patient,
  'email' | 'gender' | 'susCard' | 'motherName' | 'fatherName' | 'sensitiveCondition'
>;

type StoredCitizens = Record<string, CitizenRegistration>;

/**
 * Boundary for the citizen registration.
 *
 * Name, CPF and birth date come from the CPF lookup and are never edited here.
 * The rest is kept locally until the citizen API exists; the citizen record
 * lets the caderneta be linked even when the person has no Vac+ account.
 */
export function getCitizenRegistration(cpfFormatted: string): CitizenRegistration | undefined {
  return readAll()[cpfFormatted];
}

export async function saveCitizenRegistration(
  cpfFormatted: string,
  registration: CitizenRegistration,
): Promise<void> {
  const all = readAll();
  all[cpfFormatted] = registration;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

function readAll(): StoredCitizens {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as StoredCitizens;
  } catch {
    return {};
  }
}
