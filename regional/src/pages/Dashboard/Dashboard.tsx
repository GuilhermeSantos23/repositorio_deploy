import type { ReactNode } from 'react';
import {
  MedicineBoxOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';

// Um indicador exibido no dashboard.
interface Indicador {
  id: number;
  label: string;
  valor: string | number;
  tendencia: string;
  tendenciaTipo: 'positiva' | 'negativa';
  icone: ReactNode;
  corFundoIcone: string;
  corIcone: string;
}

// Dados fictícios apenas para reproduzir a interface visual.
const indicadores: Indicador[] = [
  {
    id: 1,
    label: 'UBSs cadastradas',
    valor: 248,
    tendencia: '+12',
    tendenciaTipo: 'positiva',
    icone: <MedicineBoxOutlined />,
    corFundoIcone: 'bg-emerald-50',
    corIcone: 'text-emerald-600',
  },
  {
    id: 2,
    label: 'Clínica privadas ativas',
    valor: 64,
    tendencia: '+4',
    tendenciaTipo: 'positiva',
    icone: <HeartOutlined />,
    corFundoIcone: 'bg-sky-50',
    corIcone: 'text-sky-500',
  },
  {
    id: 3,
    label: 'Unidades ativas',
    valor: 291,
    tendencia: '94%',
    tendenciaTipo: 'positiva',
    icone: <ThunderboltOutlined />,
    corFundoIcone: 'bg-sky-50',
    corIcone: 'text-sky-500',
  },
  {
    id: 4,
    label: 'Estoque crítico',
    valor: 9,
    tendencia: '-3',
    tendenciaTipo: 'negativa',
    icone: <WarningOutlined />,
    corFundoIcone: 'bg-red-50',
    corIcone: 'text-red-500',
  },
];

function Dashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Olá, Dra. Carla!</h1>
      <p className="mt-1 text-sm text-gray-500">
        Acompanhe os indicadores estratégicos da sua região em tempo real.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((indicador) => (
          <div
            key={indicador.id}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${indicador.corFundoIcone} ${indicador.corIcone}`}
              >
                {indicador.icone}
              </div>
              <p className="text-sm text-gray-500">{indicador.label}</p>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900">{indicador.valor}</p>

              <span
                className={`flex items-center gap-1 text-xs font-semibold ${
                  indicador.tendenciaTipo === 'positiva'
                    ? 'text-emerald-600'
                    : 'text-red-500'
                }`}
              >
                {indicador.tendenciaTipo === 'positiva' ? (
                  <RiseOutlined />
                ) : (
                  <FallOutlined />
                )}
                {indicador.tendencia}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
