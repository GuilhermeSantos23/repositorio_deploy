import { ReloadOutlined } from '@ant-design/icons';
import FormField from '../../../components/form/FormField/FormField';
import { maskCPF, maskPhone } from '../../../utils/masks';
import type { ClinicAdministratorFormData } from '../../../types/clinic';

export interface AdministratorFieldErrors {
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  temporaryPassword?: string;
  login?: string;
}

interface AdministratorFieldsGroupProps {
  index: number;
  data: ClinicAdministratorFormData;
  errors?: AdministratorFieldErrors;
  onChange: (field: keyof ClinicAdministratorFormData, value: string) => void;
  onRegeneratePassword: () => void;
}

/**
 * Renderiza os campos de UM administrador (Nome, CPF, E-mail, Telefone,
 * Senha provisória, Login). É repetido dinamicamente conforme a
 * "Quantidade de administradores" escolhida no formulário — nunca
 * duplicado manualmente.
 *
 * Login e Senha provisória não são digitados: o Login acompanha o CPF
 * automaticamente e a Senha provisória é gerada por biblioteca, podendo
 * ser regenerada pelo administrador regional.
 */
function AdministratorFieldsGroup({
  index,
  data,
  errors = {},
  onChange,
  onRegeneratePassword,
}: AdministratorFieldsGroupProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="mb-3 text-sm font-semibold text-gray-900">
        Administrador {index + 1}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Nome"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          error={errors.name}
        />
        <FormField
          label="CPF"
          inputMode="numeric"
          placeholder="123.456.789-00"
          value={data.cpf}
          onChange={(e) => onChange('cpf', maskCPF(e.target.value))}
          error={errors.cpf}
        />
        <FormField
          label="E-mail"
          type="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          error={errors.email}
        />
        <FormField
          label="Telefone"
          inputMode="numeric"
          placeholder="(11) 98765-4321"
          value={data.phone}
          onChange={(e) => onChange('phone', maskPhone(e.target.value))}
          error={errors.phone}
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-900">
            Senha provisória
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={data.temporaryPassword}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-900 outline-none"
            />
            <button
              type="button"
              onClick={onRegeneratePassword}
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
            Gerada automaticamente. Será enviada ao administrador pelo backend.
          </p>
        </div>
        <FormField
          label="Login"
          readOnly
          disabled
          value={data.login}
          className="cursor-not-allowed"
          title="O login é sempre o CPF do administrador."
        />
      </div>
    </div>
  );
}

export default AdministratorFieldsGroup;
