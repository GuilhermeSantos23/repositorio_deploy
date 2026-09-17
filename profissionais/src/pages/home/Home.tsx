import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import {
  CheckCircleOutlined,
  FileDoneOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useUser } from '../../hooks/useUser';
import { STOCK_CRITICAL_THRESHOLD } from '../../utils/stockRules';
import { getDashboardData } from '../../services/dashboardService';

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-100 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface IndicatorCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  to: string;
}

function IndicatorCard({ icon, title, value, to }: IndicatorCardProps) {
  return (
    <Link to={to} className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2">
      <Card>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-700">
          {icon}
        </span>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
      </Card>
    </Link>
  );
}

const applicationColumns = [
  { title: 'Paciente', dataIndex: 'patientName', key: 'patientName' },
  { title: 'Vacina', dataIndex: 'vaccine', key: 'vaccine' },
  { title: 'Dose', dataIndex: 'dose', key: 'dose' },
  { title: 'Profissional', dataIndex: 'professional', key: 'professional' },
];

const stockColumns = [
  { title: 'Vacina', dataIndex: 'vaccine', key: 'vaccine' },
  {
    title: 'Estoque atual',
    dataIndex: 'currentStock',
    key: 'currentStock',
    render: (value: number) => `${value} doses`,
  },
  {
    title: 'Status',
    key: 'status',
    render: () => (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        Crítico
      </span>
    ),
  },
];

function Home() {
  const { userName } = useUser();

  const dashboard = getDashboardData();
  const criticalStock = dashboard.criticalStock;

 
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Olá, {userName}! </h1>
          <p className="mt-2 text-sm text-gray-500">
            Aqui está o resumo das atividades da sua unidade hoje.
          </p>
        </div>

      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <IndicatorCard
          icon={<CheckCircleOutlined />}
          title="Total de vacinas aplicadas hoje"
          value={dashboard.vacinasHoje}
          to="/historico"
        />
        <IndicatorCard
          icon={<FileDoneOutlined />}
          title="Total de cadernetas registradas esta semana"
          value={dashboard.cadernetasSemana}
          to="/historico"
        />
        <IndicatorCard
          icon={<BarChartOutlined />}
          title="Total de vacinas aplicadas no mês"
          value={dashboard.vacinasMes}

          to="/historico"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700">
              <ClockCircleOutlined />
              <h2 className="font-semibold text-gray-900">5 últimas aplicações</h2>
            </div>
            <Link
              to="/historico"
              className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
            >
              Ver mais <ArrowRightOutlined className="text-xs" />
            </Link>
          </div>

          <Table
            columns={applicationColumns}
            dataSource={dashboard.lastApplications}
            rowKey="id"
            size="small"
            pagination={false}
            scroll={{ x: true }}
          />

          <p className="mt-3 flex items-center gap-1 text-xs text-gray-400">
            <InfoCircleOutlined />
            As informações são atualizadas conforme os registros são realizados.
          </p>
        </Card>

        <Card>
          <Link to="/historico" className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700">
              <WarningOutlined />
              <h2 className="font-semibold text-gray-900">Estoque crítico</h2>
            </div>
          </div>
          </Link>

          {criticalStock.length > 0 ? (
            <>
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3">
                <WarningOutlined className="mt-0.5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {criticalStock.length} vacina{criticalStock.length > 1 ? 's' : ''} precisa
                    {criticalStock.length > 1 ? 'm' : ''} de atenção
                  </p>
                  <p className="text-xs text-red-600">
                    Vacinas com menos de {STOCK_CRITICAL_THRESHOLD} doses em estoque.
                  </p>
                </div>
              </div>

              <Table
                columns={stockColumns}
                dataSource={criticalStock}
                rowKey="vaccine"
                size="small"
                pagination={false}
                scroll={{ x: true }}
              />
            </>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma vacina está com estoque crítico.</p>
          )}

          <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
            O estoque é atualizado pelo administrador da unidade. Você possui permissão apenas
            para consulta.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Home;
