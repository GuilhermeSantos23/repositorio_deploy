
 // Indicadores fictícios do Dashboard regional.
// Quando a API existir, estes valores devem ser substituídos
// pela resposta do serviço.

export type PeriodoVacinacao =
  | 'mensal'
  | 'quinzena1'
  | 'quinzena2';

export interface PontoVacinacaoMensal {
  mes: string;
  mensal: number;
  quinzena1: number;
  quinzena2: number;
}

// Série dos últimos 12 meses.
// Começa em novembro e termina em outubro.
// As duas quinzenas somam o valor mensal.

export const SERIE_VACINACAO: PontoVacinacaoMensal[] = [
  { mes: 'Nov', mensal: 5720, quinzena1: 2740, quinzena2: 2980 },
  { mes: 'Dez', mensal: 5980, quinzena1: 2860, quinzena2: 3120 },
  { mes: 'Jan', mensal: 6240, quinzena1: 2980, quinzena2: 3260 },
  { mes: 'Fev', mensal: 6580, quinzena1: 3140, quinzena2: 3440 },
  { mes: 'Mar', mensal: 6920, quinzena1: 3280, quinzena2: 3640 },
  { mes: 'Abr', mensal: 7340, quinzena1: 3480, quinzena2: 3860 },
  { mes: 'Mai', mensal: 7960, quinzena1: 3920, quinzena2: 4040 },
  { mes: 'Jun', mensal: 5200, quinzena1: 2480, quinzena2: 2720 },
  { mes: 'Jul', mensal: 4900, quinzena1: 2360, quinzena2: 2540 },
  { mes: 'Ago', mensal: 5050, quinzena1: 2420, quinzena2: 2630 },
  { mes: 'Set', mensal: 5280, quinzena1: 2540, quinzena2: 2740 },
  { mes: 'Out', mensal: 5460, quinzena1: 2610, quinzena2: 2850 },
];

// Referência exibida nos indicadores.

export const PERIODO_REFERENCIA = 'Nov/26';

export const ESCALA_VACINACAO = {
  maximo: 8500,
  marcas: [0, 2500, 5000, 7500],
};

// GRÁFICO DE PIZZA
// Mantido com os valores e cores originais.

export interface FatiaUnidadesAtivas {
  id: string;
  label: string;
  valor: number;
  cor: string;
}

export const UNIDADES_ATIVAS: FatiaUnidadesAtivas[] = [
  {
    id: 'ubs',
    label: 'UBSs ativas',
    valor: 4,
    cor: '#123c2e',
  },
  {
    id: 'clinicas',
    label: 'Clínicas aprovadas',
    valor: 4,
    cor: '#3dce7c',
  },
];

// DOSES POR UNIDADE DE SAÚDE

export interface DosesZona {
  zona: string;
  doses: number;
  cor: string;
}

export const DOSES_POR_ZONA: DosesZona[] = [
  {
    zona: 'Policlínica CECAP',
    doses: 1980,
    cor: '#123c2e',
  },
  {
    zona: 'Ambulatório da Criança',
    doses: 1760,
    cor: '#1b7a46',
  },
  {
    zona: 'Saúde Livre Guarulhos Centro',
    doses: 1420,
    cor: '#2eaf62',
  },
  {
    zona: 'Vacinarte',
    doses: 1280,
    cor: '#5ed48a',
  },
  {
    zona: 'Dr. Vacina Guarulhos',
    doses: 980,
    cor: '#9ae6b8',
  },
  {
    zona: 'UBS Vila Barros',
    doses: 490,
    cor: '#d3f5e4',
  },
];

// Total de doses das unidades.
// Mantido como campo independente, conforme o mock original.

export const TOTAL_DOSES_REGIAO = 7960;

// ESTOQUE DAS UNIDADES
// Verde: Normal
// Amarelo: Em atenção
// Vermelho: Crítico

export interface SituacaoGrupo {
  titulo: string;
  segmentos: {
    id: string;
    label: string;
    valor: number;
    cor: string;
  }[];
}

export const SITUACAO_UNIDADES: SituacaoGrupo[] = [
  {
    titulo: 'UBSs',
    segmentos: [
      {
        id: 'normal',
        label: 'Normal',
        valor: 4,
        cor: '#22c55e',
      },
      {
        id: 'atencao',
        label: 'Em atenção',
        valor: 2,
        cor: '#f5b942',
      },
      {
        id: 'critico',
        label: 'Crítico',
        valor: 1,
        cor: '#ef5350',
      },
    ],
  },
  {
    titulo: 'Clínicas privadas',
    segmentos: [
      {
        id: 'normal',
        label: 'Normal',
        valor: 4,
        cor: '#22c55e',
      },
      {
        id: 'atencao',
        label: 'Em atenção',
        valor: 2,
        cor: '#f5b942',
      },
      {
        id: 'critico',
        label: 'Crítico',
        valor: 1,
        cor: '#ef5350',
      },
    ],
  },
];

// Quantidade de unidades que precisam ser analisadas.



// Retorna o valor correspondente ao filtro selecionado.

export function valorDoPeriodo(
  ponto: PontoVacinacaoMensal,
  periodo: PeriodoVacinacao,
): number {
  return ponto[periodo];
}
