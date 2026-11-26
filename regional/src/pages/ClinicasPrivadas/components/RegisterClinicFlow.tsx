import { useState } from 'react';
import { Modal } from 'antd';
import ClinicForm from './ClinicForm';
import { buildEmptyFormData } from './clinicFormDefaults';
import ClinicReviewSummary from './ClinicReviewSummary';
import SuccessScreen from './SuccessScreen';
import { createClinic } from '../../../services/clinicService';
import type { Clinic, ClinicFormData } from '../../../types/clinic';

type Step = 'form' | 'review' | 'success';

interface RegisterClinicFlowProps {
  open: boolean;
  region: string;
  onClose: () => void;
  onRegistered: (clinic: Clinic) => void;
}

function RegisterClinicFlow({
  open,
  region,
  onClose,
  onRegistered,
}: RegisterClinicFlowProps) {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<ClinicFormData>(() =>
    buildEmptyFormData(region),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdClinic, setCreatedClinic] = useState<Clinic | null>(null);

  function handleClose() {
    onClose();
    // Reseta o fluxo após a animação de fechamento do modal.
    setTimeout(() => {
      setStep('form');
      setFormData(buildEmptyFormData(region));
      setCreatedClinic(null);
    }, 250);
  }

  function handleFormContinue(data: ClinicFormData) {
    setFormData(data);
    setStep('review');
  }

  async function handleConfirmRegister() {
    setIsSubmitting(true);
    const clinic = await createClinic(formData);
    setIsSubmitting(false);
    setCreatedClinic(clinic);
    setStep('success');
  }

  function handleFinish() {
    if (createdClinic) {
      onRegistered(createdClinic);
    }
    handleClose();
  }

  const titles: Record<Step, string> = {
    form: 'Cadastrar clínica',
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
          <ClinicForm
            region={region}
            initialData={formData}
            submitLabel="Continuar"
            onSubmit={handleFormContinue}
            onCancel={handleClose}
          />
        )}

        {step === 'review' && (
          <ClinicReviewSummary
            data={formData}
            onBack={() => setStep('form')}
            onConfirm={handleConfirmRegister}
            confirmLabel="Cadastrar"
            isSubmitting={isSubmitting}
          />
        )}

        {step === 'success' && (
          <SuccessScreen
            message="Clínica cadastrada com sucesso!"
            clinicCode={createdClinic?.code}
            onDone={handleFinish}
          />
        )}
      </div>
    </Modal>
  );
}

export default RegisterClinicFlow;
