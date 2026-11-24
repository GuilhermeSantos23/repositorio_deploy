import type { Professional } from '../types/professional';
import type { VaccineLot } from '../types/lot';
import type { VaccinationRecord } from '../types/vaccinationRecord';
import { brazilianDateToIso, formatIsoDate } from './formatDate';
import { isValidApplicationDate } from './dateRules';
import { isLotAvailable } from './stockRules';

export const MAX_CRM_DIGITS = 6;

export function isValidProfessionalCrm(crm: string): boolean {
  return /^\d{1,6}$/.test(crm);
}

export function getProfessionalCofen(professional: Professional | undefined): string {
  return professional?.cofen ?? '';
}

export function isValidUnit(unit: string, expectedUnit: string): boolean {
  return unit === expectedUnit;
}

// ---------------------------------------------------------------------------
// Identificação do cidadão
// ---------------------------------------------------------------------------

export interface CitizenSearchErrors {
  cpf?: string;
  birthDate?: string;
}

export function validateCitizenSearch(cpf: string, birthDate: string): CitizenSearchErrors {
  const errors: CitizenSearchErrors = {};

  if (cpf.replace(/\D/g, '').length !== 11) {
    errors.cpf = 'Informe um CPF com 11 dígitos.';
  }

  if (!birthDate) {
    errors.birthDate = 'Informe a data de nascimento.';
  } else if (!isValidApplicationDate(birthDate)) {
    errors.birthDate = 'Informe uma data de nascimento válida, que não seja futura.';
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Dose: prevista x aplicada
// ---------------------------------------------------------------------------

export interface DoseStatus {
  /** "aplicada": existe registro de aplicação. "prevista": só existe no calendário. */
  kind: 'aplicada' | 'prevista';
  /** Verdadeiro quando o registro de uma nova aplicação é permitido. */
  canRegister: boolean;
  /** Data da última aplicação registrada (AAAA-MM-DD), quando existir. */
  lastApplicationDate?: string;
  message: string;
}

// Doses que se repetem ao longo da vida. Só nelas um novo registro é aceito
// quando já existe aplicação anterior, desde que fora do período abaixo.
// Esta é uma regra provisória do frontend; a regra definitiva é do backend.
const RECURRING_DOSES: Record<string, { sameYear?: boolean; minDays?: number }> = {
  anual: { sameYear: true },
  semestral: { minDays: 180 },
  reforco: { minDays: 1 },
};

function daysBetween(firstIso: string, secondIso: string): number {
  const first = Date.parse(`${firstIso}T00:00:00Z`);
  const second = Date.parse(`${secondIso}T00:00:00Z`);
  return Math.abs(Math.round((second - first) / 86_400_000));
}

function isInsideBlockedPeriod(doseId: string, previousDate: string, newDate: string): boolean {
  const rule = RECURRING_DOSES[doseId];
  if (!rule) return true;

  if (rule.sameYear) return previousDate.slice(0, 4) === newDate.slice(0, 4);
  return daysBetween(previousDate, newDate) < (rule.minDays ?? 1);
}

/** Somente registros com status "aplicada" contam como dose aplicada. */
export function getAppliedRecords(records: VaccinationRecord[]): VaccinationRecord[] {
  return records.filter((record) => record.status === 'aplicada');
}

export function findBlockingApplication(
  records: VaccinationRecord[],
  vacinaId: string,
  doseId: string,
  applicationDate: string,
): VaccinationRecord | undefined {
  return getAppliedRecords(records).find(
    (record) =>
      record.vacinaId === vacinaId &&
      record.doseId === doseId &&
      // Registros antigos podem não ter data; nesse caso a dose conta como aplicada.
      (!record.data || isInsideBlockedPeriod(doseId, record.data, applicationDate)),
  );
}

export function getDoseStatus(
  records: VaccinationRecord[],
  vacinaId: string,
  doseId: string,
  applicationDate: string,
): DoseStatus {
  const blocking = findBlockingApplication(records, vacinaId, doseId, applicationDate);

  if (blocking) {
    return {
      kind: 'aplicada',
      canRegister: false,
      lastApplicationDate: blocking.data,
      message: blocking.data
        ? `Dose já aplicada em ${formatIsoDate(blocking.data)}`
        : 'Dose já aplicada (data não informada)',
    };
  }

  const previous = getAppliedRecords(records).find(
    (record) => record.vacinaId === vacinaId && record.doseId === doseId,
  );

  return {
    kind: 'prevista',
    canRegister: true,
    lastApplicationDate: previous?.data,
    message: previous?.data
      ? `Última aplicação em ${formatIsoDate(previous.data)}`
      : 'Sem registro de aplicação',
  };
}

// ---------------------------------------------------------------------------
// Validação do formulário de aplicação
// ---------------------------------------------------------------------------

export interface ApplicationFormValues {
  recorteId: string;
  momentoId?: string;
  vacinaId?: string;
  doseId?: string;
  lotId?: string;
  applicationDate: string;
  professionalId?: string;
}

export type ApplicationFormErrors = Partial<
  Record<'momentoId' | 'vacinaId' | 'doseId' | 'lotId' | 'applicationDate' | 'professionalId', string>
>;

/** Etapa 2: vacina e dose. */
export function validateVaccineSelection(
  values: ApplicationFormValues,
  records: VaccinationRecord[],
): ApplicationFormErrors {
  const errors: ApplicationFormErrors = {};

  if (!values.momentoId) errors.momentoId = 'Selecione o momento.';
  if (!values.vacinaId) errors.vacinaId = 'Selecione a vacina.';

  if (!values.doseId) {
    errors.doseId = 'Selecione a dose que será registrada.';
  } else if (values.vacinaId) {
    const status = getDoseStatus(records, values.vacinaId, values.doseId, values.applicationDate);
    if (!status.canRegister) {
      errors.doseId = `${status.message}. Não é possível registrá-la novamente.`;
    }
  }

  return errors;
}

/** Etapa 3: dados da aplicação. */
export function validateApplicationData(params: {
  values: ApplicationFormValues;
  lot: VaccineLot | undefined;
  professional: Professional | undefined;
  /** Data de nascimento do cidadão (AAAA-MM-DD ou DD/MM/AAAA). */
  birthDate: string;
}): ApplicationFormErrors {
  const { values, lot, professional, birthDate } = params;
  const errors: ApplicationFormErrors = {};

  if (!values.applicationDate) {
    errors.applicationDate = 'Informe a data da aplicação.';
  } else if (!isValidApplicationDate(values.applicationDate)) {
    errors.applicationDate = 'A data deve estar entre 01/01/1900 e hoje. Datas futuras não são aceitas.';
  } else if (values.applicationDate < brazilianDateToIso(birthDate)) {
    errors.applicationDate = 'A data da aplicação não pode ser anterior ao nascimento do cidadão.';
  }

  if (!values.lotId) {
    errors.lotId = 'Selecione o lote.';
  } else if (!isLotAvailable(lot)) {
    errors.lotId = 'O lote selecionado não possui doses disponíveis.';
  }

  if (!professional || !isValidProfessionalCrm(professional.cofen)) {
    errors.professionalId = 'Selecione um profissional com registro profissional válido.';
  }

  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
