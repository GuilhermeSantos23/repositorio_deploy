import type { VaccineLot } from '../types/lot';
import { MOCK_LOTS } from '../data/mockLots';
import { decrementLot } from '../utils/stockRules';

const STORAGE_KEY = 'vacmais-profissionais-lots';

/**
 * Keeps the demonstration stock shared between the application and history
 * flows. Later these operations can be replaced by the real stock API.
 */
export function getLots(): VaccineLot[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return MOCK_LOTS;

  try {
    return JSON.parse(saved) as VaccineLot[];
  } catch {
    return MOCK_LOTS;
  }
}

export function saveLots(lots: VaccineLot[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lots));
}

export function decrementLotAndSave(lots: VaccineLot[], lotId: string): VaccineLot[] {
  const updatedLots = decrementLot(lots, lotId);
  saveLots(updatedLots);
  return updatedLots;
}
