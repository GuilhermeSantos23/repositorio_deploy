import type { CampaignRecord } from '../types/campaign';

// Dados fictícios apenas para reproduzir a interface visual e permitir
// testar busca, filtro e os três estados de status (ativa/agendada/encerrada).
// Datas escolhidas em torno da data atual para que os três estados apareçam.
export const campaignsMock: CampaignRecord[] = [
  {
    id: 1,
    title: 'Campanha de vacinação contra a Gripe',
    description: 'Vacine-se e proteja você e sua família.',
    publishedAt: '2026-08-10',
    endDate: '2026-12-09',
  },
  {
    id: 2,
    title: 'Multivacinação infantil',
    description: 'Atualize a caderneta de vacinação das crianças da região.',
    publishedAt: '2026-10-01',
    endDate: '2026-10-31',
  },
  {
    id: 3,
    title: 'Campanha contra a Dengue',
    description: 'Ação de conscientização e vacinação contra a dengue.',
    publishedAt: '2026-01-15',
    endDate: '2026-03-15',
  },
];
