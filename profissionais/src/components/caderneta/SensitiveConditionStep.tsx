import { Select } from 'antd';
import { Section, FieldError, FieldLabel } from '../aplicacao/Section';
import { SENSITIVE_CONDITIONS, type SensitiveCondition } from '../../types/vaccine';

export type HasCondition = 'sim' | 'nao';

interface Props {
  hasCondition: HasCondition | undefined;
  condition: SensitiveCondition | undefined;
  error?: string;
  onChange: (hasCondition: HasCondition, condition: SensitiveCondition | undefined) => void;
}

/** Deve ser respondida antes de os cards de vacinas serem gerados. */
export default function SensitiveConditionStep({ hasCondition, condition, error, onChange }: Props) {
  return (
    <Section title="Condição sensível">
      <p className="mb-4 text-sm text-gray-600">
        Informe se o cidadão possui condição sensível. Esta resposta é necessária antes de gerar as vacinas previstas.
      </p>
      <fieldset>
        <legend className="sr-only">Possui condição sensível?</legend>
        <div className="flex flex-col gap-2">
          {([['nao', 'Não possui condição sensível'], ['sim', 'Possui condição sensível']] as const).map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50">
              <input
                type="radio"
                name="condicao-sensivel"
                checked={hasCondition === value}
                onChange={() => onChange(value, value === 'sim' ? condition : undefined)}
                className="accent-emerald-700"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {hasCondition === 'sim' && (
        <div className="mt-4 sm:max-w-sm">
          <FieldLabel htmlFor="cad-condicao" required>Condição</FieldLabel>
          <Select
            id="cad-condicao"
            className="w-full"
            placeholder="Selecione a condição"
            value={condition}
            onChange={(value) => onChange('sim', value)}
            options={SENSITIVE_CONDITIONS.map((item) => ({ value: item, label: item }))}
          />
        </div>
      )}
      <FieldError message={error} />
    </Section>
  );
}
