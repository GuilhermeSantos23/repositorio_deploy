import { Avatar } from 'antd';
import { BellOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { formatFullDate } from '../../../utils/formatDate';

interface HeaderProps {
  onMenuClick: () => void;
  adminName?: string;
  adminRole?: string;
  unitLabel?: string;
}

function Header({
  onMenuClick,
  adminName = 'Ass. Carla Ribeiro',
  adminRole = 'Admin. Unidade',
  unitLabel = 'Unidade 77',
}: HeaderProps) {
  const today = formatFullDate(new Date());
  const initials = adminName
  .replace('Ass.', '')
  .trim()
  .charAt(0)
  .toUpperCase();

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:px-8">
      <div className="relative min-w-0 flex-1">
        <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar UBS, clínica, região..."
          className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
        />
      </div>

      <div className="hidden text-right text-sm text-gray-600 md:block">
        <p className="font-semibold text-gray-900">{today}</p>
        <p>{unitLabel}</p>
      </div>

      <button
        type="button"
        aria-label="Notificações"
        className="text-lg text-gray-500 hover:text-gray-700"
      >
        <BellOutlined />
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        <Avatar size={36} style={{ backgroundColor: '#a7f3d0', color: '#022c22' }}>
          {initials || '?'}
        </Avatar>
        <div className="text-left text-sm">
          <p className="font-semibold text-gray-900">{adminName}</p>
          <p className="text-gray-500">{adminRole}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="text-xl text-gray-700 lg:hidden"
      >
        <MenuOutlined />
      </button>
    </header>
  );
}

export default Header;
