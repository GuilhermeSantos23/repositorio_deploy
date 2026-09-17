import { Link } from 'react-router-dom';
import { mainNavItems } from '../navItems';

const itemClassName =
  'flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] text-gray-500 hover:text-emerald-700';

function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white lg:hidden">
      <ul className="flex justify-between px-1 py-1">
        {mainNavItems.map((item) => (
          <li key={item.label} className="flex-1">
            <Link to={item.path} className={itemClassName}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BottomNavigation;
