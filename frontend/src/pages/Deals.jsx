import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX,
  FiChevronLeft, FiChevronRight, FiTrendingUp,
  FiUser, FiExternalLink, FiMove,
} from 'react-icons/fi';
import { LuIndianRupee } from 'react-icons/lu';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Layout from '../components/Layout';
import { dealService, clientService } from '../services/api';
import { toast } from 'react-toastify';

// Helper: get initials from company name
const initials = (name = '') => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

// Deterministic colour from string
const CLIENT_COLORS = ['#5B5BD6','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6'];
const clientColor = (name = '') => CLIENT_COLORS[name.charCodeAt(0) % CLIENT_COLORS.length];

const STAGE_BADGE = {
  prospect:    'badge badge-yellow',
  negotiation: 'badge badge-blue',
  proposal:    'badge badge-purple',
  won:         'badge badge-green',
  lost:        'badge badge-red',
};
const PRI_COLOR = { low:'var(--text-3)', medium:'var(--yellow)', high:'var(--red)' };

const STAGE_CONFIG = [
  { key:'prospect',    label:'Prospect',    color:'var(--yellow)' },
  { key:'negotiation', label:'Negotiation', color:'var(--blue)'   },
  { key:'proposal',    label:'Proposal',    color:'var(--purple)' },
  { key:'won',         label:'Won',         color:'var(--green)'  },
  { key:'lost',        label:'Lost',        color:'var(--red)'    },
];

const EMPTY = {
  title:'', client:'', amount:'', probability:50,
  stage:'prospect', priority:'medium', expectedCloseDate:'', description:'',
};

function Modal({ open, onClose, title, mw=520, children }) {
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

export default function Deals() {
  const navigate = useNavigate();
  const [view, setView]             = useState('kanban');
  const [deals, setDeals]           = useState([]);
  const [clients, setClients]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTP]         = useState(1);
  const [total, setTotal]           = useState(0);
  const [search, setSearch]         = useState('');
  const [stage, setStage]           = useState('');
  const [clientFilter, setClientF]  = useState('');
  const [stats, setStats]           = useState(null);
  const [modal, setModal]           = useState(false);
  const [editD, setEditD]           = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [fLoad, setFLoad]           = useState(false);
  const [delId, setDelId]           = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const limit = view === 'kanban' ? 200 : 10;
      const r = await dealService.getDeals({
        page: view === 'kanban' ? 1 : page, limit,
        stage: stage || undefined,
        search: search || undefined,
        client: clientFilter || undefined,
      });
      setDeals(r.data.data.deals);
      setTP(r.data.data.pagination.pages);
      setTotal(r.data.data.pagination.total);
    } catch { toast.error('Failed to load deals'); }
    finally { setLoading(false); }
  }, [page, stage, search, view, clientFilter]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => {
    dealService.getDealStats().then(r => setStats(r.data.data)).catch(() => {});
    clientService.getClients({ limit:200 }).then(r => setClients(r.data.data.clients||[])).catch(() => {});
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    try {
      setDeals(prev => prev.map(d => d._id === draggableId ? { ...d, stage: destination.droppableId } : d));
      await dealService.updateDeal(draggableId, { stage: destination.droppableId });
      toast.success('Deal stage updated');
      dealService.getDealStats().then(r => setStats(r.data.data)).catch(() => {});
    } catch {
      toast.error('Failed to update stage');
      fetch();
    }
  };

  const openCreate = () => { setEditD(null); setForm(EMPTY); setModal(true); };
  const openEdit   = d => {
    setEditD(d);
    setForm({ title:d.title, client:d.client?._id||'', amount:d.amount,
      probability:d.probability, stage:d.stage, priority:d.priority,
      expectedCloseDate: d.expectedCloseDate ? d.expectedCloseDate.slice(0,10) : '',
      description:d.description||'' });
    setModal(true);
  };

  const save = async e => {
    e.preventDefault(); setFLoad(true);
    try {
      editD
        ? (await dealService.updateDeal(editD._id, form), toast.success('Deal updated'))
        : (await dealService.createDeal(form),            toast.success('Deal created'));
      setModal(false); fetch();
      dealService.getDealStats().then(r => setStats(r.data.data)).catch(() => {});
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setFLoad(false); }
  };

  const del = async id => {
    try { await dealService.deleteDeal(id); toast.success('Deleted'); setDelId(null); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <Layout>
      <div className="page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Deals Pipeline</h1>
            <p className="page-sub">
              {total} deals
              {stats?.totalAmount > 0 && <span style={{ marginLeft:'8px' }}>· <strong>₹{stats.totalAmount.toLocaleString()}</strong> total value</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: '8px', padding: '3px', border: '1px solid var(--border)' }}>
              <button
                className={`segmented-control-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                List View
              </button>
              <button
                className={`segmented-control-btn ${view === 'kanban' ? 'active' : ''}`}
                onClick={() => setView('kanban')}
              >
                Kanban Board
              </button>
            </div>
            <button onClick={openCreate} className="btn btn-primary">
              <FiPlus size={14} /> New Deal
            </button>
          </div>
        </div>

        {/* Stage pills */}
        {stats && (
          <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
            {STAGE_CONFIG.map(s => (
              <button key={s.key}
                onClick={() => setStage(stage===s.key ? '' : s.key)}
                style={{
                  display:'flex', alignItems:'center', gap:'7px',
                  padding:'5px 13px', borderRadius:'99px',
                  background: stage===s.key ? s.color+'18' : 'var(--surface-3)',
                  border:`1px solid ${stage===s.key ? s.color+'60' : 'var(--border)'}`,
                  boxShadow:'var(--shadow-xs)', cursor:'pointer', transition:'all 0.15s',
                }}>
                <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:s.color }} />
                <span style={{ fontSize:'12.5px', fontWeight:700, color:s.color }}>{stats.byStage?.[s.key]||0}</span>
                <span style={{ fontSize:'12px', color:'var(--text-3)', fontWeight:500 }}>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {view === 'kanban' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', minHeight: 'calc(100vh - 250px)' }}>
              {STAGE_CONFIG.map(s => {
                const stageDeals = deals.filter(d => d.stage === s.key);
                const totalAmt = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
                return (
                  <div key={s.key} style={{ flex: '1', minWidth: '270px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--border)', paddingBottom: '8px', marginBottom: '4px' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: s.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                          {s.label}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{stageDeals.length} deals</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)' }}>
                        ₹{totalAmt.toLocaleString()}
                      </span>
                    </div>

                    <Droppable droppableId={s.key}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            minHeight: '200px',
                            background: snapshot.isDraggingOver ? 'var(--surface-2)' : 'transparent',
                            borderRadius: '8px',
                            padding: '4px',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          {stageDeals.map((d, index) => (
                            <Draggable key={d._id} draggableId={d._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-surface)',
                                    border: '1.5px solid var(--border)',
                                    boxShadow: snapshot.isDragging ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                    transition: 'box-shadow 0.15s ease',
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {/* Drag handle strip — only this area initiates drag */}
                                  <div
                                    {...provided.dragHandleProps}
                                    style={{
                                      display: 'flex', justifyContent: 'flex-end',
                                      marginBottom: '6px', cursor: 'grab',
                                    }}
                                  >
                                    <FiMove size={12} color="var(--text-3)" />
                                  </div>
                                  <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-1)', marginBottom: '6px' }}>{d.title}</div>
                                  {/* Client chip */}
                                  {d.client && (
                                    <div
                                      onClick={e => { e.stopPropagation(); navigate(`/clients/${d.client._id}`); }}
                                      style={{
                                        display:'inline-flex', alignItems:'center', gap:'5px',
                                        padding:'3px 8px 3px 4px', borderRadius:'99px', cursor:'pointer',
                                        background: clientColor(d.client.companyName) + '18',
                                        border:`1px solid ${clientColor(d.client.companyName)}40`,
                                        marginBottom:'6px',
                                      }}
                                      title={`Go to ${d.client.companyName}`}
                                    >
                                      <div style={{
                                        width:'18px', height:'18px', borderRadius:'50%', flexShrink:0,
                                        background: clientColor(d.client.companyName),
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        fontSize:'8px', fontWeight:800, color:'#fff',
                                      }}>
                                        {initials(d.client.companyName)}
                                      </div>
                                      <span style={{ fontSize:'11px', fontWeight:600, color: clientColor(d.client.companyName) }}>
                                        {d.client.companyName}
                                      </span>
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                      <FiDollarSign size={12} />
                                      {d.amount?.toLocaleString()}
                                    </div>
                                    <span className="badge badge-gray" style={{ fontSize: '10px' }}>{d.priority}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '6px' }}>
                                    <button className="btn-icon" style={{ width: '22px', height: '22px' }} onClick={() => openEdit(d)}><FiEdit2 size={11} /></button>
                                    <button className="btn-icon danger" style={{ width: '22px', height: '22px' }} onClick={() => setDelId(d._id)}><FiTrash2 size={11} /></button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        ) : (
          <>
            {/* Filter */}
            <div className="filter-bar">
              <div className="search-wrap">
                <FiSearch size={14} className="search-icon" />
                <input type="text" placeholder="Search deals…" value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="input input-icon-left" style={{ minHeight:'36px' }} />
              </div>
              <select value={stage} onChange={e => { setStage(e.target.value); setPage(1); }}
                className="input" style={{ width:'auto', minWidth:'130px', minHeight:'36px' }}>
                <option value="">All Stages</option>
                {STAGE_CONFIG.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <select value={clientFilter} onChange={e => { setClientF(e.target.value); setPage(1); }}
                className="input" style={{ width:'auto', minWidth:'150px', minHeight:'36px' }}>
                <option value="">All Clients</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
              </select>
            </div>

            {/* Table */}
            <div className="card" style={{ overflow:'hidden' }}>
              {loading ? (
                <div className="empty"><div className="spinner" /></div>
              ) : deals.length === 0 ? (
                <div className="empty">
                  <FiTrendingUp size={32} className="empty-icon" />
                  <p className="empty-title">No deals yet</p>
                  <p className="empty-sub">Create your first deal to start tracking</p>
                  <button onClick={openCreate} className="btn btn-primary" style={{ marginTop:'14px' }}>
                    <FiPlus size={13} /> New Deal
                  </button>
                </div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Deal</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Stage</th>
                        <th>Probability</th>
                        <th>Close Date</th>
                        <th style={{ textAlign:'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deals.map(d => (
                        <tr key={d._id}>
                          <td>
                            <div style={{ fontWeight:600, fontSize:'13.5px' }}>{d.title}</div>
                            <div style={{ fontSize:'11.5px', color:PRI_COLOR[d.priority], marginTop:'2px', fontWeight:600 }}>
                              {d.priority} priority
                            </div>
                          </td>
                          <td>
                            {d.client ? (
                              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                <div style={{
                                  width:'28px', height:'28px', borderRadius:'50%', flexShrink:0,
                                  background: clientColor(d.client.companyName),
                                  display:'flex', alignItems:'center', justifyContent:'center',
                                  fontSize:'10px', fontWeight:700, color:'#fff',
                                }}>
                                  {initials(d.client.companyName)}
                                </div>
                                <div>
                                  <div
                                    style={{ fontSize:'13px', fontWeight:600, color:'var(--accent)', cursor:'pointer' }}
                                    onClick={() => navigate(`/clients/${d.client._id}`)}
                                  >
                                    {d.client.companyName}
                                  </div>
                                  {d.client.contactName && (
                                    <div style={{ fontSize:'11px', color:'var(--text-3)' }}>{d.client.contactName}</div>
                                  )}
                                </div>
                                <FiExternalLink
                                  size={12} color="var(--text-3)" style={{ cursor:'pointer', flexShrink:0 }}
                                  onClick={() => navigate(`/clients/${d.client._id}`)}
                                />
                              </div>
                            ) : <span style={{ color:'var(--text-3)' }}>—</span>}
                          </td>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:'4px', fontWeight:700, fontSize:'14px', color:'var(--text-1)' }}>
                              <LuIndianRupee size={13} color="var(--green)" />
                              {d.amount?.toLocaleString()}
                            </div>
                          </td>
                          <td><span className={STAGE_BADGE[d.stage]||'badge badge-gray'}>{d.stage}</span></td>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                              <div style={{ flex:1, height:'5px', background:'#f3f4f6', borderRadius:'99px', maxWidth:'80px' }}>
                                <div style={{ height:'5px', background:'var(--green)', borderRadius:'99px', width:`${d.probability}%`, transition:'width 0.3s' }} />
                              </div>
                              <span style={{ fontSize:'11.5px', color:'var(--text-3)', fontWeight:600, minWidth:'28px' }}>{d.probability}%</span>
                            </div>
                          </td>
                          <td style={{ color:'var(--text-3)', fontSize:'12px' }}>
                            {d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString() : '—'}
                          </td>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'4px' }}>
                              <button className="btn-icon" onClick={() => openEdit(d)}><FiEdit2 size={14} /></button>
                              <button className="btn-icon danger" onClick={() => setDelId(d._id)}><FiTrash2 size={14} /></button>
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
          </>
        )}
      </div>

      {/* Deal Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editD ? 'Edit Deal' : 'New Deal'}>
        <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'13px' }}>
          <div>
            <label className="label">Deal Title *</label>
            <input name="title" value={form.title} onChange={ch} required placeholder="Enterprise License" className="input" />
          </div>
          <div className="form-grid">
            <div>
              <label className="label">Client *</label>
              <select name="client" value={form.client} onChange={ch} required className="input">
                <option value="">Select Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Amount (₹) *</label>
              <input type="number" name="amount" value={form.amount} onChange={ch} required min="0" placeholder="50000" className="input" />
            </div>
            <div>
              <label className="label">Stage</label>
              <select name="stage" value={form.stage} onChange={ch} className="input">
                {STAGE_CONFIG.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={form.priority} onChange={ch} className="input">
                {['low','medium','high'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Probability (%)</label>
              <input type="number" name="probability" value={form.probability} onChange={ch} min="0" max="100" className="input" />
            </div>
            <div>
              <label className="label">Expected Close</label>
              <input type="date" name="expectedCloseDate" value={form.expectedCloseDate} onChange={ch} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" value={form.description} onChange={ch} rows={3} className="input" style={{ resize:'none' }} />
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'2px' }}>
            <button type="button" onClick={() => setModal(false)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button type="submit" disabled={fLoad} className="btn btn-primary" style={{ flex:1 }}>
              {fLoad ? <span className="spinner spinner-sm spinner-white" /> : 'Save Deal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Deal" mw={360}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:'var(--red-s)', border:'1px solid #fecaca', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <FiTrash2 size={20} color="var(--red)" />
          </div>
          <p style={{ fontSize:'14px', color:'var(--text-2)', marginBottom:'20px' }}>Delete this deal? Cannot be undone.</p>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => setDelId(null)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button onClick={() => del(delId)} className="btn btn-danger" style={{ flex:1 }}>Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

