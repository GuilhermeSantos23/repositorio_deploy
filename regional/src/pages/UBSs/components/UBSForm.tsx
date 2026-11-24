import { useState, type FormEvent } from 'react';
import FormField from '../../../components/form/FormField/FormField';
import SelectField from '../../../components/form/SelectField/SelectField';
import AdministratorFieldsGroup, {
  type AdministratorFieldErrors,
} from './AdministratorFieldsGroup';
import { maskPhone, cpfToLogin } from '../../../utils/masks';
import { generateTemporaryPassword } from '../../../utils/password';
import { UBS_STATUS_OPTIONS } from '../../../utils/ubsStatus';
import { buildEmptyAdministrator, buildEmptyFormData } from './ubsFormDefaults';
import type { UBSAdministratorFormData, UBSFormData } from '../../../types/ubs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_ADMINISTRATORS = 1;
const MAX_ADMINISTRATORS = 10;

interface UBSFormErrors {
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  administratorsCount?: string;
  administrators?: AdministratorFieldErrors[];
}

interface UBSFormProps {
  region: string;
  initialData?: UBSFormData;
  submitLabel: string;
  onSubmit: (data: UBSFormData) => void;
  onCancel?: () => void;
}

function UBSForm({ region, initialData, submitLabel, onSubmit, onCancel }: UBSFormProps) {
  const [formData, setFormData] = useState<UBSFormData>(
    () => initialData ?? buildEmptyFormData(region),
  );
  const [errors, setErrors] = useState<UBSFormErrors>({});

  function updateField<K extends keyof UBSFormData>(field: K, value: UBSFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function updateAdministratorsCount(rawValue: string) {
    const count = Math.min(
      MAX_ADMINISTRATORS,
      Math.max(MIN_ADMINISTRATORS, Number(rawValue) || MIN_ADMINISTRATORS),
    );

    setFormData((prev) => {
      const administrators = Array.from({ length: count }, (_, index) => (
        prev.administrators[index]
          ? prev.administrators[index]
          : buildEmptyAdministrator()
      ));
      return { ...prev, administratorsCount: count, administrators };
    });
  }

  function updateAdministratorField(
    index: number,
    field: keyof UBSAdministratorFormData,
    value: string,
  ) {
    setFormData((prev) => {
      const administrators = prev.administrators.map((admin, i) => {
        if (i !== index) return admin;
        // O login nunca é digitado: ele acompanha automaticamente o CPF.
        if (field === 'cpf') {
          return { ...admin, cpf: value, login: cpfToLogin(value) };
        }
        return { ...admin, [field]: value };
      });
      return { ...prev, administrators };
    });
  }

  function regenerateAdministratorPassword(index: number) {
    setFormData((prev) => {
      const administrators = prev.administrators.map((admin, i) =>
        i === index ? { ...admin, temporaryPassword: generateTemporaryPassword() } : admin,
      );
      return { ...prev, administrators };
    });
  }

  function validate(): boolean {
    const newErrors: UBSFormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nome da UBS é obrigatório.';
    if (!formData.code.trim()) newErrors.code = 'Código da unidade é obrigatório.';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório.';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória.';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório.';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      newErrors.email = 'E-mail inválido.';
    }

    if (
      formData.administratorsCount < MIN_ADMINISTRATORS ||
      formData.administratorsCount > MAX_ADMINISTRATORS
    ) {
      newErrors.administratorsCount = `Quantidade deve ser entre ${MIN_ADMINISTRATORS} e ${MAX_ADMINISTRATORS}.`;
    }

    const administratorErrors: AdministratorFieldErrors[] = formData.administrators.map(
      (admin) => {
        const adminErrors: AdministratorFieldErrors = {};
        if (!admin.name.trim()) adminErrors.name = 'Nome é obrigatório.';
        if (!admin.cpf.trim()) adminErrors.cpf = 'CPF é obrigatório.';
        if (!admin.email.trim()) {
          adminErrors.email = 'E-mail é obrigatório.';
        } else if (!EMAIL_PATTERN.test(admin.email.trim())) {
          adminErrors.email = 'E-mail inválido.';
        }
        if (!admin.phone.trim()) adminErrors.phone = 'Telefone é obrigatório.';
        if (!admin.temporaryPassword.trim())
          adminErrors.temporaryPassword = 'Senha provisória é obrigatória.';
        return adminErrors;
      },
    );

    if (administratorErrors.some((adminErrors) => Object.keys(adminErrors).length > 0)) {
      newErrors.administrators = administratorErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, region });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
          Dados da UBS
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Nome da UBS"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={errors.name}
          />
          <FormField
            label="Código da unidade"
            placeholder="UBS-001"
            value={formData.code}
            onChange={(e) => updateField('code', e.target.value)}
            error={errors.code}
          />
          <FormField
            label="Endereço"
            className="sm:col-span-2"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            error={errors.address}
          />
          <FormField
            label="Cidade"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            error={errors.city}
          />
          <FormField
            label="Região"
            value={region}
            readOnly
            disabled
            className="cursor-not-allowed"
          />
          <FormField
            label="Telefone"
            inputMode="numeric"
            placeholder="(11) 3456-7890"
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
          <SelectField
            label="Estado"
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value as UBSFormData['status'])}
            options={UBS_STATUS_OPTIONS}
          />
          <FormField
            label="Quantidade de administradores"
            type="number"
            min={MIN_ADMINISTRATORS}
            max={MAX_ADMINISTRATORS}
            value={formData.administratorsCount}
            onChange={(e) => updateAdministratorsCount(e.target.value)}
            error={errors.administratorsCount}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
          Administradores
        </h3>
        <div className="flex flex-col gap-4">
          {formData.administrators.map((admin, index) => (
            <AdministratorFieldsGroup
              key={index}
              index={index}
              data={admin}
              errors={errors.administrators?.[index]}
              onChange={(field, value) => updateAdministratorField(index, field, value)}
              onRegeneratePassword={() => regenerateAdministratorPassword(index)}
            />
          ))}
        </div>
      </section>

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

export default UBSForm;
