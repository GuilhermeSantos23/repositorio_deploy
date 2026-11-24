import { useState } from 'react';
import { Modal } from 'antd';
import ClinicForm from './ClinicForm';
import SuccessScreen from './SuccessScreen';
import { updateClinic } from '../../../services/clinicService';
import type { Clinic, ClinicFormData } from '../../../types/clinic';

type Step = 'form' | 'success';

interface EditClinicFlowProps {
  clinic: Clinic | null;
  region: string;
  onClose: () => void;
  onUpdated: (clinic: Clinic) => void;
}

/**
 * Fluxo de alteração de clínica privada.
 *
 * A clínica já chega selecionada (clique no ícone de lápis ou na linha da tabela),
 * permitindo abertura instantânea do modal de alteração idêntico a UBSs.
 */
function clinicToFormData(clinic: Clinic): ClinicFormData {
  return {
    name: clinic.name,
    cnpj: clinic.cnpj,
    cep: clinic.cep,
    street: clinic.street,
    number: clinic.number,
    city: clinic.city,
    region: clinic.region,
    phone: clinic.phone,
    email: clinic.email,
    status: clinic.status,
    administratorsCount: clinic.administrators.length,
    administrators: clinic.administrators.map((admin) => ({ ...admin })),
  };
}

function EditClinicFlow({ clinic, region, onClose, onUpdated }: EditClinicFlowProps) {
  const [step, setStep] = useState<Step>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedClinic, setUpdatedClinic] = useState<Clinic | null>(null);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep('form');
      setUpdatedClinic(null);
    }, 250);
  }

  async function handleSubmit(data: ClinicFormData) {
    if (!clinic) return;
    setIsSubmitting(true);
    const result = await updateClinic(clinic.id, data);
    setIsSubmitting(false);
    if (result) {
      setUpdatedClinic(result);
      setStep('success');
    }
  }

  function handleFinish() {
    if (updatedClinic) {
      onUpdated(updatedClinic);
    }
    handleClose();
  }

  return (
    <Modal
      title={step === 'form' ? 'Alterar clínica' : 'Alteração concluída'}
      open={clinic !== null}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={false}
    >
      <div className="pt-2">
        {step === 'form' && clinic && (
          <ClinicForm
            region={region}
            initialData={clinicToFormData(clinic)}
            submitLabel={isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )}

        {step === 'success' && (
          <SuccessScreen message="Clínica alterada com sucesso!" onDone={handleFinish} />
        )}
      </div>
    </Modal>
  );
}

export default EditClinicFlow;
