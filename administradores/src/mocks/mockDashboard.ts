// Indicadores fictícios do Dashboard da unidade.
// Na integração, os dados serão fornecidos pelos serviços da unidade.

export interface PontoVacinasDia {
  dia: number;
  doses: number;
}

// Novembro/2026 — dias 01 a 25.
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
  { dia: 20, doses: 51 },
  { dia: 21, doses: 57 },
  { dia: 22, doses: 49 },
  { dia: 23, doses: 62 },
  { dia: 24, doses: 55 },
  { dia: 25, doses: 60 },
];

export const VARIACAO_MES_ANTERIOR = 8.4;

export const ESCALA_VACINAS_DIA = {
  maximo: 72,
  marcas: [0, 20, 40, 60],
};

export const JANELA_VACINAS = 'Janela de Novembro';
export const DATA_REFERENCIA_DASHBOARD = '25/11/2026';

// Gráfico de funcionários — mantido.
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

// Gráfico de campanhas — mantido.
export const CAMPANHAS: SegmentoDonut[] = [
  { id: 'ativas', label: 'Campanhas ativas', valor: 3, cor: '#3dce7c' },
  { id: 'agendadas', label: 'Agendadas', valor: 2, cor: '#f0a04b' },
  { id: 'encerradas', label: 'Encerradas', valor: 1, cor: '#f08b8b' },
];

export type StatusLoteAtencao = 'critico' | 'baixo' | 'a_vencer' | 'normal';
export type GrauAlerta = 1 | 2;

export type TipoAlertaLote =
  | 'vencimento'
  | 'problema_fabricante'
  | 'estoque_baixo'
  | 'validade_proxima';

// Cada registro representa uma remessa recebida pela unidade.
// O código do lote identifica a produção do fabricante; o código da
// remessa identifica o recebimento individual da unidade.
export interface LoteEmAtencao {
  id: string;
  vacina: string;
  lote: string;
  fabricante: string;
  remessa: string;
  unidade: string;
  validade: string;
  quantidade: number;
  problemaFabricante: boolean;
  status: StatusLoteAtencao;
}

// Regras de atenção alinhadas ao escopo do Dashboard.
export const LIMITE_ESTOQUE_ATENCAO = 75;
export const DIAS_VALIDADE_ATENCAO = 15;

// A data é fixa para que os dados demonstrativos não mudem conforme
// o relógio da máquina durante testes e apresentações.
export const DATA_REFERENCIA_LOTES = '25/11/2026';

// Remessas demonstrativas correspondentes aos mesmos códigos e quantidades
// do mock de estoque MOCK_LOTS. A unidade é ilustrativa; na integração,
// deve ser obtida da unidade vinculada ao administrador autenticado.
export const LOTES_EM_ATENCAO: LoteEmAtencao[] = [
  {
    id: 'lot-influenza-01',
    vacina: 'Influenza trivalente',
    lote: 'INF-26A41',
    fabricante: 'Instituto Butantan',
    remessa: 'REM-INF-001',
    unidade: 'Unidade Central',
    validade: '05/12/2026',
    quantidade: 20,
    problemaFabricante: false,
    status: 'baixo',
  },
  {
    id: 'lot-influenza-02',
    vacina: 'Influenza trivalente',
    lote: 'INF-26B72',
    fabricante: 'Instituto Butantan',
    remessa: 'REM-INF-002',
    unidade: 'Unidade Central',
    validade: '02/04/2027',
    quantidade: 18,
    problemaFabricante: false,
    status: 'baixo',
  },
  {
    id: 'lot-hpv-01',
    vacina: 'HPV4',
    lote: 'HPV-9921',
    fabricante: 'Fundação Oswaldo Cruz',
    remessa: 'REM-HPV-001',
    unidade: 'Unidade Central',
    validade: '10/12/2026',
    quantidade: 24,
    problemaFabricante: false,
    status: 'baixo',
  },
  {
    id: 'lot-hpv-02',
    vacina: 'HPV4',
    lote: 'HPV-9937',
    fabricante: 'Fundação Oswaldo Cruz',
    remessa: 'REM-HPV-002',
    unidade: 'Unidade Central',
    validade: '20/02/2027',
    quantidade: 19,
    problemaFabricante: false,
    status: 'baixo',
  },
  {
    id: 'lot-febre-amarela-01',
    vacina: 'Febre Amarela',
    lote: 'FA-26031',
    fabricante: 'Bio-Manguinhos',
    remessa: 'REM-FA-001',
    unidade: 'Unidade Central',
    validade: '20/08/2026',
    quantidade: 17,
    problemaFabricante: false,
    status: 'critico',
  },
  {
    id: 'lot-febre-amarela-02',
    vacina: 'Febre Amarela',
    lote: 'FA-26044',
    fabricante: 'Bio-Manguinhos',
    remessa: 'REM-FA-002',
    unidade: 'Unidade Central',
    validade: '18/05/2027',
    quantidade: 21,
    problemaFabricante: false,
    status: 'baixo',
  },
  {
    id: 'lot-bcg-01',
    vacina: 'BCG',
    lote: 'BCG-26011',
    fabricante: 'Fundação Ataulpho de Paiva',
    remessa: 'REM-BCG-001',
    unidade: 'Unidade Central',
    validade: '01/06/2028',
    quantidade: 65,
    problemaFabricante: false,
    status: 'baixo',
  },
  {
    id: 'lot-bcg-02',
    vacina: 'BCG',
    lote: 'BCG-26019',
    fabricante: 'Fundação Ataulpho de Paiva',
    remessa: 'REM-BCG-002',
    unidade: 'Unidade Central',
    validade: '10/07/2027',
    quantidade: 55,
    problemaFabricante: false,
    status: 'baixo',
  },
  {
    id: 'lot-penta-01',
    vacina: 'Penta (DTP + Hib + HB)',
    lote: 'PEN-26021',
    fabricante: 'Instituto Butantan',
    remessa: 'REM-PEN-001',
    unidade: 'Unidade Central',
    validade: '01/08/2028',
    quantidade: 70,
    problemaFabricante: false,
    status: 'baixo',
  },
  {
    id: 'lot-penta-02',
    vacina: 'Penta (DTP + Hib + HB)',
    lote: 'PEN-26038',
    fabricante: 'Instituto Butantan',
    remessa: 'REM-PEN-002',
    unidade: 'Unidade Central',
    validade: '08/12/2026',
    quantidade: 45,
    problemaFabricante: false,
    status: 'baixo',
  },
];

function converterDataValidade(data: string): Date | null {
  const correspondencia = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!correspondencia) return null;

  const dia = Number(correspondencia[1]);
  const mes = Number(correspondencia[2]);
  const ano = Number(correspondencia[3]);
  const resultado = new Date(ano, mes - 1, dia);

  if (
    resultado.getFullYear() !== ano ||
    resultado.getMonth() !== mes - 1 ||
    resultado.getDate() !== dia
  ) {
    return null;
  }

  resultado.setHours(0, 0, 0, 0);
  return resultado;
}

function normalizarData(data: Date): Date {
  const resultado = new Date(data);
  resultado.setHours(0, 0, 0, 0);
  return resultado;
}

export function calcularGrauAlerta(
  remessa: LoteEmAtencao,
  hoje: Date,
): GrauAlerta | null {
  const validade = converterDataValidade(remessa.validade);
  if (!validade) return null;

  const dataAtual = normalizarData(hoje);

  // Grau 1: remessa vencida ou com problema informado pelo fabricante.
  if (validade < dataAtual || remessa.problemaFabricante) {
    return 1;
  }

  const diferencaDias = Math.ceil(
    (validade.getTime() - dataAtual.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Grau 2: validade nos próximos 15 dias ou estoque de até 75 doses.
  if (
    (diferencaDias >= 0 && diferencaDias <= DIAS_VALIDADE_ATENCAO) ||
    remessa.quantidade <= LIMITE_ESTOQUE_ATENCAO
  ) {
    return 2;
  }

  return null;
}

export function obterTipoAlerta(
  remessa: LoteEmAtencao,
  hoje: Date,
): TipoAlertaLote | null {
  const validade = converterDataValidade(remessa.validade);
  if (!validade) return null;

  const dataAtual = normalizarData(hoje);

  if (remessa.problemaFabricante) {
    return 'problema_fabricante';
  }

  if (validade < dataAtual) {
    return 'vencimento';
  }

  const diferencaDias = Math.ceil(
    (validade.getTime() - dataAtual.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diferencaDias >= 0 && diferencaDias <= DIAS_VALIDADE_ATENCAO) {
    return 'validade_proxima';
  }

  if (remessa.quantidade <= LIMITE_ESTOQUE_ATENCAO) {
    return 'estoque_baixo';
  }

  return null;
}

export const STATUS_LOTE_LABEL: Record<StatusLoteAtencao, string> = {
  critico: 'Crítico',
  baixo: 'Estoque baixo',
  a_vencer: 'A vencer',
  normal: 'Normal',
};

export const STATUS_LOTE_CLASSE: Record<StatusLoteAtencao, string> = {
  critico: 'text-red-500',
  baixo: 'text-orange-500',
  a_vencer: 'text-amber-500',
  normal: 'text-emerald-500',
};
