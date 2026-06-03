import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiX, FiUser } from 'react-icons/fi';
import Layout from '../components/Layout';
import { userService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const ROLE_BADGE    = { admin:'badge badge-red', editor:'badge badge-blue', author:'badge badge-green' };
const ROLE_AVATAR   = { admin:'#dc2626', editor:'#2563eb', author:'#059669' };

function Modal({ open, onClose, title, mw=420, children }) {
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

export default function UserManagement() {
  const { user: me } = useAuthStore();
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editU, setEditU]   = useState(null);
  const [eForm, setEForm]   = useState({ role:'author', isActive:true });
  const [fLoad, setFLoad]   = useState(false);
  const [delId, setDelId]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await userService.getAllUsers({ search:search||undefined });
      setUsers(r.data.data || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetch(); }, [fetch]);

  const openEdit = u => { setEditU(u); setEForm({ role:u.role, isActive:u.isActive!==false }); };

  const update = async e => {
    e.preventDefault(); setFLoad(true);
    try { await userService.updateUser(editU._id, eForm); toast.success('Updated'); setEditU(null); fetch(); }
    catch { toast.error('Failed to update'); }
    finally { setFLoad(false); }
  };

  const del = async id => {
    try { await userService.deleteUser(id); toast.success('User deleted'); setDelId(null); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Users</h1>
            <p className="page-sub">{users.length} users registered</p>
          </div>
        </div>

        {/* Search */}
        <div className="filter-bar">
          <div className="search-wrap" style={{ flex:1 }}>
            <FiSearch size={14} className="search-icon" />
            <input type="text" placeholder="Search users…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="input input-icon-left" style={{ minHeight:'36px' }} />
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow:'hidden' }}>
          {loading ? (
            <div className="empty"><div className="spinner" /></div>
          ) : users.length === 0 ? (
            <div className="empty">
              <FiUser size={32} className="empty-icon" />
              <p className="empty-title">No users found</p>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{
                            width:'32px', height:'32px', borderRadius:'8px', flexShrink:0,
                            background: (ROLE_AVATAR[u.role]||'var(--accent)') + '18',
                            border:`1px solid ${ROLE_AVATAR[u.role]||'var(--accent)'}30`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'12px', fontWeight:800, color: ROLE_AVATAR[u.role]||'var(--accent)',
                          }}>
                            {(u.firstName?.[0] || u.username?.[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:'13.5px' }}>
                              {u.firstName ? `${u.firstName} ${u.lastName||''}`.trim() : u.username}
                            </div>
                            <div style={{ fontSize:'11.5px', color:'var(--text-3)' }}>@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color:'var(--text-2)', fontSize:'13px' }}>{u.email}</td>
                      <td><span className={ROLE_BADGE[u.role]||'badge badge-gray'}>{u.role}</span></td>
                      <td>
                        <span className={u.isActive!==false ? 'badge badge-green' : 'badge badge-gray'}>
                          {u.isActive!==false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ color:'var(--text-3)', fontSize:'12px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u._id !== me?.id && (
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'4px' }}>
                            <button className="btn-icon" onClick={() => openEdit(u)}><FiEdit2 size={14} /></button>
                            <button className="btn-icon danger" onClick={() => setDelId(u._id)}><FiTrash2 size={14} /></button>
                          </div>
                        )}
                        {u._id === me?.id && (
                          <span style={{ fontSize:'11px', color:'var(--text-3)', display:'block', textAlign:'right' }}>You</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editU} onClose={() => setEditU(null)} title="Edit User">
        <form onSubmit={update} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', background:'var(--surface-2)', borderRadius:'8px', border:'1px solid var(--border)' }}>
            <div style={{
              width:'34px', height:'34px', borderRadius:'8px', flexShrink:0,
              background: (ROLE_AVATAR[editU?.role]||'var(--accent)') + '18',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'13px', fontWeight:800, color: ROLE_AVATAR[editU?.role]||'var(--accent)',
            }}>
              {(editU?.firstName?.[0] || editU?.username?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize:'13.5px', fontWeight:600 }}>{editU?.firstName || editU?.username}</p>
              <p style={{ fontSize:'11.5px', color:'var(--text-3)' }}>{editU?.email}</p>
            </div>
          </div>
          <div>
            <label className="label">Role</label>
            <select value={eForm.role} onChange={e => setEForm(f => ({ ...f, role:e.target.value }))} className="input">
              <option value="author">Author</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', userSelect:'none' }}>
            <input type="checkbox" checked={eForm.isActive}
              onChange={e => setEForm(f => ({ ...f, isActive:e.target.checked }))}
              style={{ width:'16px', height:'16px', accentColor:'var(--accent)', cursor:'pointer' }} />
            <span style={{ fontSize:'13.5px', color:'var(--text-2)', fontWeight:500 }}>Account Active</span>
          </label>
          <div style={{ display:'flex', gap:'10px', marginTop:'2px' }}>
            <button type="button" onClick={() => setEditU(null)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button type="submit" disabled={fLoad} className="btn btn-primary" style={{ flex:1 }}>
              {fLoad ? <span className="spinner spinner-sm spinner-white" /> : 'Update'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete User" mw={360}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:'var(--red-s)', border:'1px solid #fecaca', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <FiTrash2 size={20} color="var(--red)" />
          </div>
          <p style={{ fontSize:'14px', color:'var(--text-2)', marginBottom:'20px' }}>Permanently delete this user? Cannot be undone.</p>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => setDelId(null)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button onClick={() => del(delId)} className="btn btn-danger" style={{ flex:1 }}>Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
