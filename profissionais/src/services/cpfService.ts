import type { Patient } from '../types/patient';
import { MOCK_PATIENTS } from '../data/mockPatients';
import { hasRegisteredBooklet } from './cadernetaService';
import { getCitizenRegistration } from './citizenService';
import { brazilianDateToIso } from '../utils/formatDate';

export type CitizenSearchResult =
  | { status: 'found'; patient: Patient }
  | { status: 'not-found' }
  | { status: 'birth-date-mismatch' };

/**
 * Boundary for the future CPF lookup API.
 *
 * The UI should call this function instead of depending directly on the mock.
 * When the external API is integrated, only this service needs to be adapted.
 */
export async function findPatientByCpf(cpf: string): Promise<Patient | null> {
  const digits = cpf.replace(/\D/g, '');

  // Mock implementation used until the real CPF API is integrated.
  const patient = MOCK_PATIENTS.find((item) => item.cpfDigits === digits);
  if (!patient) return null;

  // Dados do cadastro feito pelo profissional têm prioridade sobre o mock.
  return {
    ...patient,
    ...getCitizenRegistration(patient.cpfFormatted),
    hasCaderneta: patient.hasCaderneta || hasRegisteredBooklet(patient.cpfFormatted),
  };
}

/**
 * Identificação do cidadão por CPF e data de nascimento (AAAA-MM-DD).
 * Os dois dados precisam corresponder ao mesmo cidadão.
 */
export async function searchCitizen(cpf: string, birthDate: string): Promise<CitizenSearchResult> {
  const patient = await findPatientByCpf(cpf);
  if (!patient) return { status: 'not-found' };

  if (brazilianDateToIso(patient.birthDate) !== birthDate) {
    return { status: 'birth-date-mismatch' };
  }

  return { status: 'found', patient };
}
