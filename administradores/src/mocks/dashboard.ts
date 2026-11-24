// Indicadores fictícios do Dashboard da unidade.
// A tela lê só esta estrutura. Na integração, a origem passa a ser o
// serviço da unidade, sem reescrever os gráficos.

export interface PontoVacinasDia {
  dia: number;
  doses: number;
}

// Maio/2026, dias 1 a 19. A soma é 957 (média 50/dia) e o dia 19 tem 53 doses,
// como no indicador destacado do gráfico.
export const VACINAS_POR_DIA: PontoVacinasDia[] = [
  { dia: 1, doses: 42 },
  { dia: 2, doses: 48 },
  { dia: 3, doses: 46 },
  { dia: 4, doses: 52 },
  { dia: 5, doses: 56 },
  { dia: 6, doses: 48 },
  { dia: 7, doses: 44 },
  { dia: 8, doses: 52 },
  { dia: 9, doses: 58 },
  { dia: 10, doses: 64 },
  { dia: 11, doses: 65 },
  { dia: 12, doses: 55 },
  { dia: 13, doses: 40 },
  { dia: 14, doses: 46 },
  { dia: 15, doses: 52 },
  { dia: 16, doses: 48 },
  { dia: 17, doses: 42 },
  { dia: 18, doses: 46 },
  { dia: 19, doses: 53 },
];

export const VARIACAO_MES_ANTERIOR = 8.4;

export const ESCALA_VACINAS_DIA = {
  maximo: 72,
  marcas: [0, 20, 40, 60],
};

export const JANELA_VACINAS = 'Janela de Maio';

export interface SegmentoDonut {
  id: string;
  label: string;
  valor: number;
  cor: string;
}

export const FUNCIONARIOS: SegmentoDonut[] = [
  { id: 'ativos', label: 'Funcionários ativos', valor: 3, cor: '#3dce7c' },
  { id: 'inativos', label: 'Funcionários inativos', valor: 1, cor: '#f0a04b' },
  { id: 'bloqueados', label: 'Funcionários bloqueados', valor: 1, cor: '#f08b8b' },
];

export const CAMPANHAS: SegmentoDonut[] = [
  { id: 'ativas', label: 'Campanhas ativas', valor: 3, cor: '#3dce7c' },
  { id: 'agendadas', label: 'Agendadas', valor: 2, cor: '#f0a04b' },
  { id: 'encerradas', label: 'Encerradas', valor: 1, cor: '#f08b8b' },
];

export type StatusLoteAtencao = 'critico' | 'baixo' | 'a_vencer';

export interface LoteEmAtencao {
  id: string;
  vacina: string;
  lote: string;
  fabricante: string;
  validade: string;
  quantidade: number;
  status: StatusLoteAtencao;
}

export const LOTES_EM_ATENCAO: LoteEmAtencao[] = [
  {
    id: 'cv-2026-088',
    vacina: 'COVID-19',
    lote: 'CV-2026-088',
    fabricante: 'Pfizer',
    validade: '06/2026',
    quantidade: 5,
    status: 'critico',
  },
  {
    id: 'if-2026-142',
    vacina: 'Influenza',
    lote: 'IF-2026-142',
    fabricante: 'Butantan',
    validade: '07/2026',
    quantidade: 18,
    status: 'baixo',
  },
  {
    id: 'hb-2026-031',
    vacina: 'Hepatite B',
    lote: 'HB-2026-031',
    fabricante: 'GSK',
    validade: '08/2026',
    quantidade: 24,
    status: 'a_vencer',
  },
  {
    id: 'fa-2026-054',
    vacina: 'Febre Amarela',
    lote: 'FA-2026-054',
    fabricante: 'Fiocruz',
    validade: '06/2026',
    quantidade: 12,
    status: 'baixo',
  },
  {
    id: 'tv-2026-077',
    vacina: 'Tríplice Viral',
    lote: 'TV-2026-077',
    fabricante: 'MSD',
    validade: '09/2026',
    quantidade: 15,
    status: 'baixo',
  },
];

export const STATUS_LOTE_LABEL: Record<StatusLoteAtencao, string> = {
  critico: 'Crítico',
  baixo: 'Baixo',
  a_vencer: 'A vencer',
};

export const STATUS_LOTE_CLASSE: Record<StatusLoteAtencao, string> = {
  critico: 'text-red-500',
  baixo: 'text-orange-500',
  a_vencer: 'text-amber-500',
};
