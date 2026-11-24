import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import ClinicTable from './components/ClinicTable';
import RegisterClinicFlow from './components/RegisterClinicFlow';
import EditClinicFlow from './components/EditClinicFlow';
import {
  deleteClinic,
  getClinicStats,
  listClinics,
  searchClinics,
} from '../../services/clinicService';
import { CLINIC_STATUS_OPTIONS } from '../../utils/clinicStatus';
import { CURRENT_REGIONAL_ADMIN } from '../../mocks/session';
import type { Clinic, ClinicSearchCriterion, ClinicStatus } from '../../types/clinic';

interface Stats {
  total: number;
  operando: number;
  interditada: number;
  fechada: number;
  operacoesEncerradas: number;
}

function ClinicasPrivadas() {
  const region = CURRENT_REGIONAL_ADMIN.region;

  const [clinicList, setClinicList] = useState<Clinic[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    operando: 0,
    interditada: 0,
    fechada: 0,
    operacoesEncerradas: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriterion, setSearchCriterion] = useState<ClinicSearchCriterion>('clinic');
  const [statusFilter, setStatusFilter] = useState<ClinicStatus | 'todos'>('todos');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [clinicBeingEdited, setClinicBeingEdited] = useState<Clinic | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    const [clinicsResult, clinicStats] = await Promise.all([
      searchTerm ? searchClinics(searchTerm, searchCriterion) : listClinics(),
      getClinicStats(),
    ]);
    setClinicList(clinicsResult);
    setStats(clinicStats);
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
    setSuccessMessage('Clínica cadastrada com sucesso. Administrador notificado.');
    loadData();
  }

  function handleUpdated() {
    setSuccessMessage('Clínica alterada com sucesso.');
    loadData();
  }

  function handleDelete(clinic: Clinic) {
    Modal.confirm({
      title: 'Excluir clínica',
      content: `Tem certeza que deseja excluir a clínica "${clinic.name}"? Esta ação não pode ser desfeita.`,
      okText: 'Excluir',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        await deleteClinic(clinic.id);
        setSuccessMessage('Clínica removida com sucesso.');
        loadData();
      },
    });
  }

  const visibleClinics =
    statusFilter === 'todos'
      ? clinicList
      : clinicList.filter((clinic) => clinic.status === statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gerenciamento de Clínicas Privadas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cadastre, edite e supervisione as clínicas privadas conveniadas da sua região.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          + Cadastrar Nova Clínica
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
                searchCriterion === 'clinic'
                  ? 'Pesquisar por nome da clínica...'
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
              onChange={(e) =>
                setSearchCriterion(e.target.value as ClinicSearchCriterion)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="clinic">Clínica</option>
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
              onChange={(e) => setStatusFilter(e.target.value as ClinicStatus | 'todos')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="todos">Todos os status</option>
              {CLINIC_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ClinicTable
          clinics={visibleClinics}
          loading={isLoading}
          onEditClinic={setClinicBeingEdited}
          onDeleteClinic={handleDelete}
        />
      </div>

      <RegisterClinicFlow
        open={isRegisterOpen}
        region={region}
        onClose={() => setIsRegisterOpen(false)}
        onRegistered={handleRegistered}
      />

      <EditClinicFlow
        clinic={clinicBeingEdited}
        region={region}
        onClose={() => setClinicBeingEdited(null)}
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

export default ClinicasPrivadas;
