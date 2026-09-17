import type { RecorteId } from './vaccine';

export interface VaccineApplication {
  id: string;
  patientCpf: string;
  patientName: string;
  recorteId: RecorteId;
  momentoId: string;
  momentoLabel: string;
  vaccineId: string;
  vaccineName: string;
  doseId: string;
  doseLabel: string;
  lotId: string;
  lotCode: string;
  applicationDate: string;
  professionalId: string;
  professionalName: string;
  professionalCrm: string;
  unit: string;
}
