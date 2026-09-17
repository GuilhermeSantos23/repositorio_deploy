import { Link } from 'react-router-dom';
import { ExclamationCircleFilled, CalendarOutlined } from '@ant-design/icons';
import { useAlert } from '../../hooks/useAlert';
import { useUser } from '../../hooks/useUser';
import mascote from '../../assets/mascote.png';

// Os números abaixo são apenas dados de demonstração para a interface.
// Futuramente virão do backend, junto com o cálculo real do status de
// imunização (por enquanto o status fica fixo em "Em dia").
const SUMMARY = {
  dosesRecebidas: 7,
  dosesPendentes: 3,
  proximaDoseRecomendada: 'Influenza 2026',
  statusImunizacao: 'Em dia',
};

function Home() {
  const { userName } = useUser();
  const { alert } = useAlert();

  return (
    <div>
      <p className="text-sm text-gray-500">Sua área Vac+</p>
      <h1 className="text-2xl font-bold text-gray-800">Olá, {userName}!</h1>
      <p className="mt-1 text-sm text-gray-500">
        Acompanhe sua caderneta, próximas doses, alertas de surtos e atalhos
        rápidos.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link
          to="/caderneta-vacinacao"
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-medium text-gray-500">Doses recebidas</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {SUMMARY.dosesRecebidas}
          </p>
        </Link>

        <Link
          to="/historico-vacinal"
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-medium text-gray-500">Doses pendentes</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {SUMMARY.dosesPendentes}
          </p>
        </Link>

        <Link
          to="/historico-vacinal"
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-medium text-gray-500">
            Próxima dose recomendada
          </p>
          <p className="mt-2 text-lg font-bold text-red-600">
            {SUMMARY.proximaDoseRecomendada}
          </p>
        </Link>

        <Link
          to="/historico-vacinal"
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-medium text-gray-500">
            Status da imunização
          </p>
          <p className="mt-2 text-lg font-bold text-emerald-600">
            {SUMMARY.statusImunizacao}
          </p>
        </Link>
      </div>

      <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row">
        <img src={mascote} alt="Mascote Vac+" className="h-32 w-auto" />

        {alert ? (
          <div className="flex-1 rounded-lg border border-orange-300 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <ExclamationCircleFilled className="text-orange-500" />
                ALERTA
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <CalendarOutlined />
                Emitido em {alert.issuedAt.toLocaleDateString('pt-BR')}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-700">
              {alert.type} ·{' '}
              <span className="font-semibold">{alert.title}</span>
            </p>

            <p className="mt-2 text-sm text-gray-600">{alert.description}</p>
          </div>
        ) : (
          <div className="flex-1 rounded-lg border border-gray-100 bg-white p-5 text-center text-sm text-gray-500 shadow-sm">
            Nenhum alerta de surtos até o momento
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
