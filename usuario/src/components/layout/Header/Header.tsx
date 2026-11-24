
import { Popover } from 'antd';
import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { formatFullDate, formatShortDate } from '../../../utils/formatDate';
import { useUser } from '../../../hooks/useUser';
import { useAlert } from '../../../hooks/useAlert';
import UserAvatar from '../../common/UserAvatar/UserAvatar';

interface HeaderProps {
  onMenuClick: () => void;
  userRole?: string;
}

// O nome, o avatar e a região do usuário vêm do UserContext, para que o
// Header sempre mostre os mesmos dados salvos em Configurações.
function Header({ onMenuClick, userRole = 'Vac+ Cidadãos' }: HeaderProps) {
  const { userName, region } = useUser();
  const { alert, hasUnreadNotification, markAlertAsRead } = useAlert();
  const today = formatFullDate(new Date());

  // Conteúdo pequeno e discreto que aparece ao clicar no sino.
  // Mostra somente o alerta atual (tipo + data).
  const conteudoAlertas = (
    <div className="w-56">
      {alert ? (
        <div>
          <p className="text-sm font-bold text-gray-900">{alert.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {formatShortDate(alert.issuedAt)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Nenhum alerta no momento.
        </p>
      )}
    </div>
  );

  function handleAbrirAlertas(aberto: boolean) {
    if (aberto && hasUnreadNotification) {
      markAlertAsRead();
    }
  }

  return (
    <header className="flex items-center justify-end gap-4 border-b border-gray-200 bg-white px-4 py-3 lg:gap-5 lg:px-8">
      <div className="hidden text-right text-sm text-gray-600 md:block">
        <p className="font-semibold text-gray-900">{today}</p>
        <p>Região: {region}</p>
      </div>

      <Popover
        title="Alertas"
        content={conteudoAlertas}
        trigger="click"
        placement="bottomRight"
        onOpenChange={handleAbrirAlertas}
      >
        <button
          type="button"
          aria-label="Notificações"
          className="relative text-lg text-gray-500 hover:text-gray-700"
        >
          <BellOutlined />
          {hasUnreadNotification && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </Popover>

      <div className="hidden items-center gap-2 sm:flex">
        <UserAvatar size={36} />
        <div className="text-left text-sm">
          <p className="font-semibold text-gray-900">{userName}</p>
          <p className="text-gray-500">{userRole}</p>
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
