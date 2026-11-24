import { useState } from 'react';
import {
  DOSES_POR_ZONA,
  ESCALA_VACINACAO,
  PERIODO_REFERENCIA,
  SERIE_VACINACAO,
  SITUACAO_UNIDADES,
  TOTAL_DOSES_REGIAO,
  UNIDADES_ATIVAS,
  UNIDADES_EXIGEM_ACAO,
  valorDoPeriodo,
  type PeriodoVacinacao,
} from '../../data/mockDashboard';

const PERIODOS: { id: PeriodoVacinacao; label: string }[] = [
  { id: 'mensal', label: 'Mensal' },
  { id: 'quinzena1', label: '1ª quinzena' },
  { id: 'quinzena2', label: '2ª quinzena' },
];

function formatDoses(valor: number): string {
  return valor.toLocaleString('pt-BR');
}

function formatEixoMilhar(valor: number): string {
  if (valor === 0) return '0';
  return `${(valor / 1000).toFixed(1)}k`;
}

function percentual(valor: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
}

function polar(cx: number, cy: number, raio: number, anguloGraus: number) {
  const radianos = (anguloGraus * Math.PI) / 180;
  return {
    x: cx + raio * Math.cos(radianos),
    y: cy + raio * Math.sin(radianos),
  };
}

function caminhoFatia(
  cx: number,
  cy: number,
  raio: number,
  inicio: number,
  fim: number,
): string {
  const pontoInicio = polar(cx, cy, raio, inicio);
  const pontoFim = polar(cx, cy, raio, fim);
  const grande = fim - inicio > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${pontoInicio.x} ${pontoInicio.y} A ${raio} ${raio} 0 ${grande} 1 ${pontoFim.x} ${pontoFim.y} Z`;
}

function angulosDasFatias(fatias: typeof UNIDADES_ATIVAS, total: number) {
  return fatias.reduce<
    { fatia: (typeof UNIDADES_ATIVAS)[number]; inicio: number; fim: number }[]
  >((desenhos, fatia) => {
    const inicio = desenhos.length === 0 ? -90 : desenhos[desenhos.length - 1].fim;
    const varredura = total === 0 ? 0 : (fatia.valor / total) * 360;
    return [...desenhos, { fatia, inicio, fim: inicio + varredura }];
  }, []);
}

function GraficoUnidadesAtivas() {
  const total = UNIDADES_ATIVAS.reduce((soma, fatia) => soma + fatia.valor, 0);
  const cx = 50;
  const cy = 50;
  const raio = 46;
  const fatias = angulosDasFatias(UNIDADES_ATIVAS, total);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 items-center gap-6">
        <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0" role="img" aria-label="Distribuição das unidades ativas">
          {fatias.map(({ fatia, inicio, fim }) => {
            if (fatia.valor <= 0 || total === 0) return null;
            if (fim - inicio >= 359.99) {
              return <circle key={fatia.id} cx={cx} cy={cy} r={raio} fill={fatia.cor} />;
            }
            return <path key={fatia.id} d={caminhoFatia(cx, cy, raio, inicio, fim)} fill={fatia.cor} />;
          })}
        </svg>

        <ul className="flex flex-col gap-3">
          {UNIDADES_ATIVAS.map((fatia) => (
            <li key={fatia.id} className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: fatia.cor }}
                />
                {fatia.label}
              </span>
              <span className="text-gray-500">
                {fatia.valor} · {percentual(fatia.valor, total)}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-auto flex items-baseline justify-end gap-2 pt-4 text-sm text-gray-500">
        Total de unidades ativas
        <span className="text-lg font-bold text-gray-900">{total}</span>
      </p>
    </div>
  );
}

interface PontoGrafico {
  x: number;
  y: number;
  label: string;
}

function caminhoSuave(pontos: PontoGrafico[]): string {
  if (pontos.length === 0) return '';
  if (pontos.length === 1) return `M ${pontos[0].x} ${pontos[0].y}`;

  let caminho = `M ${pontos[0].x} ${pontos[0].y}`;
  for (let indice = 0; indice < pontos.length - 1; indice += 1) {
    const anterior = pontos[indice - 1] ?? pontos[indice];
    const atual = pontos[indice];
    const proximo = pontos[indice + 1];
    const seguinte = pontos[indice + 2] ?? proximo;
    const controle1x = atual.x + (proximo.x - anterior.x) / 6;
    const controle1y = atual.y + (proximo.y - anterior.y) / 6;
    const controle2x = proximo.x - (seguinte.x - atual.x) / 6;
    const controle2y = proximo.y - (seguinte.y - atual.y) / 6;
    caminho += ` C ${controle1x} ${controle1y}, ${controle2x} ${controle2y}, ${proximo.x} ${proximo.y}`;
  }
  return caminho;
}

function GraficoVacinacao({ periodo }: { periodo: PeriodoVacinacao }) {
  const largura = 640;
  const altura = 210;
  const margem = { topo: 12, direita: 8, base: 28, esquerda: 42 };
  const larguraUtil = largura - margem.esquerda - margem.direita;
  const alturaUtil = altura - margem.topo - margem.base;
  const baseY = margem.topo + alturaUtil;

  const pontos: PontoGrafico[] = SERIE_VACINACAO.map((ponto, indice) => {
    const valor = valorDoPeriodo(ponto, periodo);
    const x =
      margem.esquerda +
      (SERIE_VACINACAO.length === 1 ? larguraUtil / 2 : (indice / (SERIE_VACINACAO.length - 1)) * larguraUtil);
    const y = margem.topo + alturaUtil * (1 - valor / ESCALA_VACINACAO.maximo);
    return { x, y, label: ponto.mes };
  });

  const linha = caminhoSuave(pontos);
  const ultimo = pontos[pontos.length - 1];
  const primeiro = pontos[0];
  const area = ultimo && primeiro ? `${linha} L ${ultimo.x} ${baseY} L ${primeiro.x} ${baseY} Z` : '';

  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      className="mt-2 w-full"
      role="img"
      aria-label="Doses aplicadas nos últimos 12 meses"
    >
      <defs>
        <linearGradient id="gradiente-vacinacao-regional" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {ESCALA_VACINACAO.marcas.map((marca) => {
        const y = margem.topo + alturaUtil * (1 - marca / ESCALA_VACINACAO.maximo);
        return (
          <g key={marca}>
            <line
              x1={margem.esquerda}
              x2={largura - margem.direita}
              y1={y}
              y2={y}
              stroke="#eef1f4"
              strokeWidth={1}
            />
            <text x={margem.esquerda - 8} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize={12}>
              {formatEixoMilhar(marca)}
            </text>
          </g>
        );
      })}

      {area && <path d={area} fill="url(#gradiente-vacinacao-regional)" />}
      {linha && <path d={linha} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinejoin="round" />}

      {pontos.map((ponto, indice) => (
        <g key={ponto.label}>
          <circle cx={ponto.x} cy={ponto.y} r={indice === pontos.length - 1 ? 4.5 : 3.2} fill="#22c55e">
            <title>
              {ponto.label}: {formatDoses(valorDoPeriodo(SERIE_VACINACAO[indice], periodo))} doses
            </title>
          </circle>
          <text x={ponto.x} y={altura - 8} textAnchor="middle" fill="#9ca3af" fontSize={12}>
            {ponto.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CardVacinacao() {
  const [periodo, setPeriodo] = useState<PeriodoVacinacao>('mensal');
  const ultimo = SERIE_VACINACAO[SERIE_VACINACAO.length - 1];
  const dosesPeriodo = ultimo ? valorDoPeriodo(ultimo, periodo) : 0;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Vacinação mês a mês</h2>
          <p className="mt-0.5 text-xs text-gray-400">Doses aplicadas · últimos 12 meses</p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-0.5" role="group" aria-label="Período do gráfico">
          {PERIODOS.map((opcao) => {
            const ativo = periodo === opcao.id;
            return (
              <button
                key={opcao.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setPeriodo(opcao.id)}
                className={`rounded-md px-3 py-1 text-xs font-medium ${
                  ativo ? 'bg-emerald-950 text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opcao.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-gray-400">Período</p>
      <p className="mt-0.5 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-gray-800">{PERIODO_REFERENCIA}</span>
        <span className="text-2xl font-bold text-emerald-500">{formatDoses(dosesPeriodo)}</span>
      </p>

      <GraficoVacinacao periodo={periodo} />
    </article>
  );
}

function CardDosesPorRegiao() {
  const maior = Math.max(...DOSES_POR_ZONA.map((zona) => zona.doses), 1);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">Doses por região</h2>
        <p className="text-xs text-gray-400">
          {PERIODO_REFERENCIA} · total de {formatDoses(TOTAL_DOSES_REGIAO)} doses
        </p>
      </div>

      <ul className="mt-5 flex flex-1 flex-col justify-center gap-3">
        {DOSES_POR_ZONA.map((zona) => (
          <li key={zona.zona} className="flex items-center gap-3 text-sm">
            <span className="w-[6.5rem] shrink-0 text-gray-600">{zona.zona}</span>
            <div className="h-2.5 flex-1">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(zona.doses / maior) * 100}%`,
                  backgroundColor: zona.cor,
                }}
              />
            </div>
            <span className="w-12 shrink-0 text-right text-gray-500 tabular-nums">
              {formatDoses(zona.doses)}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CardSituacaoUnidades() {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900">Situação das unidades</h2>
      <p className="mt-0.5 text-xs text-gray-400">UBSs e clínicas privadas</p>

      <div className="mt-5 flex flex-col gap-5">
        {SITUACAO_UNIDADES.map((grupo) => {
          const total = grupo.segmentos.reduce((soma, segmento) => soma + segmento.valor, 0);
          return (
            <div key={grupo.titulo}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800">{grupo.titulo}</span>
                <span className="text-xs text-gray-400">{total} no total</span>
              </div>
              <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
                {grupo.segmentos.map((segmento) =>
                  segmento.valor > 0 && total > 0 ? (
                    <div
                      key={segmento.id}
                      style={{
                        width: `${(segmento.valor / total) * 100}%`,
                        backgroundColor: segmento.cor,
                      }}
                    />
                  ) : null,
                )}
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {grupo.segmentos.map((segmento) => (
                  <li key={segmento.id} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: segmento.cor }}
                    />
                    {segmento.valor} {segmento.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {UNIDADES_EXIGEM_ACAO} unidades exigem ação
      </p>
    </article>
  );
}

function Dashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Olá, Dra. Carla!</h1>
      <p className="mt-1 text-sm text-gray-500">
        Acompanhe os indicadores estratégicos da sua região em tempo real.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Unidades ativas</h2>
          <p className="mt-0.5 text-xs text-gray-400">UBSs + Clínicas Privadas</p>
          <div className="mt-4 flex flex-1 flex-col">
            <GraficoUnidadesAtivas />
          </div>
        </article>

        <CardVacinacao />
        <CardDosesPorRegiao />
        <CardSituacaoUnidades />
      </div>
    </div>
  );
}

export default Dashboard;
