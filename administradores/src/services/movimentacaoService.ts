// Serviço "mockado" de Movimentações (painel de Administradores).
// Segue o mesmo padrão de services/profissionalService.ts e
// services/lotService.ts: funções assíncronas (simulando uma chamada de
// API) operando sobre um array em memória.
//
// A tela tem dois relatórios independentes (nunca combinados):
// - listMovimentacoes(): modo Tipo — entrada/alteração/exclusão de lote.
// - listAplicacoes(): modo Ação — quem aplicou qual vacina.
//
// Os dois só apontam para um lote e um profissional já existentes, obtidos
// via lotService/profissionalService — nunca duplicamos o nome da vacina,
// o fabricante ou o nome do profissional aqui.

import { listLots } from './lotService';
import { listProfissionais } from './profissionalService';
import { MOCK_APLICACOES } from '../mocks/applications';
import type {
  Aplicacao,
  AplicacaoDetalhada,
  Movimentacao,
  MovimentacaoDetalhada,
} from '../types/movimentacao';
import type { VaccineLot } from '../types/lot';

const SIMULATED_DELAY_MS = 200;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

// Cada movimentação aponta para um lote existente em mocks/lots.ts (pelos
// mesmos ids: lot-influenza-01, lot-hpv-01...) e um profissional existente
// em mocks/professionals.ts (prof-001 a prof-004) — os mesmos lotes e
// profissionais usados nas telas de Estoque e Profissionais.
const MOCK_MOVIMENTACOES: Movimentacao[] = [
  {
    id: 'mov-001',
    tipo: 'entrada',
    loteId: 'lot-influenza-01',
    quantidade: 20,
    data: '2026-03-10',
    profissionalId: 'prof-001',
  },
  {
    id: 'mov-002',
    tipo: 'entrada',
    loteId: 'lot-hpv-01',
    quantidade: 24,
    data: '2026-01-15',
    profissionalId: 'prof-004',
  },
  {
    id: 'mov-003',
    tipo: 'entrada',
    loteId: 'lot-bcg-01',
    quantidade: 65,
    data: '2026-06-01',
    profissionalId: 'prof-001',
  },
  {
    id: 'mov-004',
    tipo: 'entrada',
    loteId: 'lot-penta-02',
    quantidade: 45,
    data: '2026-08-25',
    profissionalId: 'prof-002',
  },
  {
    id: 'mov-005',
    tipo: 'alteracao',
    loteId: 'lot-influenza-02',
    quantidade: 18,
    data: '2026-08-20',
    profissionalId: 'prof-002',
  },
  {
    id: 'mov-006',
    tipo: 'alteracao',
    loteId: 'lot-penta-01',
    quantidade: 70,
    data: '2026-08-10',
    profissionalId: 'prof-004',
  },
  {
    id: 'mov-007',
    tipo: 'exclusao',
    loteId: 'lot-febre-amarela-01',
    quantidade: 17,
    data: '2026-08-21',
    profissionalId: 'prof-003',
  },
];

function juntarComLoteEProfissional<T extends { loteId: string; profissionalId: string }>(
  registros: T[],
  lotes: VaccineLot[],
  profissionais: Awaited<ReturnType<typeof listProfissionais>>,
): (T & { lote: VaccineLot; profissionalNome: string })[] {
  const resultado: (T & { lote: VaccineLot; profissionalNome: string })[] = [];

  registros.forEach((registro) => {
    const lote = lotes.find((item) => item.id === registro.loteId);
    if (!lote) return;

    const profissional = profissionais.find((prof) => prof.id === registro.profissionalId);
    const profissionalNome = profissional
      ? `${profissional.firstName} ${profissional.lastName}`
      : 'Profissional não encontrado';

    resultado.push({ ...registro, lote, profissionalNome });
  });

  return resultado;
}

// Modo Tipo: entrada/alteração/exclusão de lote. Movimentações cujo lote
// foi excluído do estoque não aparecem mais aqui (mesma regra de
// lotService, que já tira lotes com `deleted: true` da listagem).
export async function listMovimentacoes(): Promise<MovimentacaoDetalhada[]> {
  const [lotes, profissionais] = await Promise.all([listLots(), listProfissionais()]);
  return delay(juntarComLoteEProfissional(MOCK_MOVIMENTACOES, lotes, profissionais));
}

// Modo Ação: quem aplicou qual vacina. Hoje só existe a ação "aplicação".
export async function listAplicacoes(): Promise<AplicacaoDetalhada[]> {
  const [lotes, profissionais] = await Promise.all([listLots(), listProfissionais()]);
  return delay(juntarComLoteEProfissional(MOCK_APLICACOES as Aplicacao[], lotes, profissionais));
}

export interface FiltroOption {
  value: string;
  label: string;
}

interface ComLoteEProfissional {
  loteId: string;
  profissionalId: string;
  profissionalNome: string;
  lote: VaccineLot;
}

// Opções do filtro de profissional (usado no modo Ação): só os
// profissionais que já aparecem em alguma aplicação, reutilizando os
// mesmos registros de Profissionais.
export function getProfissionalFilterOptions(registros: ComLoteEProfissional[]): FiltroOption[] {
  const map = new Map<string, string>();
  registros.forEach((registro) => map.set(registro.profissionalId, registro.profissionalNome));
  return Array.from(map, ([value, label]) => ({ value, label }));
}