import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { CITIZEN, VACCINATION_RECORDS } from '../../data/cadernetaMock';
import { formatIsoDate } from '../../utils/formatDate';
import VaccinationBookletView from '../../components/booklet/VaccinationBookletView';
import type { VaccinationRecord } from '../../types/caderneta';

type Tab = 'capa' | 'identificacao' | 'vacinas' | 'caderneta';

// Dados simulados em data/cadernetaMock.ts (trocar pela API quando existir).
const citizen = CITIZEN;

const tabs: { id: Tab; label: string }[] = [
  { id: 'capa', label: 'Capa' },
  { id: 'identificacao', label: 'Identificação' },
  { id: 'vacinas', label: 'Vacinas aplicadas' },
  { id: 'caderneta', label: 'Caderneta' },
];

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors ${
        isActive
          ? 'font-semibold text-emerald-600 underline underline-offset-4'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

function CapaContent() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl bg-emerald-200 px-8 py-14 text-center shadow-sm sm:px-16">
      <h2 className="text-xl font-bold tracking-wide text-gray-900 sm:text-2xl">
        CADERNETA DE VACINAÇÃO
      </h2>
      <p className="mt-4 max-w-md text-sm text-gray-700 sm:text-base">
        Documento digital oficial — registre, consulte e comprove sua imunização
        ao longo da vida.
      </p>
      <p className="mt-8 text-sm font-semibold text-gray-900">
        Vac+ · Plataforma Nacional de Imunização
      </p>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="mt-1 text-sm text-gray-500">{value}</p>
    </div>
  );
}

function IdentificacaoContent() {
  return (
    <div className="flex items-stretch gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:gap-8 sm:p-6">
      <div className="my-1 w-1.5 shrink-0 rounded-full bg-emerald-200" />

      <div className="flex flex-1 flex-col items-center gap-6 py-2 sm:flex-row sm:gap-10">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 sm:h-28 sm:w-28">
          <UserOutlined className="text-4xl text-emerald-700 sm:text-5xl" />
        </div>

        <div className="grid w-full grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
          <Field label="Nome completo" value={citizen.name} />
          <Field label="CPF" value={citizen.cpf} />
          <Field label="Cartão do SUS" value={citizen.susCard} />
          <Field label="Data de Nascimento" value={citizen.birthDate} />
          <Field label="Idade" value={citizen.age} />
          <Field label="Grupo prioritário" value={citizen.priorityGroup} />
        </div>
      </div>
    </div>
  );
}

function VaccineCard({ record }: { record: VaccinationRecord }) {
  return (
    <li className="grid grid-cols-1 gap-3 rounded-xl border border-dashed border-emerald-200 p-4 sm:grid-cols-2 sm:gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">{record.vacinaNome}</p>
        <p className="text-sm text-gray-900">{record.doseLabel}</p>
        <p className="mt-1 text-sm text-gray-500">Data: {formatIsoDate(record.data)}</p>
        <p className="text-sm text-gray-500">Lote: {record.lote || 'Não informado'}</p>
      </div>

      <div className="sm:pt-6">
        <p className="text-sm text-gray-500">Local: {record.unidade || 'Não informado'}</p>
        <p className="text-sm text-gray-500">
          Profissional: {record.profissional || 'Não informado'}
        </p>
      </div>
    </li>
  );
}

// Todas as vacinas aplicadas, da mais recente para a mais antiga. Doses
// apenas previstas ou não tomadas não aparecem aqui.
function VacinasContent() {
  const applied = VACCINATION_RECORDS.filter((record) => record.status === 'aplicada').sort(
    (a, b) => (b.data ?? '').localeCompare(a.data ?? ''),
  );

  return (
    <div className="flex items-stretch gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:gap-6 sm:p-6">
      <div className="my-1 w-1.5 shrink-0 rounded-full bg-emerald-200" />

      <div className="flex-1">
        <p className="mb-4 text-sm font-semibold text-gray-900">
          {applied.length === 1 ? '1 vacina aplicada' : `${applied.length} vacinas aplicadas`}
        </p>

        {applied.length === 0 ? (
          <p className="text-sm text-gray-500">Você ainda não tem vacinas aplicadas registradas.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {applied.map((record) => (
              <VaccineCard key={record.id} record={record} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

type Viewer = 'closed' | 'view' | 'print';

// Card da caderneta: o documento é o mesmo gerado pelo profissional.
// Baixar PDF, Imprimir e QR code ficam abaixo do card.
function CadernetaContent() {
  const [viewer, setViewer] = useState<Viewer>('closed');
  const [notice, setNotice] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-stretch gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:gap-6 sm:p-6">
        <div className="my-1 w-1.5 shrink-0 rounded-full bg-emerald-200" />

        <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Caderneta</h2>
            <p className="mt-1 text-sm text-gray-500">
              Documento com sua identificação e o histórico de vacinas aplicadas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => { setNotice(''); setViewer('view'); }}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Visualizar
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 px-1">
        <button
          type="button"
          onClick={() => {
            setNotice('Na janela de impressão, escolha “Salvar como PDF” como destino.');
            setViewer('print');
          }}
          className="text-sm font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
        >
          Baixar PDF
        </button>
        <button
          type="button"
          onClick={() => { setNotice(''); setViewer('print'); }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Imprimir
        </button>
        <button
          type="button"
          onClick={() => setNotice('O compartilhamento por QR code estará disponível quando a integração com o servidor estiver pronta.')}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Compartilhar QR code
        </button>
      </div>

      {notice && <p className="px-1 text-sm text-gray-500" role="status">{notice}</p>}

      {viewer !== 'closed' && (
        <VaccinationBookletView
          // key força uma nova montagem ao alternar entre visualizar e imprimir
          key={viewer}
          citizen={citizen}
          records={VACCINATION_RECORDS}
          autoPrint={viewer === 'print'}
          onClose={() => setViewer('closed')}
        />
      )}
    </div>
  );
}

function CadernetaVacinacao() {
  const [activeTab, setActiveTab] = useState<Tab>('capa');

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white px-2 py-1 shadow-sm">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {activeTab === 'capa' && <CapaContent />}
      {activeTab === 'identificacao' && <IdentificacaoContent />}
      {activeTab === 'vacinas' && <VacinasContent />}
      {activeTab === 'caderneta' && <CadernetaContent />}
    </div>
  );
}

export default CadernetaVacinacao;
