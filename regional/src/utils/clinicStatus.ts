import type { ClinicStatus } from '../types/clinic';

export const CLINIC_STATUS_OPTIONS: { value: ClinicStatus; label: string }[] = [
  { value: 'operando', label: 'Operando' },
  { value: 'interditada', label: 'Interditada' },
  { value: 'fechada', label: 'Fechada' },
  { value: 'operacoes_encerradas', label: 'Com operações encerradas' },
];

export const CLINIC_STATUS_LABELS: Record<ClinicStatus, string> =
  CLINIC_STATUS_OPTIONS.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.label }),
    {} as Record<ClinicStatus, string>,
  );

/** Classes Tailwind para um selo de status discreto (sem cores fortes). */
export const CLINIC_STATUS_BADGE_CLASSES: Record<ClinicStatus, string> = {
  operando: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  interditada: 'bg-amber-50 text-amber-700 border border-amber-200',
  fechada: 'bg-gray-200 text-gray-700 border border-gray-300',
  operacoes_encerradas: 'bg-gray-100 text-gray-500 border border-gray-200',
};
