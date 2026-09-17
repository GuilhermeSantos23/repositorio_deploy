import { Link, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  EnvironmentOutlined,
  FolderOutlined,
  BookOutlined,
  CompassOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  ToolOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import vacmaisLogo from '../../../assets/vacmais-logo.png';
import { useUser } from '../../../hooks/useUser';

// "to: null" significa que a Page correspondente ainda não existe;
// esses itens continuam como link de placeholder por enquanto.
const mainNavItems = [
  { label: 'Home', icon: <HomeOutlined />, to: '/home' },
  {
    label: 'Unidades próximas',
    icon: <EnvironmentOutlined />,
    to: '/unidades-proximas',
  },
  {
    label: 'Histórico Vacinal',
    icon: <FolderOutlined />,
    to: '/historico-vacinal',
  },
  {
    label: 'Caderneta de Vacinação',
    icon: <BookOutlined />,
    to: '/caderneta-vacinacao',
  },
  { label: 'Missão', icon: <CompassOutlined />, to: '/missao' },
  {
    label: 'Informações vacinais',
    icon: <InfoCircleOutlined />,
    to: '/informacoes-vacinais',
  },
  { label: 'Calendário', icon: <CalendarOutlined />, to: '/calendario' },
  { label: 'Serviços', icon: <ToolOutlined />, to: '/servicos' },
];

const linkClassName =
  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white';

function Sidebar() {
  const { logout } = useUser();
  const navigate = useNavigate();

  function handleSair() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-emerald-950 text-emerald-50 lg:flex">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <img
            src={vacmaisLogo}
            alt="Logo Vac+"
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="text-lg font-bold">Vac+</span>
        </div>

        <p className="mt-1 text-xs font-semibold tracking-widest text-emerald-300">
          CIDADÃO
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              {item.to ? (
                <Link to={item.to} className={linkClassName}>
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <a href="#" className={linkClassName}>
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-emerald-800 px-3 py-4">
        <ul className="flex flex-col gap-1">
          <li>
            <Link to="/configuracoes" className={linkClassName}>
              <span className="text-base">
                <SettingOutlined />
              </span>
              Configurações
            </Link>
          </li>
          <li>
            <button type="button" onClick={handleSair} className={linkClassName}>
              <span className="text-base">
                <LogoutOutlined />
              </span>
              Sair
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
