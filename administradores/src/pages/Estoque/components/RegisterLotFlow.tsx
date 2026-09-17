import { useState } from 'react';
import { Modal } from 'antd';
import LotForm from './LotForm';
import SuccessScreen from './SuccessScreen';
import { createLot } from '../../../services/lotService';
import type { LotFormData, VaccineLot } from '../../../types/lot';

type Step = 'form' | 'success';

interface RegisterLotFlowProps {
  open: boolean;
  onClose: () => void;
  onRegistered: (lot: VaccineLot) => void;
}

function RegisterLotFlow({ open, onClose, onRegistered }: RegisterLotFlowProps) {
  const [step, setStep] = useState<Step>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdLot, setCreatedLot] = useState<VaccineLot | null>(null);

  function handleClose() {
    onClose();
    // Reseta o fluxo após a animação de fechamento do modal.
    setTimeout(() => {
      setStep('form');
      setCreatedLot(null);
    }, 250);
  }

  async function handleSubmit(data: LotFormData) {
    setIsSubmitting(true);
    const lot = await createLot(data);
    setIsSubmitting(false);
    setCreatedLot(lot);
    setStep('success');
  }

  function handleFinish() {
    if (createdLot) {
      onRegistered(createdLot);
    }
    handleClose();
  }

  return (
    <Modal
      title={step === 'form' ? 'Cadastrar Novo Lote' : 'Cadastro concluído'}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      destroyOnClose
      maskClosable={false}
    >
      <div className="pt-2">
        {step === 'form' && (
          <LotForm
            submitLabel={isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )}

        {step === 'success' && (
          <SuccessScreen message="Lote cadastrado com sucesso!" onDone={handleFinish} />
        )}
      </div>
    </Modal>
  );
}

export default RegisterLotFlow;
