import { useState, type FormEvent } from 'react';
import { Modal } from 'antd';
import FormField from '../../../components/form/FormField/FormField';
import ClinicForm from './ClinicForm';
import SuccessScreen from './SuccessScreen';
import { searchClinics, updateClinic } from '../../../services/clinicService';
import type { Clinic, ClinicFormData } from '../../../types/clinic';
import { readPersonNames } from '../../../utils/personName';

type Step = 'search' | 'result' | 'form' | 'confirm' | 'success';

interface EditClinicFlowProps {
  open: boolean;
  region: string;
  onClose: () => void;
  onUpdated: (clinic: Clinic) => void;
}

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
    administrators: clinic.administrators.map((admin) => {
      const names = readPersonNames(admin);
      return {
        firstName: names.firstName,
        lastName: names.lastName,
        cpf: admin.cpf,
        email: admin.email,
        phone: admin.phone,
        temporaryPassword: admin.temporaryPassword,
        login: admin.login,
      };
    }),
  };
}

function EditClinicFlow({ open, region, onClose, onUpdated }: EditClinicFlowProps) {
  const [step, setStep] = useState<Step>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [formData, setFormData] = useState<ClinicFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedClinic, setUpdatedClinic] = useState<Clinic | null>(null);

  function resetFlow() {
    setStep('search');
    setSearchTerm('');
    setHasSearched(false);
    setResults([]);
    setSelectedClinic(null);
    setFormData(null);
    setUpdatedClinic(null);
  }

  function handleClose() {
    onClose();
    setTimeout(resetFlow, 250);
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSearching(true);
    const found = await searchClinics(searchTerm, 'clinic');
    setResults(found);
    setHasSearched(true);
    setIsSearching(false);
    setStep('result');
  }

  function handleSelectClinic(clinic: Clinic) {
    setSelectedClinic(clinic);
    setFormData(clinicToFormData(clinic));
    setStep('form');
  }

  function handleFormSubmit(data: ClinicFormData) {
    setFormData(data);
    setStep('confirm');
  }

  async function handleConfirmUpdate() {
    if (!selectedClinic || !formData) return;
    setIsSubmitting(true);
    const result = await updateClinic(selectedClinic.id, formData);
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

  const titles: Record<Step, string> = {
    search: 'Alterar clínica',
    result: 'Resultado da pesquisa',
    form: 'Alterar dados da clínica',
    confirm: 'Confirmar alteração',
    success: 'Alteração concluída',
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
        {step === 'search' && (
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Pesquise a clínica que deseja alterar pelo nome.
            </p>
            <FormField
              label="Nome da clínica"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome da clínica"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSearching}
                className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {isSearching ? 'Pesquisando...' : 'Pesquisar'}
              </button>
            </div>
          </form>
        )}

        {step === 'result' && (
          <div className="flex flex-col gap-4">
            {results.length === 0 ? (
              <p className="text-sm text-gray-600">
                Nenhuma clínica encontrada para "{searchTerm}".
              </p>
            ) : (
              results.map((clinic) => (
                <div
                  key={clinic.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="text-base font-semibold text-gray-900">
                    {clinic.name}
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-gray-500">E-mail: </span>
                      {clinic.email}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">Telefone: </span>
                      {clinic.phone}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">CEP: </span>
                      {clinic.cep}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">Administrador: </span>
                      {clinic.administrators.map((admin) => admin.name).join(', ')}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSelectClinic(clinic)}
                      className="rounded-lg bg-emerald-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                      Alterar
                    </button>
                  </div>
                </div>
              ))
            )}
            {hasSearched && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep('search')}
                  className="text-sm text-emerald-700 hover:underline"
                >
                  ← Nova pesquisa
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'form' && formData && (
          <ClinicForm
            region={region}
            initialData={formData}
            submitLabel="Alterar"
            onSubmit={handleFormSubmit}
            onCancel={() => setStep('result')}
          />
        )}

        {step === 'confirm' && (
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-5">
              <p className="text-base font-semibold text-amber-900">
                Atenção: os dados da clínica serão alterados.
              </p>
              <p className="mt-2 text-sm text-amber-800">
                Ao continuar, os dados cadastrados desta unidade serão
                atualizados. Essa é uma ação importante e deve ser realizada
                com cuidado — revise as informações antes de confirmar.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmUpdate}
                disabled={isSubmitting}
                className="rounded-lg bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Alterando...' : 'Continuar'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <SuccessScreen
            message="Clínica alterada com sucesso!"
            onDone={handleFinish}
          />
        )}
      </div>
    </Modal>
  );
}

export default EditClinicFlow;
