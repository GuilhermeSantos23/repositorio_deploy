import { useMemo, useState } from 'react';
import {
  RiseOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import {
  CAMPANHAS,
  ESCALA_VACINAS_DIA,
  FUNCIONARIOS,
  JANELA_VACINAS,
  LOTES_EM_ATENCAO,
  VACINAS_POR_DIA,
  VARIACAO_MES_ANTERIOR,
  DATA_REFERENCIA_DASHBOARD,
  DATA_REFERENCIA_LOTES,
  calcularGrauAlerta,
  obterTipoAlerta,
  type GrauAlerta,
  type LoteEmAtencao,
  type TipoAlertaLote,
  type SegmentoDonut,
} from '../../mocks/mockDashboard';

function formatDia(dia: number): string {
  return String(dia).padStart(2, '0');
}

function converterData(data: string): Date | null {
  const valor = data.trim();
  const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const iso = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  let dia: number;
  let mes: number;
  let ano: number;

  if (brasileira) {
    dia = Number(brasileira[1]);
    mes = Number(brasileira[2]);
    ano = Number(brasileira[3]);
  } else if (iso) {
    ano = Number(iso[1]);
    mes = Number(iso[2]);
    dia = Number(iso[3]);
  } else {
    return null;
  }

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

function formatarData(data: string): string {
  const dataConvertida = converterData(data);
  if (!dataConvertida) return data;
  return dataConvertida.toLocaleDateString('pt-BR');
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
  const largura = 760;
  const altura = 250;
  const margem = { topo: 16, direita: 14, base: 34, esquerda: 38 };

  const larguraUtil = largura - margem.esquerda - margem.direita;
  const alturaUtil = altura - margem.topo - margem.base;
  const baseY = margem.topo + alturaUtil;
  const totalPontos = VACINAS_POR_DIA.length;

  const pontos: PontoGrafico[] = VACINAS_POR_DIA.map((ponto, indice) => ({
    x:
      margem.esquerda +
      (totalPontos === 1
        ? larguraUtil / 2
        : (indice / (totalPontos - 1)) * larguraUtil),
    y:
      margem.topo +
      alturaUtil * (1 - ponto.doses / ESCALA_VACINAS_DIA.maximo),
    dia: ponto.dia,
    doses: ponto.doses,
  }));

  const linha = caminhoSuave(pontos);
  const primeiro = pontos[0];
  const ultimo = pontos[pontos.length - 1];
  const area =
    primeiro && ultimo
      ? `${linha} L ${ultimo.x} ${baseY} L ${primeiro.x} ${baseY} Z`
      : '';

  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      className="mt-3 w-full"
      role="img"
      aria-label="Vacinas entregues por dia em novembro, do dia 01 ao dia 25"
    >
      <defs>
        <linearGradient
          id="gradiente-vacinas-novembro"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {ESCALA_VACINAS_DIA.marcas.map((marca) => {
        const y =
          margem.topo +
          alturaUtil * (1 - marca / ESCALA_VACINAS_DIA.maximo);

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
            <text
              x={margem.esquerda - 8}
              y={y + 4}
              textAnchor="end"
              fill="#9ca3af"
              fontSize={12}
            >
              {marca}
            </text>
          </g>
        );
      })}

      {area && <path d={area} fill="url(#gradiente-vacinas-novembro)" />}

      {linha && (
        <path
          d={linha}
          fill="none"
          stroke="#22c55e"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {pontos.map((ponto) => {
        const destacar = ponto === ultimo;
        return (
          <g key={ponto.dia}>
            <circle
              cx={ponto.x}
              cy={ponto.y}
              r={destacar ? 4.5 : 2}
              fill={destacar ? '#16a34a' : '#22c55e'}
            >
              <title>
                {formatDia(ponto.dia)}/11: {ponto.doses} doses
              </title>
            </circle>
            <text
              x={ponto.x}
              y={altura - 9}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize={10}
            >
              {formatDia(ponto.dia)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CardVacinasPorDia() {
  const total = VACINAS_POR_DIA.reduce((soma, ponto) => soma + ponto.doses, 0);
  const media =
    VACINAS_POR_DIA.length === 0
      ? 0
      : Math.round(total / VACINAS_POR_DIA.length);
  const ultimo = VACINAS_POR_DIA[VACINAS_POR_DIA.length - 1];

  const variacao = VARIACAO_MES_ANTERIOR.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">
          Vacinas entregues por dia
        </h2>
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
            {formatDia(ultimo.dia)}/11 · {ultimo.doses} doses
          </p>
        )}
      </div>

      <GraficoVacinasPorDia />
    </article>
  );
}

function deslocamentoDosSegmentos(
  segmentos: SegmentoDonut[],
  total: number,
  circunferencia: number,
) {
  let deslocamento = 0;

  return segmentos.map((segmento) => {
    const comprimento =
      total === 0 ? 0 : (segmento.valor / total) * circunferencia;
    const resultado = { segmento, deslocamento, comprimento };
    deslocamento += comprimento;
    return resultado;
  });
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
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            role="img"
            aria-label={titulo}
          >
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
          <li
            key={segmento.id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segmento.cor }}
              />
              {segmento.label}
            </span>
            <span className="font-medium tabular-nums text-gray-700">
              {segmento.valor}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

interface RemessaClassificada {
  remessa: LoteEmAtencao;
  grau: GrauAlerta | null;
  tipo: TipoAlertaLote | null;
  diasParaVencer: number | null;
}

function diferencaEmDias(data: string, referencia: Date): number | null {
  const validade = converterData(data);
  if (!validade) return null;
  return Math.ceil(
    (validade.getTime() - referencia.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function obterDescricaoAlerta(tipo: TipoAlertaLote | null): string {
  switch (tipo) {
    case 'vencimento':
      return 'Vencimento';
    case 'problema_fabricante':
      return 'Problemas com a fabricante';
    case 'estoque_baixo':
      return 'Estoque crítico';
    case 'validade_proxima':
      return 'Validade próxima';
    default:
      return 'Sem alerta';
  }
}

function ModalBaixaRemessa({
  remessa,
  confirmacao,
  onConfirmacaoChange,
  onCancelar,
  onConcluir,
}: {
  remessa: LoteEmAtencao;
  confirmacao: string;
  onConfirmacaoChange: (valor: string) => void;
  onCancelar: () => void;
  onConcluir: () => void;
}) {
  const podeConcluir = confirmacao === 'CONFIRMO';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4"
      role="presentation"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCancelar();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-baixa"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 id="titulo-modal-baixa" className="text-lg font-bold text-gray-900">
                Confirmar baixa de estoque
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Esta ação exige confirmação explícita.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            aria-label="Fechar"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <CloseOutlined />
          </button>
        </div>

        <p className="mt-5 text-sm leading-6 text-gray-600 text-justify">
          Ao confirmar, você declara que retirou a remessa do estoque da unidade.
          A remessa deixará de ficar disponível para movimentações e aplicações.
          Verifique os dados antes de continuar.
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-gray-500">Vacina</dt>
            <dd className="mt-1 font-semibold text-gray-900">{remessa.vacina}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Lote do fabricante</dt>
            <dd className="mt-1 font-semibold text-gray-900">{remessa.lote}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Remessa da unidade</dt>
            <dd className="mt-1 font-semibold text-gray-900">{remessa.remessa}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Quantidade registrada</dt>
            <dd className="mt-1 font-semibold text-gray-900">{remessa.quantidade} doses</dd>
          </div>
        </dl>

        <label
          htmlFor="confirmacao-baixa"
          className="mt-5 block text-sm font-semibold text-gray-800"
        >
          Para habilitar a baixa, digite CONFIRMO
        </label>
        <input
          id="confirmacao-baixa"
          type="text"
          autoComplete="off"
          value={confirmacao}
          onChange={(evento) => onConfirmacaoChange(evento.target.value)}
          placeholder="Digite CONFIRMO"
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        />

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!podeConcluir}
            onClick={onConcluir}
            className="rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Confirmar baixa da remessa
          </button>
        </div>
      </section>
    </div>
  );
}

function LinhaRemessaCritica({
  item,
  onBaixa,
}: {
  item: RemessaClassificada;
  onBaixa: (remessa: LoteEmAtencao) => void;
}) {
  const { remessa, tipo } = item;
  const titulo = obterDescricaoAlerta(tipo);

  return (
    <article className="grid grid-cols-1 items-center gap-3 border-b border-gray-100 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto] md:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-red-600">{titulo}</p>
          <p className="mt-1 truncate text-sm font-semibold text-gray-900">
            {remessa.vacina} do lote {remessa.lote}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            Remessa {remessa.remessa} · {remessa.unidade}
          </p>
        </div>
      </div>

      <div className="pl-[52px] md:pl-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Fabricante</p>
        <p className="mt-1 text-sm text-gray-700">{remessa.fabricante}</p>
      </div>

      <div className="pl-[52px] md:pl-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Validade</p>
        <p className="mt-1 text-sm font-semibold text-red-600">{formatarData(remessa.validade)}</p>
      </div>

      <div className="pl-[52px] md:pl-0">
        <button
          type="button"
          onClick={() => onBaixa(remessa)}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label={`Baixar remessa ${remessa.remessa} do lote ${remessa.lote}`}
        >
          Baixar estoque
        </button>
      </div>
    </article>
  );
}

function LinhaRemessaAtencao({ item }: { item: RemessaClassificada }) {
  const { remessa, tipo, diasParaVencer } = item;

  return (
    <article className="grid grid-cols-1 items-center gap-3 border-b border-gray-100 py-4 last:border-b-0 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto] md:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{remessa.vacina}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Lote {remessa.lote} · Remessa {remessa.remessa}
          </p>
        </div>
      </div>

      <div className="pl-5 md:pl-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Validade</p>
        <p className="mt-1 text-sm font-medium text-gray-700">{formatarData(remessa.validade)}</p>
        {diasParaVencer !== null && diasParaVencer >= 0 && (
          <p className="mt-0.5 text-xs text-gray-500">
            {diasParaVencer === 0 ? 'Vence hoje' : `${diasParaVencer} dias restantes`}
          </p>
        )}
      </div>

      <div className="pl-5 md:pl-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Estoque</p>
        <p className="mt-1 text-sm font-medium text-gray-700">{remessa.quantidade} doses</p>
      </div>

      <div className="pl-5 md:pl-0">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
          {obterDescricaoAlerta(tipo)}
        </span>
      </div>
    </article>
  );
}

function TabelaLotes() {
  const [pagina, setPagina] = useState<1 | 2>(1);
  const [paginaPrioritarios, setPaginaPrioritarios] = useState(1);
  const [paginaAtencao, setPaginaAtencao] = useState(1);
  const [busca, setBusca] = useState('');
  const [remessasBaixadas, setRemessasBaixadas] = useState<string[]>([]);
  const [remessaSelecionada, setRemessaSelecionada] = useState<LoteEmAtencao | null>(null);
  const [confirmacao, setConfirmacao] = useState('');

  // Este mock representa o dashboard da Unidade Central.
  // Na integração, substitua pelo identificador da unidade do usuário autenticado.
  const unidadeDashboard = 'Unidade Central';

  const dataReferencia = useMemo(
    () => converterData(DATA_REFERENCIA_LOTES) ?? new Date(),
    [],
  );

  const remessasDaUnidade = useMemo(
    () => LOTES_EM_ATENCAO.filter((item) => item.unidade === unidadeDashboard),
    [unidadeDashboard],
  );

  const remessasClassificadas = useMemo<RemessaClassificada[]>(
    () =>
      remessasDaUnidade.map((remessa) => ({
        remessa,
        grau: calcularGrauAlerta(remessa, dataReferencia),
        tipo: obterTipoAlerta(remessa, dataReferencia),
        diasParaVencer: diferencaEmDias(remessa.validade, dataReferencia),
      })),
    [remessasDaUnidade, dataReferencia],
  );

  const remessasAtivas = remessasClassificadas.filter(
    ({ remessa }) => !remessasBaixadas.includes(remessa.id),
  );

  const alertasCriticos = remessasAtivas
    .filter((item) => item.grau === 1)
    .sort((a, b) => {
      const prioridadeA = a.tipo === 'vencimento' ? 0 : 1;
      const prioridadeB = b.tipo === 'vencimento' ? 0 : 1;
      return prioridadeA - prioridadeB;
    });

  const alertasAtencao = remessasAtivas.filter((item) => item.grau === 2);
  const totalPaginasPrioritarios = Math.max(1, Math.ceil(alertasCriticos.length / 3));
  const totalPaginasAtencao = Math.max(1, Math.ceil(alertasAtencao.length / 3));
  const paginaPrioritariosAtual = Math.min(paginaPrioritarios, totalPaginasPrioritarios);
  const paginaAtencaoAtual = Math.min(paginaAtencao, totalPaginasAtencao);
  const alertasCriticosPagina = alertasCriticos.slice((paginaPrioritariosAtual - 1) * 3, paginaPrioritariosAtual * 3);
  const alertasAtencaoPagina = alertasAtencao.slice((paginaAtencaoAtual - 1) * 3, paginaAtencaoAtual * 3);

  const termo = busca.trim().toLocaleLowerCase('pt-BR');
  const resultadosBusca = termo
    ? remessasAtivas.filter(({ remessa }) =>
        [
          remessa.vacina,
          remessa.lote,
          remessa.fabricante,
          remessa.remessa,
          remessa.unidade,
        ].some((campo) => campo.toLocaleLowerCase('pt-BR').includes(termo)),
      )
    : [];

  function abrirModalBaixa(remessa: LoteEmAtencao) {
    setRemessaSelecionada(remessa);
    setConfirmacao('');
  }

  function cancelarBaixa() {
    setRemessaSelecionada(null);
    setConfirmacao('');
  }

  function concluirBaixa() {
    if (!remessaSelecionada || confirmacao !== 'CONFIRMO') return;

    // Estado local de demonstração. A integração deverá persistir a baixa no backend.
    setRemessasBaixadas((anteriores) =>
      anteriores.includes(remessaSelecionada.id)
        ? anteriores
        : [...anteriores, remessaSelecionada.id],
    );
    cancelarBaixa();
  }

  return (
    <section className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold tracking-tight text-gray-900">
              Monitoramento de remessas
            </h2>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Acompanhe validade, problemas do fabricante e níveis de estoque da unidade.
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Data de referência dos dados: {DATA_REFERENCIA_LOTES}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <SearchOutlined className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar vacina, lote ou remessa..."
            aria-label="Buscar vacina, lote ou remessa"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {termo ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
            <h3 className="text-sm font-semibold text-gray-800">Resultados da pesquisa</h3>
            <span className="text-xs text-gray-500">
              {resultadosBusca.length} resultado(s) nesta unidade
            </span>
          </div>

          {resultadosBusca.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-gray-700">Nenhuma vacina, lote ou remessa encontrada.</p>
              <p className="mt-1 text-xs text-gray-400">Confira o termo pesquisado e tente novamente.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {resultadosBusca.map(({ remessa, grau, tipo }) => (
                <article
                  key={remessa.id}
                  className="grid grid-cols-1 gap-3 py-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{remessa.vacina}</p>
                    <p className="mt-1 text-xs text-gray-500">Lote {remessa.lote}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Remessa</p>
                    <p className="mt-1 text-sm text-gray-700">{remessa.remessa}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Validade</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">{formatarData(remessa.validade)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        grau === 1
                          ? 'bg-red-50 text-red-700'
                          : grau === 2
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {grau === 1 ? 'Grau 1' : grau === 2 ? 'Grau 2' : 'Regular'}
                    </span>
                    <span className="text-xs text-gray-500">{obterDescricaoAlerta(tipo)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-6 flex gap-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setPagina(1)}
              aria-current={pagina === 1 ? 'page' : undefined}
              className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition ${
                pagina === 1 ? 'text-red-600' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Alertas prioritários
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                pagina === 1 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {alertasCriticos.length}
              </span>
              {pagina === 1 && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-red-500" />}
            </button>

            <button
              type="button"
              onClick={() => setPagina(2)}
              aria-current={pagina === 2 ? 'page' : undefined}
              className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition ${
                pagina === 2 ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Em atenção
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                pagina === 2 ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {alertasAtencao.length}
              </span>
              {pagina === 2 && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-gray-500" />}
            </button>
          </div>

          {pagina === 1 ? (
            <div className="mt-2">
              {alertasCriticos.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckOutlined />
                  </span>
                  <p className="mt-3 text-sm font-medium text-gray-700">Nenhum alerta prioritário pendente.</p>
                  <p className="mt-1 text-xs text-gray-400">Não há remessas vencidas ou com problemas de fabricante nesta unidade.</p>
                </div>
              ) : (
                alertasCriticosPagina.map((item) => (
                  <LinhaRemessaCritica
                    key={item.remessa.id}
                    item={item}
                    onBaixa={abrirModalBaixa}
                  />
                ))
              )}
              {alertasCriticos.length > 3 && (
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span>Exibindo {(paginaPrioritariosAtual - 1) * 3 + 1}–{Math.min(paginaPrioritariosAtual * 3, alertasCriticos.length)} de {alertasCriticos.length} alertas</span>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={paginaPrioritariosAtual === 1} onClick={() => setPaginaPrioritarios((atual) => Math.max(1, atual - 1))} className="rounded-md border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
                    <span>{paginaPrioritariosAtual} / {totalPaginasPrioritarios}</span>
                    <button type="button" disabled={paginaPrioritariosAtual === totalPaginasPrioritarios} onClick={() => setPaginaPrioritarios((atual) => Math.min(totalPaginasPrioritarios, atual + 1))} className="rounded-md border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Próxima</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2">
              {alertasAtencao.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckOutlined />
                  </span>
                  <p className="mt-3 text-sm font-medium text-gray-700">Nenhum alerta de atenção.</p>
                  <p className="mt-1 text-xs text-gray-400">Não há remessas dentro dos limites de atenção nesta unidade.</p>
                </div>
              ) : (
                alertasAtencaoPagina.map((item) => (
                  <LinhaRemessaAtencao key={item.remessa.id} item={item} />
                ))
              )}
              {alertasAtencao.length > 3 && (
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span>Exibindo {(paginaAtencaoAtual - 1) * 3 + 1}–{Math.min(paginaAtencaoAtual * 3, alertasAtencao.length)} de {alertasAtencao.length} alertas</span>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={paginaAtencaoAtual === 1} onClick={() => setPaginaAtencao((atual) => Math.max(1, atual - 1))} className="rounded-md border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
                    <span>{paginaAtencaoAtual} / {totalPaginasAtencao}</span>
                    <button type="button" disabled={paginaAtencaoAtual === totalPaginasAtencao} onClick={() => setPaginaAtencao((atual) => Math.min(totalPaginasAtencao, atual + 1))} className="rounded-md border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Próxima</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-400">
        <span>{remessasAtivas.length} remessa(s) ativa(s) nesta unidade</span>
        <span>Referência: {DATA_REFERENCIA_LOTES}</span>
      </div>

      {remessaSelecionada && (
        <ModalBaixaRemessa
          remessa={remessaSelecionada}
          confirmacao={confirmacao}
          onConfirmacaoChange={setConfirmacao}
          onCancelar={cancelarBaixa}
          onConcluir={concluirBaixa}
        />
      )}
    </section>
  );
}

function Dashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Olá, Carla!</h1>
      <p className="mt-1 text-sm text-gray-500">
        Acompanhe os indicadores e a situação do estoque da sua unidade.
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Dados demonstrativos com referência em {DATA_REFERENCIA_DASHBOARD}.
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
