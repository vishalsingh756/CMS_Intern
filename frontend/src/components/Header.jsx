import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiSun, FiMoon, FiInfo } from 'react-icons/fi';
import useAuthStore from '../utils/authStore';
import SearchModal from './SearchModal';
import NotificationPanel from './NotificationPanel';

const titles = {
  '/dashboard':     'Dashboard',
  '/clients':       'Clients',
  '/deals':         'Deals',
  '/tasks':         'Tasks',
  '/interactions':  'Interactions',
  '/users':         'Users',
  '/activity-logs': 'Activity Logs',
  '/reports':       'Reports',
  '/profile':       'Profile',
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const title = (() => {
    const ex = titles[location.pathname];
    if (ex) return ex;
    for (const [k, v] of Object.entries(titles))
      if (location.pathname.startsWith(k + '/')) return v;
    return 'CMS';
  })();

  // Global Ctrl+K / ⌘+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="topbar">
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onMenuClick}
            id="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-1)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <FiMenu size={20} />
          </button>
          <span className="topbar-title">{title}</span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Search pill — opens modal */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '7px',
              padding: '5px 12px',
              color: 'var(--text-3)',
              fontSize: '12.5px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border-2)';
              e.currentTarget.style.color = 'var(--text-2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--surface-2)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-3)';
            }}
            title="Search (Ctrl+K)"
          >
            <FiSearch size={13} />
            <span>Search…</span>
            <kbd style={{
              marginLeft: '6px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '1px 5px',
              fontSize: '10px',
              color: 'var(--text-3)',
              fontFamily: 'inherit',
            }}>⌘K</kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              width: '30px', height: '30px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginRight: '2px'
            }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--surface-3)';
              e.currentTarget.style.borderColor = 'var(--border-2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--surface-2)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            {theme === 'light' ? <FiMoon size={14} /> : <FiSun size={14} />}
          </button>

          {/* About/Help Button */}
          <button
            onClick={() => navigate('/about')}
            style={{
              width: '30px', height: '30px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginRight: '2px'
            }}
            title="About & Help"
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--surface-3)';
              e.currentTarget.style.borderColor = 'var(--border-2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--surface-2)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <FiInfo size={14} />
          </button>

          {/* Notification bell */}
          <NotificationPanel />

          {/* Avatar */}
          <div
            style={{
              width: '30px', height: '30px',
              borderRadius: '8px',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: '#fff',
              boxShadow: '0 2px 6px rgba(79,70,229,0.3)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            title={user?.firstName || user?.username}
            onClick={() => navigate('/profile')}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(79,70,229,0.3)';
            }}
          >
            {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
          </div>
        </div>
      </header>

      {/* Global search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
