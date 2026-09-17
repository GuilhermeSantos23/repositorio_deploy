import type { Recorte } from '../types/vaccine';

// Calendário Nacional de Vacinação 2026 do Ministério da Saúde.
// Os recortes Criança, Adolescente, Jovem, Adulto e Idoso seguem as
// categorias oficiais do calendário nacional. O recorte Anual é mantido
// como organização própria do Vac+.
//
// Fonte oficial consultada em 06/09/2026:
// https://www.gov.br/saude/pt-br/vacinacao/calendario
export const RECORTES: Recorte[] = [
  {
    id: 'crianca',
    label: 'Criança',
    moments: [
      {
        id: 'ao-nascer',
        label: 'Ao nascer',
        vaccines: [
          { id: 'hepatite-b', name: 'Hepatite B', network: 'publica', doses: [{ id: 'dose-1', label: '1 dose' }] },
          { id: 'bcg', name: 'BCG', network: 'publica', doses: [{ id: 'unica', label: 'Dose única' }] },
        ],
      },
      {
        id: '2-meses',
        label: '2 meses',
        vaccines: [
          { id: 'penta', name: 'Penta (DTP + Hib + HB)', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
          { id: 'vip', name: 'Poliomielite inativada (VIP)', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
          { id: 'rotavirus', name: 'Rotavírus humano', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
          { id: 'pneumococica-20', name: 'Pneumocócica 20-valente', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
        ],
      },
      {
        id: '3-meses',
        label: '3 meses',
        vaccines: [
          { id: 'meningococica-c', name: 'Meningocócica C', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
        ],
      },
      {
        id: '4-meses',
        label: '4 meses',
        vaccines: [
          { id: 'penta', name: 'Penta (DTP + Hib + HB)', network: 'publica', doses: [{ id: 'dose-2', label: '2ª dose' }] },
          { id: 'vip', name: 'Poliomielite inativada (VIP)', network: 'publica', doses: [{ id: 'dose-2', label: '2ª dose' }] },
          { id: 'rotavirus', name: 'Rotavírus humano', network: 'publica', doses: [{ id: 'dose-2', label: '2ª dose' }] },
          { id: 'pneumococica-10', name: 'Pneumocócica 10-valente', network: 'publica', doses: [{ id: 'dose-2', label: '2ª dose' }] },
        ],
      },
      {
        id: '5-meses',
        label: '5 meses',
        vaccines: [
          { id: 'meningococica-c', name: 'Meningocócica C', network: 'publica', doses: [{ id: 'dose-2', label: '2ª dose' }] },
        ],
      },
      {
        id: '6-meses',
        label: '6 meses',
        vaccines: [
          { id: 'penta', name: 'Penta (DTP + Hib + HB)', network: 'publica', doses: [{ id: 'dose-3', label: '3ª dose' }] },
          { id: 'vip', name: 'Poliomielite inativada (VIP)', network: 'publica', doses: [{ id: 'dose-3', label: '3ª dose' }] },
          { id: 'influenza', name: 'Influenza trivalente', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
          { id: 'covid-19', name: 'Covid-19', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
        ],
      },
      {
        id: '6-a-8-meses',
        label: '6 a 8 meses',
        vaccines: [
          {
            id: 'febre-amarela',
            name: 'Febre Amarela',
            network: 'publica',
            doses: [{ id: 'unica-excepcional', label: '1 dose (casos excepcionais)' }],
            note: 'Indicada apenas após avaliação de risco-benefício em contexto epidemiológico específico.',
          },
        ],
      },
      {
        id: '7-meses',
        label: '7 meses',
        vaccines: [
          { id: 'covid-19', name: 'Covid-19', network: 'publica', doses: [{ id: 'dose-2', label: '2ª dose' }] },
        ],
      },
      {
        id: '9-meses',
        label: '9 meses',
        vaccines: [
          { id: 'covid-19', name: 'Covid-19', network: 'publica', doses: [{ id: 'dose-3', label: '3ª dose' }] },
          { id: 'febre-amarela', name: 'Febre Amarela', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
        ],
      },
      {
        id: '12-meses',
        label: '12 meses',
        vaccines: [
          { id: 'pneumococica-20', name: 'Pneumocócica 20-valente', network: 'publica', doses: [{ id: 'reforco', label: '1 dose de reforço' }] },
          { id: 'meningococica-acwy', name: 'Meningocócica ACWY', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }] },
          { id: 'triplice-viral', name: 'Tríplice Viral (SCR)', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
        ],
      },
      {
        id: '15-meses',
        label: '15 meses',
        vaccines: [
          { id: 'dtp', name: 'DTP', network: 'publica', doses: [{ id: 'reforco-1', label: '1º reforço' }] },
          { id: 'vip', name: 'Poliomielite inativada (VIP)', network: 'publica', doses: [{ id: 'reforco-1', label: '1º reforço' }] },
          { id: 'triplice-viral', name: 'Tríplice Viral (SCR)', network: 'publica', doses: [{ id: 'dose-2', label: '2ª dose' }] },
          { id: 'varicela', name: 'Varicela', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }] },
          { id: 'hepatite-a', name: 'Hepatite A', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }] },
        ],
      },
      {
        id: '4-anos',
        label: '4 anos',
        vaccines: [
          { id: 'dtp', name: 'DTP', network: 'publica', doses: [{ id: 'reforco-2', label: '2º reforço' }] },
          { id: 'vip', name: 'Poliomielite inativada (VIP)', network: 'publica', doses: [{ id: 'reforco-2', label: '2º reforço' }] },
          { id: 'varicela', name: 'Varicela', network: 'publica', doses: [{ id: 'dose-2', label: '2ª dose' }] },
          { id: 'febre-amarela', name: 'Febre Amarela', network: 'publica', doses: [{ id: 'reforco', label: '1 dose de reforço' }] },
        ],
      },
      {
        id: '5-anos',
        label: '5 anos',
        vaccines: [
          {
            id: 'pneumococica-20',
            name: 'Pneumocócica 20-valente',
            network: 'publica',
            doses: [{ id: 'unica', label: '1 dose' }],
            note: 'Somente para povos indígenas sem histórico vacinal com pneumocócica conjugada.',
          },
        ],
      },
      {
        id: '9-anos',
        label: '9 anos',
        vaccines: [
          {
            id: 'hpv4',
            name: 'HPV4',
            network: 'publica',
            doses: [{ id: 'unica', label: '1 dose' }],
            note: 'Em atraso, pode ser realizada até 14 anos, 11 meses e 29 dias; para 15 a 19 anos, 11 meses e 29 dias, seguir estratégia estadual.',
          },
        ],
      },
    ],
  },
  {
    id: 'adolescente',
    label: 'Adolescente',
    moments: [
      {
        id: 'conforme-historico',
        label: 'Conforme histórico vacinal',
        vaccines: [
          { id: 'hpv4', name: 'HPV4', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }] },
          { id: 'hepatite-b', name: 'Hepatite B', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }, { id: 'dose-3', label: '3ª dose' }] },
          { id: 'febre-amarela', name: 'Febre Amarela', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }] },
          { id: 'triplice-viral', name: 'Tríplice Viral (SCR)', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }] },
          { id: 'varicela', name: 'Varicela', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }], note: 'Somente para trabalhadores da saúde e povos indígenas, conforme histórico e critérios oficiais.' },
          { id: 'pneumococica-20', name: 'Pneumocócica 20-valente', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }], note: 'Somente para povos indígenas sem histórico vacinal com pneumocócica conjugada.' },
          { id: 'dengue-dng4', name: 'Dengue DNG4', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }] },
          { id: 'meningococica-acwy', name: 'Meningocócica ACWY', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }] },
          { id: 'dt', name: 'dT', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }, { id: 'dose-3', label: '3ª dose' }] },
        ],
      },
    ],
  },
  {
    id: 'jovem',
    label: 'Jovem',
    moments: [
      {
        id: 'conforme-historico',
        label: 'Conforme histórico vacinal',
        vaccines: [
          { id: 'hepatite-b', name: 'Hepatite B', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }, { id: 'dose-3', label: '3ª dose' }] },
          { id: 'febre-amarela', name: 'Febre Amarela', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }] },
          { id: 'triplice-viral', name: 'Tríplice Viral (SCR)', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }] },
          { id: 'varicela', name: 'Varicela', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }], note: 'Somente para trabalhadores da saúde e povos indígenas, conforme histórico e critérios oficiais.' },
          { id: 'pneumococica-20', name: 'Pneumocócica 20-valente', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }], note: 'Somente para povos indígenas sem histórico vacinal com pneumocócica conjugada.' },
          { id: 'dengue-dng4', name: 'Dengue DNG4', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }] },
          { id: 'meningococica-acwy', name: 'Meningocócica ACWY', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }] },
          { id: 'dt', name: 'dT', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }, { id: 'dose-3', label: '3ª dose' }, { id: 'reforco', label: 'Reforço' }] },
        ],
      },
    ],
  },
  {
    id: 'adulto',
    label: 'Adulto',
    moments: [
      {
        id: 'conforme-historico',
        label: 'Conforme histórico vacinal',
        vaccines: [
          { id: 'hepatite-b', name: 'Hepatite B', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }, { id: 'dose-3', label: '3ª dose' }] },
          { id: 'dt', name: 'dT', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }, { id: 'dose-3', label: '3ª dose' }, { id: 'reforco', label: 'Reforço' }] },
          { id: 'febre-amarela', name: 'Febre Amarela', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }], note: 'Indicada conforme histórico, risco epidemiológico e critérios oficiais.' },
          { id: 'triplice-viral', name: 'Tríplice Viral (SCR)', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }] },
          { id: 'varicela', name: 'Varicela', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }], note: 'Somente para trabalhadores da saúde e povos indígenas, conforme histórico e critérios oficiais.' },
          { id: 'pneumococica-20', name: 'Pneumocócica 20-valente', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }], note: 'Somente para povos indígenas sem histórico vacinal com pneumocócica conjugada.' },
        ],
      },
    ],
  },
  {
    id: 'idoso',
    label: 'Idoso',
    moments: [
      {
        id: 'conforme-historico',
        label: 'Conforme histórico vacinal',
        vaccines: [
          { id: 'hepatite-b', name: 'Hepatite B', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }, { id: 'dose-3', label: '3ª dose' }] },
          { id: 'dt', name: 'dT', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }, { id: 'dose-3', label: '3ª dose' }, { id: 'reforco', label: 'Reforço' }] },
          { id: 'febre-amarela', name: 'Febre Amarela', network: 'publica', doses: [{ id: 'unica-excepcional', label: '1 dose (casos excepcionais)' }] },
          { id: 'triplice-viral', name: 'Tríplice Viral (SCR)', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }], note: 'Somente para trabalhadores de saúde, mediante avaliação do serviço de saúde.' },
          { id: 'varicela', name: 'Varicela', network: 'publica', doses: [{ id: 'dose-1', label: '1ª dose' }, { id: 'dose-2', label: '2ª dose' }], note: 'Somente para trabalhadores da saúde e povos indígenas, conforme critérios oficiais.' },
          { id: 'pneumococica-20', name: 'Pneumocócica 20-valente', network: 'publica', doses: [{ id: 'unica', label: '1 dose' }], note: 'Somente para não vacinados acamados/institucionalizados e povos indígenas sem histórico com pneumocócica conjugada.' },
          { id: 'influenza', name: 'Influenza trivalente', network: 'publica', doses: [{ id: 'anual', label: '1 dose anual por temporada' }] },
          { id: 'covid-19', name: 'Covid-19', network: 'publica', doses: [{ id: 'semestral', label: '1 dose semestral' }] },
        ],
      },
    ],
  },
  {
    id: 'anual',
    label: 'Anual',
    moments: [
      {
        id: 'campanha-anual',
        label: 'Campanha anual',
        vaccines: [
          {
            id: 'influenza',
            name: 'Influenza trivalente',
            network: 'publica',
            doses: [{ id: 'anual', label: 'Dose anual' }],
          },
          {
            id: 'covid-19-reforco',
            name: 'Covid-19 (reforço)',
            network: 'publica',
            doses: [{ id: 'semestral', label: 'Reforço semestral (60+)' }],
          },
        ],
      },
    ],
  },
];
