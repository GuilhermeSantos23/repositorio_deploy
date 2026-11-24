import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import ClinicTable from './components/ClinicTable';
import ClinicDetailModal from './components/ClinicDetailModal';
import RegisterClinicFlow from './components/RegisterClinicFlow';
import EditClinicFlow from './components/EditClinicFlow';
import {
  getClinicStats,
  listClinics,
  searchClinics,
} from '../../services/clinicService';
import { CURRENT_REGIONAL_ADMIN } from '../../mocks/session';
import type { Clinic, ClinicSearchCriterion } from '../../types/clinic';

interface Stats {
  totalClinics: number;
  totalAdministrators: number;
  closedClinics: number;
}

function ClinicasPrivadas() {
  const region = CURRENT_REGIONAL_ADMIN.region;

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalClinics: 0,
    totalAdministrators: 0,
    closedClinics: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriterion, setSearchCriterion] = useState<ClinicSearchCriterion>('clinic');

  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    const [clinicList, clinicStats] = await Promise.all([
      searchTerm ? searchClinics(searchTerm, searchCriterion) : listClinics(),
      getClinicStats(),
    ]);
    setClinics(clinicList);
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
    setSuccessMessage('Clínica cadastrada com sucesso.');
    loadData();
  }

  function handleUpdated(clinic: Clinic) {
    setSuccessMessage('Clínica alterada com sucesso.');
    loadData();
    setSelectedClinic((prev) => (prev?.id === clinic.id ? clinic : prev));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clínicas Privadas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as clínicas privadas conveniadas da região {region}.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Alterar
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Cadastrar clínica
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:underline"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total de unidades cadastradas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.totalClinics}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total de administradores</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {stats.totalAdministrators}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Unidades fechadas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.closedClinics}</p>
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
        </div>

        <ClinicTable
          clinics={clinics}
          loading={isLoading}
          onSelectClinic={setSelectedClinic}
        />
      </div>

      <ClinicDetailModal
        clinic={selectedClinic}
        open={selectedClinic !== null}
        onClose={() => setSelectedClinic(null)}
      />

      <RegisterClinicFlow
        open={isRegisterOpen}
        region={region}
        onClose={() => setIsRegisterOpen(false)}
        onRegistered={handleRegistered}
      />

      <EditClinicFlow
        open={isEditOpen}
        region={region}
        onClose={() => setIsEditOpen(false)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}

export default ClinicasPrivadas;
