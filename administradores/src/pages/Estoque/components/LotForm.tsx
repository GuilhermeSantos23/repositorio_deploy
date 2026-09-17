import { useState, type ChangeEvent, type FormEvent } from 'react';
import FormField from '../../../components/form/FormField/FormField';
import { maskLotCode, maskNumeric } from '../../../utils/masks';
import { compareISODates, getTodayISO } from '../../../utils/date';
import { VACCINE_NAME_OPTIONS, MANUFACTURER_OPTIONS } from '../../../utils/vaccineCatalog';
import { CURRENT_UNIT_ADMIN } from '../../../mocks/session';
import type { LotFormData } from '../../../types/lot';

function buildEmptyFormData(): LotFormData {
  return {
    vaccineName: '',
    manufacturer: '',
    code: '',
    quantity: '',
    receivedAt: getTodayISO(),
    expiresAt: '',
    attachmentName: undefined,
  };
}

interface LotFormErrors {
  vaccineName?: string;
  manufacturer?: string;
  code?: string;
  quantity?: string;
  receivedAt?: string;
  expiresAt?: string;
}

interface LotFormProps {
  initialData?: LotFormData;
  submitLabel: string;
  onSubmit: (data: LotFormData) => void;
  onCancel?: () => void;
}

function LotForm({ initialData, submitLabel, onSubmit, onCancel }: LotFormProps) {
  const [formData, setFormData] = useState<LotFormData>(() => initialData ?? buildEmptyFormData());
  const [errors, setErrors] = useState<LotFormErrors>({});

  function updateField<K extends keyof LotFormData>(field: K, value: LotFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleAttachmentChange(e: ChangeEvent<HTMLInputElement>) {
    // O campo de anexo em si (input de arquivo) já existia pronto na tela
    // original — aqui só passamos a guardar o nome do arquivo escolhido,
    // já que agora ele também precisa aparecer na tabela/lote cadastrado.
    const file = e.target.files?.[0];
    updateField('attachmentName', file ? file.name : undefined);
  }

  function validate(): boolean {
    const today = getTodayISO();
    const newErrors: LotFormErrors = {};

    if (!formData.vaccineName.trim()) newErrors.vaccineName = 'Nome da vacina é obrigatório.';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Fabricante é obrigatório.';
    if (!formData.code.trim()) newErrors.code = 'Lote é obrigatório.';

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantidade é obrigatória.';
    } else if (Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantidade deve ser maior que zero.';
    }

    if (!formData.receivedAt) {
      newErrors.receivedAt = 'Data de recebimento é obrigatória.';
    } else if (compareISODates(formData.receivedAt, today) > 0) {
      newErrors.receivedAt = 'Data de recebimento não pode ser futura.';
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = 'Data de vencimento é obrigatória.';
    } else if (
      formData.receivedAt &&
      compareISODates(formData.expiresAt, formData.receivedAt) <= 0
    ) {
      newErrors.expiresAt = 'Data de vencimento deve ser posterior ao recebimento.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
          Dados
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FormField
              label="Nome da vacina"
              list="vaccine-name-options"
              placeholder="Ex.: Influenza trivalente"
              value={formData.vaccineName}
              onChange={(e) => updateField('vaccineName', e.target.value)}
              error={errors.vaccineName}
            />
            <datalist id="vaccine-name-options">
              {VACCINE_NAME_OPTIONS.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <div>
            <FormField
              label="Fabricante"
              list="manufacturer-options"
              placeholder="Ex.: Instituto Butantan"
              value={formData.manufacturer}
              onChange={(e) => updateField('manufacturer', e.target.value)}
              error={errors.manufacturer}
            />
            <datalist id="manufacturer-options">
              {MANUFACTURER_OPTIONS.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <FormField
            label="Lote"
            placeholder="INF-26A41"
            value={formData.code}
            onChange={(e) => updateField('code', maskLotCode(e.target.value))}
            error={errors.code}
          />

          <FormField
            label="Quantidade"
            inputMode="numeric"
            placeholder="100"
            value={formData.quantity}
            onChange={(e) => updateField('quantity', maskNumeric(e.target.value, 6))}
            error={errors.quantity}
          />

          <FormField
            label="Data de recebimento"
            type="date"
            max={getTodayISO()}
            value={formData.receivedAt}
            onChange={(e) => updateField('receivedAt', e.target.value)}
            error={errors.receivedAt}
          />

          <FormField
            label="Data de vencimento"
            type="date"
            min={formData.receivedAt || undefined}
            value={formData.expiresAt}
            onChange={(e) => updateField('expiresAt', e.target.value)}
            error={errors.expiresAt}
          />

          <FormField
            label="Receptor"
            value={CURRENT_UNIT_ADMIN.name}
            readOnly
            disabled
            className="cursor-not-allowed"
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Anexar romaneio/recibo
            </label>
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-emerald-700"
            />
            {formData.attachmentName && (
              <p className="mt-1 text-xs text-gray-500">Selecionado: {formData.attachmentName}</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default LotForm;
