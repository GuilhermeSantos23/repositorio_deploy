/**
 * Tipos do módulo Clínicas Privadas.
 *
 * Modelados para refletir o que futuramente virá do backend
 * (POST/GET/PUT /clinicas). Enquanto não existe API real, os dados
 * são fornecidos por src/services/clinicService.ts (mock).
 */

export type ClinicStatus =
  | 'operando'
  | 'interditada'
  | 'fechada'
  | 'operacoes_encerradas';

export interface ClinicAdministrator {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  /** Senha provisória gerada no cadastro. Em produção isso não deve trafegar/exibir livremente. */
  temporaryPassword: string;
  login: string;
}

/** Ação registrada no histórico da clínica (cadastro, alteração, etc.). */
export interface ClinicHistoryEntry {
  id: string;
  action: string;
  /** Administrador responsável pela ação. Futuramente virá do backend/autenticação. */
  performedBy?: string;
  /** Data/hora da ação. Futuramente virá do backend. */
  performedAt?: string;
}

export interface Clinic {
  id: string;
  /** Código oficial da clínica. Hoje é mockado; futuramente é gerado pelo backend. */
  code: string;
  name: string;
  cnpj: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  status: ClinicStatus;
  administrators: ClinicAdministrator[];
  history: ClinicHistoryEntry[];
}

/** Dados de um administrador preenchidos no formulário (sem id ainda). */
export interface ClinicAdministratorFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  temporaryPassword: string;
  login: string;
}

/** Payload do formulário de cadastro/alteração de clínica. */
export interface ClinicFormData {
  name: string;
  cnpj: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  /** Região do administrador regional logado — sempre bloqueada no formulário. */
  region: string;
  phone: string;
  email: string;
  status: ClinicStatus;
  administratorsCount: number;
  administrators: ClinicAdministratorFormData[];
}

export type ClinicSearchCriterion = 'clinic' | 'administrator';
