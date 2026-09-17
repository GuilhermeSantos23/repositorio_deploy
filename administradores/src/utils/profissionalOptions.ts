// Opções e rótulos usados nas combo-boxes da página de Profissionais.
// Segue o mesmo padrão de utils/ubsStatus.ts.

import type { ProfissionalCargo, ProfissionalStatus } from '../types/profissional';

export const CARGO_LABELS: Record<ProfissionalCargo, string> = {
  enfermeiro: 'Enfermeiro (Enf)',
  tecnico: 'Técnico de enfermagem (TE)',
  auxiliar: 'Auxiliar de enfermagem (AE)',
};

// Únicos cargos permitidos no cadastro de Profissionais (ver escopo do TCC).
export const CARGO_OPTIONS: { value: ProfissionalCargo; label: string }[] = [
  { value: 'enfermeiro', label: CARGO_LABELS.enfermeiro },
  { value: 'tecnico', label: CARGO_LABELS.tecnico },
  { value: 'auxiliar', label: CARGO_LABELS.auxiliar },
];

export const PROFISSIONAL_STATUS_LABELS: Record<ProfissionalStatus, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  bloqueado: 'Bloqueado',
};

export const PROFISSIONAL_STATUS_BADGE_CLASSES: Record<ProfissionalStatus, string> = {
  ativo: 'bg-emerald-50 text-emerald-700',
  inativo: 'bg-amber-50 text-amber-700',
  bloqueado: 'bg-red-50 text-red-700',
};

// Opções disponíveis no FORMULÁRIO (Bloqueado nunca é escolhido manualmente:
// ele só é atingido através da exclusão/demissão do profissional).
export const PROFISSIONAL_STATUS_FORM_OPTIONS: { value: ProfissionalStatus; label: string }[] = [
  { value: 'ativo', label: PROFISSIONAL_STATUS_LABELS.ativo },
  { value: 'inativo', label: PROFISSIONAL_STATUS_LABELS.inativo },
];

// Opções disponíveis no FILTRO da listagem (inclui Bloqueado).
export const PROFISSIONAL_STATUS_FILTER_OPTIONS: { value: ProfissionalStatus; label: string }[] = [
  { value: 'ativo', label: PROFISSIONAL_STATUS_LABELS.ativo },
  { value: 'inativo', label: PROFISSIONAL_STATUS_LABELS.inativo },
  { value: 'bloqueado', label: PROFISSIONAL_STATUS_LABELS.bloqueado },
];

// Opções do filtro "Alteração ou cadastro".
export const ORIGEM_FILTER_OPTIONS: { value: 'cadastro' | 'alteracao'; label: string }[] = [
  { value: 'cadastro', label: 'Cadastrado' },
  { value: 'alteracao', label: 'Alterado' },
];

// Lista simples de UFs para o campo "Estado" (mantido como combo-box para
// evitar erros de digitação, sem depender de nenhuma API externa de CEP).
export const UF_OPTIONS: { value: string; label: string }[] = [
  { value: 'AC', label: 'AC' }, { value: 'AL', label: 'AL' }, { value: 'AP', label: 'AP' },
  { value: 'AM', label: 'AM' }, { value: 'BA', label: 'BA' }, { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' }, { value: 'ES', label: 'ES' }, { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' }, { value: 'MT', label: 'MT' }, { value: 'MS', label: 'MS' },
  { value: 'MG', label: 'MG' }, { value: 'PA', label: 'PA' }, { value: 'PB', label: 'PB' },
  { value: 'PR', label: 'PR' }, { value: 'PE', label: 'PE' }, { value: 'PI', label: 'PI' },
  { value: 'RJ', label: 'RJ' }, { value: 'RN', label: 'RN' }, { value: 'RS', label: 'RS' },
  { value: 'RO', label: 'RO' }, { value: 'RR', label: 'RR' }, { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' }, { value: 'SE', label: 'SE' }, { value: 'TO', label: 'TO' },
];
