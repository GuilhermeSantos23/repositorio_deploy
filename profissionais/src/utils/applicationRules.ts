import type { Professional } from '../types/professional';
import type { VaccineLot } from '../types/lot';
import { canRegisterApplication } from './stockRules';
import { isValidApplicationDate } from './dateRules';

export const MAX_CRM_DIGITS = 6;

export function isValidProfessionalCrm(crm: string): boolean {
  return /^\d{1,6}$/.test(crm);
}

export function getProfessionalCrm(professional: Professional | undefined): string {
  return professional?.crm ?? '';
}

export function isValidUnit(unit: string, expectedUnit: string): boolean {
  return unit === expectedUnit;
}

export function canSubmitApplication(params: {
  applicationDate: string;
  lot: VaccineLot | undefined;
  professional: Professional | undefined;
  unit: string;
  expectedUnit: string;
}): boolean {
  return (
    isValidApplicationDate(params.applicationDate) &&
    canRegisterApplication(params.lot) &&
    Boolean(params.professional) &&
    isValidProfessionalCrm(params.professional?.crm ?? '') &&
    isValidUnit(params.unit, params.expectedUnit)
  );
}
