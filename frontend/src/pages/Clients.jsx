import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiMail, FiPhone,
  FiX, FiChevronLeft, FiChevronRight, FiEye,
} from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import Layout from '../components/Layout';
import { clientService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const STATUS_BADGE = {
  prospect: 'badge badge-yellow',
  active:   'badge badge-green',
  inactive: 'badge badge-gray',
  lost:     'badge badge-red',
};

const INDUSTRIES = ['Technology','Finance','Healthcare','Retail','Manufacturing','Education','Other'];
const SOURCES    = ['Website','Referral','Cold Call','Email','Social Media','Other'];

const EMPTY = {
  companyName:'', contactName:'', email:'', phone:'',
  address:{ street:'', city:'', state:'', country:'', postalCode:'' },
  industry:'', status:'prospect', source:'', website:'', notes:'',
};

/* ── Modal shell ───────────────────────────────────── */
function Modal({ open, onClose, title, mw=580, children }) {
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

/* ── Form atoms ────────────────────────────────────── */
const Lbl = ({ children }) => <label className="label">{children}</label>;
const Inp = ({ label, ...p }) => (
  <div>
    {label && <Lbl>{label}</Lbl>}
    <input {...p} className="input" />
  </div>
);
const Sel = ({ label, opts, ...p }) => (
  <div>
    {label && <Lbl>{label}</Lbl>}
    <select {...p} className="input">
      {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

/* ── Client form ────────────────────────────────────── */
function ClientForm({ form, setForm, onSubmit, loading, onClose }) {
  const ch = e => {
    const { name, value } = e.target;
    name.startsWith('a.')
      ? setForm(f => ({ ...f, address: { ...f.address, [name.slice(2)]: value } }))
      : setForm(f => ({ ...f, [name]: value }));
  };
  // alias
  const a = (field) => ({ name: `a.${field}`, value: form.address?.[field] || '', onChange: ch });

  return (
    <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
      <div className="form-grid">
        <Inp label="Company Name *" name="companyName" value={form.companyName} onChange={ch} required placeholder="Acme Corp" />
        <Inp label="Contact Name *" name="contactName" value={form.contactName} onChange={ch} required placeholder="John Doe" />
        <Inp label="Email *" type="email" name="email" value={form.email} onChange={ch} required placeholder="john@acme.com" />
        <Inp label="Phone *" name="phone" value={form.phone} onChange={ch} required placeholder="+1 234 567 8900" />
        <Inp label="Website" name="website" value={form.website} onChange={ch} placeholder="https://acme.com" />
        <Sel label="Industry" name="industry" value={form.industry} onChange={ch}
          opts={[{v:'',l:'Select…'}, ...INDUSTRIES.map(i => ({v:i,l:i}))]} />
        <Sel label="Status" name="status" value={form.status} onChange={ch}
          opts={[{v:'prospect',l:'Prospect'},{v:'active',l:'Active'},{v:'inactive',l:'Inactive'},{v:'lost',l:'Lost'}]} />
        <Sel label="Source" name="source" value={form.source} onChange={ch}
          opts={[{v:'',l:'Select…'}, ...SOURCES.map(s => ({v:s,l:s}))]} />
      </div>

      <div>
        <p style={{ fontSize:'10.5px', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px' }}>Address</p>
        <div className="form-grid">
          <Inp label="Street"  {...a('street')}     placeholder="123 Main St" />
          <Inp label="City"    {...a('city')}        placeholder="New York" />
          <Inp label="State"   {...a('state')}       placeholder="NY" />
          <Inp label="Country" {...a('country')}     placeholder="USA" />
          <Inp label="Postal"  {...a('postalCode')}  placeholder="10001" />
        </div>
      </div>

      <div>
        <Lbl>Notes</Lbl>
        <textarea name="notes" value={form.notes} onChange={ch} rows={3}
          placeholder="Additional notes…"
          className="input" style={{ resize:'none' }} />
      </div>

      <div style={{ display:'flex', gap:'10px', marginTop:'2px' }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex:1 }}>
          {loading ? <span className="spinner spinner-sm spinner-white" /> : 'Save Client'}
        </button>
      </div>
    </form>
  );
}

/* ── Main ───────────────────────────────────────────── */
export default function Clients() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [totalPages, setTP]     = useState(1);
  const [total, setTotal]       = useState(0);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [modal, setModal]       = useState(false);
  const [editC, setEditC]       = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [fLoad, setFLoad]       = useState(false);
  const [delId, setDelId]       = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await clientService.getClients({ page, limit:10, status: status||undefined, search: search||undefined });
      setClients(r.data.data.clients);
      setTP(r.data.data.pagination.pages);
      setTotal(r.data.data.pagination.total);
    } catch { toast.error('Failed to load clients'); }
    finally { setLoading(false); }
  }, [page, status, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditC(null); setForm(EMPTY); setModal(true); };
  const openEdit   = c  => {
    setEditC(c);
    setForm({ companyName:c.companyName||'', contactName:c.contactName||'', email:c.email||'', phone:c.phone||'',
      address: c.address||{street:'',city:'',state:'',country:'',postalCode:''},
      industry:c.industry||'', status:c.status||'prospect', source:c.source||'', website:c.website||'', notes:c.notes||'' });
    setModal(true);
  };

  const save = async e => {
    e.preventDefault(); setFLoad(true);
    try {
      const clean = { ...form };
      if (!clean.industry) delete clean.industry;
      if (!clean.source)   delete clean.source;
      if (!clean.website)  delete clean.website;
      if (!clean.notes)    delete clean.notes;
      editC
        ? (await clientService.updateClient(editC._id, clean), toast.success('Client updated'))
        : (await clientService.createClient(clean),            toast.success('Client created'));
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setFLoad(false); }
  };

  const del = async id => {
    try { await clientService.deleteClient(id); toast.success('Deleted'); setDelId(null); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <Layout>
      <div className="page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Clients</h1>
            <p className="page-sub">{total} total clients</p>
          </div>
          <button onClick={openCreate} className="btn btn-primary">
            <FiPlus size={14} /> Add Client
          </button>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="search-wrap">
            <FiSearch size={14} className="search-icon" />
            <input
              type="text" placeholder="Search clients…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input input-icon-left"
              style={{ minHeight:'36px' }}
            />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="input" style={{ width:'auto', minWidth:'130px', minHeight:'36px' }}>
            <option value="">All Status</option>
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow:'hidden' }}>
          {loading ? (
            <div className="empty"><div className="spinner" /></div>
          ) : clients.length === 0 ? (
            <div className="empty">
              <MdBusiness size={36} className="empty-icon" />
              <p className="empty-title">No clients yet</p>
              <p className="empty-sub">Add your first client to get started</p>
              <button onClick={openCreate} className="btn btn-primary" style={{ marginTop:'14px' }}>
                <FiPlus size={13} /> Add Client
              </button>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Industry</th>
                    <th>Added</th>
                    <th style={{ textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{
                            width:'34px', height:'34px', borderRadius:'9px', flexShrink:0,
                            background:'var(--accent-s)', border:'1px solid var(--border)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'13px', fontWeight:800, color:'var(--accent)',
                          }}>
                            {c.companyName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:'13.5px', color:'var(--text-1)' }}>{c.companyName}</div>
                            <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11.5px', color:'var(--text-3)', marginTop:'1px' }}>
                              <FiMail size={10} /> {c.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize:'13px', fontWeight:500 }}>{c.contactName}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11.5px', color:'var(--text-3)', marginTop:'1px' }}>
                          <FiPhone size={10} /> {c.phone}
                        </div>
                      </td>
                      <td><span className={STATUS_BADGE[c.status] || 'badge badge-gray'}>{c.status}</span></td>
                      <td style={{ color:'var(--text-2)', fontSize:'13px' }}>{c.industry || '—'}</td>
                      <td style={{ color:'var(--text-3)', fontSize:'12px' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'4px' }}>
                          <button className="btn-icon" onClick={() => navigate(`/clients/${c._id}`)} title="View"><FiEye size={14} /></button>
                          <button className="btn-icon" onClick={() => openEdit(c)} title="Edit"><FiEdit2 size={14} /></button>
                          {user?.role === 'admin' && (
                            <button className="btn-icon danger" onClick={() => setDelId(c._id)} title="Delete"><FiTrash2 size={14} /></button>
                          )}
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
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'14px' }}>
            <span style={{ fontSize:'12.5px', color:'var(--text-3)' }}>Page {page} of {totalPages}</span>
            <div style={{ display:'flex', gap:'6px' }}>
              <button className="btn btn-ghost" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ padding:'6px 10px' }}><FiChevronLeft size={14} /></button>
              <button className="btn btn-ghost" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:'6px 10px' }}><FiChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editC ? 'Edit Client' : 'New Client'}>
        <ClientForm form={form} setForm={setForm} onSubmit={save} loading={fLoad} onClose={() => setModal(false)} />
      </Modal>

      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Client" mw={380}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:'var(--red-s)', border:'1px solid var(--red)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <FiTrash2 size={20} color="var(--red)" />
          </div>
          <p style={{ fontSize:'14px', color:'var(--text-2)', marginBottom:'20px' }}>Delete this client? This action cannot be undone.</p>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => setDelId(null)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button onClick={() => del(delId)} className="btn btn-danger" style={{ flex:1 }}>Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
