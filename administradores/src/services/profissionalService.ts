// Serviço "mockado" de Profissionais (painel de Administradores).
// Segue o mesmo padrão de services/ubsService.ts: funções assíncronas
// (simulando uma chamada de API) que operam sobre um array em memória.
//
// Quando o backend real existir, basta trocar a implementação de cada
// função por uma chamada Axios, mantendo a mesma assinatura — as telas
// não precisam mudar.

import type {
  Profissional,
  ProfissionalFormData,
  ProfissionalOrigem,
  ProfissionalSearchCriterion,
  ProfissionalStatus,
} from '../types/profissional';
import { professionalsMock } from '../mocks/professionals';

const SIMULATED_DELAY_MS = 200;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

// A tela de cadastro NÃO possui campo de CPF (ver escopo do TCC), mas a
// tabela precisa exibi-lo. Para novos cadastros geramos um CPF fictício,
// já que não há integração com backend nesta etapa do projeto.
function generateMockCPF(): string {
  const block = () => Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const digits = () => Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${block()}.${block()}.${block()}-${digits()}`;
}

let nextId = 5;

let profissionais: Profissional[] = professionalsMock.map((prof) => ({ ...prof }));

const cpfById = new Map<string, string>(
  profissionais.map((prof) => [prof.id, generateMockCPF()]),
);

export function getProfissionalCPF(id: string): string {
  return cpfById.get(id) ?? '—';
}

function matchesSearch(prof: Profissional, term: string, criterion: ProfissionalSearchCriterion) {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return true;

  if (criterion === 'administrador') {
    return prof.responsavelNome.toLowerCase().includes(normalized);
  }

  const fullName = `${prof.firstName} ${prof.lastName}`.toLowerCase();
  const cpf = getProfissionalCPF(prof.id).toLowerCase();
  return (
    fullName.includes(normalized) ||
    prof.coren.toLowerCase().includes(normalized) ||
    cpf.includes(normalized)
  );
}

export async function listProfissionais(): Promise<Profissional[]> {
  return delay([...profissionais]);
}

export async function searchProfissionais(
  term: string,
  criterion: ProfissionalSearchCriterion,
): Promise<Profissional[]> {
  return delay(profissionais.filter((prof) => matchesSearch(prof, term, criterion)));
}

export interface ProfissionalStats {
  total: number;
  enfermeiros: number;
  tecnicos: number;
  auxiliares: number;
}

// Profissionais "Bloqueados" (excluídos/demitidos) não entram nos totais,
// pois representam quem deixou de fazer parte do quadro ativo.
export async function getProfissionalStats(): Promise<ProfissionalStats> {
  const ativos = profissionais.filter((prof) => prof.status !== 'bloqueado');
  return delay({
    total: ativos.length,
    enfermeiros: ativos.filter((prof) => prof.cargo === 'enfermeiro').length,
    tecnicos: ativos.filter((prof) => prof.cargo === 'tecnico').length,
    auxiliares: ativos.filter((prof) => prof.cargo === 'auxiliar').length,
  });
}

export interface AdministradorOption {
  id: string;
  nome: string;
}

// Lista, sem repetição, os administradores que já cadastraram ou
// alteraram algum profissional — usada na combo-box de filtro.
export function getAdministradoresCadastrados(lista: Profissional[]): AdministradorOption[] {
  const map = new Map<string, string>();
  lista.forEach((prof) => map.set(prof.responsavelId, prof.responsavelNome));
  return Array.from(map, ([id, nome]) => ({ id, nome }));
}

export async function createProfissional(
  data: ProfissionalFormData,
  responsavelId: string,
  responsavelNome: string,
): Promise<Profissional> {
  const novo: Profissional = {
    id: String(nextId++),
    firstName: data.firstName,
    lastName: data.lastName,
    coren: data.coren,
    cep: data.cep,
    estado: data.estado,
    cidade: data.cidade,
    birthDate: data.birthDate,
    phone: data.phone,
    email: data.email,
    cargo: data.cargo as Profissional['cargo'],
    status: data.status,
    admissionDate: new Date().toISOString().slice(0, 10),
    responsavelId,
    responsavelNome,
    origem: 'cadastro',
  };
  cpfById.set(novo.id, generateMockCPF());
  profissionais = [...profissionais, novo];
  return delay(novo);
}

export async function updateProfissional(
  id: string,
  data: ProfissionalFormData,
  responsavelId: string,
  responsavelNome: string,
): Promise<Profissional | null> {
  let atualizado: Profissional | null = null;

  profissionais = profissionais.map((prof) => {
    if (prof.id !== id) return prof;
    atualizado = {
      ...prof,
      firstName: data.firstName,
      lastName: data.lastName,
      coren: data.coren,
      cep: data.cep,
      estado: data.estado,
      cidade: data.cidade,
      birthDate: data.birthDate,
      phone: data.phone,
      email: data.email,
      cargo: data.cargo as Profissional['cargo'],
      status: data.status,
      responsavelId,
      responsavelNome,
      origem: 'alteracao' as ProfissionalOrigem,
    };
    return atualizado;
  });

  return delay(atualizado);
}

// "Excluir" um profissional não o remove da base: ele passa para o
// status Bloqueado e o motivo informado é armazenado junto ao registro.
export async function demitirProfissional(
  id: string,
  motivo: string,
): Promise<Profissional | null> {
  let atualizado: Profissional | null = null;

  profissionais = profissionais.map((prof) => {
    if (prof.id !== id) return prof;
    atualizado = {
      ...prof,
      status: 'bloqueado' as ProfissionalStatus,
      motivoExclusao: motivo,
    };
    return atualizado;
  });

  return delay(atualizado);
}