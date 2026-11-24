import { CLINIC_STATUS_LABELS } from '../../../utils/clinicStatus';
import type { ClinicFormData } from '../../../types/clinic';

interface ReviewRowProps {
  label: string;
  value: string;
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </p>
      <p className="text-sm text-gray-900">{value || '—'}</p>
    </div>
  );
}

interface ClinicReviewSummaryProps {
  data: ClinicFormData;
  onBack: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  isSubmitting?: boolean;
}

function ClinicReviewSummary({
  data,
  onBack,
  onConfirm,
  confirmLabel,
  isSubmitting = false,
}: ClinicReviewSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
          Clínica
        </h3>
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
          <ReviewRow label="Nome da clínica" value={data.name} />
          <ReviewRow label="CNPJ" value={data.cnpj} />
          <ReviewRow label="CEP" value={data.cep} />
          <ReviewRow label="Logradouro" value={data.street} />
          <ReviewRow label="Número" value={data.number} />
          <ReviewRow label="Cidade" value={data.city} />
          <ReviewRow label="Região" value={data.region} />
          <ReviewRow label="Telefone" value={data.phone} />
          <ReviewRow label="E-mail" value={data.email} />
          <ReviewRow label="Estado" value={CLINIC_STATUS_LABELS[data.status]} />
          <ReviewRow
            label="Quantidade de administradores"
            value={String(data.administratorsCount)}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
          Administradores
        </h3>
        <div className="flex flex-col gap-3">
          {data.administrators.map((admin, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">
                Administrador {index + 1}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ReviewRow label="Nome" value={admin.name} />
                <ReviewRow label="CPF" value={admin.cpf} />
                <ReviewRow label="E-mail" value={admin.email} />
                <ReviewRow label="Telefone" value={admin.phone} />
                <ReviewRow label="Login" value={admin.login} />
                <ReviewRow label="Senha provisória" value={admin.temporaryPassword} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Alterar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : confirmLabel}
        </button>
      </div>
    </div>
  );
}

export default ClinicReviewSummary;
