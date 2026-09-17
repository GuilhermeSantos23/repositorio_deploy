import type { UBSStatus } from '../types/ubs';

export const UBS_STATUS_OPTIONS: { value: UBSStatus; label: string }[] = [
  { value: 'operando', label: 'Operando' },
  { value: 'interditada', label: 'Interditada' },
  { value: 'fechada', label: 'Fechada' },
  { value: 'operacoes_encerradas', label: 'Com operações encerradas' },
];

export const UBS_STATUS_LABELS: Record<UBSStatus, string> = UBS_STATUS_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<UBSStatus, string>,
);

/** Classes Tailwind para um selo de status discreto (sem cores fortes). */
export const UBS_STATUS_BADGE_CLASSES: Record<UBSStatus, string> = {
  operando: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  interditada: 'bg-amber-50 text-amber-700 border border-amber-200',
  fechada: 'bg-gray-200 text-gray-700 border border-gray-300',
  operacoes_encerradas: 'bg-gray-100 text-gray-500 border border-gray-200',
};
