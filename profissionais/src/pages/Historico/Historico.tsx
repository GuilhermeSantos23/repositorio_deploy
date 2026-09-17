import { Tabs, Segmented, Table } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { MOCK_HISTORY, type HistoryEntry } from '../../data/mockHistory';
import { getAllApplications } from '../../services/applicationService';
import { getLots } from '../../services/lotService';

const columns = [
  { title: 'Horário', dataIndex: 'timestamp', key: 'timestamp' },
  { title: 'Ação', dataIndex: 'actionLabel', key: 'actionLabel' },
  { title: 'Detalhes', dataIndex: 'detail', key: 'detail' },
  {
    title: 'Lote',
    dataIndex: 'lotCode',
    key: 'lotCode',
    render: (value?: string) => value || '—',
  },
  { title: 'Paciente', dataIndex: 'patientName', key: 'patientName' },
  { title: 'CPF', dataIndex: 'patientCpf', key: 'patientCpf' },
];

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative mb-4">
      <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-emerald-500"
      />
    </div>
  );
}

function matchesQuery(entry: HistoryEntry, query: string) {
  const q = query.toLowerCase();
  return (
    entry.patientName.toLowerCase().includes(q) ||
    entry.patientCpf.toLowerCase().includes(q) ||
    entry.detail.toLowerCase().includes(q)
  );
}

function formatHistoryDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function getIntegratedHistory(): HistoryEntry[] {
  const applications = getAllApplications();
  // application.lotCode nem sempre vem preenchido nos dados mock/seed
  // (só é setado de fato ao registrar uma aplicação nova, ver
  // applicationService.registerApplication). Por isso o lote é sempre
  // resolvido a partir do lotService (application.lotId → lote), que é a
  // mesma fonte de estoque usada em LoteTab e em Aplicações — o campo
  // application.lotCode só serve de respaldo caso o lote não seja mais
  // encontrado na lista atual.
  const lotById = new Map(getLots().map((lot) => [lot.id, lot]));
  const applicationEntries: HistoryEntry[] = applications.map((application) => {
    const lot = lotById.get(application.lotId);
    const resolvedLotCode = lot?.code ?? application.lotCode;
    return {
      id: application.id,
      action: 'aplicou-dose',
      actionLabel: 'Aplicou dose',
      detail: `${application.vaccineName} · ${application.doseLabel}`,
      lotCode: resolvedLotCode,
      timestamp: formatHistoryDate(application.applicationDate),
      patientName: application.patientName,
      patientCpf: application.patientCpf,
    };
  });

  const mockHistoryWithoutDuplicatedApplications = MOCK_HISTORY.filter((entry) => {
    if (entry.action !== 'aplicou-dose') return true;
    return !applications.some(
      (application) =>
        application.patientCpf === entry.patientCpf &&
        entry.detail.toLowerCase().includes(application.vaccineName.toLowerCase()) &&
        entry.detail.toLowerCase().includes(application.doseLabel.toLowerCase()),
    );
  });

  return [...applicationEntries, ...mockHistoryWithoutDuplicatedApplications];
}

function RegistrosTab() {
  const [query, setQuery] = useState('');
  const history = useMemo(getIntegratedHistory, []);
  const data = history.filter((entry) => matchesQuery(entry, query));

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Buscar por paciente, CPF ou vacina" />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        pagination={false}
      />
    </div>
  );
}

function AplicacoesTab() {
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<'todas' | 'registradas' | 'alteradas'>('todas');
  const history = useMemo(getIntegratedHistory, []);

  const data = history.filter((entry) => {
    const isAplicacao = entry.action === 'aplicou-dose' || entry.action === 'alterou-aplicacao';
    if (!isAplicacao) return false;
    if (filtro === 'registradas' && entry.action !== 'aplicou-dose') return false;
    if (filtro === 'alteradas' && entry.action !== 'alterou-aplicacao') return false;
    return matchesQuery(entry, query);
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBox value={query} onChange={setQuery} placeholder="Buscar por paciente, CPF ou vacina" />
        </div>
        <Segmented
          value={filtro}
          onChange={(value) => setFiltro(value as typeof filtro)}
          options={[
            { label: 'Todas', value: 'todas' },
            { label: 'Registradas', value: 'registradas' },
            { label: 'Alteradas', value: 'alteradas' },
          ]}
        />
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" size="small" pagination={false} />
    </div>
  );
}

function PacientesTab() {
  const [query, setQuery] = useState('');
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const history = useMemo(getIntegratedHistory, []);

  const pacientesUnicos = Array.from(
    new Map(
      history.filter((entry) => entry.patientCpf !== '—').map((entry) => [
        entry.patientCpf,
        entry,
      ]),
    ).values(),
  ).filter((entry) => matchesQuery(entry, query));

  const historicoPaciente = selecionado
    ? history.filter((entry) => entry.patientCpf === selecionado)
    : [];

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Buscar por paciente, CPF ou vacina" />

      <ul className="flex flex-col gap-2">
        {pacientesUnicos.map((paciente) => (
          <li key={paciente.patientCpf}>
            <button
              type="button"
              onClick={() =>
                setSelecionado(
                  selecionado === paciente.patientCpf ? null : paciente.patientCpf,
                )
              }
              className="flex w-full items-center justify-between rounded-lg border border-gray-100 p-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <UserOutlined />
                </span>
                <div>
                  <p className="font-medium text-gray-900">{paciente.patientName}</p>
                  <p className="text-sm text-gray-500">
                    {paciente.actionLabel} · {paciente.timestamp}
                  </p>
                </div>
              </div>
              <span className="text-gray-400">{selecionado === paciente.patientCpf ? '−' : '+'}</span>
            </button>

            {selecionado === paciente.patientCpf && (
              <div className="mt-2 ml-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <Table
                  columns={columns.filter((c) => c.key !== 'patientName' && c.key !== 'patientCpf')}
                  dataSource={historicoPaciente}
                  rowKey="id"
                  size="small"
                  pagination={false}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoteTab() {
  const [query, setQuery] = useState('');
  // Só mostramos os detalhes/rastreabilidade depois que o profissional
  // clica no lote encontrado — a busca sozinha só mostra o resultado.
  const [loteSelecionadoId, setLoteSelecionadoId] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();

  const loteEncontrado = normalizedQuery
    ? getLots().find((lote) => lote.code.toLowerCase().includes(normalizedQuery))
    : undefined;

  // Trocar a pesquisa esconde os detalhes de um lote clicado anteriormente.
  function handleQueryChange(value: string) {
    setQuery(value);
    setLoteSelecionadoId(null);
  }

  const mostrarDetalhes = loteEncontrado && loteSelecionadoId === loteEncontrado.id;
  const applications = getAllApplications();
  const aplicacoesDoLote = mostrarDetalhes
    ? applications.filter((application) => application.lotId === loteEncontrado.id)
    : [];

  return (
    <div>
      <SearchBox value={query} onChange={handleQueryChange} placeholder="Pesquisar lote pelo código" />

      {!loteEncontrado && query.trim() && (
        <p className="text-sm text-gray-500">Nenhum lote encontrado para &quot;{query}&quot;.</p>
      )}

      {loteEncontrado && !mostrarDetalhes && (
        <button
          type="button"
          onClick={() => setLoteSelecionadoId(loteEncontrado.id)}
          className="flex w-full flex-col gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-left transition-colors hover:bg-emerald-100 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Lote localizado</p>
            <p className="mt-1 text-lg font-bold text-emerald-950">{loteEncontrado.code}</p>
            <p className="text-sm text-emerald-800">{loteEncontrado.vaccineName}</p>
          </div>
          <div className="text-sm text-emerald-800 sm:text-right">
            <p>Fabricante: {loteEncontrado.manufacturer}</p>
            <p className="font-medium">
              {loteEncontrado.quantity > 0
                ? `Estoque atual: ${loteEncontrado.quantity} doses`
                : 'Estoque atual: 0 doses (indisponível para novas aplicações)'}
            </p>
            <span className="mt-1 inline-block text-xs font-semibold text-emerald-700 underline">
              Ver detalhes do lote
            </span>
          </div>
        </button>
      )}

      {mostrarDetalhes && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setLoteSelecionadoId(null)}
            className="self-start text-sm font-medium text-emerald-700 hover:underline"
          >
            ← Voltar ao resultado
          </button>

          <div className="flex flex-col gap-3 rounded-lg bg-emerald-950 p-5 text-white sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs tracking-wide text-emerald-300 uppercase">Lote</p>
              <p className="mt-1 text-xl font-bold">{loteEncontrado.code}</p>
              <p className="mt-3 text-sm text-emerald-200">Fabricante</p>
              <p className="text-sm font-medium">{loteEncontrado.manufacturer}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-emerald-200">Vacina</p>
              <p className="text-sm font-medium">{loteEncontrado.vaccineName}</p>
              <p className="mt-2 text-sm text-emerald-200">Estoque atual</p>
              <p className="text-sm font-medium">{loteEncontrado.quantity} doses</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Aplicações realizadas com este lote</h3>
            <p className="mb-3 text-sm text-gray-500">
              Pessoas que receberam uma dose vinculada ao lote {loteEncontrado.code}.
            </p>
            {aplicacoesDoLote.length > 0 ? (
              <ul className="flex flex-col divide-y divide-gray-100">
                {aplicacoesDoLote.map((application) => (
                  <li key={application.id} className="flex flex-col gap-1 py-3 text-sm">
                    <span className="font-medium text-gray-900">{application.patientName}</span>
                    <span className="text-gray-500">
                      {application.applicationDate.split('-').reverse().join('/')}
                    </span>
                    <span className="text-gray-500">
                      {application.professionalName} · CRM {application.professionalCrm}
                    </span>
                    <span className="text-gray-500">{application.unit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma aplicação registrada para este lote.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CadernetaHistoricoTab() {
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<'todas' | 'cadastradas' | 'alteradas'>('todas');
  const history = useMemo(getIntegratedHistory, []);

  const data = history.filter((entry) => {
    const isCaderneta =
      entry.action === 'cadastrou-caderneta' || entry.action === 'alterou-caderneta';
    if (!isCaderneta) return false;
    if (filtro === 'cadastradas' && entry.action !== 'cadastrou-caderneta') return false;
    if (filtro === 'alteradas' && entry.action !== 'alterou-caderneta') return false;
    return matchesQuery(entry, query);
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBox value={query} onChange={setQuery} placeholder="Buscar por paciente, CPF ou vacina" />
        </div>
        <Segmented
          value={filtro}
          onChange={(value) => setFiltro(value as typeof filtro)}
          options={[
            { label: 'Todas', value: 'todas' },
            { label: 'Cadastradas', value: 'cadastradas' },
            { label: 'Alteradas', value: 'alteradas' },
          ]}
        />
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" size="small" pagination={false} />
    </div>
  );
}

const tabItems = [
  { key: 'registros', label: 'Registros', children: <RegistrosTab /> },
  { key: 'aplicacoes', label: 'Aplicações', children: <AplicacoesTab /> },
  { key: 'pacientes', label: 'Pacientes', children: <PacientesTab /> },
  { key: 'lote', label: 'Lote', children: <LoteTab /> },
  { key: 'caderneta', label: 'Caderneta', children: <CadernetaHistoricoTab /> },
];

function Historico() {
  return (
    <div>
      <p className="text-sm text-gray-500">Consulta</p>
      <h1 className="text-2xl font-bold text-gray-800">Histórico</h1>
      <p className="mt-1 text-sm text-gray-500">
        Consulte registros, aplicações, pacientes, lotes e cadernetas da unidade.
      </p>

      <Tabs items={tabItems} className="mt-6" />
    </div>
  );
}

export default Historico;
