import { useEffect, useState } from 'react';
import { MedicineBoxOutlined, WarningOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import LotTable from './components/LotTable';
import RegisterLotFlow from './components/RegisterLotFlow';
import EditLotFlow from './components/EditLotFlow';
import DeleteLotModal from './components/DeleteLotModal';
import LotListModal from './components/LotListModal';
import { getStockStats, listLots, searchLots } from '../../services/lotService';
import { STOCK_LEVEL_FILTER_OPTIONS, getStockLevel, isNearExpiration } from '../../utils/stockRules';
import type { StockLevel } from '../../utils/stockRules';
import type { VaccineLot } from '../../types/lot';

interface Stats {
  distributedThisMonth: number;
  nearExpirationCount: number;
  criticalCount: number;
}

type DetailModal = 'near-expiration' | 'critical' | null;

function Estoque() {
  const [lots, setLots] = useState<VaccineLot[]>([]);
  const [stats, setStats] = useState<Stats>({
    distributedThisMonth: 0,
    nearExpirationCount: 0,
    criticalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockLevel | 'todos'>('todos');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [lotBeingEdited, setLotBeingEdited] = useState<VaccineLot | null>(null);
  const [lotBeingDeleted, setLotBeingDeleted] = useState<VaccineLot | null>(null);
  const [detailModal, setDetailModal] = useState<DetailModal>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    const [lotsResult, lotStats] = await Promise.all([
      searchTerm ? searchLots(searchTerm) : listLots(),
      getStockStats(),
    ]);
    setLots(lotsResult);
    setStats(lotStats);
    setIsLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  function handleRegistered() {
    setSuccessMessage('Lote cadastrado com sucesso.');
    loadData();
  }

  function handleUpdated() {
    setSuccessMessage('Lote alterado com sucesso.');
    loadData();
  }

  function handleDeleted() {
    setSuccessMessage('Lote removido do estoque.');
    loadData();
  }

  // Filtro de status é aplicado localmente sobre o resultado já pesquisado,
  // mantendo a lógica de pesquisa (por vacina/lote/fabricante) separada da
  // lógica de filtro — mesmo padrão da tela de UBSs.
  const visibleLots =
    statusFilter === 'todos' ? lots : lots.filter((lot) => getStockLevel(lot.quantity) === statusFilter);

  const nearExpirationLots = lots.filter((lot) => isNearExpiration(lot.expiresAt));
  const criticalLots = lots.filter((lot) => getStockLevel(lot.quantity) === 'critico');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque da Unidade</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitoramento de lotes, validade e distribuição vacinal por região.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          + Adicionar Lote
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <MedicineBoxOutlined />
          </div>
          <div>
            <p className="text-sm text-gray-500">Distribuídas (mês)</p>
            <p className="text-2xl font-bold text-gray-900">{stats.distributedThisMonth}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDetailModal('near-expiration')}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5 text-left hover:border-amber-300"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <WarningOutlined />
          </div>
          <div>
            <p className="text-sm text-gray-500">Vacinas perto do vencimento</p>
            <p className="text-2xl font-bold text-gray-900">{stats.nearExpirationCount}</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setDetailModal('critical')}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5 text-left hover:border-red-300"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <WarningOutlined />
          </div>
          <div>
            <p className="text-sm text-gray-500">Vacinas com estoque crítico</p>
            <p className="text-2xl font-bold text-gray-900">{stats.criticalCount}</p>
          </div>
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por vacina, lote ou fabricante..."
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-gray-400" />
            <label htmlFor="status-filter" className="text-sm whitespace-nowrap text-gray-600">
              Filtrar por:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StockLevel | 'todos')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500 sm:w-auto"
            >
              <option value="todos">Todos os status</option>
              {STOCK_LEVEL_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <LotTable
          lots={visibleLots}
          loading={isLoading}
          onEditLot={setLotBeingEdited}
          onDeleteLot={setLotBeingDeleted}
        />
      </div>

      <RegisterLotFlow
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegistered={handleRegistered}
      />

      <EditLotFlow lot={lotBeingEdited} onClose={() => setLotBeingEdited(null)} onUpdated={handleUpdated} />

      <DeleteLotModal
        lot={lotBeingDeleted}
        onClose={() => setLotBeingDeleted(null)}
        onDeleted={handleDeleted}
      />

      <LotListModal
        open={detailModal === 'near-expiration'}
        title="Vacinas perto do vencimento"
        description="Lotes que vencem nos próximos 30 dias."
        lots={nearExpirationLots}
        onClose={() => setDetailModal(null)}
      />

      <LotListModal
        open={detailModal === 'critical'}
        title="Vacinas com estoque crítico"
        description="Lotes com quantidade abaixo de 50 unidades."
        lots={criticalLots}
        onClose={() => setDetailModal(null)}
      />

      {successMessage && (
        <div className="fixed right-6 bottom-6 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <svg viewBox="0 0 52 52" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="#059669" strokeWidth="4">
            <circle cx="26" cy="26" r="23" />
            <path d="M15 27 L23 35 L38 18" />
          </svg>
          <p className="text-sm text-gray-800">{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Estoque;
