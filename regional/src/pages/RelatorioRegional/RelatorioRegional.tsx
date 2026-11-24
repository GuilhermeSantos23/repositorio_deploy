import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  BookOutlined,
  BankOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
} from '@ant-design/icons';

// Um indicador exibido nos cards do topo.
interface Indicador {
  id: number;
  label: string;
  valor: string;
  icone: ReactNode;
  corFundoIcone: string;
  corIcone: string;
}

// Dados fictícios apenas para reproduzir a interface visual.
const indicadores: Indicador[] = [
  {
    id: 1,
    label: 'Doses em estoque',
    valor: '33.150',
    icone: <BookOutlined />,
    corFundoIcone: 'bg-sky-50',
    corIcone: 'text-sky-500',
  },
  {
    id: 2,
    label: 'Clínicas totais',
    valor: '64',
    icone: <BankOutlined />,
    corFundoIcone: 'bg-emerald-50',
    corIcone: 'text-emerald-600',
  },
  {
    id: 3,
    label: 'Lotes críticos',
    valor: '2',
    icone: <WarningOutlined />,
    corFundoIcone: 'bg-red-50',
    corIcone: 'text-red-500',
  },
  {
    id: 4,
    label: 'Distribuídas (mês)',
    valor: '184.260',
    icone: <MedicineBoxOutlined />,
    corFundoIcone: 'bg-emerald-50',
    corIcone: 'text-emerald-600',
  },
];

// Tipos de unidade cadastradas na tabela.
type TipoUnidade = 'Público' | 'Privada';

interface Unidade {
  id: number;
  unidade: string;
  tipo: TipoUnidade;
  cep: string;
  admin: string;
  quantidade: number;
  estado: string;
}

// Dados fictícios apenas para reproduzir a interface visual.
const unidadesIniciais: Unidade[] = [
  {
    id: 1,
    unidade: 'UBS Centro',
    tipo: 'Público',
    cep: '034390-99',
    admin: 'Vinicius',
    quantidade: 1,
    estado: 'Operando',
  },
  {
    id: 2,
    unidade: 'UBS Alvorada',
    tipo: 'Público',
    cep: '056906-88',
    admin: 'Carla',
    quantidade: 1,
    estado: 'Interditada',
  },
  {
    id: 3,
    unidade: 'Clínica Amor Saúde',
    tipo: 'Privada',
    cep: '456905-77',
    admin: 'Barbara',
    quantidade: 1,
    estado: 'Operando',
  },
  {
    id: 4,
    unidade: 'Clínica Viver',
    tipo: 'Privada',
    cep: '564356-99',
    admin: 'Raissa',
    quantidade: 1,
    estado: 'Fechada',
  },
  {
    id: 5,
    unidade: 'UBS Dutra',
    tipo: 'Público',
    cep: '454665-34',
    admin: 'Guilherme',
    quantidade: 1,
    estado: 'Operando',
  },
  {
    id: 6,
    unidade: 'UBS Pimentas',
    tipo: 'Público',
    cep: '456546-09',
    admin: 'Carlos',
    quantidade: 1,
    estado: 'Desativada',
  },
  {
    id: 7,
    unidade: 'UBS Cumbica',
    tipo: 'Público',
    cep: '456546-89',
    admin: 'Mateus',
    quantidade: 1,
    estado: 'Interditada',
  },
];

function RelatorioRegional() {
  const [busca, setBusca] = useState('');

  // Filtra as unidades pelo nome conforme o usuário digita.
  const unidadesFiltradas = unidadesIniciais.filter((item) => {
    const termo = busca.trim().toLowerCase();
    return !termo || item.unidade.toLowerCase().includes(termo);
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Relatório Regional</h1>
      <p className="mt-1 text-sm text-gray-500">
        Monitoramento de unidades, estoque e distribuição vacinal por unidade.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((indicador) => (
          <div
            key={indicador.id}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-gray-500">{indicador.label}</p>

            <div className="mt-3 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${indicador.corFundoIcone} ${indicador.corIcone}`}
              >
                {indicador.icone}
              </div>
              <p className="text-2xl font-bold text-gray-900">{indicador.valor}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Unidades cadastradas</h2>
            <p className="text-xs text-gray-400">Monitore unidades em tempo real</p>
          </div>

          <div className="relative w-64 max-w-full">
            <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por unidade"
              className="w-full rounded-lg border border-gray-200 py-1.5 pr-3 pl-8 text-sm text-gray-600 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                <th className="py-2 pr-4 font-medium">Unidade</th>
                <th className="py-2 pr-4 font-medium">Tipo</th>
                <th className="py-2 pr-4 font-medium">CEP</th>
                <th className="py-2 pr-4 font-medium">Admin</th>
                <th className="py-2 pr-4 font-medium">Quantidade</th>
                <th className="py-2 pr-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {unidadesFiltradas.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 text-gray-700 last:border-0">
                  <td className="py-2 pr-4">{item.unidade}</td>
                  <td className="py-2 pr-4">{item.tipo}</td>
                  <td className="py-2 pr-4">{item.cep}</td>
                  <td className="py-2 pr-4">{item.admin}</td>
                  <td className="py-2 pr-4">{item.quantidade}</td>
                  <td className="py-2 pr-4">{item.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {unidadesFiltradas.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-400">Nenhuma unidade encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RelatorioRegional;
