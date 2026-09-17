import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  SafetyOutlined,
  AccountBookOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import logo from '../../../assets/vacmais-logo.png';




// "to: null" significa que a Page correspondente ainda não existe;
// esses itens continuam como link de placeholder por enquanto.
const mainNavItems = [
  { label: 'Home', icon: <HomeOutlined />, to: '/home' },
  { label: 'Aplicar Vacinas', icon: <SafetyOutlined />, to: '/aplicacoes' },
  { label: 'Caderneta', icon: <AccountBookOutlined />, to: '/cadernetas' },
  { label: 'Histórico Vacinal', icon: <ClockCircleOutlined />, to: '/historico' },
];

const bottomNavItems = [
  { label: 'Configurações', icon: <SettingOutlined />, to: '/configuracoes' },
  { label: 'Sair', icon: <LogoutOutlined />, to: '/login' },
];

const linkClassName =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white';

const activeLinkClassName = 'bg-emerald-900 text-white';

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-emerald-950 text-emerald-50 lg:flex">
      {/* Logo */}
      <div className="px-6 py-6">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo vac+"
              className="h-8 w-8 rounded-lg object-contain"
            />
            <span className="text-lg font-bold">Vac+</span>
          </div>

          <p className="mt-1 text-xs font-semibold tracking-widest text-emerald-300">
            PROFISSIONAIS
          </p>
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {mainNavItems.map((item) => {
            const isActive = item.to
              ? location.pathname.startsWith(item.to)
              : false;

            return (
              <li key={item.label}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className={`${linkClassName} ${
                      isActive ? activeLinkClassName : ''
                    }`}
                  >
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
            );
          })}
        </ul>
      </nav>

      {/* Navegação inferior */}
      <div className="border-t border-emerald-800 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {bottomNavItems.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className={linkClassName}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
