import type { RecorteId, SensitiveCondition } from './vaccine';

export type VaccinationRecordStatus = 'aplicada' | 'nao-realizada';

export interface VaccinationRecord {
  id: string;
  patientCpf: string;
  recorteId: RecorteId;
  momentoId: string;
  momentoLabel: string;
  vacinaId: string;
  vacinaNome: string;
  doseId: string;
  doseLabel: string;
  status: VaccinationRecordStatus;
  data?: string;
  lote?: string;
  unidade?: string;
  profissional?: string;
  crm?: string;
  justificativa?: string;
  condicaoSensivel?: SensitiveCondition;
}
