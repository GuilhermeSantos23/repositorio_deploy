import { UserOutlined } from '@ant-design/icons';
import type { Patient } from '../../types/patient';
import { calculateAge } from '../../utils/ageRules';
import { formatAnyDate } from '../../utils/formatDate';
import { DataList, secondaryButton } from './Section';

interface Props {
  patient: Patient;
  /** Versão de uma linha, usada nas etapas seguintes à identificação. */
  compact?: boolean;
  onViewBooklet?: () => void;
  bookletLoading?: boolean;
  onChangeCitizen: () => void;
}

export default function PatientSummary({ patient, compact, onViewBooklet, bookletLoading, onChangeCitizen }: Props) {
  const age = calculateAge(patient.birthDate);
  const actions = (
    <div className="flex flex-wrap gap-2">
      {patient.hasCaderneta && onViewBooklet && (
        <button type="button" onClick={onViewBooklet} disabled={bookletLoading} className={secondaryButton}>
          {bookletLoading ? 'Carregando...' : 'Consultar caderneta'}
        </button>
      )}
      <button type="button" onClick={onChangeCitizen} className={secondaryButton}>
        Trocar cidadão
      </button>
    </div>
  );

  if (compact) {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-5 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{patient.name}</p>
          <p className="text-xs text-gray-600">
            CPF {patient.cpfFormatted} · Nascimento {formatAnyDate(patient.birthDate)} · {age} anos
          </p>
        </div>
        {actions}
      </div>
    );
  }

  const items = patient.hasCaderneta
    ? [
        { label: 'Nome completo', value: patient.name },
        { label: 'CPF', value: patient.cpfFormatted },
        { label: 'Data de nascimento', value: formatAnyDate(patient.birthDate) },
        { label: 'Idade', value: `${age} anos` },
        { label: 'Cartão SUS', value: patient.susCard || 'Não informado' },
        { label: 'Condição sensível', value: patient.sensitiveCondition || 'Não informada' },
      ]
    : [
        { label: 'Nome completo', value: patient.name },
        { label: 'Data de nascimento', value: formatAnyDate(patient.birthDate) },
      ];

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          <UserOutlined />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Cidadão identificado</p>
      </div>
      <DataList items={items} />
      <div className="mt-5 border-t border-gray-100 pt-4">{actions}</div>
    </div>
  );
}
