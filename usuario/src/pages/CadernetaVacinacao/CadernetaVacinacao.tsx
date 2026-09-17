import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

type Tab = 'capa' | 'identificacao' | 'vacinas';

interface Citizen {
  name: string;
  cpf: string;
  susCard: string;
  birthDate: string;
  age: string;
  priorityGroup: string;
}

interface Vaccine {
  name: string;
  date: string;
  batch: string;
  location: string;
  professional: string;
}

// Dados estáticos apenas para reproduzir o protótipo do Figma.
const citizen: Citizen = {
  name: 'Carla Ribeiro',
  cpf: '123.456.789-00',
  susCard: '700 9674 9916 0003',
  birthDate: '14/04/1992',
  age: '34 anos',
  priorityGroup: 'Adulto',
};

const vaccines: Vaccine[] = [
  {
    name: 'BCG (Dose única)',
    date: '19/04/1992',
    batch: 'BC39292',
    location: 'Maternidade Municipal',
    professional: 'Ana Costa',
  },
  {
    name: 'Hepatite B (3º Dose)',
    date: '14/10/1992',
    batch: 'HEP4421',
    location: 'UBS Vila Nova',
    professional: 'Tec. Pedro Lima',
  },
];

const tabs: { id: Tab; label: string }[] = [
  { id: 'capa', label: 'Capa' },
  { id: 'identificacao', label: 'Identificação' },
  { id: 'vacinas', label: 'Vacinas aplicadas' },
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

interface VaccineCardProps {
  vaccine: Vaccine;
}

function VaccineCard({ vaccine }: VaccineCardProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-dashed border-emerald-200 p-4 sm:grid-cols-2 sm:gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">Vacina</p>
        <p className="text-sm text-gray-900">{vaccine.name}</p>
        <p className="mt-1 text-sm text-gray-500">Data: {vaccine.date}</p>
        <p className="text-sm text-gray-500">Lote: {vaccine.batch}</p>
      </div>

      <div className="sm:pt-6">
        <p className="text-sm text-gray-500">Local: {vaccine.location}</p>
        <p className="text-sm text-gray-500">
          Profissional: {vaccine.professional}
        </p>
      </div>
    </div>
  );
}

function VacinasContent() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-stretch gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:gap-6 sm:p-6">
      <div className="my-1 w-1.5 shrink-0 rounded-full bg-emerald-200" />

      <div className="flex-1">
        <div className="flex flex-col gap-4">
          {vaccines.map((vaccine) => (
            <VaccineCard key={vaccine.name} vaccine={vaccine} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-gray-100 pt-4">
          <button
            type="button"
            className="text-sm font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
          >
            Baixar PDF
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Imprimir
          </button>
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Compartilhar QRcode
          </button>
        </div>
      </div>
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
    </div>
  );
}

export default CadernetaVacinacao;
