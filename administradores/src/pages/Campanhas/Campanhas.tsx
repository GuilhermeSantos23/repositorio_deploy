import { useEffect, useState } from 'react';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { Campaign, CampaignFormData, CampaignStatus } from '../../types/campaign';
import { createCampaign, getCampaigns, updateCampaign } from '../../services/campaignServices';
import CampaignCard from '../../components/Campanhas/CampaignCard/CampaignCard';
import CampaignForm from '../../components/Campanhas/CampaignForm/CampaignForm';

type StatusFilter = CampaignStatus | 'todas';

const statusFilterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'ativa', label: 'Ativas' },
  { value: 'agendada', label: 'Agendadas' },
  { value: 'encerrada', label: 'Encerradas' },
];

function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campaign[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');

  const [modalAberto, setModalAberto] = useState(false);
  const [campanhaEmEdicao, setCampanhaEmEdicao] = useState<Campaign | undefined>(undefined);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getCampaigns().then((resultado) => {
      setCampanhas(resultado);
      setCarregando(false);
    });
  }, []);

  // Busca por título e filtro por status (calculado pelas datas) são
  // aplicados juntos sobre a lista já carregada — mesmo padrão da tela
  // de Estoque.
  const campanhasFiltradas = campanhas.filter((campanha) => {
    const termo = busca.trim().toLowerCase();
    const combinaBusca = !termo || campanha.title.toLowerCase().includes(termo);
    const combinaStatus = statusFilter === 'todas' || campanha.status === statusFilter;
    return combinaBusca && combinaStatus;
  });

  function abrirCriacao() {
    setCampanhaEmEdicao(undefined);
    setModalAberto(true);
  }

  function abrirEdicao(campanha: Campaign) {
    setCampanhaEmEdicao(campanha);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setCampanhaEmEdicao(undefined);
  }

  async function handleSubmit(data: CampaignFormData) {
    setSalvando(true);

    const resultado = campanhaEmEdicao
      ? await updateCampaign(campanhaEmEdicao.id, data)
      : await createCampaign(data);

    if (resultado) {
      setCampanhas((atual) => {
        const existe = atual.some((campanha) => campanha.id === resultado.id);
        return existe
          ? atual.map((campanha) => (campanha.id === resultado.id ? resultado : campanha))
          : [resultado, ...atual];
      });
    }

    setSalvando(false);
    fecharModal();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas e Alertas</h1>
          <p className="mt-1 text-sm text-gray-500">Criação e postagem de informativos</p>
        </div>

        <button
          type="button"
          onClick={abrirCriacao}
          className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          + Criar campanha
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar campanha"
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-gray-400" />
            <label htmlFor="campanha-status-filter" className="text-sm whitespace-nowrap text-gray-600">
              Tipo:
            </label>
            <select
              id="campanha-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500 sm:w-auto"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!carregando && campanhasFiltradas.length === 0 && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-8 text-center">
            <p className="font-medium text-gray-700">Nenhuma campanha encontrada.</p>
            <p className="mt-1 text-sm text-gray-400">Tente pesquisar por outro título ou outro filtro.</p>
          </div>
        )}

        {/* No máximo 2 cards por linha, mesmo em telas grandes. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {carregando &&
            [1, 2, 3, 4].map((placeholder) => (
              <div
                key={placeholder}
                className="h-28 animate-pulse rounded-lg border border-gray-100 bg-gray-50"
              />
            ))}

          {!carregando &&
            campanhasFiltradas.map((campanha) => (
              <CampaignCard key={campanha.id} campaign={campanha} onEdit={abrirEdicao} />
            ))}
        </div>
      </div>

      {modalAberto && (
        <CampaignForm
          campaign={campanhaEmEdicao}
          onSubmit={handleSubmit}
          onCancel={fecharModal}
          submitting={salvando}
        />
      )}
    </div>
  );
}

export default Campanhas;