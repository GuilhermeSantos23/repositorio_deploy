import { useState } from 'react';
import { Modal } from 'antd';
import UBSForm from './UBSForm';
import { buildEmptyFormData } from './ubsFormDefaults';
import UBSReviewSummary from './UBSReviewSummary';
import SuccessScreen from './SuccessScreen';
import { createUBS } from '../../../services/ubsService';
import type { UBS, UBSFormData } from '../../../types/ubs';

type Step = 'form' | 'review' | 'success';

interface RegisterUBSFlowProps {
  open: boolean;
  region: string;
  onClose: () => void;
  onRegistered: (ubs: UBS) => void;
}

function RegisterUBSFlow({ open, region, onClose, onRegistered }: RegisterUBSFlowProps) {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<UBSFormData>(() => buildEmptyFormData(region));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUBS, setCreatedUBS] = useState<UBS | null>(null);

  function handleClose() {
    onClose();
    // Reseta o fluxo após a animação de fechamento do modal.
    setTimeout(() => {
      setStep('form');
      setFormData(buildEmptyFormData(region));
      setCreatedUBS(null);
    }, 250);
  }

  function handleFormContinue(data: UBSFormData) {
    setFormData(data);
    setStep('review');
  }

  async function handleConfirmRegister() {
    setIsSubmitting(true);
    const ubs = await createUBS(formData);
    setIsSubmitting(false);
    setCreatedUBS(ubs);
    setStep('success');
  }

  function handleFinish() {
    if (createdUBS) {
      onRegistered(createdUBS);
    }
    handleClose();
  }

  const titles: Record<Step, string> = {
    form: 'Cadastrar Nova UBS',
    review: 'Revisão do cadastro',
    success: 'Cadastro concluído',
  };

  return (
    <Modal
      title={titles[step]}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={false}
    >
      <div className="pt-2">
        {step === 'form' && (
          <UBSForm
            region={region}
            initialData={formData}
            submitLabel="Continuar"
            onSubmit={handleFormContinue}
            onCancel={handleClose}
          />
        )}

        {step === 'review' && (
          <UBSReviewSummary
            data={formData}
            onBack={() => setStep('form')}
            onConfirm={handleConfirmRegister}
            confirmLabel="Cadastrar"
            isSubmitting={isSubmitting}
          />
        )}

        {step === 'success' && (
          <SuccessScreen
            message="UBS cadastrada com sucesso!"
            ubsCode={createdUBS?.code}
            onDone={handleFinish}
          />
        )}
      </div>
    </Modal>
  );
}

export default RegisterUBSFlow;
