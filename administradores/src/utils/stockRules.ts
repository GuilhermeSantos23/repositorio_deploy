// Regras de estoque e validade dos lotes, usadas pela tela de Estoque.
// Segue o mesmo padrão de utils/ubsStatus.ts / utils/profissionalOptions.ts
// (opções, rótulos e classes de badge centralizados aqui).

import { compareISODates, getTodayISO } from './date';

export type StockLevel = 'critico' | 'atencao' | 'ok';

// Regras exatas do escopo do TCC:
// crítico  -> quantidade < 50
// atenção  -> quantidade >= 50 e < 65
// OK       -> quantidade >= 65
export const STOCK_CRITICAL_LIMIT = 50;
export const STOCK_ATTENTION_LIMIT = 65;

export function getStockLevel(quantity: number): StockLevel {
  if (quantity < STOCK_CRITICAL_LIMIT) return 'critico';
  if (quantity < STOCK_ATTENTION_LIMIT) return 'atencao';
  return 'ok';
}

export const STOCK_LEVEL_LABELS: Record<StockLevel, string> = {
  critico: 'Crítico',
  atencao: 'Atenção',
  ok: 'OK',
};

// Cores usadas com moderação: só no texto do status (sem badge/borda).
export const STOCK_LEVEL_TEXT_CLASSES: Record<StockLevel, string> = {
  critico: 'text-red-600',
  atencao: 'text-amber-600',
  ok: 'text-emerald-600',
};

export const STOCK_LEVEL_FILTER_OPTIONS: { value: StockLevel; label: string }[] = [
  { value: 'critico', label: STOCK_LEVEL_LABELS.critico },
  { value: 'atencao', label: STOCK_LEVEL_LABELS.atencao },
  { value: 'ok', label: STOCK_LEVEL_LABELS.ok },
];

// Janela considerada "perto do vencimento" (dias a partir de hoje). Não é
// um valor definido no escopo — 30 dias foi escolhido como um padrão
// razoável para a demonstração da tela.
export const EXPIRATION_WARNING_DAYS = 30;

function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(`${fromISO}T00:00:00`);
  const to = new Date(`${toISO}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

/** true quando o lote já passou da data de vencimento. */
export function isExpired(expiresAt: string, referenceDateISO: string = getTodayISO()): boolean {
  return compareISODates(expiresAt, referenceDateISO) < 0;
}

/** true quando o lote vence dentro da janela de alerta, mas ainda não venceu. */
export function isNearExpiration(
  expiresAt: string,
  referenceDateISO: string = getTodayISO(),
): boolean {
  const diffDays = daysBetween(referenceDateISO, expiresAt);
  return diffDays >= 0 && diffDays <= EXPIRATION_WARNING_DAYS;
}