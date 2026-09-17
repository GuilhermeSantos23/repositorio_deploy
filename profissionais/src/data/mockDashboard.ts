import { MOCK_LOTS } from './mockLots';
import { getVaccineStock, STOCK_CRITICAL_THRESHOLD } from '../utils/stockRules';

// Dados de exemplo para a Home/Dashboard do profissional.
// Assim como em mockPatients.ts e mockHistory.ts, estes valores são só
// placeholders visuais. Futuramente virão do backend (indicadores,
// últimas aplicações e estoque da unidade) — nenhum endpoint foi
// inventado aqui, ver comentário em Home.tsx.

// Estoque crítico = menos de STOCK_CRITICAL_THRESHOLD doses (regra do
// prompt do time, seção 26). Mantido como constante para ficar claro de
// onde vem o "50" usado no filtro.

export interface DashboardStats {
  vacinasHoje: number;
  cadernetasSemana: number;
  vacinasMes: number;
}

export const DASHBOARD_STATS: DashboardStats = {
  vacinasHoje: 32,
  cadernetasSemana: 18,
  vacinasMes: 256,
};

export interface LastApplication {
  id: string;
  dateTime: string;
  patientName: string;
  vaccine: string;
  dose: string;
  professional: string;
}

// As 5 últimas aplicações mostradas na Home. Futuramente vira uma
// consulta ordenada por data/hora vinda do backend, limitada a 5 itens.
export const LAST_APPLICATIONS: LastApplication[] = [
  {
    id: '1',
    dateTime: '25/05/2026, 14:28',
    patientName: 'Maria Ferreira',
    vaccine: 'Influenza',
    dose: 'Dose única',
    professional: 'Ana Paula Santos',
  },
  {
    id: '2',
    dateTime: '25/05/2026, 14:10',
    patientName: 'Paulo Reis',
    vaccine: 'HPV4',
    dose: '2ª dose',
    professional: 'Dra. Helena Ramos',
  },
  {
    id: '3',
    dateTime: '25/05/2026, 13:52',
    patientName: 'Joana Nunes',
    vaccine: 'Febre Amarela',
    dose: 'Dose única',
    professional: 'Ana Paula Santos',
  },
  {
    id: '4',
    dateTime: '25/05/2026, 13:31',
    patientName: 'Maria Ferreira',
    vaccine: 'Tríplice Viral (SCR)',
    dose: '1ª dose',
    professional: 'Dr. Carlos Souza',
  },
  {
    id: '5',
    dateTime: '25/05/2026, 13:05',
    patientName: 'Paulo Reis',
    vaccine: 'Meningocócica ACWY',
    dose: 'Dose única',
    professional: 'Ana Paula Santos',
  },
];

export interface StockItem {
  vaccine: string;
  currentStock: number;
}

export const STOCK_ITEMS: StockItem[] = Array.from(
  new Map(
    MOCK_LOTS.map((lot) => [lot.vaccineId, lot]),
  ).values(),
).map((lot) => ({
  vaccine: lot.vaccineName,
  currentStock: getVaccineStock(MOCK_LOTS, lot.vaccineId),
}));
