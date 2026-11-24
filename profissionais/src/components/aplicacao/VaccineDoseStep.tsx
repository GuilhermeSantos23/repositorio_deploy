import { Select } from 'antd';
import { Section, FieldError, FieldLabel } from './Section';
import { RECORTES } from '../../data/vaccinesData';
import { isRecorteAvailableForAge } from '../../utils/ageRules';
import { getDoseStatus, type ApplicationFormErrors, type ApplicationFormValues } from '../../utils/applicationRules';
import type { VaccinationRecord } from '../../types/vaccinationRecord';
import type { Momento, VaccineOption } from '../../types/vaccine';

interface Props {
  values: ApplicationFormValues;
  errors: ApplicationFormErrors;
  records: VaccinationRecord[];
  patientAge: number;
  momentos: Momento[];
  vacina: VaccineOption | undefined;
  onRecorteChange: (id: string) => void;
  onMomentoChange: (id: string) => void;
  onVacinaChange: (id: string) => void;
  onDoseChange: (id: string) => void;
}

export default function VaccineDoseStep({
  values, errors, records, patientAge, momentos, vacina,
  onRecorteChange, onMomentoChange, onVacinaChange, onDoseChange,
}: Props) {
  const momento = momentos.find((item) => item.id === values.momentoId);

  return (
    <Section title="Vacina e dose">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="campo-grupo">Grupo</FieldLabel>
          <Select
            id="campo-grupo"
            className="w-full"
            value={values.recorteId}
            onChange={onRecorteChange}
            options={RECORTES.map((recorte) => ({
              value: recorte.id,
              label: recorte.label,
              disabled: !isRecorteAvailableForAge(recorte.id, patientAge),
            }))}
          />
        </div>
        <div>
          <FieldLabel htmlFor="campo-momento" required>Momento</FieldLabel>
          <Select
            id="campo-momento"
            className="w-full"
            status={errors.momentoId ? 'error' : undefined}
            placeholder="Selecione"
            value={values.momentoId}
            onChange={onMomentoChange}
            options={momentos.map((item) => ({ value: item.id, label: item.label }))}
          />
          <FieldError message={errors.momentoId} />
        </div>
        <div>
          <FieldLabel htmlFor="campo-vacina" required>Vacina</FieldLabel>
          <Select
            id="campo-vacina"
            className="w-full"
            status={errors.vacinaId ? 'error' : undefined}
            placeholder={values.momentoId ? 'Selecione' : 'Selecione o momento'}
            disabled={!momento}
            value={values.vacinaId}
            onChange={onVacinaChange}
            options={momento?.vaccines.map((item) => ({
              value: item.id,
              label: item.network === 'privada' ? `${item.name} (opcional)` : item.name,
            }))}
          />
          <FieldError message={errors.vacinaId} />
        </div>
      </div>

      {vacina && (
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-medium text-gray-700">
            Dose a registrar<span className="text-red-600"> *</span>
          </legend>
          <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {vacina.doses.map((dose) => {
              const status = getDoseStatus(records, vacina.id, dose.id, values.applicationDate);
              return (
                <label
                  key={dose.id}
                  className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${
                    status.canRegister ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="dose"
                      value={dose.id}
                      checked={values.doseId === dose.id}
                      disabled={!status.canRegister}
                      onChange={() => onDoseChange(dose.id)}
                      className="accent-emerald-700"
                    />
                    <span className="font-medium text-gray-900">{dose.label}</span>
                  </span>
                  <span className={status.kind === 'aplicada' ? 'text-xs font-semibold text-emerald-800' : 'text-xs text-gray-600'}>
                    {status.kind === 'aplicada' ? status.message : `Prevista · ${status.message.toLowerCase()}`}
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError message={errors.doseId} />
          {vacina.note && (
            <p className="mt-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
              <strong>Informação relevante:</strong> {vacina.note}
            </p>
          )}
          <p className="mt-3 text-xs text-gray-500">
            Dose prevista é a que consta no calendário. Ela só passa a constar como aplicada na caderneta
            depois da confirmação do registro.
          </p>
        </fieldset>
      )}
    </Section>
  );
}
