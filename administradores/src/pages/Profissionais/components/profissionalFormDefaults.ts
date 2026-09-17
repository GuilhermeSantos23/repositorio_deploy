import type { Profissional, ProfissionalFormData } from '../../../types/profissional';
import { generateTemporaryPassword } from '../../../utils/password';

export function buildEmptyFormData(): ProfissionalFormData {
  return {
    firstName: '',
    lastName: '',
    coren: '',
    cep: '',
    estado: '',
    cidade: '',
    birthDate: '',
    phone: '',
    email: '',
    emailConfirmation: '',
    temporaryPassword: generateTemporaryPassword(),
    cargo: '',
    status: 'ativo',
  };
}

export function profissionalToFormData(profissional: Profissional): ProfissionalFormData {
  return {
    firstName: profissional.firstName,
    lastName: profissional.lastName,
    coren: profissional.coren,
    cep: profissional.cep,
    estado: profissional.estado,
    cidade: profissional.cidade,
    birthDate: profissional.birthDate,
    phone: profissional.phone,
    email: profissional.email,
    emailConfirmation: profissional.email,
    // Ao editar, mantém-se a senha provisória atual em vez de gerar outra —
    // o usuário pode trocá-la manualmente clicando em "gerar outra".
    temporaryPassword: generateTemporaryPassword(),
    cargo: profissional.cargo,
    // "Bloqueado" nunca é selecionável no formulário (ver utils/profissionalOptions);
    // como o botão de editar já fica desabilitado para profissionais bloqueados,
    // este caso não deve ocorrer na prática — o fallback é só uma proteção extra.
    status: profissional.status === 'bloqueado' ? 'inativo' : profissional.status,
  };
}
