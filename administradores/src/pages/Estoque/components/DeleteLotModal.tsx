import { useState } from 'react';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { deleteLot } from '../../../services/lotService';
import type { VaccineLot } from '../../../types/lot';

interface DeleteLotModalProps {
  lot: VaccineLot | null;
  onClose: () => void;
  onDeleted: (lot: VaccineLot) => void;
}

/**
 * Modal de confirmação de exclusão de lote. Mesmo padrão visual e de
 * comportamento de DeleteProfissionalModal (ícone de alerta, título,
 * mensagem, campo de justificativa obrigatório, botões), já que aqui
 * também é preciso pedir um motivo antes de excluir.
 */
function DeleteLotModal({ lot, onClose, onDeleted }: DeleteLotModalProps) {
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setMotivo('');
      setErro(null);
    }, 250);
  }

  async function handleConfirm() {
    if (!lot) return;
    if (!motivo.trim()) {
      setErro('Informe a justificativa para a exclusão.');
      return;
    }

    setIsSubmitting(true);
    const atualizado = await deleteLot(lot.id, motivo.trim());
    setIsSubmitting(false);

    if (atualizado) {
      onDeleted(atualizado);
    }
    handleClose();
  }

  return (
    <Modal
      open={lot !== null}
      onCancel={handleClose}
      footer={null}
      width={480}
      destroyOnClose
      maskClosable={false}
      closable={false}
    >
      {lot && (
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-start gap-3">
            <ExclamationCircleFilled className="mt-0.5 text-xl text-amber-500" />
            <div>
              <h3 className="text-base font-semibold text-gray-900">Excluir Lote</h3>
              <p className="mt-1 text-sm text-gray-600">
                Cuidado! Esta ação irá remover o lote{' '}
                <span className="font-medium text-gray-900">{lot.code}</span> (
                {lot.vaccineName}) do estoque.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Justificativa para a exclusão
            </label>
            <textarea
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                if (erro) setErro(null);
              }}
              rows={3}
              placeholder="Descreva o motivo..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500"
            />
            {erro && <p className="mt-1 text-xs text-red-500">{erro}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default DeleteLotModal;
