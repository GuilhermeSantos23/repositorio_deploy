import { useMemo, useState } from 'react';
import { RiseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  CAMPANHAS,
  ESCALA_VACINAS_DIA,
  FUNCIONARIOS,
  JANELA_VACINAS,
  LOTES_EM_ATENCAO,
  STATUS_LOTE_CLASSE,
  STATUS_LOTE_LABEL,
  VACINAS_POR_DIA,
  VARIACAO_MES_ANTERIOR,
  type SegmentoDonut,
} from '../../mocks/dashboard';

function formatDia(dia: number): string {
  return String(dia).padStart(2, '0');
}

interface PontoGrafico {
  x: number;
  y: number;
  dia: number;
  doses: number;
}

function caminhoSuave(pontos: PontoGrafico[]): string {
  if (pontos.length === 0) return '';
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

function GraficoVacinasPorDia() {
  const largura = 640;
  const altura = 230;
  const margem = { topo: 16, direita: 12, base: 28, esquerda: 32 };
  const larguraUtil = largura - margem.esquerda - margem.direita;
  const alturaUtil = altura - margem.topo - margem.base;
  const baseY = margem.topo + alturaUtil;
  const totalPontos = VACINAS_POR_DIA.length;

  const pontos: PontoGrafico[] = VACINAS_POR_DIA.map((ponto, indice) => ({
    x: margem.esquerda + (totalPontos === 1 ? larguraUtil / 2 : (indice / (totalPontos - 1)) * larguraUtil),
    y: margem.topo + alturaUtil * (1 - ponto.doses / ESCALA_VACINAS_DIA.maximo),
    dia: ponto.dia,
    doses: ponto.doses,
  }));

  const linha = caminhoSuave(pontos);
  const primeiro = pontos[0];
  const ultimo = pontos[pontos.length - 1];
  const area = primeiro && ultimo ? `${linha} L ${ultimo.x} ${baseY} L ${primeiro.x} ${baseY} Z` : '';

  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      className="mt-2 w-full"
      role="img"
      aria-label="Vacinas entregues por dia em maio"
    >
      <defs>
        <linearGradient id="gradiente-vacinas-dia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {ESCALA_VACINAS_DIA.marcas.map((marca) => {
        const y = margem.topo + alturaUtil * (1 - marca / ESCALA_VACINAS_DIA.maximo);
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
              {marca}
            </text>
          </g>
        );
      })}

      {area && <path d={area} fill="url(#gradiente-vacinas-dia)" />}
      {linha && (
        <path d={linha} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      )}

      {pontos.map((ponto) => {
        const destacar = ponto === ultimo;
        const mostrarRotulo = ponto.dia % 2 === 1;
        return (
          <g key={ponto.dia}>
            {destacar && (
              <circle cx={ponto.x} cy={ponto.y} r={5} fill="#22c55e">
                <title>
                  {formatDia(ponto.dia)}/05: {ponto.doses} doses
                </title>
              </circle>
            )}
            {mostrarRotulo && (
              <text x={ponto.x} y={altura - 8} textAnchor="middle" fill="#9ca3af" fontSize={12}>
                {formatDia(ponto.dia)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function CardVacinasPorDia() {
  const total = VACINAS_POR_DIA.reduce((soma, ponto) => soma + ponto.doses, 0);
  const media = VACINAS_POR_DIA.length === 0 ? 0 : Math.round(total / VACINAS_POR_DIA.length);
  const ultimo = VACINAS_POR_DIA[VACINAS_POR_DIA.length - 1];
  const variacao = VARIACAO_MES_ANTERIOR.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">Vacinas entregues por dia</h2>
        <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
          <RiseOutlined />
          +{variacao}% vs. mês anterior
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className="text-gray-400">
          {JANELA_VACINAS} · total {total.toLocaleString('pt-BR')} · média {media}/dia
        </p>
        {ultimo && (
          <p className="font-medium text-emerald-600">
            {formatDia(ultimo.dia)}/05 · {ultimo.doses} doses
          </p>
        )}
      </div>

      <GraficoVacinasPorDia />
    </article>
  );
}

function deslocamentoDosSegmentos(segmentos: SegmentoDonut[], total: number, circunferencia: number) {
  return segmentos.reduce<
    { segmento: SegmentoDonut; deslocamento: number; comprimento: number }[]
  >((desenhos, segmento) => {
    const deslocamento = desenhos.reduce((soma, item) => soma + item.comprimento, 0);
    const comprimento = total === 0 ? 0 : (segmento.valor / total) * circunferencia;
    return [...desenhos, { segmento, deslocamento, comprimento }];
  }, []);
}

function GraficoDonut({
  titulo,
  segmentos,
}: {
  titulo: string;
  segmentos: SegmentoDonut[];
}) {
  const total = segmentos.reduce((soma, segmento) => soma + segmento.valor, 0);
  const raio = 36;
  const circunferencia = 2 * Math.PI * raio;
  const arcos = deslocamentoDosSegmentos(segmentos, total, circunferencia);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900">{titulo}</h2>

      <div className="mt-4 flex flex-1 flex-col items-center justify-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={titulo}>
            <g transform="rotate(-90 50 50)">
              {arcos.map(({ segmento, deslocamento, comprimento }) => {
                if (segmento.valor <= 0 || total === 0) return null;
                return (
                  <circle
                    key={segmento.id}
                    cx={50}
                    cy={50}
                    r={raio}
                    fill="none"
                    stroke={segmento.cor}
                    strokeWidth={13}
                    strokeDasharray={`${comprimento} ${circunferencia - comprimento}`}
                    strokeDashoffset={-deslocamento}
                  />
                );
              })}
            </g>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-900">
            {total}
          </span>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {segmentos.map((segmento) => (
          <li key={segmento.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segmento.cor }}
              />
              {segmento.label}
            </span>
            <span className="font-medium text-gray-700 tabular-nums">{segmento.valor}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function TabelaLotes() {
  const [busca, setBusca] = useState('');
  const termo = busca.trim().toLowerCase();

  const lotesVisiveis = useMemo(
    () =>
      LOTES_EM_ATENCAO.filter((lote) => {
        if (!termo) return true;
        return (
          lote.vacina.toLowerCase().includes(termo) || lote.lote.toLowerCase().includes(termo)
        );
      }),
    [termo],
  );

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Lotes em atenção</h2>
        <div className="relative w-full sm:w-64">
          <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por vacina ou lote..."
            aria-label="Buscar por vacina ou lote"
            className="w-full rounded-lg border border-gray-200 py-1.5 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
              <th className="py-2 pr-3 font-medium">Vacina</th>
              <th className="py-2 pr-3 font-medium">Lote</th>
              <th className="py-2 pr-3 font-medium">Fabricante</th>
              <th className="py-2 pr-3 font-medium">Validade</th>
              <th className="py-2 pr-3 font-medium">Qtde</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {lotesVisiveis.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm text-gray-400">
                  Nenhum lote encontrado.
                </td>
              </tr>
            ) : (
              lotesVisiveis.map((lote) => (
                <tr key={lote.id} className="border-b border-gray-50 last:border-b-0">
                  <td className="py-3 pr-3 text-gray-800">{lote.vacina}</td>
                  <td className="py-3 pr-3 text-gray-600">{lote.lote}</td>
                  <td className="py-3 pr-3 text-gray-600">{lote.fabricante}</td>
                  <td className="py-3 pr-3 text-gray-600">{lote.validade}</td>
                  <td className="py-3 pr-3 text-gray-800 tabular-nums">{lote.quantidade}</td>
                  <td className={`py-3 font-medium ${STATUS_LOTE_CLASSE[lote.status]}`}>
                    {STATUS_LOTE_LABEL[lote.status]}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function Dashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Olá, Carla!</h1>
      <p className="mt-1 text-sm text-gray-500">
        Acompanhe os indicadores estratégicos da sua região em tempo real.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CardVacinasPorDia />
        </div>
        <div className="xl:col-span-2">
          <GraficoDonut titulo="Funcionários" segmentos={FUNCIONARIOS} />
        </div>
        <div className="xl:col-span-3">
          <TabelaLotes />
        </div>
        <div className="xl:col-span-2">
          <GraficoDonut titulo="Campanhas e avisos" segmentos={CAMPANHAS} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
