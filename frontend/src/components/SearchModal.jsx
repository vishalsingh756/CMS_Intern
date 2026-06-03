import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUsers, FiTrendingUp, FiCheckSquare, FiMessageSquare, FiX, FiArrowRight } from 'react-icons/fi';
import { clientService, dealService, taskService, interactionService } from '../services/api';

const SECTIONS = [
  { key: 'clients',      label: 'Clients',      icon: FiUsers,         color: 'var(--blue)',   bg: 'var(--blue-s)' },
  { key: 'deals',        label: 'Deals',        icon: FiTrendingUp,    color: 'var(--green)',  bg: 'var(--green-s)' },
  { key: 'tasks',        label: 'Tasks',        icon: FiCheckSquare,   color: 'var(--purple)', bg: 'var(--purple-s)' },
  { key: 'interactions', label: 'Interactions', icon: FiMessageSquare, color: 'var(--orange)', bg: 'var(--orange-s)' },
];

function getResultLabel(key, item) {
  switch (key) {
    case 'clients':      return item.name || item.companyName || 'Unnamed';
    case 'deals':        return item.title || item.name || 'Unnamed';
    case 'tasks':        return item.title || item.name || 'Unnamed';
    case 'interactions': return item.subject || item.notes?.slice(0, 60) || 'Interaction';
    default:             return 'Unknown';
  }
}

function getResultSub(key, item) {
  switch (key) {
    case 'clients':      return item.email || item.industry || '';
    case 'deals':        return item.stage ? `Stage: ${item.stage}` : (item.value ? `$${item.value}` : '');
    case 'tasks':        return item.status || item.priority || '';
    case 'interactions': return item.type || '';
    default:             return '';
  }
}

function getResultPath(key, item) {
  switch (key) {
    case 'clients':      return `/clients/${item._id}`;
    case 'deals':        return `/deals`;
    case 'tasks':        return `/tasks`;
    case 'interactions': return `/interactions`;
    default:             return '/';
  }
}

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef  = useRef(null);

  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [active,  setActive]  = useState(0); // flat index

  // Flatten all results into one list for keyboard nav
  const flat = SECTIONS.flatMap(s =>
    (results[s.key] || []).slice(0, 4).map(item => ({ section: s, item }))
  );

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults({}); return; }
    setLoading(true);
    try {
      const [cl, dl, tk, ix] = await Promise.allSettled([
        clientService.getClients({ search: q, limit: 4 }),
        dealService.getDeals({ search: q, limit: 4 }),
        taskService.getTasks({ search: q, limit: 4 }),
        interactionService.getInteractions({ search: q, limit: 4 }),
      ]);
      setResults({
        clients:      cl.status === 'fulfilled' ? (cl.value.data?.data?.clients || cl.value.data?.data || []) : [],
        deals:        dl.status === 'fulfilled' ? (dl.value.data?.data?.deals   || dl.value.data?.data || []) : [],
        tasks:        tk.status === 'fulfilled' ? (tk.value.data?.data?.tasks   || tk.value.data?.data || []) : [],
        interactions: ix.status === 'fulfilled' ? (ix.value.data?.data?.interactions || ix.value.data?.data || []) : [],
      });
    } finally {
      setLoading(false);
    }
    setActive(0);
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 280);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults({});
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : void 0; // parent toggles
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, flat.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && flat[active]) {
      navigate(getResultPath(flat[active].section.key, flat[active].item));
      onClose();
    }
  };

  const go = (section, item) => {
    navigate(getResultPath(section.key, item));
    onClose();
  };

  if (!isOpen) return null;

  const hasAny = flat.length > 0;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,20,30,0.5)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '12vh',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '560px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
          margin: '0 16px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '14px 16px',
          borderBottom: hasAny || loading || query ? '1px solid var(--border)' : 'none',
        }}>
          <FiSearch size={17} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search clients, deals, tasks, interactions…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: '15px', color: 'var(--text-1)',
              fontFamily: 'inherit',
            }}
          />
          {loading && <div className="spinner spinner-sm" />}
          {query && !loading && (
            <button
              className="btn-icon"
              onClick={() => { setQuery(''); setResults({}); inputRef.current?.focus(); }}
              style={{ width: 24, height: 24 }}
            >
              <FiX size={13} />
            </button>
          )}
          <kbd style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: '5px', padding: '2px 6px', fontSize: '11px',
            color: 'var(--text-3)', fontFamily: 'inherit', flexShrink: 0,
          }}>Esc</kbd>
        </div>

        {/* Results */}
        {hasAny ? (
          <div ref={listRef} style={{ maxHeight: '420px', overflowY: 'auto', padding: '8px' }}>
            {SECTIONS.map(section => {
              const items = (results[section.key] || []).slice(0, 4);
              if (!items.length) return null;
              const Icon = section.icon;
              return (
                <div key={section.key} style={{ marginBottom: '4px' }}>
                  {/* Section header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 10px 4px',
                    fontSize: '10.5px', fontWeight: 700,
                    color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    <Icon size={11} />
                    {section.label}
                  </div>
                  {items.map(item => {
                    const flatIdx = flat.findIndex(f => f.section.key === section.key && f.item === item);
                    const isActive = flatIdx === active;
                    return (
                      <button
                        key={item._id}
                        onClick={() => go(section, item)}
                        onMouseEnter={() => setActive(flatIdx)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px 10px', borderRadius: '8px',
                          background: isActive ? 'var(--accent-s)' : 'transparent',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          transition: 'background 0.1s',
                        }}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: '7px', flexShrink: 0,
                          background: section.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon size={13} style={{ color: section.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '13px', fontWeight: 600,
                            color: isActive ? 'var(--accent)' : 'var(--text-1)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {getResultLabel(section.key, item)}
                          </div>
                          {getResultSub(section.key, item) && (
                            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginTop: '1px' }}>
                              {getResultSub(section.key, item)}
                            </div>
                          )}
                        </div>
                        {isActive && <FiArrowRight size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : query && !loading ? (
          <div style={{
            padding: '32px 20px', textAlign: 'center',
            color: 'var(--text-3)', fontSize: '13.5px',
          }}>
            No results for <strong style={{ color: 'var(--text-2)' }}>"{query}"</strong>
          </div>
        ) : !query ? (
          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Quick Navigate
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { label: 'Clients',      path: '/clients',      icon: FiUsers,         color: 'var(--blue)',   bg: 'var(--blue-s)' },
                { label: 'Deals',        path: '/deals',        icon: FiTrendingUp,    color: 'var(--green)',  bg: 'var(--green-s)' },
                { label: 'Tasks',        path: '/tasks',        icon: FiCheckSquare,   color: 'var(--purple)', bg: 'var(--purple-s)' },
                { label: 'Interactions', path: '/interactions', icon: FiMessageSquare, color: 'var(--orange)', bg: 'var(--orange-s)' },
              ].map(({ label, path, icon: Icon, color, bg }) => (
                <button
                  key={path}
                  onClick={() => { navigate(path); onClose(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 10px', borderRadius: '7px',
                    background: bg, border: '1px solid transparent',
                    cursor: 'pointer', fontSize: '12.5px', fontWeight: 600,
                    color, transition: 'all 0.12s',
                  }}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '14px', padding: '8px 0 0', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
              <span><kbd style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 5px', marginRight: '4px' }}>↑↓</kbd>Navigate</span>
              <span><kbd style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 5px', marginRight: '4px' }}>↵</kbd>Open</span>
              <span><kbd style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 5px', marginRight: '4px' }}>Esc</kbd>Close</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
