import type { UBSAdministratorFormData, UBSFormData } from '../../../types/ubs';
import { generateTemporaryPassword } from '../../../utils/password';

export function buildEmptyAdministrator(): UBSAdministratorFormData {
  return {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    temporaryPassword: generateTemporaryPassword(),
    login: '',
  };
}

export function buildEmptyFormData(region: string): UBSFormData {
  return {
    name: '',
    code: '',
    address: '',
    city: '',
    region,
    phone: '',
    email: '',
    status: 'operando',
    administratorsCount: 1,
    administrators: [buildEmptyAdministrator()],
  };
}
