import { NavLink } from 'react-router-dom';
import vacmaisLogo from '../../../assets/vacmais-logo.png';
import { mainNavItems, bottomNavItems } from '../navItems';

const linkClassName =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white';
const activeLinkClassName = 'bg-emerald-900 text-white';

function Sidebar() {
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
          REGIONAL
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${linkClassName} ${isActive ? activeLinkClassName : ''}`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-emerald-800 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {bottomNavItems.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${linkClassName} ${isActive ? activeLinkClassName : ''}`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
