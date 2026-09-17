import { RECORTES } from '../data/vaccinesData';
import type { RecorteId, VaccineOption } from '../types/vaccine';
import { getRecorteByAge } from './ageRules';

export function getRecorte(recorteId: RecorteId) {
  return RECORTES.find((recorte) => recorte.id === recorteId);
}

export function getRecorteForAge(age: number) {
  return getRecorte(getRecorteByAge(age));
}

export function getVaccinesForRecorte(recorteId: RecorteId): VaccineOption[] {
  const recorte = getRecorte(recorteId);
  if (!recorte) return [];

  return recorte.moments.flatMap((momento) => momento.vaccines);
}

export function getVaccineOptionsForMoment(recorteId: RecorteId, momentId: string): VaccineOption[] {
  return getRecorte(recorteId)?.moments.find((moment) => moment.id === momentId)?.vaccines ?? [];
}
