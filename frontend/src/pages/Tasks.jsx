import { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheckSquare,
  FiChevronLeft, FiChevronRight, FiCheck,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { taskService, clientService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const PRIORITY_STYLES = {
  low: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const STATUS_STYLES = {
  open: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/10 text-green-400 border-green-500/30',
  cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const emptyForm = {
  title: '', description: '', client: '', priority: 'medium', status: 'open', dueDate: '', assignedTo: '',
};

const Tasks = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [stats, setStats] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskService.getTasks({
        page, limit: 10,
        status: status || undefined,
        priority: priority || undefined,
        search: search || undefined,
      });
      setTasks(res.data.data.tasks);
      setTotalPages(res.data.data.pagination.pages);
      setTotal(res.data.data.pagination.total);
    } catch (err) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, status, priority, search]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    taskService.getTaskStats().then(r => setStats(r.data.data)).catch(() => {});
    clientService.getClients({ limit: 200 }).then(r => setClients(r.data.data.clients || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditTask(null);
    setForm({ ...emptyForm, assignedTo: user?.id || '' });
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title, description: task.description || '', client: task.client?._id || '',
      priority: task.priority, status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      assignedTo: task.assignedTo?._id || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = { ...form, assignedTo: form.assignedTo || user.id };
      if (editTask) {
        await taskService.updateTask(editTask._id, data);
        toast.success('Task updated');
      } else {
        await taskService.createTask(data);
        toast.success('Task created');
      }
      setModalOpen(false);
      fetchTasks();
      taskService.getTaskStats().then(r => setStats(r.data.data)).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      setDeleteId(null);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const quickComplete = async (task) => {
    try {
      await taskService.updateTask(task._id, { status: 'completed' });
      toast.success('Task completed!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const isOverdue = (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">{total} tasks total{stats?.overdue > 0 ? ` · ⚠️ ${stats.overdue} overdue` : ''}</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
            <FiPlus size={16} /> New Task
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Open', count: stats.open, color: 'text-yellow-400', filter: 'open' },
              { label: 'In Progress', count: stats.inProgress, color: 'text-blue-400', filter: 'in_progress' },
              { label: 'Completed', count: stats.completed, color: 'text-green-400', filter: 'completed' },
              { label: 'Overdue', count: stats.overdue, color: 'text-red-400', filter: '' },
            ].map(s => (
              <button
                key={s.label}
                onClick={() => s.filter && setStatus(status === s.filter ? '' : s.filter)}
                className={`bg-gray-900 border rounded-xl p-4 text-center transition-all hover:border-gray-600 ${status === s.filter ? 'border-gray-500 bg-gray-800' : 'border-gray-800'}`}
              >
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none placeholder-gray-600"
            />
          </div>
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priority}
            onChange={e => { setPriority(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Task List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
              <FiCheckSquare size={48} className="mb-3 opacity-30" />
              <p className="text-base font-medium">No tasks found</p>
              <button onClick={openCreate} className="mt-4 flex items-center gap-2 bg-yellow-500 text-white px-5 py-2 rounded-xl text-sm">
                <FiPlus size={14} /> Create Task
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {tasks.map(task => (
                <div key={task._id} className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-800/40 transition-colors ${isOverdue(task) ? 'border-l-2 border-red-500' : ''}`}>
                  {/* Complete button */}
                  <button
                    onClick={() => task.status !== 'completed' && quickComplete(task)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-600 hover:border-green-400'
                    }`}
                  >
                    {task.status === 'completed' && <FiCheck size={12} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                        {task.title}
                      </p>
                      {isOverdue(task) && <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Overdue</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {task.client && <span className="text-xs text-gray-500">{task.client.companyName}</span>}
                      <span className="text-xs text-gray-600">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</span>
                      <span className="text-xs text-gray-600">Assigned to: {task.assignedTo?.username || 'me'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${PRIORITY_STYLES[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${STATUS_STYLES[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <button onClick={() => openEdit(task)} className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(task._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-40">
                <FiChevronLeft size={16} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-40">
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTask ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Task Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Follow up call..." className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Client</label>
              <select name="client" value={form.client} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                <option value="">No Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Due Date *</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                {['open', 'in_progress', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-xl text-sm hover:bg-yellow-400 disabled:opacity-50">
              {formLoading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Task">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <FiTrash2 size={24} className="text-red-400" />
          </div>
          <p className="text-gray-300">Are you sure you want to delete this task?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm hover:bg-red-400">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Tasks;
