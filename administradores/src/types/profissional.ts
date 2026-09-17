// Tipos do domínio "Profissionais" (painel de Administradores).
// Segue o mesmo padrão de organização de types/ubs.ts.

export type ProfissionalCargo = 'enfermeiro' | 'tecnico' | 'auxiliar';

export type ProfissionalStatus = 'ativo' | 'inativo' | 'bloqueado';

// "cadastro" = profissional criado agora; "alteracao" = já existia e foi editado.
export type ProfissionalOrigem = 'cadastro' | 'alteracao';

export type ProfissionalSearchCriterion = 'profissional' | 'administrador';

export interface Profissional {
  id: string;
  firstName: string;
  lastName: string;
  coren: string;
  cep: string;
  estado: string;
  cidade: string;
  birthDate: string;
  phone: string;
  email: string;
  cargo: ProfissionalCargo;
  status: ProfissionalStatus;
  admissionDate: string; // Data de admissão (cadastro), formato ISO (yyyy-mm-dd)
  responsavelId: string; // id do administrador responsável pelo cadastro/alteração
  responsavelNome: string; // nome do administrador (exibido em "Responsável")
  origem: ProfissionalOrigem;
  motivoExclusao?: string;
  // Unidade de origem do profissional no cadastro do app `profissionais/`
  // (mesmo dado de lá, ex.: 'UBS Pimentas'). Não é exibida na tabela nem no
  // formulário do Administradores — existe só para manter a rastreabilidade
  // com o registro compartilhado entre os apps do sistema.
  unit?: string;
}

// Dados manipulados pelo formulário de cadastro/edição.
export interface ProfissionalFormData {
  firstName: string;
  lastName: string;
  coren: string;
  cep: string;
  estado: string;
  cidade: string;
  birthDate: string;
  phone: string;
  email: string;
  emailConfirmation: string;
  temporaryPassword: string;
  cargo: ProfissionalCargo | '';
  status: ProfissionalStatus;
}