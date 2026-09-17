import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  EnvironmentOutlined,
  FolderOutlined,
  BookOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

// Apenas as funcionalidades principais ficam na Bottom Navigation.
// O restante (Missão, Serviços, Configurações, Sair) fica no HamburgerMenu.
const bottomNavItems = [
  { label: 'Home', icon: <HomeOutlined />, to: '/home' },
  {
    label: 'Unidades',
    icon: <EnvironmentOutlined />,
    to: '/unidades-proximas',
  },
  { label: 'Histórico', icon: <FolderOutlined />, to: '/historico-vacinal' },
  { label: 'Caderneta', icon: <BookOutlined />, to: '/caderneta-vacinacao' },
  {
    label: 'Informações',
    icon: <InfoCircleOutlined />,
    to: '/informacoes-vacinais',
  },
  { label: 'Calendário', icon: <CalendarOutlined />, to: '/calendario' },
];

const itemClassName =
  'flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] text-gray-500 hover:text-emerald-700';

function BottomNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex justify-between px-1 py-1">
        {bottomNavItems.map((item) => (
          <li key={item.label} className="flex-1">
            {item.to ? (
              <Link to={item.to} className={itemClassName}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <a href="#" className={itemClassName}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BottomNavigation;
