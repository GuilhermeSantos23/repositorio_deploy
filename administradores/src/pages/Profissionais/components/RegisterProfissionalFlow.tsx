import { useState } from 'react';
import { Modal } from 'antd';
import ProfissionalForm from './ProfissionalForm';
import { buildEmptyFormData } from './profissionalFormDefaults';
import ProfissionalSuccessScreen from './ProfissionalSuccessScreen';
import { createProfissional } from '../../../services/profissionalService';
import type { Profissional, ProfissionalFormData } from '../../../types/profissional';

type Step = 'form' | 'success';

interface RegisterProfissionalFlowProps {
  open: boolean;
  responsavelId: string;
  responsavelNome: string;
  onClose: () => void;
  onRegistered: (profissional: Profissional) => void;
}

function RegisterProfissionalFlow({
  open,
  responsavelId,
  responsavelNome,
  onClose,
  onRegistered,
}: RegisterProfissionalFlowProps) {
  const [step, setStep] = useState<Step>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProfissional, setCreatedProfissional] = useState<Profissional | null>(null);

  function handleClose() {
    onClose();
    // Reseta o fluxo após a animação de fechamento do modal.
    setTimeout(() => {
      setStep('form');
      setCreatedProfissional(null);
    }, 250);
  }

  async function handleSubmit(data: ProfissionalFormData) {
    setIsSubmitting(true);
    const profissional = await createProfissional(data, responsavelId, responsavelNome);
    setIsSubmitting(false);
    setCreatedProfissional(profissional);
    setStep('success');
  }

  function handleFinish() {
    if (createdProfissional) {
      onRegistered(createdProfissional);
    }
    handleClose();
  }

  return (
    <Modal
      title={step === 'form' ? 'Cadastrar Profissional' : 'Cadastro concluído'}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={false}
    >
      <div className="pt-2">
        {step === 'form' && (
          <ProfissionalForm
            responsavelNome={responsavelNome}
            initialData={buildEmptyFormData()}
            submitLabel={isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )}

        {step === 'success' && (
          <ProfissionalSuccessScreen
            message="Profissional cadastrado com sucesso!"
            onDone={handleFinish}
          />
        )}
      </div>
    </Modal>
  );
}

export default RegisterProfissionalFlow;
