import { useState } from 'react';
import { Modal } from 'antd';
import UBSForm from './UBSForm';
import SuccessScreen from './SuccessScreen';
import { updateUBS } from '../../../services/ubsService';
import type { UBS, UBSFormData } from '../../../types/ubs';

type Step = 'form' | 'success';

interface EditUBSFlowProps {
  ubs: UBS | null;
  region: string;
  onClose: () => void;
  onUpdated: (ubs: UBS) => void;
}

/**
 * Fluxo de alteração de UBS.
 *
 * Diferente de EditClinicFlow (que pesquisa a clínica dentro do modal),
 * aqui a UBS já chega selecionada — o usuário clicou em "Editar" numa
 * linha específica da tabela — então o fluxo é direto: formulário e
 * confirmação de sucesso.
 */
function ubsToFormData(ubs: UBS): UBSFormData {
  return {
    name: ubs.name,
    code: ubs.code,
    address: ubs.address,
    city: ubs.city,
    region: ubs.region,
    phone: ubs.phone,
    email: ubs.email,
    status: ubs.status,
    administratorsCount: ubs.administrators.length,
    administrators: ubs.administrators.map((admin) => ({ ...admin })),
  };
}

function EditUBSFlow({ ubs, region, onClose, onUpdated }: EditUBSFlowProps) {
  const [step, setStep] = useState<Step>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedUBS, setUpdatedUBS] = useState<UBS | null>(null);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep('form');
      setUpdatedUBS(null);
    }, 250);
  }

  async function handleSubmit(data: UBSFormData) {
    if (!ubs) return;
    setIsSubmitting(true);
    const result = await updateUBS(ubs.id, data);
    setIsSubmitting(false);
    if (result) {
      setUpdatedUBS(result);
      setStep('success');
    }
  }

  function handleFinish() {
    if (updatedUBS) {
      onUpdated(updatedUBS);
    }
    handleClose();
  }

  return (
    <Modal
      title={step === 'form' ? 'Alterar UBS' : 'Alteração concluída'}
      open={ubs !== null}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={false}
    >
      <div className="pt-2">
        {step === 'form' && ubs && (
          <UBSForm
            region={region}
            initialData={ubsToFormData(ubs)}
            submitLabel={isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )}

        {step === 'success' && (
          <SuccessScreen message="UBS alterada com sucesso!" onDone={handleFinish} />
        )}
      </div>
    </Modal>
  );
}

export default EditUBSFlow;
