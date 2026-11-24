import type { VaccinationRecord } from '../types/caderneta';

/** Uma aplicação do histórico, pronta para ser desenhada em uma folha. */
export interface HistoryItem {
  key: string;
  record: VaccinationRecord;
  /** Número sequencial da aplicação no histórico. */
  number: number;
}

function compareByDate(a: VaccinationRecord, b: VaccinationRecord): number {
  if (a.data && b.data && a.data !== b.data) return a.data < b.data ? -1 : 1;
  if (a.data && !b.data) return -1;
  if (!a.data && b.data) return 1;
  return a.vacinaNome.localeCompare(b.vacinaNome, 'pt-BR');
}

/**
 * Monta a lista do histórico. Somente registros com status "aplicada" são
 * aplicações; doses não realizadas ou apenas previstas nunca entram aqui.
 */
export function buildHistoryItems(records: VaccinationRecord[]): HistoryItem[] {
  return records
    .filter((record) => record.status === 'aplicada')
    .sort(compareByDate)
    .map((record, index) => ({ key: record.id, record, number: index + 1 }));
}

/**
 * Distribui os itens em páginas conforme a altura real de cada um.
 * Devolve, para cada página, os índices dos itens. Um item nunca é dividido:
 * se não couber no que sobra da página, ele começa a página seguinte.
 * Uma página sempre recebe pelo menos um item (evita laço infinito se um
 * único item for maior que a página).
 */
export function paginateByHeight(heights: number[], capacity: number): number[][] {
  const pages: number[][] = [];
  let current: number[] = [];
  let used = 0;

  heights.forEach((height, index) => {
    if (current.length > 0 && used + height > capacity) {
      pages.push(current);
      current = [];
      used = 0;
    }

    current.push(index);
    used += height;
  });

  if (current.length > 0) pages.push(current);
  return pages;
}
