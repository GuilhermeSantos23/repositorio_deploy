import type { GrupoEspecial, GrupoViajante } from '../types/vaccine';

// Grupos especiais: Gestante, Imunossuprimido, Em quimioterapia e
// Transplantado.
//
// Fonte oficial: o Ministério da Saúde (Programa Nacional de
// Imunizações) orienta que vacinas de vírus vivo atenuado são
// contraindicadas para gestantes e para pessoas imunossuprimidas
// (o que inclui quem está em tratamento quimioterápico e pessoas
// transplantadas em uso de imunossupressores), justamente porque o
// sistema de defesa dessas pessoas está mais fraco para lidar com o
// vírus da vacina, mesmo enfraquecido.
//
// As vacinas abaixo (Febre Amarela, Tríplice Viral, Varicela e Dengue)
// são as vacinas de vírus vivo atenuado presentes no Calendário
// Nacional de Vacinação (ver src/data/vaccines.ts). Cada grupo repete
// essas vacinas porque a mesma regra (vírus vivo atenuado) se aplica a
// todos eles. A avaliação final de cada caso deve sempre considerar a
// condição clínica específica e ser feita por um profissional de
// saúde, conforme o aviso mostrado no topo de cada grupo.
const AVISO_GRUPO_ESPECIAL =
  'Algumas vacinas devem ser evitadas ou podem ser contraindicadas em determinadas condições. A indicação pode depender da condição clínica e da avaliação de um profissional de saúde.';

function criarVacinasContraindicadasPadrao(motivoBase: string) {
  return [
    {
      id: 'febre-amarela',
      name: 'Febre Amarela',
      reason: `Vacina de vírus vivo atenuado; ${motivoBase}.`,
    },
    {
      id: 'triplice-viral',
      name: 'Tríplice Viral (SCR)',
      reason: `Vacina de vírus vivo atenuado; ${motivoBase}.`,
    },
    {
      id: 'varicela',
      name: 'Varicela',
      reason: `Vacina de vírus vivo atenuado; ${motivoBase}.`,
    },
    {
      id: 'dengue-dng4',
      name: 'Dengue DNG4',
      reason: `Vacina de vírus vivo atenuado; ${motivoBase}.`,
    },
  ];
}

// Ordem alfabética, conforme pedido: Em quimioterapia, Gestante,
// Imunossuprimido, Transplantado.
export const GRUPOS_ESPECIAIS: GrupoEspecial[] = [
  {
    id: 'quimioterapia',
    label: 'Em quimioterapia',
    warning: AVISO_GRUPO_ESPECIAL,
    vaccines: criarVacinasContraindicadasPadrao(
      'contraindicada durante o tratamento quimioterápico, pela queda da imunidade',
    ),
  },
  {
    id: 'gestante',
    label: 'Gestante',
    warning: AVISO_GRUPO_ESPECIAL,
    vaccines: criarVacinasContraindicadasPadrao(
      'contraindicada durante a gestação, pelo risco ao feto',
    ),
  },
  {
    id: 'imunossuprimido',
    label: 'Imunossuprimido',
    warning: AVISO_GRUPO_ESPECIAL,
    vaccines: criarVacinasContraindicadasPadrao(
      'contraindicada em pessoas imunossuprimidas, pela baixa capacidade de defesa contra o vírus vacinal',
    ),
  },
  {
    id: 'transplantado',
    label: 'Transplantado',
    warning: AVISO_GRUPO_ESPECIAL,
    vaccines: criarVacinasContraindicadasPadrao(
      'contraindicada em pessoas transplantadas em uso de imunossupressores',
    ),
  },
];

// Grupo do viajante: aparece por último, com visual e texto diferentes
// dos grupos especiais (aqui a vacina é recomendada, não contraindicada).
//
// Fonte oficial: Ministério da Saúde, orientações de vacinação para
// viajantes/estrangeiros que vêm para o Brasil.
// https://www.gov.br/saude/pt-br/vacinacao/calendario
export const GRUPO_VIAJANTE: GrupoViajante = {
  id: 'viajante',
  label: 'Viajante',
  description:
    'Este filtro apresenta as principais vacinas que um turista internacional deve manter atualizadas antes de viajar para o Brasil.',
  disclaimer:
    'Importante: o Ministério da Saúde informa que não há obrigatoriedade geral de comprovação vacinal para entrada no país. São recomendações para que o turista internacional mantenha sua vacinação atualizada antes da viagem.',
  source: 'Fonte: Ministério da Saúde',
  vaccines: [
    {
      id: 'febre-amarela',
      name: 'Febre Amarela',
      reason:
        'Proteção contra febre amarela em áreas com recomendação de vacinação',
      leadTime: '10 dias',
    },
    {
      id: 'triplice-viral',
      name: 'Tríplice Viral (Sarampo)',
      reason: 'Atualização da vacinação contra sarampo',
      leadTime: 'Conforme situação vacinal',
    },
    {
      id: 'vip',
      name: 'Poliomielite (VIP)',
      reason: 'Manter esquema vacinal completo',
      leadTime: 'Conforme orientação',
    },
    {
      id: 'dt-difteria',
      name: 'Difteria (dT)',
      reason: 'Manter esquema vacinal completo',
      leadTime: 'Conforme orientação',
    },
    {
      id: 'dt-tetano',
      name: 'Tétano (dT)',
      reason: 'Manter esquema vacinal completo',
      leadTime: 'Conforme orientação',
    },
  ],
};
