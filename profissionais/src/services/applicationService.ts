import type { VaccineApplication } from '../types/application';
import { MOCK_APPLICATIONS } from '../data/mockApplications';
import { saveBookletRecord } from './cadernetaService';
import { decrementLotAndSave, getLots } from './lotService';

const STORAGE_KEY = 'vacmais-profissionais-applications';

/**
 * Boundary for application registration.
 *
 * Today the data is stored locally only to demonstrate the complete flow.
 * When the backend is ready, the request can be added here without changing
 * the application page.
 */
export async function registerApplication(
  application: Omit<VaccineApplication, 'id'>,
): Promise<VaccineApplication> {
  const savedApplications = readApplications();

  const newApplication: VaccineApplication = {
    id: `mock-application-${Date.now()}`,
    ...application,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...savedApplications, newApplication]),
  );

  // A aplicação registrada também passa a fazer parte da caderneta do cidadão.
  await saveBookletRecord({
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
      crm: newApplication.professionalCrm,
    },
  });

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
