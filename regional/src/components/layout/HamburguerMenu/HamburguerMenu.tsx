import { Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { bottomNavItems } from '../navItems';

interface HamburguerMenuProps {
  open: boolean;
  onClose: () => void;
}

const DARK_GREEN = '#022c22';

const itemClassName =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm !text-emerald-100 hover:bg-emerald-900 hover:!text-white';

function HamburguerMenu({ open, onClose }: HamburguerMenuProps) {
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
        {bottomNavItems.map((item) => (
          <li key={item.key}>
            <NavLink to={item.path} onClick={onClose} className={itemClassName}>
              <span className="text-base !text-emerald-100">{item.icon}</span>
              <span className="!text-emerald-100">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </Drawer>
  );
}

export default HamburguerMenu;
