import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiTrendingUp, FiCheckSquare,
  FiMessageSquare, FiActivity, FiLogOut, FiLayers,
  FiPieChart, FiChevronRight,
} from 'react-icons/fi';
import { RiUser3Line } from 'react-icons/ri';
import useAuthStore from '../utils/authStore';

const nav = [
  { path: '/dashboard',     icon: FiHome,          label: 'Dashboard' },
  { path: '/clients',       icon: FiUsers,         label: 'Clients',      roles: ['author','editor','admin'] },
  { path: '/deals',         icon: FiTrendingUp,    label: 'Deals',        roles: ['author','editor','admin'] },
  { path: '/tasks',         icon: FiCheckSquare,   label: 'Tasks',        roles: ['author','editor','admin'] },
  { path: '/interactions',  icon: FiMessageSquare, label: 'Interactions', roles: ['author','editor','admin'] },
  { path: '/reports',       icon: FiPieChart,      label: 'Reports',      roles: ['author','editor','admin'] },
  { path: '/users',         icon: RiUser3Line,     label: 'Users',        roles: ['admin'] },
  { path: '/activity-logs', icon: FiActivity,      label: 'Activity',     roles: ['admin'] },
];

export default function Sidebar({ variant = 'rail', isOpen, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');
  const go       = (p) => { navigate(p); onClose?.(); };
  const filtered = nav.filter(item => !item.roles || item.roles.includes(user?.role));
  const initials = (user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase();

  /* ── Shared inner content ── */
  const inner = (
    <>
      {/* Logo */}
      <button
        className="sb-logo"
        onClick={() => go('/dashboard')}
      >
        <div className="sb-logo-mark">
          <FiLayers size={14} color="#fff" />
        </div>
        <span className="sb-logo-name">CMS</span>
      </button>

      {/* Nav */}
      <nav className="sb-nav">
        <div className="sb-section-label">Navigation</div>
        {filtered.map(item => {
          const Icon   = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              className={`sb-item ${active ? 'active' : ''}`}
              title={item.label}
            >
              <span className="sb-item-icon"><Icon size={17} /></span>
              <span className="sb-item-label">{item.label}</span>
              {active && <FiChevronRight size={11} className="sb-item-arrow" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sb-footer">
        <button className="sb-user" onClick={() => go('/profile')}>
          <div className="sb-avatar">{initials}</div>
          <div className="sb-user-info">
            <div className="sb-user-name">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username}
            </div>
            <div className="sb-user-role">{user?.role}</div>
          </div>
        </button>
        <button className="sb-logout" onClick={() => { logout(); navigate('/login'); }}>
          <FiLogOut size={14} />
          <span className="sb-item-label">Sign out</span>
        </button>
      </div>
    </>
  );

  /* ── Desktop rail ── */
  if (variant === 'rail') {
    return (
      <aside
        className="sidebar-rail"
        onMouseEnter={e => e.currentTarget.setAttribute('data-expanded', 'true')}
        onMouseLeave={e => e.currentTarget.removeAttribute('data-expanded')}
      >
        {inner}
      </aside>
    );
  }

  /* ── Mobile drawer ── */
  return (
    <aside className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
      {inner}
    </aside>
  );
}
