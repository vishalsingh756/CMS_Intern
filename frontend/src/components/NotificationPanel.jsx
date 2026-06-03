import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell, FiX, FiUsers, FiTrendingUp, FiCheckSquare,
  FiMessageSquare, FiUser, FiLogIn, FiLogOut, FiActivity,
} from 'react-icons/fi';
import { activityService } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const ACTION_META = {
  create_client:       { label: 'New client added',        icon: FiUsers,         color: 'var(--blue)',   bg: 'var(--blue-s)' },
  edit_client:         { label: 'Client updated',          icon: FiUsers,         color: 'var(--blue)',   bg: 'var(--blue-s)' },
  delete_client:       { label: 'Client deleted',          icon: FiUsers,         color: 'var(--red)',    bg: 'var(--red-s)' },
  create_deal:         { label: 'New deal created',        icon: FiTrendingUp,    color: 'var(--green)',  bg: 'var(--green-s)' },
  edit_deal:           { label: 'Deal updated',            icon: FiTrendingUp,    color: 'var(--green)',  bg: 'var(--green-s)' },
  delete_deal:         { label: 'Deal deleted',            icon: FiTrendingUp,    color: 'var(--red)',    bg: 'var(--red-s)' },
  win_deal:            { label: 'Deal won! 🎉',             icon: FiTrendingUp,    color: 'var(--green)',  bg: 'var(--green-s)' },
  lose_deal:           { label: 'Deal lost',               icon: FiTrendingUp,    color: 'var(--red)',    bg: 'var(--red-s)' },
  create_task:         { label: 'New task created',        icon: FiCheckSquare,   color: 'var(--purple)', bg: 'var(--purple-s)' },
  complete_task:       { label: 'Task completed ✓',        icon: FiCheckSquare,   color: 'var(--green)',  bg: 'var(--green-s)' },
  delete_task:         { label: 'Task deleted',            icon: FiCheckSquare,   color: 'var(--red)',    bg: 'var(--red-s)' },
  create_interaction:  { label: 'Interaction logged',      icon: FiMessageSquare, color: 'var(--orange)', bg: 'var(--orange-s)' },
  edit_interaction:    { label: 'Interaction updated',     icon: FiMessageSquare, color: 'var(--orange)', bg: 'var(--orange-s)' },
  delete_interaction:  { label: 'Interaction deleted',     icon: FiMessageSquare, color: 'var(--red)',    bg: 'var(--red-s)' },
  create_user:         { label: 'New user registered',     icon: FiUser,          color: 'var(--accent)', bg: 'var(--accent-s)' },
  edit_user:           { label: 'User profile updated',    icon: FiUser,          color: 'var(--accent)', bg: 'var(--accent-s)' },
  delete_user:         { label: 'User removed',            icon: FiUser,          color: 'var(--red)',    bg: 'var(--red-s)' },
  login:               { label: 'User signed in',          icon: FiLogIn,         color: 'var(--text-2)', bg: 'var(--surface-2)' },
  logout:              { label: 'User signed out',         icon: FiLogOut,        color: 'var(--text-2)', bg: 'var(--surface-2)' },
};

const ENTITY_PATH = {
  client:      (id) => `/clients/${id}`,
  deal:        ()   => `/deals`,
  task:        ()   => `/tasks`,
  interaction: ()   => `/interactions`,
  user:        ()   => `/users`,
};

const STORAGE_KEY = 'cms_notif_read_ts';

export default function NotificationPanel() {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const btnRef   = useRef(null);

  const [open,    setOpen]    = useState(false);
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [unread,  setUnread]  = useState(0);
  const [lastRead, setLastRead] = useState(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? new Date(v) : null;
  });

  const fetchNotifs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await activityService.getLogs({ limit: 20, sort: '-createdAt' });
      const logs = res.data?.data?.logs || res.data?.data || [];
      setNotifs(Array.isArray(logs) ? logs : []);
    } catch {
      // silently fail — user may not have admin access
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling every 60s
  useEffect(() => {
    fetchNotifs();
    const id = setInterval(fetchNotifs, 60_000);
    return () => clearInterval(id);
  }, [fetchNotifs]);

  // Count unread
  useEffect(() => {
    if (!lastRead) {
      setUnread(notifs.length);
    } else {
      setUnread(notifs.filter(n => new Date(n.createdAt) > lastRead).length);
    }
  }, [notifs, lastRead]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (open && !panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const markAllRead = () => {
    const now = new Date();
    setLastRead(now);
    localStorage.setItem(STORAGE_KEY, now.toISOString());
    setUnread(0);
  };

  const handleOpen = () => {
    setOpen(v => !v);
    if (!open) fetchNotifs(); // refresh on open
  };

  const handleNotifClick = (notif) => {
    const pathFn = ENTITY_PATH[notif.entityType];
    if (pathFn) {
      navigate(pathFn(notif.entityId));
      setOpen(false);
    }
  };

  const meta = (action) => ACTION_META[action] || {
    label: action?.replace(/_/g, ' ') || 'Activity',
    icon: FiActivity,
    color: 'var(--text-2)',
    bg: 'var(--surface-2)',
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        ref={btnRef}
        className="btn-icon"
        onClick={handleOpen}
        title="Notifications"
        style={{
          position: 'relative',
          background: open ? 'var(--accent-s)' : undefined,
          color: open ? 'var(--accent)' : undefined,
          borderColor: open ? 'var(--accent)' : undefined,
        }}
      >
        <FiBell size={16} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '4px', right: '4px',
            width: unread > 9 ? '14px' : '8px',
            height: '8px',
            background: 'var(--red)',
            borderRadius: '99px',
            border: '1.5px solid var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '8px', fontWeight: 800, color: '#fff',
            lineHeight: 1,
            transition: 'all 0.2s',
            animation: 'pulse-dot 2s ease infinite',
          }}>
            {unread > 9 ? '9+' : ''}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: '340px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 9000,
            overflow: 'hidden',
            animation: 'scaleIn 0.18s cubic-bezier(0.16,1,0.3,1)',
            transformOrigin: 'top right',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px 12px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
                Notifications
              </div>
              {unread > 0 && (
                <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginTop: '1px' }}>
                  {unread} new since last visit
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    fontSize: '11.5px', fontWeight: 600,
                    color: 'var(--accent)', background: 'var(--accent-s)',
                    border: '1px solid #c7d2fe', borderRadius: '6px',
                    padding: '3px 9px', cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                >
                  Mark all read
                </button>
              )}
              <button className="btn-icon" style={{ width: 26, height: 26 }} onClick={() => setOpen(false)}>
                <FiX size={13} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {loading && notifs.length === 0 ? (
              <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner" />
              </div>
            ) : notifs.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <FiBell size={28} style={{ color: '#d1d5db', marginBottom: '10px' }} />
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-2)' }}>All caught up!</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>No recent activity to show.</div>
              </div>
            ) : (
              notifs.map(notif => {
                const m = meta(notif.action);
                const Icon = m.icon;
                const isNew = lastRead ? new Date(notif.createdAt) > lastRead : true;
                const hasLink = !!ENTITY_PATH[notif.entityType];
                return (
                  <div
                    key={notif._id}
                    onClick={() => hasLink && handleNotifClick(notif)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      padding: '11px 14px',
                      background: isNew ? 'rgba(79,70,229,0.03)' : 'transparent',
                      borderBottom: '1px solid var(--border)',
                      cursor: hasLink ? 'pointer' : 'default',
                      transition: 'background 0.12s',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { if (hasLink) e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isNew ? 'rgba(79,70,229,0.03)' : 'transparent'; }}
                  >
                    {/* Unread dot */}
                    {isNew && (
                      <span style={{
                        position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)',
                        width: '5px', height: '5px', borderRadius: '50%',
                        background: 'var(--accent)',
                      }} />
                    )}

                    {/* Icon */}
                    <div style={{
                      width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
                      background: m.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginLeft: '4px',
                    }}>
                      <Icon size={14} style={{ color: m.color }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '1px' }}>
                        {m.label}
                      </div>
                      {notif.description && (
                        <div style={{
                          fontSize: '12px', color: 'var(--text-2)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {notif.description}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                        {notif.user?.firstName && (
                          <>
                            <span style={{ fontSize: '11px', color: 'var(--border-2)' }}>·</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                              {notif.user.firstName} {notif.user.lastName || ''}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div style={{
              padding: '10px 14px',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
            }}>
              <button
                onClick={() => { navigate('/activity-logs'); setOpen(false); }}
                style={{
                  fontSize: '12.5px', fontWeight: 600,
                  color: 'var(--accent)', background: 'none',
                  border: 'none', cursor: 'pointer',
                  transition: 'opacity 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                View all activity logs →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
