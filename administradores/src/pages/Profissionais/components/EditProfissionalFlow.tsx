import { useState } from 'react';
import { Modal } from 'antd';
import ProfissionalForm from './ProfissionalForm';
import ProfissionalSuccessScreen from './ProfissionalSuccessScreen';
import { profissionalToFormData } from './profissionalFormDefaults';
import { updateProfissional } from '../../../services/profissionalService';
import type { Profissional, ProfissionalFormData } from '../../../types/profissional';

type Step = 'form' | 'success';

interface EditProfissionalFlowProps {
  profissional: Profissional | null;
  responsavelId: string;
  responsavelNome: string;
  onClose: () => void;
  onUpdated: (profissional: Profissional) => void;
}

/**
 * Fluxo de alteração de um profissional já existente — o mesmo formulário
 * do cadastro é reaproveitado, apenas pré-preenchido, seguindo o mesmo
 * padrão de EditUBSFlow.tsx.
 */
function EditProfissionalFlow({
  profissional,
  responsavelId,
  responsavelNome,
  onClose,
  onUpdated,
}: EditProfissionalFlowProps) {
  const [step, setStep] = useState<Step>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedProfissional, setUpdatedProfissional] = useState<Profissional | null>(null);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep('form');
      setUpdatedProfissional(null);
    }, 250);
  }

  async function handleSubmit(data: ProfissionalFormData) {
    if (!profissional) return;
    setIsSubmitting(true);
    const result = await updateProfissional(profissional.id, data, responsavelId, responsavelNome);
    setIsSubmitting(false);
    if (result) {
      setUpdatedProfissional(result);
      setStep('success');
    }
  }

  function handleFinish() {
    if (updatedProfissional) {
      onUpdated(updatedProfissional);
    }
    handleClose();
  }

  return (
    <Modal
      title={step === 'form' ? 'Alterar Profissional' : 'Alteração concluída'}
      open={profissional !== null}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={false}
    >
      <div className="pt-2">
        {step === 'form' && profissional && (
          <ProfissionalForm
            responsavelNome={responsavelNome}
            initialData={profissionalToFormData(profissional)}
            submitLabel={isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )}

        {step === 'success' && (
          <ProfissionalSuccessScreen message="Profissional alterado com sucesso!" onDone={handleFinish} />
        )}
      </div>
    </Modal>
  );
}

export default EditProfissionalFlow;
