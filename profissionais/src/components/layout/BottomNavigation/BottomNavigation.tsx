import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  SafetyOutlined,
  AccountBookOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { logout } from '../../../services/authService';

// Mesmo rótulo e ícone da Caderneta usados na Sidebar, para manter a
// identidade coerente entre desktop e mobile.
const bottomNavItems = [
  { label: 'Home', icon: <HomeOutlined />, to: '/home' },
  { label: 'Aplicar Vacinas', icon: <SafetyOutlined />, to: '/aplicacoes' },
  { label: 'Caderneta', icon: <AccountBookOutlined />, to: '/cadernetas' },
  { label: 'Histórico Vacinal', icon: <ClockCircleOutlined />, to: '/historico' },
  { label: 'Configurações', icon: <SettingOutlined />, to: '/configuracoes' },
];

const itemClassName =
  'flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] text-gray-500 hover:text-emerald-700';
const activeItemClassName = 'text-emerald-700';

function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white lg:hidden">
      <ul className="flex justify-between px-1 py-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <li key={item.label} className="flex-1">
              <Link
                to={item.to}
                className={`${itemClassName} ${isActive ? activeItemClassName : ''}`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <button type="button" onClick={handleLogout} className={itemClassName}>
            <span className="text-base">
              <LogoutOutlined />
            </span>
            Sair
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNavigation;
