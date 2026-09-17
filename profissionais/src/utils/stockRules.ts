import type { VaccineLot } from '../types/lot';

export const STOCK_CRITICAL_THRESHOLD = 50;
export const EMPTY_LOT_MESSAGE = 'O lote informado teve todas suas vacinas aplicadas.';

export function getVaccineStock(lots: VaccineLot[], vaccineId: string): number {
  return lots
    .filter((lot) => lot.vaccineId === vaccineId)
    .reduce((total, lot) => total + lot.quantity, 0);
}

export function getLotsForVaccine(lots: VaccineLot[], vaccineId: string): VaccineLot[] {
  return lots.filter((lot) => lot.vaccineId === vaccineId);
}

export function getAvailableLots(lots: VaccineLot[], vaccineId: string): VaccineLot[] {
  return getLotsForVaccine(lots, vaccineId).filter((lot) => lot.quantity > 0);
}

export function isLotAvailable(lot: VaccineLot | undefined): boolean {
  return Boolean(lot && lot.quantity > 0);
}

export function canRegisterApplication(lot: VaccineLot | undefined): boolean {
  return isLotAvailable(lot);
}

export function isCriticalStock(quantity: number): boolean {
  return quantity < STOCK_CRITICAL_THRESHOLD;
}

export function decrementLot(lots: VaccineLot[], lotId: string): VaccineLot[] {
  return lots.map((lot) =>
    lot.id === lotId && lot.quantity > 0
      ? { ...lot, quantity: lot.quantity - 1 }
      : lot,
  );
}
