import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiTrendingUp, FiCheckSquare,
  FiMessageSquare, FiActivity, FiLogOut, FiLayers, FiPieChart, FiTarget,
} from 'react-icons/fi';
import { RiUser3Line } from 'react-icons/ri';
import useAuthStore from '../utils/authStore';

const nav = [
  { path: '/dashboard',    icon: FiHome,          label: 'Dashboard' },
  { path: '/leads',        icon: FiTarget,        label: 'Leads',        roles: ['author','editor','admin'] },
  { path: '/clients',      icon: FiUsers,         label: 'Clients',      roles: ['author','editor','admin'] },
  { path: '/deals',        icon: FiTrendingUp,    label: 'Deals',        roles: ['author','editor','admin'] },
  { path: '/tasks',        icon: FiCheckSquare,   label: 'Tasks',        roles: ['author','editor','admin'] },
  { path: '/interactions', icon: FiMessageSquare, label: 'Interactions', roles: ['author','editor','admin'] },
  { path: '/reports',      icon: FiPieChart,      label: 'Reports',      roles: ['author','editor','admin'] },
  { path: '/users',        icon: RiUser3Line,     label: 'Users',        roles: ['admin'] },
  { path: '/activity-logs',icon: FiActivity,      label: 'Activity',     roles: ['admin'] },
];

export default function Sidebar({ isOpen, onClose, alwaysVisible }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');
  const go       = (p) => { navigate(p); if (!alwaysVisible) onClose?.(); };
  const filtered = nav.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile overlay */}
      {!alwaysVisible && isOpen && (
        <div onClick={onClose} style={{
          position:'fixed', inset:0, zIndex:40,
          background:'rgba(0,0,0,0.2)',
          backdropFilter:'blur(2px)',
        }} />
      )}

      <aside
        className="sidebar"
        style={alwaysVisible ? {
          position: 'sticky',
          top: 0,
          transform: 'none',
          zIndex: 10,
        } : {
          position: 'fixed',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Logo — click to go to dashboard */}
        <button
          className="sidebar-logo"
          onClick={() => go('/dashboard')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            width: '100%', textAlign: 'left',
            transition: 'background 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
          title="Go to Dashboard"
        >
          <div className="sidebar-logo-mark">
            <FiLayers size={14} color="#fff" />
          </div>
          <div>
            <div className="sidebar-logo-name">CMS</div>
            <div className="sidebar-logo-sub">Management Suite</div>
          </div>
        </button>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section">Navigation</div>
          {filtered.map(item => {
            const Icon   = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className={`sidebar-item ${active ? 'active' : ''}`}
              >
                <Icon size={15} style={{ flexShrink:0, opacity: active ? 1 : 0.55 }} />
                {item.label}
                {active && <span className="sidebar-item-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-user" onClick={() => go('/profile')}>
            <div className="sidebar-avatar">
              {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="sidebar-user-name truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName||''}`.trim() : user?.username}
              </div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </button>
          <button className="sidebar-logout" onClick={() => { logout(); navigate('/login'); }}>
            <FiLogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
