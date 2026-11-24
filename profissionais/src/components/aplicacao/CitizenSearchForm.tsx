import { Section, FieldError, FieldLabel, inputClass, primaryButton } from './Section';
import { maskCPF } from '../../utils/masks';
import { getTodayDateString } from '../../utils/dateRules';
import type { CitizenSearchErrors } from '../../utils/applicationRules';

interface Props {
  cpf: string;
  birthDate: string;
  errors: CitizenSearchErrors;
  /** Erro vindo da consulta (CPF não encontrado, data não confere, falha). */
  searchError: string;
  loading: boolean;
  onChange: (values: { cpf: string; birthDate: string }) => void;
  onSubmit: () => void;
}

export default function CitizenSearchForm({ cpf, birthDate, errors, searchError, loading, onChange, onSubmit }: Props) {
  return (
    <Section title="Identificar cidadão">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <p className="mb-4 text-sm text-gray-600">Informe o CPF e a data de nascimento do cidadão atendido.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="busca-cpf" required>CPF</FieldLabel>
            <input
              id="busca-cpf"
              value={cpf}
              onChange={(event) => onChange({ cpf: maskCPF(event.target.value), birthDate })}
              placeholder="000.000.000-00"
              inputMode="numeric"
              aria-invalid={Boolean(errors.cpf)}
              className={inputClass(Boolean(errors.cpf))}
            />
            <FieldError message={errors.cpf} />
          </div>
          <div>
            <FieldLabel htmlFor="busca-nascimento" required>Data de nascimento</FieldLabel>
            <input
              id="busca-nascimento"
              type="date"
              min="1900-01-01"
              max={getTodayDateString()}
              value={birthDate}
              onChange={(event) => onChange({ cpf, birthDate: event.target.value })}
              aria-invalid={Boolean(errors.birthDate)}
              className={inputClass(Boolean(errors.birthDate))}
            />
            <FieldError message={errors.birthDate} />
          </div>
        </div>

        {searchError && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {searchError}
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={loading} className={primaryButton}>
            {loading ? 'Pesquisando...' : 'Pesquisar'}
          </button>
        </div>
      </form>
    </Section>
  );
}
