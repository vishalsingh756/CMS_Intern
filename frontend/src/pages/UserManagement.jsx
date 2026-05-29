import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiX, FiUser } from 'react-icons/fi';
import Layout from '../components/Layout';
import { userService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const ROLE_STYLES = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/30',
  editor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  author: 'bg-green-500/10 text-green-400 border-green-500/30',
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ role: 'author', isActive: true });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers({ search: search || undefined });
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ role: u.role, isActive: u.isActive !== false });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await userService.updateUser(editUser._id, editForm);
      toast.success('User updated');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} users registered</p>
        </div>

        {/* Search */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none placeholder-gray-600"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
              <FiUser size={48} className="mb-3 opacity-30" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                            {(u.firstName?.[0] || u.username?.[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">
                              {u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.username}
                            </p>
                            <p className="text-gray-500 text-xs">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-gray-400 text-sm">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${ROLE_STYLES[u.role]}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                          u.isActive !== false ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u._id !== currentUser?.id && (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(u)} className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                              <FiEdit2 size={14} />
                            </button>
                            <button onClick={() => setDeleteId(u._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                              <FiTrash2 size={14} />
                            </button>
                          </div>
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
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <p className="text-white font-medium">{editUser?.firstName || editUser?.username}</p>
            <p className="text-gray-500 text-sm">{editUser?.email}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Role</label>
            <select
              value={editForm.role}
              onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
            >
              <option value="author">Author</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={editForm.isActive}
              onChange={e => setEditForm(f => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-cyan-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-300">Account Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setEditUser(null)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-xl text-sm hover:bg-cyan-400 disabled:opacity-50">
              {formLoading ? 'Saving...' : 'Update User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <FiTrash2 size={24} className="text-red-400" />
          </div>
          <p className="text-gray-300">Are you sure? This will permanently delete the user.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm hover:bg-red-400">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserManagement;
