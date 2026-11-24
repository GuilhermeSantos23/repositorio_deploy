import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { formatFullDate } from '../../../utils/formatDate';
import UserAvatar from '../../common/UserAvatar/UserAvatar';

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

  return (
    <header className="flex items-center justify-end gap-4 border-b border-gray-200 bg-white px-4 py-3 lg:gap-5 lg:px-8">
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
        <UserAvatar size={36} />
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
