import type { ReactNode } from 'react';
import {
  TeamOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  RiseOutlined,
} from '@ant-design/icons';

// Um indicador exibido no dashboard.
interface Indicador {
  id: number;
  label: string;
  valor: string | number;
  tendencia?: string;
  icone: ReactNode;
  corFundoIcone: string;
  corIcone: string;
}

// Dados fictícios apenas para reproduzir a interface visual.
const indicadores: Indicador[] = [
  {
    id: 1,
    label: 'Profissionais',
    valor: 25,
    icone: <TeamOutlined />,
    corFundoIcone: 'bg-blue-50',
    corIcone: 'text-blue-500',
  },
  {
    id: 2,
    label: 'Estoque crítico',
    valor: 9,
    icone: <WarningOutlined />,
    corFundoIcone: 'bg-red-50',
    corIcone: 'text-red-500',
  },
  {
    id: 3,
    label: 'Vacinas entregues (mês)',
    valor: 1350,
    tendencia: '+8.4%',
    icone: <MedicineBoxOutlined />,
    corFundoIcone: 'bg-emerald-50',
    corIcone: 'text-emerald-600',
  },
  {
    id: 4,
    label: 'Campanhas ativos',
    valor: 23,
    icone: <BellOutlined />,
    corFundoIcone: 'bg-amber-50',
    corIcone: 'text-amber-500',
  },
];

// Um ponto do gráfico "Vacinas entregues por dia".
interface PontoGrafico {
  dia: string;
  valor: number;
}

// Dados fictícios apenas para reproduzir a interface visual.
const dadosGrafico: PontoGrafico[] = [
  { dia: '01/05', valor: 32 },
  { dia: '02/05', valor: 41 },
  { dia: '03/05', valor: 38 },
  { dia: '04/05', valor: 44 },
  { dia: '05/05', valor: 54 },
  { dia: '06/05', valor: 22 },
  { dia: '07/05', valor: 27 },
  { dia: '08/05', valor: 45 },
  { dia: '09/05', valor: 50 },
  { dia: '10/05', valor: 57 },
  { dia: '11/05', valor: 53 },
  { dia: '12/05', valor: 32 },
  { dia: '13/05', valor: 28 },
  { dia: '14/05', valor: 47 },
  { dia: '15/05', valor: 58 },
  { dia: '16/05', valor: 51 },
  { dia: '17/05', valor: 38 },
  { dia: '18/05', valor: 33 },
  { dia: '19/05', valor: 40 },
];

// Configuração do sistema de coordenadas do gráfico (SVG).
const CHART_WIDTH = 1000;
const CHART_HEIGHT = 300;
const CHART_PADDING = { top: 16, right: 16, bottom: 44, left: 32 };
const VALOR_MAXIMO = 60;
const LINHAS_GRADE = [0, 20, 40, 60];

function coordenadaX(indice: number, total: number) {
  const larguraUtil = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  return CHART_PADDING.left + (indice / (total - 1)) * larguraUtil;
}

function coordenadaY(valor: number) {
  const alturaUtil = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  return CHART_PADDING.top + alturaUtil * (1 - valor / VALOR_MAXIMO);
}

function GraficoVacinasPorDia() {
  const pontos = dadosGrafico.map((ponto, indice) => ({
    x: coordenadaX(indice, dadosGrafico.length),
    y: coordenadaY(ponto.valor),
    dia: ponto.dia,
  }));

  const linha = pontos
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const baseY = coordenadaY(0);
  const area = `${linha} L ${pontos[pontos.length - 1].x.toFixed(1)} ${baseY.toFixed(1)} L ${pontos[0].x.toFixed(1)} ${baseY.toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="mt-4 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="gradienteVacinas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Linhas de grade horizontais */}
      {LINHAS_GRADE.map((valor) => (
        <g key={valor}>
          <line
            x1={CHART_PADDING.left}
            x2={CHART_WIDTH - CHART_PADDING.right}
            y1={coordenadaY(valor)}
            y2={coordenadaY(valor)}
            stroke="#f0f0f0"
            strokeWidth={1}
          />
          <text
            x={CHART_PADDING.left - 8}
            y={coordenadaY(valor) + 4}
            textAnchor="end"
            className="fill-gray-400 text-[11px]"
          >
            {valor}
          </text>
        </g>
      ))}

      {/* Área preenchida */}
      <path d={area} fill="url(#gradienteVacinas)" />

      {/* Linha do gráfico */}
      <path d={linha} fill="none" stroke="#10b981" strokeWidth={2.5} />

      {/* Pontos e labels do eixo X */}
      {pontos.map((p) => (
        <g key={p.dia}>
          <circle cx={p.x} cy={p.y} r={3.5} fill="#10b981" />
          <text
            x={p.x}
            y={CHART_HEIGHT - CHART_PADDING.bottom + 16}
            textAnchor="end"
            className="fill-gray-400 text-[10px]"
            transform={`rotate(-45 ${p.x} ${CHART_HEIGHT - CHART_PADDING.bottom + 16})`}
          >
            {p.dia}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Dashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Olá, Carla!</h1>
      <p className="mt-0.5 text-sm text-gray-500">
        Acompanhe os indicadores estratégicos da sua região em tempo real.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {indicadores.map((indicador) => (
          <div
            key={indicador.id}
            className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${indicador.corFundoIcone} ${indicador.corIcone}`}
              >
                {indicador.icone}
              </div>
              <p className="text-sm leading-tight text-gray-500">{indicador.label}</p>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900">{indicador.valor}</p>

              {indicador.tendencia && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  <RiseOutlined />
                  {indicador.tendencia}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Vacinas entregues por dia</h2>
            <p className="text-sm text-gray-500">Janela de Maio</p>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <RiseOutlined />
            +8.4% vs. mês anterior
          </span>
        </div>

        <GraficoVacinasPorDia />
      </div>
    </div>
  );
}

export default Dashboard;