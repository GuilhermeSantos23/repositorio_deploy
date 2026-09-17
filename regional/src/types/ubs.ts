/**
 * Tipos do módulo UBSs (Unidades Básicas de Saúde).
 *
 * Modelados no mesmo espírito de src/types/clinic.ts, porém como uma
 * estrutura própria: UBS não é um tipo de Clinic. Enquanto não existe
 * API real, os dados são fornecidos por src/services/ubsService.ts (mock).
 */

export type UBSStatus =
  | 'operando'
  | 'interditada'
  | 'fechada'
  | 'operacoes_encerradas';

export interface UBSAdministrator {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  /** Senha provisória gerada no cadastro. Em produção isso não deve trafegar/exibir livremente. */
  temporaryPassword: string;
  login: string;
}

/** Ação registrada no histórico da UBS (cadastro, alteração, etc.). */
export interface UBSHistoryEntry {
  id: string;
  action: string;
  /** Administrador responsável pela ação. Futuramente virá do backend/autenticação. */
  performedBy?: string;
  /** Data/hora da ação. Futuramente virá do backend. */
  performedAt?: string;
}

export interface UBS {
  id: string;
  /** Código da unidade, informado no cadastro (ex.: UBS-001). */
  code: string;
  name: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  status: UBSStatus;
  administrators: UBSAdministrator[];
  history: UBSHistoryEntry[];
}

/** Dados do administrador preenchidos no formulário (sem id ainda). */
export interface UBSAdministratorFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  temporaryPassword: string;
  login: string;
}

/** Payload do formulário de cadastro/alteração de UBS. */
export interface UBSFormData {
  name: string;
  code: string;
  address: string;
  city: string;
  /** Região do administrador regional logado — sempre bloqueada no formulário. */
  region: string;
  phone: string;
  email: string;
  status: UBSStatus;
  administratorsCount: number;
  administrators: UBSAdministratorFormData[];
}

export type UBSSearchCriterion = 'ubs' | 'administrator';
