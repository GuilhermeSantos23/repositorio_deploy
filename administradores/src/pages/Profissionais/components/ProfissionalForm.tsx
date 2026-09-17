import { useState, type FormEvent } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import FormField from '../../../components/form/FormField/FormField';
import SelectField from '../../../components/form/SelectField/SelectField';
import { maskPhone } from '../../../utils/masks';
import { generateTemporaryPassword } from '../../../utils/password';
import {
  CARGO_OPTIONS,
  PROFISSIONAL_STATUS_FORM_OPTIONS,
  UF_OPTIONS,
} from '../../../utils/profissionalOptions';
import { buildEmptyFormData } from './profissionalFormDefaults';
import type { ProfissionalFormData } from '../../../types/profissional';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Máscaras específicas desta tela. Caso o projeto já tenha maskCEP/maskDate
// em utils/masks.ts (usadas no cadastro de Cidadãos), prefira importar de
// lá em vez desta cópia local, para manter uma única fonte de máscaras.
function maskCOREN(value: string): string {
  return value.replace(/\D/g, '').slice(0, 7);
}

function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

interface ProfissionalFormErrors {
  firstName?: string;
  lastName?: string;
  coren?: string;
  cep?: string;
  estado?: string;
  cidade?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  emailConfirmation?: string;
  temporaryPassword?: string;
  cargo?: string;
}

interface ProfissionalFormProps {
  responsavelNome: string;
  initialData?: ProfissionalFormData;
  submitLabel: string;
  onSubmit: (data: ProfissionalFormData) => void;
  onCancel?: () => void;
}

function ProfissionalForm({
  responsavelNome,
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}: ProfissionalFormProps) {
  const [formData, setFormData] = useState<ProfissionalFormData>(
    () => initialData ?? buildEmptyFormData(),
  );
  const [errors, setErrors] = useState<ProfissionalFormErrors>({});

  function updateField<K extends keyof ProfissionalFormData>(
    field: K,
    value: ProfissionalFormData[K],
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function regeneratePassword() {
    setFormData((prev) => ({ ...prev, temporaryPassword: generateTemporaryPassword() }));
  }

  function validate(): boolean {
    const newErrors: ProfissionalFormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório.';

    const corenDigits = formData.coren.replace(/\D/g, '');
    if (!corenDigits) {
      newErrors.coren = 'COREN é obrigatório.';
    } else if (corenDigits.length < 4 || corenDigits.length > 7) {
      newErrors.coren = 'COREN deve ter entre 4 e 7 dígitos.';
    }

    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório.';
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório.';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória.';
    if (!formData.birthDate.trim()) newErrors.birthDate = 'Data de nascimento é obrigatória.';
    if (!formData.phone.trim()) newErrors.phone = 'Contato é obrigatório.';

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      newErrors.email = 'E-mail inválido.';
    }

    if (!formData.emailConfirmation.trim()) {
      newErrors.emailConfirmation = 'Confirmação de e-mail é obrigatória.';
    } else if (formData.emailConfirmation.trim() !== formData.email.trim()) {
      newErrors.emailConfirmation = 'Os e-mails informados não são iguais.';
    }

    if (!formData.temporaryPassword.trim())
      newErrors.temporaryPassword = 'Senha provisória é obrigatória.';
    if (!formData.cargo) newErrors.cargo = 'Cargo é obrigatório.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="First name"
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          error={errors.firstName}
        />
        <FormField
          label="Last name"
          value={formData.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          error={errors.lastName}
        />
        <FormField
          label="COREN"
          inputMode="numeric"
          placeholder="1234567"
          value={formData.coren}
          onChange={(e) => updateField('coren', maskCOREN(e.target.value))}
          error={errors.coren}
        />
        <FormField
          label="CEP"
          inputMode="numeric"
          placeholder="00000-000"
          value={formData.cep}
          onChange={(e) => updateField('cep', maskCEP(e.target.value))}
          error={errors.cep}
        />
        <SelectField
          label="Estado"
          value={formData.estado}
          onChange={(e) => updateField('estado', e.target.value)}
          options={UF_OPTIONS}
          error={errors.estado}
        />
        <FormField
          label="Cidade"
          value={formData.cidade}
          onChange={(e) => updateField('cidade', e.target.value)}
          error={errors.cidade}
        />
        <FormField
          label="Data de nascimento"
          inputMode="numeric"
          placeholder="01/01/2000"
          value={formData.birthDate}
          onChange={(e) => updateField('birthDate', maskDate(e.target.value))}
          error={errors.birthDate}
        />
        <FormField
          label="Contato"
          inputMode="numeric"
          placeholder="(11) 98765-4321"
          value={formData.phone}
          onChange={(e) => updateField('phone', maskPhone(e.target.value))}
          error={errors.phone}
        />
        <FormField
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
        />
        <FormField
          label="Confirmação do e-mail"
          type="email"
          value={formData.emailConfirmation}
          onChange={(e) => updateField('emailConfirmation', e.target.value)}
          error={errors.emailConfirmation}
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-900">
            Senha provisória
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={formData.temporaryPassword}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-900 outline-none"
            />
            <button
              type="button"
              onClick={regeneratePassword}
              title="Gerar nova senha"
              aria-label="Gerar nova senha"
              className="shrink-0 rounded-lg border border-gray-300 px-3 text-gray-600 hover:bg-gray-50"
            >
              <ReloadOutlined />
            </button>
          </div>
          {errors.temporaryPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.temporaryPassword}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Gerada automaticamente. Será enviada ao profissional pelo backend.
          </p>
        </div>
        <SelectField
          label="Cargo"
          value={formData.cargo}
          onChange={(e) => updateField('cargo', e.target.value as ProfissionalFormData['cargo'])}
          options={CARGO_OPTIONS}
          error={errors.cargo}
        />
        <SelectField
          label="Status"
          value={formData.status}
          onChange={(e) =>
            updateField('status', e.target.value as ProfissionalFormData['status'])
          }
          options={PROFISSIONAL_STATUS_FORM_OPTIONS}
        />
        <FormField
          label="Responsável"
          readOnly
          disabled
          value={responsavelNome}
          className="cursor-not-allowed"
          title="O responsável é sempre o administrador logado no momento do cadastro/alteração."
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ProfissionalForm;
