import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import type { Campaign } from '../../../types/campaign';
import { formatDateBR } from '../../../utils/date';
import CampaignStatus from '../CampaignStatus/CampaignStatus';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
}

// Card compacto: só o essencial para identificar a campanha e seu prazo.
// Sem imagem e sem local, já que a campanha pertence à unidade do
// administrador logado.
function CampaignCard({ campaign, onEdit }: CampaignCardProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900">{campaign.title}</h3>

        <div className="flex shrink-0 items-center gap-2">
          <CampaignStatus status={campaign.status} />
          <button
            type="button"
            onClick={() => onEdit(campaign)}
            aria-label="Editar campanha"
            title="Editar campanha"
            className="text-gray-400 hover:text-emerald-700"
          >
            <EditOutlined />
          </button>
        </div>
      </div>

      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{campaign.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <CalendarOutlined className="text-gray-400" />
          Publicada: {formatDateBR(campaign.publishedAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarOutlined className="text-gray-400" />
          Encerra: {formatDateBR(campaign.endDate)}
        </span>
      </div>
    </div>
  );
}

export default CampaignCard;