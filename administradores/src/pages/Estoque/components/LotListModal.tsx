import { Modal } from 'antd';
import StockStatusBadge from './StockStatusBadge';
import { formatDateBR } from '../../../utils/date';
import type { VaccineLot } from '../../../types/lot';

interface LotListModalProps {
  open: boolean;
  title: string;
  description?: string;
  lots: VaccineLot[];
  onClose: () => void;
}

/**
 * Detalhamento clicável dos cards "Vacinas perto do vencimento" e "Vacinas
 * com estoque crítico": lista os lotes específicos daquela condição, em vez
 * de só mostrar o número no card.
 */
function LotListModal({ open, title, description, lots, onClose }: LotListModalProps) {
  return (
    <Modal title={title} open={open} onCancel={onClose} footer={null} width={600} destroyOnClose>
      <div className="pt-2">
        {description && <p className="mb-4 text-sm text-gray-500">{description}</p>}

        {lots.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            Nenhum lote nessa condição no momento.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {lots.map((lot) => (
              <li key={lot.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lot.vaccineName}</p>
                  <p className="text-xs text-gray-500">
                    Lote {lot.code} · {lot.manufacturer} · Validade {formatDateBR(lot.expiresAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">{lot.quantity} un.</span>
                  <StockStatusBadge quantity={lot.quantity} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

export default LotListModal;
