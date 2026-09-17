import { useEffect, useState } from 'react';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import ProfissionalTable from './components/ProfissionalTable';
import RegisterProfissionalFlow from './components/RegisterProfissionalFlow';
import EditProfissionalFlow from './components/EditProfissionalFlow';
import DeleteProfissionalModal from './components/DeleteProfissionalModal';
import {
  getAdministradoresCadastrados,
  getProfissionalStats,
  listProfissionais,
  searchProfissionais,
  type AdministradorOption,
  type ProfissionalStats,
} from '../../services/profissionalService';
import {
  ORIGEM_FILTER_OPTIONS,
  PROFISSIONAL_STATUS_FILTER_OPTIONS,
} from '../../utils/profissionalOptions';
// Ajuste este import para a mesma fonte de sessão do Administrador logado
// já usada no restante do painel (ex.: no Header). O nome do export pode
// precisar ser adaptado — aqui assume-se algo equivalente a
// CURRENT_REGIONAL_ADMIN, mas para o perfil de Administrador.
import { CURRENT_UNIT_ADMIN } from '../../mocks/session';
import type { Profissional, ProfissionalOrigem, ProfissionalStatus } from '../../types/profissional';

function Profissionais() {
  const currentAdmin = CURRENT_UNIT_ADMIN;

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [todosProfissionais, setTodosProfissionais] = useState<Profissional[]>([]);
  const [stats, setStats] = useState<ProfissionalStats>({
    total: 0,
    enfermeiros: 0,
    tecnicos: 0,
    auxiliares: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [administradorFilter, setAdministradorFilter] = useState('todos');
  const [origemFilter, setOrigemFilter] = useState<ProfissionalOrigem | 'todos'>('todos');
  const [statusFilter, setStatusFilter] = useState<ProfissionalStatus | 'todos'>('todos');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [profissionalBeingEdited, setProfissionalBeingEdited] = useState<Profissional | null>(null);
  const [profissionalBeingDeleted, setProfissionalBeingDeleted] = useState<Profissional | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    const [resultado, statsAtuais, listaCompleta] = await Promise.all([
      searchTerm ? searchProfissionais(searchTerm, 'profissional') : listProfissionais(),
      getProfissionalStats(),
      listProfissionais(),
    ]);
    setProfissionais(resultado);
    setStats(statsAtuais);
    setTodosProfissionais(listaCompleta);
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
    setSuccessMessage('Profissional cadastrado com sucesso.');
    loadData();
  }

  function handleUpdated() {
    setSuccessMessage('Profissional alterado com sucesso.');
    loadData();
  }

  function handleDeleted() {
    setSuccessMessage('Profissional excluído/demitido com sucesso.');
    loadData();
  }

  // Os 3 filtros (Administrador, Alteração/Cadastro, Status) são aplicados
  // localmente sobre o resultado já pesquisado, do mesmo jeito que UBSs
  // aplica o filtro de status sobre o resultado da pesquisa.
  const profissionaisVisiveis = profissionais.filter((prof) => {
    const combinaAdministrador =
      administradorFilter === 'todos' || prof.responsavelId === administradorFilter;
    const combinaOrigem = origemFilter === 'todos' || prof.origem === origemFilter;
    const combinaStatus = statusFilter === 'todos' || prof.status === statusFilter;
    return combinaAdministrador && combinaOrigem && combinaStatus;
  });

  const administradorOptions: AdministradorOption[] = getAdministradoresCadastrados(
    todosProfissionais,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cadastre, edite e supervisione os profissionais aptos a aplicar doses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          + Cadastrar Profissional
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total de profissionais</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-emerald-700">Enfermeiros</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.enfermeiros}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-emerald-700">Técnicos de enfermagem</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.tecnicos}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-emerald-700">Auxiliares de enfermagem</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.auxiliares}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative flex-1">
            <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, CPF ou COREN..."
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="administrador-filter" className="text-sm text-gray-600">
              Administrador:
            </label>
            <select
              id="administrador-filter"
              value={administradorFilter}
              onChange={(e) => setAdministradorFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="todos">Todos</option>
              {administradorOptions.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="origem-filter" className="text-sm text-gray-600">
              Cadastro/Alteração:
            </label>
            <select
              id="origem-filter"
              value={origemFilter}
              onChange={(e) => setOrigemFilter(e.target.value as ProfissionalOrigem | 'todos')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="todos">Todos</option>
              {ORIGEM_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FilterOutlined className="text-gray-400" />
            <label htmlFor="status-filter" className="text-sm text-gray-600">
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProfissionalStatus | 'todos')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="todos">Todos os status</option>
              {PROFISSIONAL_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ProfissionalTable
          profissionais={profissionaisVisiveis}
          loading={isLoading}
          onEditProfissional={setProfissionalBeingEdited}
          onDeleteProfissional={setProfissionalBeingDeleted}
        />
      </div>

      <RegisterProfissionalFlow
        open={isRegisterOpen}
        responsavelId={currentAdmin.id}
        responsavelNome={currentAdmin.name}
        onClose={() => setIsRegisterOpen(false)}
        onRegistered={handleRegistered}
      />

      <EditProfissionalFlow
        profissional={profissionalBeingEdited}
        responsavelId={currentAdmin.id}
        responsavelNome={currentAdmin.name}
        onClose={() => setProfissionalBeingEdited(null)}
        onUpdated={handleUpdated}
      />

      <DeleteProfissionalModal
        profissional={profissionalBeingDeleted}
        onClose={() => setProfissionalBeingDeleted(null)}
        onDeleted={handleDeleted}
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

export default Profissionais;
