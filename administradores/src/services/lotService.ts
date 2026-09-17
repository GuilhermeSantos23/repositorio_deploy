// Serviço "mockado" de Estoque (lotes de vacina) — painel de Administradores.
// Segue o mesmo padrão de services/profissionalService.ts: funções
// assíncronas (simulando uma chamada de API) operando sobre um array em
// memória. Quando o backend existir, só a implementação de cada função
// muda — as telas não precisam mudar.

import type { LotFormData, VaccineLot } from '../types/lot';
import { MOCK_LOTS } from '../mocks/lots';
import { CURRENT_UNIT_ADMIN } from '../mocks/session';
import { getTodayISO } from '../utils/date';
import { getStockLevel, isNearExpiration } from '../utils/stockRules';

const SIMULATED_DELAY_MS = 200;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

let lots: VaccineLot[] = [...MOCK_LOTS];
let nextId = 1;

function matchesSearch(lot: VaccineLot, term: string): boolean {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return true;

  return (
    lot.vaccineName.toLowerCase().includes(normalized) ||
    lot.code.toLowerCase().includes(normalized) ||
    lot.manufacturer.toLowerCase().includes(normalized)
  );
}

// Lotes excluídos ficam marcados como `deleted` (mesma ideia de
// profissionais "bloqueados"), mas somem da listagem/estatísticas da tela.
function activeLots(): VaccineLot[] {
  return lots.filter((lot) => !lot.deleted);
}

export async function listLots(): Promise<VaccineLot[]> {
  return delay(activeLots());
}

export async function searchLots(term: string): Promise<VaccineLot[]> {
  return delay(activeLots().filter((lot) => matchesSearch(lot, term)));
}

export interface StockStats {
  distributedThisMonth: number;
  nearExpirationCount: number;
  criticalCount: number;
}

// "Distribuídas (mês)" não tem, hoje, uma fonte real de distribuição/
// aplicação no projeto (ver item 26 do escopo). Como estrutura mínima para
// a demonstração da tela, o valor é a soma das quantidades dos lotes
// RECEBIDOS no mês atual — quando existir um serviço real de distribuição,
// basta trocar esse cálculo por ele.
export async function getStockStats(): Promise<StockStats> {
  const currentMonth = getTodayISO().slice(0, 7);
  const active = activeLots();

  const distributedThisMonth = active
    .filter((lot) => lot.receivedAt.startsWith(currentMonth))
    .reduce((sum, lot) => sum + lot.quantity, 0);

  return delay({
    distributedThisMonth,
    nearExpirationCount: active.filter((lot) => isNearExpiration(lot.expiresAt)).length,
    criticalCount: active.filter((lot) => getStockLevel(lot.quantity) === 'critico').length,
  });
}

export async function createLot(data: LotFormData): Promise<VaccineLot> {
  const novo: VaccineLot = {
    id: `lot-novo-${nextId++}`,
    code: data.code,
    vaccineId: data.vaccineName.toLowerCase().trim().replace(/\s+/g, '-'),
    vaccineName: data.vaccineName,
    manufacturer: data.manufacturer,
    quantity: Number(data.quantity) || 0,
    receivedAt: data.receivedAt,
    expiresAt: data.expiresAt,
    receivedBy: CURRENT_UNIT_ADMIN.name,
    attachmentName: data.attachmentName,
  };

  lots = [novo, ...lots];
  return delay(novo);
}

export async function updateLot(id: string, data: LotFormData): Promise<VaccineLot | null> {
  let atualizado: VaccineLot | null = null;

  lots = lots.map((lot) => {
    if (lot.id !== id) return lot;
    atualizado = {
      ...lot,
      code: data.code,
      vaccineId: data.vaccineName.toLowerCase().trim().replace(/\s+/g, '-'),
      vaccineName: data.vaccineName,
      manufacturer: data.manufacturer,
      quantity: Number(data.quantity) || 0,
      receivedAt: data.receivedAt,
      expiresAt: data.expiresAt,
      attachmentName: data.attachmentName ?? lot.attachmentName,
    };
    return atualizado;
  });

  return delay(atualizado);
}

export async function deleteLot(id: string, reason: string): Promise<VaccineLot | null> {
  let atualizado: VaccineLot | null = null;

  lots = lots.map((lot) => {
    if (lot.id !== id) return lot;
    atualizado = { ...lot, deleted: true, deletionReason: reason };
    return atualizado;
  });

  return delay(atualizado);
}
