import type { Recorte } from '../types/vaccine';

// Calendário Nacional de Vacinação 2026 do Ministério da Saúde.
// Os recortes Criança, Adolescente, Jovem, Adulto e Idoso seguem as
// categorias oficiais do calendário nacional.
//
// Esta é uma tela informativa: os dados abaixo descrevem o calendário
// oficial e não são comparados com o histórico pessoal de ninguém.
//
// Estrutura: Grupo -> Idade/Momento -> Vacina -> Dose -> Observação.
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
  // ADOLESCENTE (10 anos a 19 anos, 11 meses e 29 dias).
  // Cada vacina aparece em uma linha própria, dentro da faixa de idade
  // em que o calendário oficial a indica. A frase "conforme histórico
  // vacinal" é apenas uma observação da dose: ela nunca substitui o
  // nome da vacina.
  {
    id: 'adolescente',
    label: 'Adolescente',
    moments: [
      {
        id: '9-a-14-anos',
        label: '9 a 14 anos',
        vaccines: [
          {
            id: 'hpv4',
            name: 'HPV4',
            network: 'publica',
            doses: [{ id: 'unica', label: '1 dose' }],
            observation: 'conforme histórico vacinal',
          },
        ],
      },
      {
        id: '10-a-14-anos',
        label: '10 a 14 anos',
        vaccines: [
          {
            id: 'dengue',
            name: 'Dengue tetravalente',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'conforme histórico vacinal',
          },
        ],
      },
      {
        id: '11-a-14-anos',
        label: '11 a 14 anos',
        vaccines: [
          {
            id: 'meningococica-acwy',
            name: 'Meningocócica ACWY',
            network: 'publica',
            doses: [{ id: 'unica', label: '1 dose' }],
          },
        ],
      },
      {
        id: '10-a-24-anos',
        label: '10 a 24 anos',
        vaccines: [
          {
            id: 'hepatite-b',
            name: 'Hepatite B',
            network: 'publica',
            doses: [{ id: 'tres', label: '3 doses' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'dt',
            name: 'dT',
            network: 'publica',
            doses: [{ id: 'tres', label: '3 doses' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'febre-amarela',
            name: 'Febre Amarela',
            network: 'publica',
            doses: [{ id: 'unica', label: '1 dose' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'triplice-viral',
            name: 'Tríplice Viral SCR',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'pneumococica-23',
            name: 'Pneumocócica 23-valente',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condição específica',
            note: 'Somente para povos indígenas sem histórico vacinal com pneumocócica conjugada.',
          },
          {
            id: 'varicela',
            name: 'Varicela',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condição específica',
            note: 'Somente para povos indígenas e trabalhadores da saúde nas condições indicadas oficialmente e conforme histórico vacinal.',
          },
        ],
      },
    ],
  },
  // JOVEM (20 anos a 24 anos, 11 meses e 29 dias).
  // O calendário oficial trata Adolescente e Jovem na mesma tabela, mas
  // as faixas de 9 a 14 anos não alcançam o jovem. Por isso aqui ficam
  // somente as vacinas da faixa "10 a 24 anos".
  {
    id: 'jovem',
    label: 'Jovem',
    moments: [
      {
        id: '10-a-24-anos',
        label: '10 a 24 anos',
        vaccines: [
          {
            id: 'hepatite-b',
            name: 'Hepatite B',
            network: 'publica',
            doses: [{ id: 'tres', label: '3 doses' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'dt',
            name: 'dT',
            network: 'publica',
            doses: [{ id: 'tres', label: '3 doses' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'febre-amarela',
            name: 'Febre Amarela',
            network: 'publica',
            doses: [{ id: 'unica', label: '1 dose' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'triplice-viral',
            name: 'Tríplice Viral SCR',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'pneumococica-23',
            name: 'Pneumocócica 23-valente',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condição específica',
            note: 'Somente para povos indígenas sem histórico vacinal com pneumocócica conjugada.',
          },
          {
            id: 'varicela',
            name: 'Varicela',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condição específica',
            note: 'Somente para povos indígenas e trabalhadores da saúde nas condições indicadas oficialmente e conforme histórico vacinal.',
          },
        ],
      },
    ],
  },
  // ADULTO (25 anos a 59 anos, 11 meses e 29 dias).
  {
    id: 'adulto',
    label: 'Adulto',
    moments: [
      {
        id: '25-a-59-anos',
        label: '25 a 59 anos',
        vaccines: [
          {
            id: 'hepatite-b',
            name: 'Hepatite B',
            network: 'publica',
            doses: [{ id: 'tres', label: '3 doses' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'dt',
            name: 'dT',
            network: 'publica',
            doses: [{ id: 'tres', label: '3 doses' }],
            observation: 'conforme histórico vacinal',
            note: '1 dose de reforço aos 34 anos e, na sequência, 1 dose a cada 10 anos.',
          },
          {
            id: 'febre-amarela',
            name: 'Febre Amarela',
            network: 'publica',
            doses: [{ id: 'unica', label: '1 dose' }],
            observation: 'conforme histórico vacinal',
            note: 'Manter a situação vacinal atualizada, principalmente para residentes e viajantes de áreas com circulação do vírus.',
          },
          {
            id: 'triplice-viral',
            name: 'Tríplice Viral SCR',
            network: 'publica',
            doses: [{ id: 'ate-29', label: 'até 29 anos: 2 doses' }, { id: 'de-30-a-59', label: 'de 30 a 59 anos: 1 dose' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'varicela',
            name: 'Varicela',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condição específica',
            note: 'Somente para trabalhadores da saúde e povos indígenas, conforme critérios oficiais.',
          },
          {
            id: 'pneumococica-23',
            name: 'Pneumocócica 23-valente',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condição específica',
            note: 'Somente para povos indígenas sem histórico vacinal com pneumocócica conjugada.',
          },
          {
            id: 'hpv4',
            name: 'HPV4',
            network: 'publica',
            doses: [{ id: 'unica', label: '1 dose' }],
            observation: 'condição específica',
            note: 'Indicada para os grupos prioritários definidos na Instrução Normativa do Calendário Nacional de Vacinação.',
          },
        ],
      },
    ],
  },
  // IDOSO (a partir de 60 anos).
  {
    id: 'idoso',
    label: 'Idoso',
    moments: [
      {
        id: 'a-partir-de-60-anos',
        label: 'A partir de 60 anos',
        vaccines: [
          {
            id: 'hepatite-b',
            name: 'Hepatite B',
            network: 'publica',
            doses: [{ id: 'tres', label: '3 doses' }],
            observation: 'conforme histórico vacinal',
          },
          {
            id: 'dt',
            name: 'dT',
            network: 'publica',
            doses: [{ id: 'tres', label: '3 doses' }],
            observation: 'conforme histórico vacinal',
            note: 'Reforço a cada 10 anos, conforme orientação oficial.',
          },
          {
            id: 'febre-amarela',
            name: 'Febre Amarela',
            network: 'publica',
            doses: [{ id: 'excepcional', label: '1 dose em casos excepcionais' }],
            observation: 'conforme histórico vacinal',
            note: 'Indicada após avaliação de risco-benefício pelo serviço de saúde.',
          },
          {
            id: 'triplice-viral',
            name: 'Tríplice Viral SCR',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condição específica',
            note: 'Somente para trabalhadores da saúde, mediante avaliação do serviço de saúde.',
          },
          {
            id: 'pneumococica-23',
            name: 'Pneumocócica 23-valente',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condições específicas',
            note: 'Somente para pessoas acamadas ou institucionalizadas e povos indígenas sem histórico vacinal com pneumocócica conjugada.',
          },
          {
            id: 'varicela',
            name: 'Varicela',
            network: 'publica',
            doses: [{ id: 'duas', label: '2 doses' }],
            observation: 'condições específicas',
            note: 'Somente para trabalhadores da saúde e povos indígenas, conforme critérios oficiais.',
          },
          {
            id: 'influenza',
            name: 'Influenza',
            network: 'publica',
            doses: [{ id: 'anual', label: '1 dose anual' }],
          },
          {
            id: 'covid-19',
            name: 'Covid-19',
            network: 'publica',
            doses: [{ id: 'semestral', label: '1 dose semestral' }],
          },
        ],
      },
    ],
  },
];
