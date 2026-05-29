import { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiMessageSquare,
  FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { interactionService, clientService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const INTERACTION_ICONS = {
  email: '📧', phone: '📞', meeting: '🤝', note: '📝', site_visit: '🏢',
};

const OUTCOME_STYLES = {
  positive: 'bg-green-500/10 text-green-400 border-green-500/30',
  negative: 'bg-red-500/10 text-red-400 border-red-500/30',
  neutral: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
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
  client: '', type: 'email', subject: '', description: '',
  date: '', outcome: 'pending', nextFollowUp: '',
};

const Interactions = () => {
  const { user } = useAuthStore();
  const [interactions, setInteractions] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterClient, setFilterClient] = useState('');
  const [filterType, setFilterType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editInteraction, setEditInteraction] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchInteractions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await interactionService.getInteractions({
        page, limit: 15,
        client: filterClient || undefined,
        type: filterType || undefined,
      });
      setInteractions(res.data.data.interactions);
      setTotalPages(res.data.data.pagination.pages);
      setTotal(res.data.data.pagination.total);
    } catch (err) {
      toast.error('Failed to fetch interactions');
    } finally {
      setLoading(false);
    }
  }, [page, filterClient, filterType]);

  useEffect(() => { fetchInteractions(); }, [fetchInteractions]);

  useEffect(() => {
    clientService.getClients({ limit: 200 }).then(r => setClients(r.data.data.clients || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditInteraction(null);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 16) });
    setModalOpen(true);
  };

  const openEdit = (interaction) => {
    setEditInteraction(interaction);
    setForm({
      client: interaction.client?._id || '',
      type: interaction.type,
      subject: interaction.subject,
      description: interaction.description,
      date: interaction.date ? interaction.date.slice(0, 16) : '',
      outcome: interaction.outcome,
      nextFollowUp: interaction.nextFollowUp ? interaction.nextFollowUp.slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editInteraction) {
        await interactionService.updateInteraction(editInteraction._id, form);
        toast.success('Interaction updated');
      } else {
        await interactionService.createInteraction(form);
        toast.success('Interaction logged');
      }
      setModalOpen(false);
      fetchInteractions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save interaction');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await interactionService.deleteInteraction(id);
      toast.success('Interaction deleted');
      setDeleteId(null);
      fetchInteractions();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Interactions</h1>
            <p className="text-gray-500 text-sm mt-1">{total} interactions logged</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
            <FiPlus size={16} /> Log Interaction
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <select
              value={filterClient}
              onChange={e => { setFilterClient(e.target.value); setPage(1); }}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
            >
              <option value="">All Clients</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
            </select>
          </div>
          <select
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option value="">All Types</option>
            {['email', 'phone', 'meeting', 'note', 'site_visit'].map(t => (
              <option key={t} value={t}>{t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Interaction List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : interactions.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col items-center justify-center py-20 text-gray-600">
              <FiMessageSquare size={48} className="mb-3 opacity-30" />
              <p className="text-base font-medium">No interactions yet</p>
              <button onClick={openCreate} className="mt-4 flex items-center gap-2 bg-purple-500 text-white px-5 py-2 rounded-xl text-sm">
                <FiPlus size={14} /> Log Interaction
              </button>
            </div>
          ) : interactions.map((interaction) => (
            <div key={interaction._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {INTERACTION_ICONS[interaction.type] || '📌'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-white">{interaction.subject}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500 capitalize">{interaction.type.replace('_', ' ')}</span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-gray-500">{interaction.client?.companyName}</span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-gray-600">{new Date(interaction.date).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${OUTCOME_STYLES[interaction.outcome]}`}>
                        {interaction.outcome}
                      </span>
                      <button onClick={() => openEdit(interaction)} className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(interaction._id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{interaction.description}</p>
                  {interaction.nextFollowUp && (
                    <p className="text-xs text-cyan-400 mt-2">
                      📅 Follow-up: {new Date(interaction.nextFollowUp).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">by {interaction.createdBy?.username}</p>
                </div>
              </div>
            </div>
          ))}
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

      {/* Interaction Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editInteraction ? 'Edit Interaction' : 'Log Interaction'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Client *</label>
              <select name="client" value={form.client} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none">
                <option value="">Select Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none">
                {['email', 'phone', 'meeting', 'note', 'site_visit'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Subject *</label>
            <input name="subject" value={form.subject} onChange={handleChange} required placeholder="Discussed pricing proposal..." className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Detailed description of the interaction..." className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Date & Time *</label>
              <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Outcome</label>
              <select name="outcome" value={form.outcome} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none">
                {['positive', 'negative', 'neutral', 'pending'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Next Follow-up Date</label>
            <input type="date" name="nextFollowUp" value={form.nextFollowUp} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2.5 bg-purple-500 text-white rounded-xl text-sm hover:bg-purple-400 disabled:opacity-50">
              {formLoading ? 'Saving...' : 'Save Interaction'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Interaction">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <FiTrash2 size={24} className="text-red-400" />
          </div>
          <p className="text-gray-300">Are you sure you want to delete this interaction?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm hover:bg-red-400">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Interactions;
