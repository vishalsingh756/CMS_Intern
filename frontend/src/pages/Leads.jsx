import { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX,
  FiChevronLeft, FiChevronRight, FiUsers, FiAward, FiArrowRight,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { leadService } from '../services/api';
import { toast } from 'react-toastify';

const STATUS_BADGE = {
  new:         'badge badge-blue',
  contacted:   'badge badge-yellow',
  qualified:   'badge badge-purple',
  unqualified: 'badge badge-red',
  converted:   'badge badge-green',
};

const CATEGORY_BADGE = {
  hot:  'badge badge-red',
  warm: 'badge badge-yellow',
  cold: 'badge badge-blue',
};

const STATUS_CONFIG = [
  { key: 'new',         label: 'New' },
  { key: 'contacted',   label: 'Contacted' },
  { key: 'qualified',   label: 'Qualified' },
  { key: 'unqualified', label: 'Unqualified' },
  { key: 'converted',   label: 'Converted' },
];

const EMPTY_LEAD = {
  name: '', company: '', email: '', phone: '',
  source: 'other', industry: '', budget: '', notes: '', tags: '',
};

function Modal({ open, onClose, title, mw = 520, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: mw }}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn-icon" onClick={onClose}><FiX size={15} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modal, setModal] = useState(false);
  const [editL, setEditL] = useState(null);
  const [form, setForm] = useState(EMPTY_LEAD);
  const [fLoad, setFLoad] = useState(false);
  const [delId, setDelId] = useState(null);

  // Lead score modal state
  const [scoreModal, setScoreModal] = useState(false);
  const [scoreLeadId, setScoreLeadId] = useState(null);
  const [scoreForm, setScoreForm] = useState({ factor: 'website_visit', points: 10, note: '' });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const r = await leadService.getLeads({ page, limit: 10, status: status || undefined, search: search || undefined });
      setLeads(r.data.data.leads || []);
      setTP(r.data.data.pagination.pages);
      setTotal(r.data.data.pagination.total);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const openCreate = () => { setEditL(null); setForm(EMPTY_LEAD); setModal(true); };
  const openEdit = l => {
    setEditL(l);
    setForm({
      name: l.name,
      company: l.company || '',
      email: l.email || '',
      phone: l.phone || '',
      source: l.source || 'other',
      industry: l.industry || '',
      budget: l.budget || '',
      notes: l.notes || '',
      tags: l.tags ? l.tags.join(', ') : '',
    });
    setModal(true);
  };

  const save = async e => {
    e.preventDefault();
    setFLoad(true);
    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (editL) {
        await leadService.updateLead(editL._id, payload);
        toast.success('Lead updated');
      } else {
        await leadService.createLead(payload);
        toast.success('Lead created');
      }
      setModal(false);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setFLoad(false);
    }
  };

  const del = async id => {
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted');
      setDelId(null);
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const handleConvert = async id => {
    if (!window.confirm('Convert this lead to a Client and Deal?')) return;
    try {
      await leadService.convertLead(id);
      toast.success('Lead converted successfully!');
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to convert lead');
    }
  };

  const openScoreModal = id => {
    setScoreLeadId(id);
    setScoreForm({ factor: 'website_visit', points: 10, note: '' });
    setScoreModal(true);
  };

  const saveScore = async e => {
    e.preventDefault();
    try {
      await leadService.addScore(scoreLeadId, scoreForm);
      toast.success('Lead score updated');
      setScoreModal(false);
      fetchLeads();
    } catch {
      toast.error('Failed to add score');
    }
  };

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const chScore = e => setScoreForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <Layout>
      <div className="page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Lead Management</h1>
            <p className="page-sub">{total} leads registered</p>
          </div>
          <button onClick={openCreate} className="btn btn-primary">
            <FiPlus size={14} /> New Lead
          </button>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="search-wrap">
            <FiSearch size={14} className="search-icon" />
            <input type="text" placeholder="Search leads…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input input-icon-left" style={{ minHeight: '36px' }} />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="input" style={{ width: 'auto', minWidth: '130px', minHeight: '36px' }}>
            <option value="">All Statuses</option>
            {STATUS_CONFIG.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div className="empty"><div className="spinner" /></div>
          ) : leads.length === 0 ? (
            <div className="empty">
              <FiUsers size={32} className="empty-icon" />
              <p className="empty-title">No leads found</p>
              <p className="empty-sub">Create your first lead to start tracking potential clients</p>
              <button onClick={openCreate} className="btn btn-primary" style={{ marginTop: '14px' }}>
                <FiPlus size={13} /> New Lead
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email & Phone</th>
                    <th>Source & Industry</th>
                    <th>Status</th>
                    <th>Score / Cat</th>
                    <th>Budget</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l._id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{l.name}</div>
                        {l.tags && l.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {l.tags.map(t => <span key={t} className="badge badge-gray" style={{ fontSize: '10px' }}>{t}</span>)}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-2)' }}>{l.company || '—'}</td>
                      <td>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-1)' }}>{l.email || '—'}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>{l.phone || '—'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12.5px' }}>{l.source}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>{l.industry || '—'}</div>
                      </td>
                      <td>
                        <span className={STATUS_BADGE[l.status] || 'badge badge-gray'}>{l.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '12.5px' }}>{l.score}</span>
                          <span className={CATEGORY_BADGE[l.category]}>{l.category}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {l.budget ? `$${l.budget.toLocaleString()}` : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          {l.status !== 'converted' && (
                            <>
                              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => openScoreModal(l._id)}>
                                <FiAward size={13} style={{ marginRight: '4px' }} /> Score
                              </button>
                              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--green)' }} onClick={() => handleConvert(l._id)}>
                                <FiArrowRight size={13} style={{ marginRight: '4px' }} /> Convert
                              </button>
                            </>
                          )}
                          <button className="btn-icon" onClick={() => openEdit(l)}><FiEdit2 size={13} /></button>
                          <button className="btn-icon danger" onClick={() => setDelId(l._id)}><FiTrash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 10px' }}><FiChevronLeft size={14} /></button>
              <button className="btn btn-ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 10px' }}><FiChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editL ? 'Edit Lead' : 'New Lead'}>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="label">Contact Name *</label>
            <input name="name" value={form.name} onChange={ch} required placeholder="Jane Doe" className="input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="label">Company Name</label>
              <input name="company" value={form.company} onChange={ch} placeholder="Acme Corp" className="input" />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={ch} placeholder="jane@example.com" className="input" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input name="phone" value={form.phone} onChange={ch} placeholder="+1 (555) 019-2834" className="input" />
            </div>
            <div>
              <label className="label">Industry</label>
              <input name="industry" value={form.industry} onChange={ch} placeholder="Software / Healthcare" className="input" />
            </div>
            <div>
              <label className="label">Budget ($)</label>
              <input type="number" name="budget" value={form.budget} onChange={ch} min="0" placeholder="10000" className="input" />
            </div>
            <div>
              <label className="label">Lead Source</label>
              <select name="source" value={form.source} onChange={ch} className="input">
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="cold_call">Cold Call</option>
                <option value="social">Social Media</option>
                <option value="email">Email Campaign</option>
                <option value="trade_show">Trade Show</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={ch} placeholder="enterprise, urgent, high-value" className="input" />
          </div>
          <div>
            <label className="label">Notes / Context</label>
            <textarea name="notes" value={form.notes} onChange={ch} rows={3} className="input" style={{ resize: 'none' }} placeholder="Lead source context, interests..." />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={() => setModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={fLoad} className="btn btn-primary" style={{ flex: 1 }}>
              {fLoad ? <span className="spinner spinner-sm spinner-white" /> : 'Save Lead'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Score Modal */}
      <Modal open={scoreModal} onClose={() => setScoreModal(false)} title="Add Lead Score Factor" mw={400}>
        <form onSubmit={saveScore} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="label">Scoring Factor</label>
            <select name="factor" value={scoreForm.factor} onChange={chScore} className="input">
              <option value="website_visit">Website Visit (+10)</option>
              <option value="email_open">Email Open (+5)</option>
              <option value="form_submit">Form Submission (+20)</option>
              <option value="meeting">Scheduled Meeting (+30)</option>
              <option value="manual">Manual Adjustment</option>
            </select>
          </div>
          <div>
            <label className="label">Points</label>
            <input type="number" name="points" value={scoreForm.points} onChange={chScore} className="input" required />
          </div>
          <div>
            <label className="label">Note</label>
            <input name="note" value={scoreForm.note} onChange={chScore} placeholder="Visited pricing page, etc." className="input" />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={() => setScoreModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Score</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Lead" mw={360}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--red-s)', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <FiTrash2 size={20} color="var(--red)" />
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '20px' }}>Delete this lead? Cannot be undone.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setDelId(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button onClick={() => del(delId)} className="btn btn-danger" style={{ flex: 1 }}>Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
