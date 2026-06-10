import { useState, useEffect } from 'react';
import { FiActivity, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Layout from '../components/Layout';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const ACTION_ICONS = {
  login:'🔐', logout:'🚪',
  create_client:'👤', edit_client:'✏️', delete_client:'🗑️',
  create_deal:'💰', edit_deal:'✏️', delete_deal:'🗑️', win_deal:'🏆', lose_deal:'😞',
  create_task:'✅', update_task:'🔄', complete_task:'✅', delete_task:'🗑️',
  create_interaction:'💬', edit_interaction:'✏️', delete_interaction:'🗑️',
  create_user:'👤', edit_user:'✏️',
};
const ACTION_COLOR = {
  login:'var(--green)', logout:'var(--text-3)',
  create_client:'var(--accent)', edit_client:'var(--blue)', delete_client:'var(--red)',
  create_deal:'var(--green)', win_deal:'var(--green)', lose_deal:'var(--red)',
  create_task:'var(--yellow)', complete_task:'var(--green)', delete_task:'var(--red)',
};

export default function ActivityLogs() {
  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [totalPages, setTP]     = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await apiClient.get('/activity', { params:{ page, limit:25 } });
        setLogs(r.data.data.logs || r.data.data || []);
        setTP(r.data.data.pagination?.pages || 1);
      } catch {
        try {
          const r2 = await apiClient.get('/auth/activity', { params:{ page, limit:25 } });
          setLogs(r2.data.data || []);
        } catch { toast.error('Failed to load activity logs'); }
      } finally { setLoading(false); }
    };
    load();
  }, [page]);

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Activity Logs</h1>
            <p className="page-sub">System-wide audit trail</p>
          </div>
        </div>

        <div className="card" style={{ overflow:'hidden' }}>
          {loading ? (
            <div className="empty"><div className="spinner" /></div>
          ) : logs.length === 0 ? (
            <div className="empty">
              <FiActivity size={32} className="empty-icon" />
              <p className="empty-title">No activity yet</p>
              <p className="empty-sub">Actions will appear here as the system is used</p>
            </div>
          ) : (
            <div>
              {logs.map((log, i) => {
                const color = ACTION_COLOR[log.action] || 'var(--accent)';
                return (
                  <div key={log._id||i} style={{
                    display:'flex', alignItems:'flex-start', gap:'13px',
                    padding:'13px 18px',
                    borderBottom:'1px solid var(--border)',
                    transition:'background 0.12s',
                    background: 'var(--bg-surface)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background='var(--bg-surface)'}
                  >
                    {/* Icon bubble */}
                    <div style={{
                      width:'36px', height:'36px', borderRadius:'9px', flexShrink:0,
                      background: color+'12', border:`1px solid ${color}25`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'16px',
                    }}>
                      {ACTION_ICONS[log.action] || '📌'}
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'13.5px', fontWeight:600, color:'var(--text-1)', textTransform:'capitalize' }}>
                          {log.action?.replace(/_/g,' ') || 'Action'}
                        </span>
                        {log.entityType && (
                          <>
                            <span style={{ color:'var(--border-2)' }}>·</span>
                            <span style={{ fontSize:'11.5px', color:'var(--text-3)', textTransform:'capitalize' }}>
                              {log.entityType}
                            </span>
                          </>
                        )}
                      </div>
                      <p style={{ fontSize:'11.5px', color:'var(--text-3)', marginTop:'2px' }}>
                        by <strong style={{ color:'var(--text-2)', fontWeight:600 }}>
                          {log.user?.username || log.userId?.username || 'Unknown'}
                        </strong>
                        {' · '}
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                      </p>
                    </div>

                    {/* Time chip */}
                    <div style={{ fontSize:'11px', color:'var(--text-3)', flexShrink:0, paddingTop:'2px' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'14px' }}>
            <span style={{ fontSize:'12.5px', color:'var(--text-3)' }}>Page {page} of {totalPages}</span>
            <div style={{ display:'flex', gap:'6px' }}>
              <button className="btn btn-ghost" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ padding:'6px 10px' }}><FiChevronLeft size={14} /></button>
              <button className="btn btn-ghost" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:'6px 10px' }}><FiChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
