import type { Patient } from '../types/patient';
import { MOCK_PATIENTS } from '../data/mockPatients';
import { hasRegisteredBooklet } from './cadernetaService';

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

  return hasRegisteredBooklet(patient.cpfFormatted)
    ? { ...patient, hasCaderneta: true }
    : patient;
}
