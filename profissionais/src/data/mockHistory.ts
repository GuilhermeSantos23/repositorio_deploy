export type ActionType =
  | 'aplicou-dose'
  | 'cadastrou-caderneta'
  | 'alterou-caderneta'
  | 'alterou-aplicacao'
  | 'consultou-lote'
  | 'visualizou-paciente';

export interface HistoryEntry {
  id: string;
  action: ActionType;
  actionLabel: string;
  detail: string;
  timestamp: string;
  patientName: string;
  patientCpf: string;
  // Preenchido apenas para entradas de aplicação (ver Historico.tsx). O
  // lote sempre vem do lotService (fonte única de estoque), nunca de um
  // mock paralelo.
  lotCode?: string;
}

// Registros de exemplo, apenas para demonstrar as telas de Histórico.
// Futuramente essa lista virá do backend (log real de ações do sistema).
export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: '1',
    action: 'aplicou-dose',
    actionLabel: 'Aplicou dose',
    detail: 'Influenza · Dose única',
    timestamp: 'Hoje, 14:32',
    patientName: 'Maria Ferreira',
    patientCpf: '104.825.736-42',
  },
  {
    id: '2',
    action: 'alterou-caderneta',
    actionLabel: 'Alterou caderneta',
    detail: 'HPV · Faixa etária: Infantil',
    timestamp: 'Hoje, 13:48',
    patientName: 'Joana Nunes',
    patientCpf: '529.307.184-16',
  },
  {
    id: '3',
    action: 'cadastrou-caderneta',
    actionLabel: 'Cadastrou caderneta',
    detail: 'Faixa etária: Ao nascer',
    timestamp: 'Hoje, 12:15',
    patientName: 'Paulo Reis',
    patientCpf: '418.296.530-71',
  },
  {
    id: '4',
    action: 'alterou-aplicacao',
    actionLabel: 'Alterou aplicação',
    detail: 'Dengue (DNG4) · 2ª dose',
    timestamp: 'Ontem, 16:02',
    patientName: 'Joana Nunes',
    patientCpf: '529.307.184-16',
  },
  {
    id: '5',
    action: 'consultou-lote',
    actionLabel: 'Consultou lote',
    detail: 'Lote ABC123 · Fabricante: Instituto Butantan',
    timestamp: 'Ontem, 11:31',
    patientName: '—',
    patientCpf: '—',
  },
  {
    id: '6',
    action: 'visualizou-paciente',
    actionLabel: 'Visualizou paciente',
    detail: 'Visualização do histórico do paciente',
    timestamp: 'Ontem, 09:45',
    patientName: 'Maria Ferreira',
    patientCpf: '104.825.736-42',
  },
];

