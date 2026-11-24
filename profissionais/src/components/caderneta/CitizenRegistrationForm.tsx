import { Select } from 'antd';
import { Section, FieldError, FieldLabel, inputClass } from '../aplicacao/Section';
import { maskSus } from '../../utils/masks';
import { GENDER_OPTIONS, type CitizenFormErrors, type CitizenFormValues } from '../../utils/citizenRules';
import type { Patient } from '../../types/patient';
import { formatAnyDate } from '../../utils/formatDate';

interface Props {
  patient: Patient;
  values: CitizenFormValues;
  errors: CitizenFormErrors;
  onChange: (changes: Partial<CitizenFormValues>) => void;
}

const lockedClass = 'flex min-h-[38px] items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700';

/** Cadastro do cidadão. Nome, CPF e nascimento vêm da consulta e não podem ser alterados. */
export default function CitizenRegistrationForm({ patient, values, errors, onChange }: Props) {
  return (
    <Section title="Cadastro do cidadão">
      <p className="mb-4 text-sm text-gray-600">
        O cadastro permite vincular a caderneta ao cidadão, com ou sem conta no Vac+. Os dados abaixo vêm da
        consulta do CPF e não podem ser alterados.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel>Nome completo</FieldLabel>
          <div className={lockedClass}>{patient.name}</div>
        </div>
        <div>
          <FieldLabel>CPF</FieldLabel>
          <div className={lockedClass}>{patient.cpfFormatted}</div>
        </div>
        <div>
          <FieldLabel>Data de nascimento</FieldLabel>
          <div className={lockedClass}>{formatAnyDate(patient.birthDate)}</div>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="cad-email" required>E-mail</FieldLabel>
          <input
            id="cad-email"
            type="email"
            value={values.email}
            onChange={(event) => onChange({ email: event.target.value })}
            aria-invalid={Boolean(errors.email)}
            className={inputClass(Boolean(errors.email))}
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <FieldLabel htmlFor="cad-mae" required>Nome da mãe</FieldLabel>
          <input
            id="cad-mae"
            value={values.motherName}
            onChange={(event) => onChange({ motherName: event.target.value })}
            aria-invalid={Boolean(errors.motherName)}
            className={inputClass(Boolean(errors.motherName))}
          />
          <FieldError message={errors.motherName} />
        </div>
        <div>
          <FieldLabel htmlFor="cad-pai" required>Nome do pai</FieldLabel>
          <input
            id="cad-pai"
            value={values.fatherName}
            onChange={(event) => onChange({ fatherName: event.target.value })}
            aria-invalid={Boolean(errors.fatherName)}
            className={inputClass(Boolean(errors.fatherName))}
          />
          <FieldError message={errors.fatherName} />
        </div>
        <div>
          <FieldLabel htmlFor="cad-sus">Cartão SUS (opcional)</FieldLabel>
          <input
            id="cad-sus"
            inputMode="numeric"
            placeholder="000 0000 0000 0000"
            value={values.susCard}
            onChange={(event) => onChange({ susCard: maskSus(event.target.value) })}
            aria-invalid={Boolean(errors.susCard)}
            className={inputClass(Boolean(errors.susCard))}
          />
          <FieldError message={errors.susCard} />
        </div>
        <div>
          <FieldLabel htmlFor="cad-genero">Gênero (opcional)</FieldLabel>
          <Select
            id="cad-genero"
            className="w-full"
            allowClear
            placeholder="Selecione"
            value={values.gender || undefined}
            onChange={(gender) => onChange({ gender: gender ?? '' })}
            options={GENDER_OPTIONS.map((option) => ({ value: option, label: option }))}
          />
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">Campos marcados com * são obrigatórios.</p>
    </Section>
  );
}
