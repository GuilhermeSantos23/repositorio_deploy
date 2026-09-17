import { Link, useNavigate } from 'react-router-dom';
import { Drawer } from 'antd';
import {
  CloseOutlined,
  CompassOutlined,
  ToolOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useUser } from '../../../hooks/useUser';

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Missão', icon: <CompassOutlined />, to: '/missao' },
  { label: 'Serviços', icon: <ToolOutlined />, to: '/servicos' },
  { label: 'Configurações', icon: <SettingOutlined />, to: '/configuracoes' },
];

const DARK_GREEN = '#022c22';

const itemClassName =
  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm !text-emerald-100 hover:bg-emerald-900 hover:!text-white';

function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  const { logout } = useUser();
  const navigate = useNavigate();

  function handleSair() {
    logout();
    onClose();
    navigate('/login');
  }

  return (
    <Drawer
      placement="right"
      open={open}
      onClose={onClose}
      width={260}
      closeIcon={<CloseOutlined className="!text-emerald-100" />}
      styles={{
        header: {
          backgroundColor: DARK_GREEN,
          borderBottom: '1px solid #065f46',
        },
        body: {
          backgroundColor: DARK_GREEN,
          padding: '12px',
        },
      }}
    >
      <ul className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link to={item.to} onClick={onClose} className={itemClassName}>
              <span className="text-base !text-emerald-100">{item.icon}</span>
              <span className="!text-emerald-100">{item.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={handleSair}
            className={itemClassName}
          >
            <span className="text-base !text-emerald-100">
              <LogoutOutlined />
            </span>
            <span className="!text-emerald-100">Sair</span>
          </button>
        </li>
      </ul>
    </Drawer>
  );
}

export default HamburgerMenu;
