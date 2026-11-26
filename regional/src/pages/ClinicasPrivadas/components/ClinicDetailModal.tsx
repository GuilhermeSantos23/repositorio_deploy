import { Modal } from 'antd';
import ClinicStatusBadge from './ClinicStatusBadge';
import type { Clinic } from '../../../types/clinic';

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </p>
      <p className="text-sm text-gray-900">{value || '—'}</p>
    </div>
  );
}

interface ClinicDetailModalProps {
  clinic: Clinic | null;
  open: boolean;
  onClose: () => void;
}

function ClinicDetailModal({ clinic, open, onClose }: ClinicDetailModalProps) {
  return (
    <Modal
      title="Detalhes da clínica"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      {clinic && (
        <div className="flex flex-col gap-6 pt-2">
          <section>
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
              Dados da unidade
            </h3>
            <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
              <DetailRow label="Nome da unidade" value={clinic.name} />
              <DetailRow label="Código da unidade" value={clinic.code} />
              <DetailRow label="CEP" value={clinic.cep} />
              <DetailRow
                label="Logradouro"
                value={`${clinic.street}, ${clinic.number} — ${clinic.city}`}
              />
              <DetailRow label="Região" value={clinic.region} />
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Estado da unidade
                </p>
                <div className="mt-1">
                  <ClinicStatusBadge status={clinic.status} />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
              Administradores
            </h3>
            <div className="flex flex-col gap-3">
              {clinic.administrators.map((admin, index) => (
                <div key={admin.id} className="rounded-lg border border-gray-200 p-4">
                  <p className="mb-2 text-sm font-semibold text-gray-900">
                    Administrador {index + 1}
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DetailRow label="Nome" value={admin.name} />
                    <DetailRow label="CPF" value={admin.cpf} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {clinic.history.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-emerald-700 uppercase">
                Histórico
              </h3>
              <ul className="flex flex-col gap-2">
                {clinic.history.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-sm"
                  >
                    <span className="text-gray-900">{entry.action}</span>
                    {entry.performedBy && (
                      <span className="text-gray-500">{entry.performedBy}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
}

export default ClinicDetailModal;
