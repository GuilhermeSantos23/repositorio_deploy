import type { CampaignStatus as CampaignStatusType } from '../../../types/campaign';

interface CampaignStatusProps {
  status: CampaignStatusType;
}

// Segue o mesmo padrão de "texto colorido em negrito" já usado para status
// em outras telas do sistema (Profissionais, Estoque, Movimentações).
const statusConfig: Record<CampaignStatusType, { label: string; className: string }> = {
  ativa: { label: 'Ativa', className: 'text-emerald-600' },
  agendada: { label: 'Agendada', className: 'text-amber-500' },
  encerrada: { label: 'Encerrada', className: 'text-gray-400' },
};

function CampaignStatus({ status }: CampaignStatusProps) {
  const { label, className } = statusConfig[status];

  return <span className={`text-sm font-semibold ${className}`}>{label}</span>;
}

export default CampaignStatus;
