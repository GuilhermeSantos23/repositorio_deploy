import { Select } from 'antd';
import { Section, FieldError, FieldLabel, inputClass } from './Section';
import { getApplicationDateLimits } from '../../utils/dateRules';
import type { ApplicationFormErrors, ApplicationFormValues } from '../../utils/applicationRules';
import type { VaccineLot } from '../../types/lot';
import type { Professional } from '../../types/professional';

interface Props {
  values: ApplicationFormValues;
  errors: ApplicationFormErrors;
  lots: VaccineLot[];
  professionals: Professional[];
  professional: Professional;
  unit: string;
  onChange: (changes: Partial<ApplicationFormValues>) => void;
}

const readOnlyClass = 'flex min-h-[38px] items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700';

export default function ApplicationDataStep({ values, errors, lots, professionals, professional, unit, onChange }: Props) {
  const { min, max } = getApplicationDateLimits();

  return (
    <Section title="Dados da aplicação">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="campo-data" required>Data da aplicação</FieldLabel>
          <input
            id="campo-data"
            type="date"
            min={min}
            max={max}
            value={values.applicationDate}
            onChange={(event) => onChange({ applicationDate: event.target.value })}
            aria-invalid={Boolean(errors.applicationDate)}
            className={inputClass(Boolean(errors.applicationDate))}
          />
          <FieldError message={errors.applicationDate} />
        </div>

        <div>
          <FieldLabel htmlFor="campo-lote" required>Lote</FieldLabel>
          <Select
            id="campo-lote"
            className="w-full"
            status={errors.lotId ? 'error' : undefined}
            placeholder="Selecione o lote"
            value={values.lotId}
            onChange={(lotId) => onChange({ lotId })}
            options={lots.map((lot) => ({
              value: lot.id,
              label: `${lot.code} · ${lot.manufacturer} · ${lot.quantity} doses`,
            }))}
          />
          {lots.length === 0 && <p className="mt-1 text-xs text-red-600">Não há lotes disponíveis para esta vacina.</p>}
          <FieldError message={errors.lotId} />
        </div>

        <div>
          <FieldLabel htmlFor="campo-profissional" required>Profissional responsável</FieldLabel>
          <Select
            id="campo-profissional"
            className="w-full"
            value={professional.id}
            onChange={(professionalId) => onChange({ professionalId })}
            options={professionals.map((item) => ({ value: item.id, label: item.name }))}
          />
          <FieldError message={errors.professionalId} />
        </div>

        <div>
          <FieldLabel>Registro profissional</FieldLabel>
          <div className={readOnlyClass}>{professional.cofen}</div>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel>Unidade de saúde</FieldLabel>
          <div className={readOnlyClass}>{unit}</div>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">Campos marcados com * são obrigatórios.</p>
    </Section>
  );
}
