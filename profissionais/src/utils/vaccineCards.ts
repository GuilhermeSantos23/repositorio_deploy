import { RECORTES } from '../data/vaccinesData';
import type { RecorteId } from '../types/vaccine';
import type { VaccinationRecord } from '../types/vaccinationRecord';
import { isRecorteAvailableForAge } from './ageRules';

/** Uma vacina + dose prevista, mostrada como card no cadastro da caderneta. */
export interface VaccineCard {
  /** vacina + dose. Uma mesma dose aparece uma única vez, no grupo mais jovem em que é prevista. */
  key: string;
  recorteId: RecorteId;
  momentoId: string;
  momentoLabel: string;
  vacinaId: string;
  vacinaNome: string;
  doseId: string;
  doseLabel: string;
  note?: string;
}

export type CardsByRecorte = Record<RecorteId, VaccineCard[]>;

export function getCardKey(vacinaId: string, doseId: string): string {
  return `${vacinaId}:${doseId}`;
}

/**
 * Gera os cards previstos para a idade do cidadão. Grupos de faixa etária
 * mais avançada que a idade dele não geram cards (ficam bloqueados), e
 * vacinas com idade mínima maior que a dele também não.
 */
export function buildVaccineCards(age: number): CardsByRecorte {
  const result = { crianca: [], adolescente: [], jovem: [], adulto: [], idoso: [], anual: [] } as CardsByRecorte;
  const seen = new Set<string>();

  // A campanha anual é processada primeiro para que influenza e covid fiquem nela.
  const ordered = [...RECORTES].sort((a, b) => Number(b.id === 'anual') - Number(a.id === 'anual'));

  for (const recorte of ordered) {
    if (!isRecorteAvailableForAge(recorte.id, age)) continue;

    for (const momento of recorte.moments) {
      for (const vacina of momento.vaccines) {
        if (vacina.minAge !== undefined && age < vacina.minAge) continue;

        for (const dose of vacina.doses) {
          const key = getCardKey(vacina.id, dose.id);
          if (seen.has(key)) continue;
          seen.add(key);

          result[recorte.id].push({
            key,
            recorteId: recorte.id,
            momentoId: momento.id,
            momentoLabel: momento.label,
            vacinaId: vacina.id,
            vacinaNome: vacina.name,
            doseId: dose.id,
            doseLabel: dose.label,
            note: vacina.note,
          });
        }
      }
    }
  }

  return result;
}

/** O que o profissional informou em um card. */
export interface CardEntry {
  status: 'aplicada' | 'nao-realizada';
  /** Os campos abaixo são opcionais: cadernetas antigas raramente têm todos os dados. */
  data?: string;
  lote?: string;
  unidade?: string;
  profissional?: string;
  cofen?: string;
}

export type CardEntries = Record<string, CardEntry>;

/** Preenche os cards a partir de uma caderneta existente (alteração). */
export function entriesFromRecords(records: VaccinationRecord[]): CardEntries {
  const entries: CardEntries = {};

  for (const record of records) {
    entries[getCardKey(record.vacinaId, record.doseId)] = {
      status: record.status,
      data: record.data,
      lote: record.lote,
      unidade: record.unidade,
      profissional: record.profissional,
      cofen: record.cofen,
    };
  }

  return entries;
}

/**
 * Transforma os cards marcados em registros da caderneta. Registros que não
 * correspondem a nenhum card (ex.: aplicações feitas pela tela de Aplicações
 * em outra estrutura) são mantidos como estavam.
 */
export function buildRecordsFromCards(params: {
  patientCpf: string;
  cards: VaccineCard[];
  entries: CardEntries;
  previousRecords: VaccinationRecord[];
}): VaccinationRecord[] {
  const { patientCpf, cards, entries, previousRecords } = params;
  const cardKeys = new Set(cards.map((card) => card.key));
  const previousByKey = new Map(previousRecords.map((r) => [getCardKey(r.vacinaId, r.doseId), r]));

  const fromCards = cards.flatMap((card): VaccinationRecord[] => {
    const entry = entries[card.key];
    if (!entry) return [];

    const clean = (value?: string) => (value && value.trim() ? value.trim() : undefined);
    const previous = previousByKey.get(card.key);
    const isApplied = entry.status === 'aplicada';

    return [
      {
        id: previous?.id ?? `booklet-${patientCpf}-${card.key}`,
        patientCpf,
        recorteId: card.recorteId,
        momentoId: card.momentoId,
        momentoLabel: card.momentoLabel,
        vacinaId: card.vacinaId,
        vacinaNome: card.vacinaNome,
        doseId: card.doseId,
        doseLabel: card.doseLabel,
        status: entry.status,
        ...(isApplied
          ? {
              data: clean(entry.data),
              lote: clean(entry.lote),
              unidade: clean(entry.unidade),
              profissional: clean(entry.profissional),
              cofen: clean(entry.cofen),
            }
          : { justificativa: previous?.justificativa }),
      },
    ];
  });

  const untouched = previousRecords.filter((r) => !cardKeys.has(getCardKey(r.vacinaId, r.doseId)));
  return [...fromCards, ...untouched];
}

/** Valida os campos opcionais de um card marcado como tomado. */
export function validateCardEntry(
  entry: CardEntry,
  birthDateIso: string,
  today: string,
): Partial<Record<'data' | 'cofen', string>> {
  const errors: Partial<Record<'data' | 'cofen', string>> = {};
  if (entry.status !== 'aplicada') return errors;

  if (entry.data) {
    if (entry.data > today) errors.data = 'A data não pode ser futura.';
    else if (entry.data < birthDateIso) errors.data = 'A data não pode ser anterior ao nascimento.';
    else if (entry.data < '1900-01-01') errors.data = 'Informe uma data a partir de 1900.';
  }

  if (entry.cofen && !/^\d{1,6}$/.test(entry.cofen)) {
    errors.cofen = 'O registro profissional deve ter de 1 a 6 números.';
  }

  return errors;
}
