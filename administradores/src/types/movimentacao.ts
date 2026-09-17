/**
 * Tipos do módulo de Movimentações (painel de Administradores).
 *
 * A tela tem dois modos, que nunca aparecem juntos:
 * - modo "tipo": como os lotes estão se movimentando (entrada, alteração
 *   ou exclusão) — usa `Movimentacao`/`MovimentacaoDetalhada`.
 * - modo "acao": quem está aplicando as vacinas — usa
 *   `Aplicacao`/`AplicacaoDetalhada`.
 *
 * Nenhum dos dois guarda os dados do lote ou do profissional soltos — só
 * apontam pra eles por id (`loteId`, `profissionalId`), usando o mesmo
 * `VaccineLot` de `types/lot.ts` (já compartilhado com Estoque) e o mesmo
 * `Profissional` de `types/profissional.ts`. Isso evita duas fontes de
 * verdade para o mesmo lote/profissional entre as telas.
 */

import type { VaccineLot } from './lot';

export type ModoMovimentacao = 'tipo' | 'acao';

export type TipoMovimentacao = 'entrada' | 'alteracao' | 'exclusao';

// Hoje só existe a ação "aplicação" (aplicar uma dose de um lote). O campo
// fica como um tipo próprio, e não como boolean, pra ficar fácil de somar
// outra ação no futuro sem mudar a estrutura.
export type AcaoMovimentacao = 'aplicacao';

// Registro "cru" da movimentação de um lote (modo Tipo), como fica
// armazenado no mock.
export interface Movimentacao {
  id: string;
  tipo: TipoMovimentacao;
  loteId: string; // referencia VaccineLot.id (types/lot.ts)
  quantidade: number;
  data: string; // ISO (yyyy-mm-dd), mesmo padrão de utils/date.ts
  profissionalId: string; // referencia Profissional.id (services/profissionalService.ts)
}

// Movimentação já combinada com o lote e o nome do profissional — é essa
// versão que a tela consome no modo Tipo.
export interface MovimentacaoDetalhada extends Movimentacao {
  lote: VaccineLot;
  profissionalNome: string;
}

// Registro "cru" de uma aplicação de vacina (modo Ação), como fica
// armazenado no mock.
export interface Aplicacao {
  id: string;
  acao: AcaoMovimentacao;
  loteId: string; // referencia VaccineLot.id (types/lot.ts)
  data: string; // ISO (yyyy-mm-dd)
  profissionalId: string; // referencia Profissional.id (services/profissionalService.ts)
}

// Aplicação já combinada com o lote e o nome do profissional — é essa
// versão que a tela consome no modo Ação.
export interface AplicacaoDetalhada extends Aplicacao {
  lote: VaccineLot;
  profissionalNome: string;
}
