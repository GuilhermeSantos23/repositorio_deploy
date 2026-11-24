import type { ClinicAdministratorFormData, ClinicFormData } from '../../../types/clinic';
import { generateTemporaryPassword } from '../../../utils/password';

export function buildEmptyAdministrator(): ClinicAdministratorFormData {
  return {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    temporaryPassword: generateTemporaryPassword(),
    login: '',
  };
}

export function buildEmptyFormData(region: string): ClinicFormData {
  return {
    name: '',
    cnpj: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    region,
    phone: '',
    email: '',
    status: 'operando',
    administratorsCount: 1,
    administrators: [buildEmptyAdministrator()],
  };
}
