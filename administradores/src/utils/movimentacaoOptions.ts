// Labels e opções de filtro do módulo de Movimentações.
// Segue o mesmo padrão de utils/stockRules.ts / utils/profissionalOptions.ts
// (rótulos centralizados aqui, para reutilizar no filtro e na tabela).

import type { AcaoMovimentacao, ModoMovimentacao, TipoMovimentacao } from '../types/movimentacao';

export const MODO_MOVIMENTACAO_OPTIONS: { value: ModoMovimentacao; label: string }[] = [
  { value: 'tipo', label: 'Tipo' },
  { value: 'acao', label: 'Ação' },
];

export const TIPO_MOVIMENTACAO_LABELS: Record<TipoMovimentacao, string> = {
  entrada: 'Entrada',
  alteracao: 'Alteração',
  exclusao: 'Exclusão',
};

export const TIPO_MOVIMENTACAO_FILTER_OPTIONS: { value: TipoMovimentacao; label: string }[] = [
  { value: 'entrada', label: TIPO_MOVIMENTACAO_LABELS.entrada },
  { value: 'alteracao', label: TIPO_MOVIMENTACAO_LABELS.alteracao },
  { value: 'exclusao', label: TIPO_MOVIMENTACAO_LABELS.exclusao },
];

export const ACAO_MOVIMENTACAO_LABELS: Record<AcaoMovimentacao, string> = {
  aplicacao: 'Aplicação',
};
