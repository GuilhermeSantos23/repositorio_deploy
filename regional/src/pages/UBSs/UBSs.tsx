import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import UBSTable from './components/UBSTable';
import RegisterUBSFlow from './components/RegisterUBSFlow';
import EditUBSFlow from './components/EditUBSFlow';
import {
  deleteUBS,
  getUBSStats,
  listUBSs,
  searchUBSs,
} from '../../services/ubsService';
import { UBS_STATUS_OPTIONS } from '../../utils/ubsStatus';
import { CURRENT_REGIONAL_ADMIN } from '../../mocks/session';
import type { UBS, UBSSearchCriterion, UBSStatus } from '../../types/ubs';

interface Stats {
  total: number;
  operando: number;
  interditada: number;
  fechada: number;
  operacoesEncerradas: number;
}

function UBSs() {
  const region = CURRENT_REGIONAL_ADMIN.region;

  const [ubsList, setUBSList] = useState<UBS[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    operando: 0,
    interditada: 0,
    fechada: 0,
    operacoesEncerradas: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriterion, setSearchCriterion] = useState<UBSSearchCriterion>('ubs');
  const [statusFilter, setStatusFilter] = useState<UBSStatus | 'todos'>('todos');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [ubsBeingEdited, setUBSBeingEdited] = useState<UBS | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    const [ubsResult, ubsStats] = await Promise.all([
      searchTerm ? searchUBSs(searchTerm, searchCriterion) : listUBSs(),
      getUBSStats(),
    ]);
    setUBSList(ubsResult);
    setStats(ubsStats);
    setIsLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchCriterion]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  function handleRegistered() {
    setSuccessMessage('UBS cadastrada com sucesso. Administrador notificado.');
    loadData();
  }

  function handleUpdated() {
    setSuccessMessage('UBS alterada com sucesso.');
    loadData();
  }

  function handleDelete(ubs: UBS) {
    Modal.confirm({
      title: 'Excluir UBS',
      content: `Tem certeza que deseja excluir a UBS "${ubs.name}"? Esta ação não pode ser desfeita.`,
      okText: 'Excluir',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        await deleteUBS(ubs.id);
        setSuccessMessage('UBS removida com sucesso.');
        loadData();
      },
    });
  }

  // Filtro de status é aplicado localmente sobre o resultado já
  // pesquisado, mantendo a lógica de pesquisa (por nome/administrador)
  // separada da lógica de filtro, como pedido no escopo da tela.
  const visibleUBSs =
    statusFilter === 'todos' ? ubsList : ubsList.filter((ubs) => ubs.status === statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de UBSs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cadastre, edite e supervisione as unidades públicas da sua região.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          + Cadastrar Nova UBS
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-emerald-700">Operando</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.operando}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-amber-700">Interditada</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.interditada}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Fechada</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.fechada}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Op. encerradas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.operacoesEncerradas}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                searchCriterion === 'ubs'
                  ? 'Pesquisar por nome da UBS...'
                  : 'Pesquisar por nome do administrador...'
              }
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="search-criterion" className="text-sm text-gray-600">
              Pesquisar por:
            </label>
            <select
              id="search-criterion"
              value={searchCriterion}
              onChange={(e) => setSearchCriterion(e.target.value as UBSSearchCriterion)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="ubs">UBS</option>
              <option value="administrator">Administrador</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-gray-400" />
            <label htmlFor="status-filter" className="text-sm text-gray-600">
              Filtrar por:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UBSStatus | 'todos')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="todos">Todos os status</option>
              {UBS_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <UBSTable
          ubsList={visibleUBSs}
          loading={isLoading}
          onEditUBS={setUBSBeingEdited}
          onDeleteUBS={handleDelete}
        />
      </div>

      <RegisterUBSFlow
        open={isRegisterOpen}
        region={region}
        onClose={() => setIsRegisterOpen(false)}
        onRegistered={handleRegistered}
      />

      <EditUBSFlow
        ubs={ubsBeingEdited}
        region={region}
        onClose={() => setUBSBeingEdited(null)}
        onUpdated={handleUpdated}
      />

      {successMessage && (
        <div className="fixed right-6 bottom-6 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <svg
            viewBox="0 0 52 52"
            className="mt-0.5 h-5 w-5 shrink-0"
            fill="none"
            stroke="#059669"
            strokeWidth="4"
          >
            <circle cx="26" cy="26" r="23" />
            <path d="M15 27 L23 35 L38 18" />
          </svg>
          <p className="text-sm text-gray-800">{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default UBSs;
