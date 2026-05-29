import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiTrendingUp,
  FiCheckSquare,
  FiActivity,
  FiLogOut,
  FiUser,
  FiChevronRight,
} from 'react-icons/fi';
import { MdBusinessCenter } from 'react-icons/md';
import useAuthStore from '../utils/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', color: 'from-indigo-400 to-cyan-400' },
    { path: '/clients', icon: FiUsers, label: 'Clients', color: 'from-blue-400 to-indigo-400', roles: ['author', 'editor', 'admin'] },
    { path: '/deals', icon: FiTrendingUp, label: 'Deals', color: 'from-emerald-400 to-teal-400', roles: ['author', 'editor', 'admin'] },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks', color: 'from-amber-400 to-orange-400', roles: ['author', 'editor', 'admin'] },
    { path: '/interactions', icon: FiMessageSquare, label: 'Interactions', color: 'from-fuchsia-400 to-purple-400', roles: ['author', 'editor', 'admin'] },
    { path: '/users', icon: FiUser, label: 'Users', color: 'from-rose-400 to-pink-400', roles: ['admin'] },
    { path: '/activity-logs', icon: FiActivity, label: 'Activity Logs', color: 'from-red-400 to-rose-400', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 glass-panel border-y-0 border-l-0 text-white transition-transform duration-300 z-50 lg:relative lg:translate-x-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <MdBusinessCenter className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight">Antigravity</h1>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Workspace</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="mt-6 space-y-2 flex-1 overflow-y-auto px-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest px-2 mb-4">Menu</p>
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  active
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10'
                    : 'border border-transparent text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/5'
                }`}
              >
                {active && (
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${item.color}`} />
                )}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-xl ${active ? `bg-gradient-to-br ${item.color} shadow-lg` : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <Icon size={16} className={active ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'} />
                </div>
                <span className="relative z-10 text-[15px] font-semibold">{item.label}</span>
                {active && <FiChevronRight size={16} className="relative z-10 ml-auto text-white/50" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/5 p-5 space-y-3 bg-black/20">
          <button
            onClick={() => { navigate('/profile'); onClose(); }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-300 hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg">
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-bold text-[15px] text-white truncate">{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username}</p>
              <p className="text-[11px] font-medium text-indigo-300 uppercase tracking-wider mt-0.5">{user?.role}</p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
          >
            <FiLogOut size={18} />
            <span className="text-sm font-bold tracking-wide">Secure Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
