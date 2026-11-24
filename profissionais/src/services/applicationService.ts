import type { VaccineApplication } from '../types/application';
import type { Patient } from '../types/patient';
import { MOCK_APPLICATIONS } from '../data/mockApplications';
import { getPatientBooklet, removeBookletRecord, saveBookletRecord } from './cadernetaService';
import { decrementLotAndSave, getLots } from './lotService';
import { findBlockingApplication } from '../utils/applicationRules';
import { isValidApplicationDate } from '../utils/dateRules';
import { isLotAvailable } from '../utils/stockRules';
import { createId } from '../utils/id';
import { formatIsoDate } from '../utils/formatDate';

const STORAGE_KEY = 'vacmais-profissionais-applications';

/** Erro com mensagem própria para o profissional (a tela exibe o texto). */
export class ApplicationRegistrationError extends Error {}

/**
 * Boundary for application registration.
 *
 * Today the data is stored locally only to demonstrate the complete flow.
 * When the backend is ready, the request can be added here without changing
 * the application page. The checks below imitate what the backend must do:
 * the frontend validates to help the user, but the final rule is the server's.
 */
export async function registerApplication(
  application: Omit<VaccineApplication, 'id'>,
  patient: Patient,
): Promise<VaccineApplication> {
  if (patient.cpfFormatted !== application.patientCpf) {
    throw new ApplicationRegistrationError('A aplicação não corresponde ao cidadão identificado.');
  }

  if (!isValidApplicationDate(application.applicationDate)) {
    throw new ApplicationRegistrationError('A data da aplicação é inválida ou está no futuro.');
  }

  const lot = getLots().find((item) => item.id === application.lotId);
  if (!isLotAvailable(lot)) {
    throw new ApplicationRegistrationError('O lote selecionado não possui doses disponíveis.');
  }

  const currentRecords = await getPatientBooklet(patient);
  const duplicate = findBlockingApplication(
    currentRecords,
    application.vaccineId,
    application.doseId,
    application.applicationDate,
  );
  if (duplicate) {
    throw new ApplicationRegistrationError(
      `Esta dose já foi aplicada${duplicate.data ? ` em ${formatIsoDate(duplicate.data)}` : ''}. O registro não foi duplicado.`,
    );
  }

  const newApplication: VaccineApplication = {
    id: createId('mock-application'),
    ...application,
  };

  // A aplicação também passa a fazer parte da caderneta do cidadão.
  const bookletRecord = await saveBookletRecord({
    patientCpf: newApplication.patientCpf,
    record: {
      recorteId: newApplication.recorteId,
      momentoId: newApplication.momentoId,
      momentoLabel: newApplication.momentoLabel,
      vacinaId: newApplication.vaccineId,
      vacinaNome: newApplication.vaccineName,
      doseId: newApplication.doseId,
      doseLabel: newApplication.doseLabel,
      status: 'aplicada',
      data: newApplication.applicationDate,
      lote: newApplication.lotCode,
      unidade: newApplication.unit,
      profissional: newApplication.professionalName,
      cofen: newApplication.professionalCofen,
    },
  });

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...readApplications(), newApplication]),
    );
  } catch (error) {
    // Se a aplicação não foi salva, a caderneta também não pode mostrá-la.
    removeBookletRecord(newApplication.patientCpf, bookletRecord.id);
    throw error;
  }

  // A baixa do estoque acontece somente depois que o registro da aplicação foi salvo.
  decrementLotAndSave(getLots(), newApplication.lotId);

  return newApplication;
}

/** Returns the applications already registered in this browser. */
export function getApplications(): VaccineApplication[] {
  return readApplications();
}

export function getAllApplications(): VaccineApplication[] {
  return [...MOCK_APPLICATIONS, ...readApplications()];
}

function readApplications(): VaccineApplication[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved) as VaccineApplication[];
  } catch {
    return [];
  }
}
