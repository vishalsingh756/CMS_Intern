import { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX,
  FiChevronLeft, FiChevronRight, FiCheck, FiCheckSquare,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { taskService, clientService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const PRI_BADGE = { low:'badge badge-gray', medium:'badge badge-yellow', high:'badge badge-red' };
const STA_BADGE = { open:'badge badge-yellow', in_progress:'badge badge-blue', completed:'badge badge-green', cancelled:'badge badge-gray' };

function Modal({ open, onClose, title, mw=480, children }) {
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

const EMPTY = { title:'', description:'', client:'', priority:'medium', status:'open', dueDate:'', assignedTo:'' };

export default function Tasks() {
  const { user } = useAuthStore();
  const [tasks, setTasks]   = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(1);
  const [totalPages, setTP] = useState(1);
  const [total, setTotal]   = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPri]  = useState('');
  const [stats, setStats]   = useState(null);
  const [modal, setModal]   = useState(false);
  const [editT, setEditT]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [fLoad, setFLoad]   = useState(false);
  const [delId, setDelId]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await taskService.getTasks({ page, limit:10, status:status||undefined, priority:priority||undefined, search:search||undefined });
      setTasks(r.data.data.tasks);
      setTP(r.data.data.pagination.pages);
      setTotal(r.data.data.pagination.total);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, [page, status, priority, search]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => {
    taskService.getTaskStats().then(r => setStats(r.data.data)).catch(() => {});
    clientService.getClients({ limit:200 }).then(r => setClients(r.data.data.clients||[])).catch(() => {});
  }, []);

  const openCreate = () => { setEditT(null); setForm({ ...EMPTY, assignedTo: user?.id||'' }); setModal(true); };
  const openEdit   = t  => {
    setEditT(t);
    setForm({ title:t.title, description:t.description||'', client:t.client?._id||'',
      priority:t.priority, status:t.status,
      dueDate: t.dueDate ? t.dueDate.slice(0,10) : '',
      assignedTo: t.assignedTo?._id||'' });
    setModal(true);
  };

  const save = async e => {
    e.preventDefault(); setFLoad(true);
    try {
      const data = { ...form, assignedTo: form.assignedTo || user.id };
      editT
        ? (await taskService.updateTask(editT._id, data), toast.success('Task updated'))
        : (await taskService.createTask(data),            toast.success('Task created'));
      setModal(false); fetch();
      taskService.getTaskStats().then(r => setStats(r.data.data)).catch(() => {});
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setFLoad(false); }
  };

  const del = async id => {
    try { await taskService.deleteTask(id); toast.success('Deleted'); setDelId(null); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const complete = async t => {
    try { await taskService.updateTask(t._id, { status:'completed' }); toast.success('Marked complete!'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const overdue = t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const statPills = [
    { label:'Open',        c: stats?.open      || 0, color:'var(--yellow)', bg:'var(--yellow-s)', f:'open'        },
    { label:'In Progress', c: stats?.inProgress || 0, color:'var(--blue)',   bg:'var(--blue-s)',   f:'in_progress' },
    { label:'Completed',   c: stats?.completed  || 0, color:'var(--green)',  bg:'var(--green-s)',  f:'completed'   },
    { label:'Overdue',     c: stats?.overdue    || 0, color:'var(--red)',    bg:'var(--red-s)',    f:''            },
  ];

  return (
    <Layout>
      <div className="page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-sub">
              {total} tasks
              {stats?.overdue > 0 && <span style={{ color:'var(--red)', marginLeft:'8px', fontWeight:600 }}>· {stats.overdue} overdue</span>}
            </p>
          </div>
          <button onClick={openCreate} className="btn btn-primary"><FiPlus size={14} /> New Task</button>
        </div>

        {/* Stat pills */}
        {stats && (
          <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
            {statPills.map(s => (
              <button
                key={s.label}
                onClick={() => s.f && setStatus(status===s.f ? '' : s.f)}
                style={{
                  display:'flex', alignItems:'center', gap:'7px',
                  padding:'5px 13px', borderRadius:'99px',
                  background: status===s.f ? s.bg : '#fff',
                  border: `1px solid ${status===s.f ? s.color+'60' : 'var(--border)'}`,
                  cursor: s.f ? 'pointer' : 'default',
                  boxShadow: 'var(--shadow-xs)',
                  transition:'all 0.15s',
                }}
              >
                <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: s.color }} />
                <span style={{ fontSize:'12.5px', fontWeight:700, color: s.color }}>{s.c}</span>
                <span style={{ fontSize:'12px', color:'var(--text-3)', fontWeight:500 }}>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="filter-bar">
          <div className="search-wrap">
            <FiSearch size={14} className="search-icon" />
            <input type="text" placeholder="Search tasks…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input input-icon-left" style={{ minHeight:'36px' }} />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="input" style={{ width:'auto', minWidth:'130px', minHeight:'36px' }}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={priority} onChange={e => { setPri(e.target.value); setPage(1); }}
            className="input" style={{ width:'auto', minWidth:'130px', minHeight:'36px' }}>
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* List */}
        <div className="card" style={{ overflow:'hidden' }}>
          {loading ? (
            <div className="empty"><div className="spinner" /></div>
          ) : tasks.length === 0 ? (
            <div className="empty">
              <FiCheckSquare size={32} className="empty-icon" />
              <p className="empty-title">No tasks found</p>
              <button onClick={openCreate} className="btn btn-primary" style={{ marginTop:'12px' }}><FiPlus size={13} /> Create Task</button>
            </div>
          ) : (
            tasks.map(t => (
              <div
                key={t._id}
                style={{
                  display:'flex', alignItems:'center', gap:'12px', padding:'13px 16px',
                  borderBottom:'1px solid #f3f4f6',
                  borderLeft: `3px solid ${overdue(t) ? 'var(--red)' : 'transparent'}`,
                  background: t.status==='completed' ? '#fafafa' : '#fff',
                  transition:'background 0.12s',
                }}
              >
                {/* Circle toggle */}
                <button
                  onClick={() => t.status!=='completed' && complete(t)}
                  style={{
                    width:'20px', height:'20px', borderRadius:'50%', flexShrink:0,
                    border: `1.5px solid ${t.status==='completed' ? 'var(--green)' : '#d1d5db'}`,
                    background: t.status==='completed' ? 'var(--green)' : '#fff',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor: t.status==='completed' ? 'default' : 'pointer',
                    transition:'all 0.15s',
                  }}
                >
                  {t.status==='completed' && <FiCheck size={11} color="#fff" />}
                </button>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'7px', flexWrap:'wrap' }}>
                    <span style={{
                      fontSize:'13.5px', fontWeight:500,
                      color: t.status==='completed' ? 'var(--text-3)' : 'var(--text-1)',
                      textDecoration: t.status==='completed' ? 'line-through' : 'none',
                    }}>
                      {t.title}
                    </span>
                    {overdue(t) && <span className="badge badge-red" style={{ fontSize:'10px' }}>Overdue</span>}
                  </div>
                  <div style={{ display:'flex', gap:'12px', marginTop:'3px', flexWrap:'wrap' }}>
                    {t.client && <span style={{ fontSize:'11.5px', color:'var(--text-3)' }}>{t.client.companyName}</span>}
                    <span style={{ fontSize:'11.5px', color:'var(--text-3)' }}>
                      Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>

                {/* Badges + actions */}
                <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
                  <span className={PRI_BADGE[t.priority]||'badge badge-gray'} style={{ fontSize:'10.5px' }}>{t.priority}</span>
                  <span className={STA_BADGE[t.status]||'badge badge-gray'} style={{ fontSize:'10.5px' }}>{t.status.replace('_',' ')}</span>
                  <button className="btn-icon" onClick={() => openEdit(t)}><FiEdit2 size={13} /></button>
                  <button className="btn-icon danger" onClick={() => setDelId(t._id)}><FiTrash2 size={13} /></button>
                </div>
              </div>
            ))
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

      {/* Task Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editT ? 'Edit Task' : 'New Task'}>
        <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'13px' }}>
          <div>
            <label className="label">Title *</label>
            <input name="title" value={form.title} onChange={ch} required placeholder="Follow up call…" className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" value={form.description} onChange={ch} rows={2} className="input" style={{ resize:'none' }} />
          </div>
          <div className="form-grid">
            <div>
              <label className="label">Client</label>
              <select name="client" value={form.client} onChange={ch} className="input">
                <option value="">No Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Due Date *</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={ch} required className="input" />
            </div>
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={form.priority} onChange={ch} className="input">
                {['low','medium','high'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={ch} className="input">
                {['open','in_progress','completed','cancelled'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'2px' }}>
            <button type="button" onClick={() => setModal(false)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button type="submit" disabled={fLoad} className="btn btn-primary" style={{ flex:1 }}>
              {fLoad ? <span className="spinner spinner-sm spinner-white" /> : 'Save Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Task" mw={360}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:'var(--red-s)', border:'1px solid #fecaca', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <FiTrash2 size={20} color="var(--red)" />
          </div>
          <p style={{ fontSize:'14px', color:'var(--text-2)', marginBottom:'20px' }}>Delete this task? Cannot be undone.</p>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => setDelId(null)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button onClick={() => del(delId)} className="btn btn-danger" style={{ flex:1 }}>Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
