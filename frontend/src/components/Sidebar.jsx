import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiTrendingUp, FiCheckSquare,
  FiMessageSquare, FiActivity, FiLogOut, FiLayers,
  FiPieChart, FiTarget, FiChevronRight,
} from 'react-icons/fi';
import { RiUser3Line } from 'react-icons/ri';
import useAuthStore from '../utils/authStore';

const nav = [
  { path: '/dashboard',     icon: FiHome,          label: 'Dashboard' },
  { path: '/leads',         icon: FiTarget,        label: 'Leads',        roles: ['author','editor','admin'] },
  { path: '/clients',       icon: FiUsers,         label: 'Clients',      roles: ['author','editor','admin'] },
  { path: '/deals',         icon: FiTrendingUp,    label: 'Deals',        roles: ['author','editor','admin'] },
  { path: '/tasks',         icon: FiCheckSquare,   label: 'Tasks',        roles: ['author','editor','admin'] },
  { path: '/interactions',  icon: FiMessageSquare, label: 'Interactions', roles: ['author','editor','admin'] },
  { path: '/reports',       icon: FiPieChart,      label: 'Reports',      roles: ['author','editor','admin'] },
  { path: '/users',         icon: RiUser3Line,     label: 'Users',        roles: ['admin'] },
  { path: '/activity-logs', icon: FiActivity,      label: 'Activity',     roles: ['admin'] },
];

export default function Sidebar({ isOpen, onClose, alwaysVisible }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');
  const go       = (p) => { navigate(p); if (!alwaysVisible) onClose?.(); };
  const filtered = nav.filter(item => !item.roles || item.roles.includes(user?.role));
  const initials  = (user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase();

  /* ── Hover-expand sidebar (desktop) ── */
  if (alwaysVisible) {
    return (
      <aside
        className="sidebar-rail"
        onMouseEnter={e => e.currentTarget.setAttribute('data-expanded', 'true')}
        onMouseLeave={e => e.currentTarget.removeAttribute('data-expanded')}
      >
        {/* Logo */}
        <button className="rail-logo" onClick={() => go('/dashboard')}>
          <div className="rail-logo-mark">
            <FiLayers size={14} color="#fff" />
          </div>
          <span className="rail-logo-name">CMS</span>
        </button>

        {/* Nav items */}
        <nav className="rail-nav">
          <div className="rail-section-label">Navigation</div>
          {filtered.map(item => {
            const Icon   = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className={`rail-item ${active ? 'active' : ''}`}
                title={item.label}
              >
                <div className="rail-item-icon">
                  <Icon size={17} />
                </div>
                <span className="rail-item-label">{item.label}</span>
                {active && <FiChevronRight size={11} className="rail-item-arrow" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="rail-footer">
          <button className="rail-user" onClick={() => go('/profile')}>
            <div className="rail-avatar">{initials}</div>
            <div className="rail-user-info">
              <div className="rail-user-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username}
              </div>
              <div className="rail-user-role">{user?.role}</div>
            </div>
          </button>
          <button className="rail-logout" onClick={() => { logout(); navigate('/login'); }}>
            <FiLogOut size={14} />
            <span className="rail-item-label">Sign out</span>
          </button>
        </div>
      </aside>
    );
  }

  /* ── Mobile drawer ── */
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}
      <aside
        className="sidebar"
        style={{
          position: 'fixed', zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        <button className="sidebar-logo" onClick={() => go('/dashboard')}
          style={{ background:'none', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
          <div className="sidebar-logo-mark"><FiLayers size={14} color="#fff" /></div>
          <div>
            <div className="sidebar-logo-name">CMS</div>
            <div className="sidebar-logo-sub">Management Suite</div>
          </div>
        </button>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Navigation</div>
          {filtered.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => go(item.path)}
                className={`sidebar-item ${active ? 'active' : ''}`}>
                <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.55 }} />
                {item.label}
                {active && <span className="sidebar-item-dot" />}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-user" onClick={() => go('/profile')}>
            <div className="sidebar-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username}
              </div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </button>
          <button className="sidebar-logout" onClick={() => { logout(); navigate('/login'); }}>
            <FiLogOut size={13} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
