import { useState } from 'react';
import { Modal } from 'antd';
import LotForm from './LotForm';
import SuccessScreen from './SuccessScreen';
import { updateLot } from '../../../services/lotService';
import type { LotFormData, VaccineLot } from '../../../types/lot';

type Step = 'form' | 'success';

interface EditLotFlowProps {
  lot: VaccineLot | null;
  onClose: () => void;
  onUpdated: (lot: VaccineLot) => void;
}

function lotToFormData(lot: VaccineLot): LotFormData {
  return {
    vaccineName: lot.vaccineName,
    manufacturer: lot.manufacturer,
    code: lot.code,
    quantity: String(lot.quantity),
    receivedAt: lot.receivedAt,
    expiresAt: lot.expiresAt,
    attachmentName: lot.attachmentName,
  };
}

function EditLotFlow({ lot, onClose, onUpdated }: EditLotFlowProps) {
  const [step, setStep] = useState<Step>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedLot, setUpdatedLot] = useState<VaccineLot | null>(null);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep('form');
      setUpdatedLot(null);
    }, 250);
  }

  async function handleSubmit(data: LotFormData) {
    if (!lot) return;
    setIsSubmitting(true);
    const result = await updateLot(lot.id, data);
    setIsSubmitting(false);
    if (result) {
      setUpdatedLot(result);
      setStep('success');
    }
  }

  function handleFinish() {
    if (updatedLot) {
      onUpdated(updatedLot);
    }
    handleClose();
  }

  return (
    <Modal
      title={step === 'form' ? 'Alterar Lote' : 'Alteração concluída'}
      open={lot !== null}
      onCancel={handleClose}
      footer={null}
      width={700}
      destroyOnClose
      maskClosable={false}
    >
      <div className="pt-2">
        {step === 'form' && lot && (
          <LotForm
            initialData={lotToFormData(lot)}
            submitLabel={isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )}

        {step === 'success' && (
          <SuccessScreen message="Lote alterado com sucesso!" onDone={handleFinish} />
        )}
      </div>
    </Modal>
  );
}

export default EditLotFlow;
