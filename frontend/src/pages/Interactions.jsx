import { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiX,
  FiChevronLeft, FiChevronRight, FiMessageSquare,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { interactionService, clientService } from '../services/api';
import { toast } from 'react-toastify';

const TYPE_ICON  = { email:'📧', phone:'📞', meeting:'🤝', note:'📝', site_visit:'🏢' };
const TYPE_COLOR = { email:'var(--blue)', phone:'var(--green)', meeting:'var(--purple)', note:'var(--yellow)', site_visit:'var(--orange)' };

const OUTCOME_BADGE = {
  positive: 'badge badge-green',
  negative: 'badge badge-red',
  neutral:  'badge badge-gray',
  pending:  'badge badge-yellow',
};

const EMPTY = { client:'', type:'email', subject:'', description:'', date:'', outcome:'pending', nextFollowUp:'' };

function Modal({ open, onClose, title, mw=500, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:mw }}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn-icon" onClick={onClose}><FiX size={15} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default function Interactions() {
  const [items, setItems]       = useState([]);
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [totalPages, setTP]     = useState(1);
  const [total, setTotal]       = useState(0);
  const [filterClient, setFC]   = useState('');
  const [filterType, setFT]     = useState('');
  const [modal, setModal]       = useState(false);
  const [editI, setEditI]       = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [fLoad, setFLoad]       = useState(false);
  const [delId, setDelId]       = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await interactionService.getInteractions({ page, limit:15, client:filterClient||undefined, type:filterType||undefined });
      setItems(r.data.data.interactions);
      setTP(r.data.data.pagination.pages);
      setTotal(r.data.data.pagination.total);
    } catch { toast.error('Failed to load interactions'); }
    finally { setLoading(false); }
  }, [page, filterClient, filterType]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => {
    clientService.getClients({ limit:200 }).then(r => setClients(r.data.data.clients||[])).catch(() => {});
  }, []);

  const openCreate = () => { setEditI(null); setForm({ ...EMPTY, date: new Date().toISOString().slice(0,16) }); setModal(true); };
  const openEdit   = i => {
    setEditI(i);
    setForm({ client:i.client?._id||'', type:i.type, subject:i.subject, description:i.description,
      date: i.date ? i.date.slice(0,16) : '', outcome:i.outcome,
      nextFollowUp: i.nextFollowUp ? i.nextFollowUp.slice(0,10) : '' });
    setModal(true);
  };

  const save = async e => {
    e.preventDefault(); setFLoad(true);
    try {
      editI
        ? (await interactionService.updateInteraction(editI._id, form), toast.success('Updated'))
        : (await interactionService.createInteraction(form),            toast.success('Interaction logged'));
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setFLoad(false); }
  };

  const del = async id => {
    try { await interactionService.deleteInteraction(id); toast.success('Deleted'); setDelId(null); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <Layout>
      <div className="page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Interactions</h1>
            <p className="page-sub">{total} interactions logged</p>
          </div>
          <button onClick={openCreate} className="btn btn-primary">
            <FiPlus size={14} /> Log Interaction
          </button>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <select value={filterClient} onChange={e => { setFC(e.target.value); setPage(1); }}
            className="input" style={{ flex:1, minWidth:'160px', minHeight:'36px' }}>
            <option value="">All Clients</option>
            {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
          </select>
          <select value={filterType} onChange={e => { setFT(e.target.value); setPage(1); }}
            className="input" style={{ width:'auto', minWidth:'140px', minHeight:'36px' }}>
            <option value="">All Types</option>
            {['email','phone','meeting','note','site_visit'].map(t =>
              <option key={t} value={t}>{t.replace('_',' ')}</option>
            )}
          </select>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="empty"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="card">
            <div className="empty">
              <FiMessageSquare size={32} className="empty-icon" />
              <p className="empty-title">No interactions yet</p>
              <p className="empty-sub">Start logging client interactions to track relationships</p>
              <button onClick={openCreate} className="btn btn-primary" style={{ marginTop:'14px' }}>
                <FiPlus size={13} /> Log Interaction
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {items.map(i => (
              <div key={i._id} className="card" style={{ padding:'16px 18px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'13px' }}>
                  {/* Icon */}
                  <div style={{
                    width:'40px', height:'40px', borderRadius:'10px', flexShrink:0,
                    background: (TYPE_COLOR[i.type]||'var(--accent)') + '15',
                    border:`1px solid ${TYPE_COLOR[i.type]||'var(--accent)'}30`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'18px',
                  }}>
                    {TYPE_ICON[i.type] || '📌'}
                  </div>

                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'10px', flexWrap:'wrap' }}>
                      <div>
                        <p style={{ fontWeight:600, fontSize:'14px', color:'var(--text-1)' }}>{i.subject}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'3px', flexWrap:'wrap' }}>
                          <span style={{ fontSize:'11.5px', color:'var(--text-3)', textTransform:'capitalize' }}>
                            {i.type.replace('_',' ')}
                          </span>
                          <span style={{ color:'var(--border-2)' }}>·</span>
                          <span style={{ fontSize:'11.5px', color:'var(--text-3)' }}>{i.client?.companyName}</span>
                          <span style={{ color:'var(--border-2)' }}>·</span>
                          <span style={{ fontSize:'11.5px', color:'var(--text-3)' }}>{new Date(i.date).toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        <span className={OUTCOME_BADGE[i.outcome]||'badge badge-gray'}>{i.outcome}</span>
                        <button className="btn-icon" onClick={() => openEdit(i)}><FiEdit2 size={13} /></button>
                        <button className="btn-icon danger" onClick={() => setDelId(i._id)}><FiTrash2 size={13} /></button>
                      </div>
                    </div>

                    {i.description && (
                      <p style={{ fontSize:'13px', color:'var(--text-2)', marginTop:'8px', lineHeight:1.6 }}
                        className="truncate-2">{i.description}</p>
                    )}

                    {i.nextFollowUp && (
                      <div style={{ display:'flex', alignItems:'center', gap:'5px', marginTop:'8px' }}>
                        <span style={{ fontSize:'11px', fontWeight:600, color:'var(--accent)',
                          background:'var(--accent-s)', border:'1px solid #c7d2fe',
                          padding:'2px 8px', borderRadius:'99px' }}>
                          📅 Follow-up: {new Date(i.nextFollowUp).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'6px' }}>
                      by {i.createdBy?.username || '—'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'16px' }}>
            <span style={{ fontSize:'12.5px', color:'var(--text-3)' }}>Page {page} of {totalPages}</span>
            <div style={{ display:'flex', gap:'6px' }}>
              <button className="btn btn-ghost" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ padding:'6px 10px' }}><FiChevronLeft size={14} /></button>
              <button className="btn btn-ghost" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:'6px 10px' }}><FiChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Log/Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editI ? 'Edit Interaction' : 'Log Interaction'}>
        <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'13px' }}>
          <div className="form-grid">
            <div>
              <label className="label">Client *</label>
              <select name="client" value={form.client} onChange={ch} required className="input">
                <option value="">Select Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Type *</label>
              <select name="type" value={form.type} onChange={ch} className="input">
                {['email','phone','meeting','note','site_visit'].map(t =>
                  <option key={t} value={t}>{t.replace('_',' ')}</option>
                )}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Subject *</label>
            <input name="subject" value={form.subject} onChange={ch} required placeholder="Discussed pricing proposal…" className="input" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea name="description" value={form.description} onChange={ch} required rows={4} placeholder="Details of the interaction…" className="input" style={{ resize:'none' }} />
          </div>
          <div className="form-grid">
            <div>
              <label className="label">Date & Time *</label>
              <input type="datetime-local" name="date" value={form.date} onChange={ch} required className="input" />
            </div>
            <div>
              <label className="label">Outcome</label>
              <select name="outcome" value={form.outcome} onChange={ch} className="input">
                {['positive','negative','neutral','pending'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Next Follow-up</label>
            <input type="date" name="nextFollowUp" value={form.nextFollowUp} onChange={ch} className="input" />
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'2px' }}>
            <button type="button" onClick={() => setModal(false)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button type="submit" disabled={fLoad} className="btn btn-primary" style={{ flex:1 }}>
              {fLoad ? <span className="spinner spinner-sm spinner-white" /> : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Interaction" mw={360}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:'var(--red-s)', border:'1px solid #fecaca', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <FiTrash2 size={20} color="var(--red)" />
          </div>
          <p style={{ fontSize:'14px', color:'var(--text-2)', marginBottom:'20px' }}>Delete this interaction? Cannot be undone.</p>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => setDelId(null)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button onClick={() => del(delId)} className="btn btn-danger" style={{ flex:1 }}>Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
