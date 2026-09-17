import type { Aplicacao } from '../types/movimentacao';

// Aplicações de vacina usadas na tela de Movimentações (modo Ação).
//
// As duas primeiras ('application-001' e 'application-002') são os MESMOS
// registros de `profissionais/src/data/mockApplications.ts` (mesmo `id`,
// `loteId` e `profissionalId` — só os campos que o modo Ação não usa, como
// paciente e dose, ficam de fora). As demais seguem o mesmo padrão
// (mesmos lotes de `mocks/lots.ts` e mesmos profissionais de
// `mocks/professionals.ts`), só pra dar volume pro relatório.
//
// Como `profissionais` e `administradores` são projetos Vite separados
// (sem workspace/alias compartilhado), os registros são reproduzidos aqui
// em vez de importados — mesmo motivo documentado em mocks/lots.ts.
export const MOCK_APLICACOES: Aplicacao[] = [
  {
    id: 'application-001',
    acao: 'aplicacao',
    loteId: 'lot-influenza-01',
    data: '2026-09-06',
    profissionalId: 'prof-001',
  },
  {
    id: 'application-002',
    acao: 'aplicacao',
    loteId: 'lot-hpv-01',
    data: '2026-09-05',
    profissionalId: 'prof-002',
  },
  {
    id: 'aplicacao-003',
    acao: 'aplicacao',
    loteId: 'lot-bcg-01',
    data: '2026-08-20',
    profissionalId: 'prof-004',
  },
  {
    id: 'aplicacao-004',
    acao: 'aplicacao',
    loteId: 'lot-penta-01',
    data: '2026-08-15',
    profissionalId: 'prof-001',
  },
  {
    id: 'aplicacao-005',
    acao: 'aplicacao',
    loteId: 'lot-influenza-02',
    data: '2026-08-10',
    profissionalId: 'prof-003',
  },
  {
    id: 'aplicacao-006',
    acao: 'aplicacao',
    loteId: 'lot-hpv-02',
    data: '2026-07-25',
    profissionalId: 'prof-002',
  },
  {
    id: 'aplicacao-007',
    acao: 'aplicacao',
    loteId: 'lot-penta-02',
    data: '2026-09-01',
    profissionalId: 'prof-004',
  },
  {
    id: 'aplicacao-008',
    acao: 'aplicacao',
    loteId: 'lot-bcg-02',
    data: '2026-08-05',
    profissionalId: 'prof-001',
  },
];
