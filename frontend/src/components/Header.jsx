import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../utils/authStore';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clients',
  '/deals': 'Deals Pipeline',
  '/tasks': 'Tasks',
  '/interactions': 'Interactions',
  '/users': 'User Management',
  '/activity-logs': 'Activity Logs',
  '/profile': 'My Profile',
};

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const getTitle = () => {
    const exact = pageTitles[location.pathname];
    if (exact) return exact;
    for (const [key, val] of Object.entries(pageTitles)) {
      if (location.pathname.startsWith(key + '/')) return val;
    }
    return 'CRM';
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-4 glass-panel border-x-0 border-t-0 z-10"
      style={{ minHeight: '70px' }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <FiMenu size={22} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-wide">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
          <FiBell size={20} />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            {user?.firstName?.[0] || user?.username?.[0] || 'U'}
          </div>
          <span className="text-sm font-medium text-gray-200 hidden sm:block">
            {user?.firstName || user?.username}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
