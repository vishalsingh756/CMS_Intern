import { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiChevronLeft, FiChevronRight,
  FiTrendingUp, FiDollarSign,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { dealService, clientService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const STAGE_COLORS = {
  prospect: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  negotiation: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  proposal: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  won: 'bg-green-500/10 text-green-400 border-green-500/30',
  lost: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const PRIORITY_COLORS = {
  low: 'text-gray-400', medium: 'text-yellow-400', high: 'text-red-400',
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
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
  title: '', client: '', amount: '', probability: 50, stage: 'prospect',
  priority: 'medium', expectedCloseDate: '', description: '',
};

const Deals = () => {
  const { user } = useAuthStore();
  const [deals, setDeals] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [stats, setStats] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dealService.getDeals({
        page, limit: 10,
        stage: stage || undefined,
        search: search || undefined,
      });
      setDeals(res.data.data.deals);
      setTotalPages(res.data.data.pagination.pages);
      setTotal(res.data.data.pagination.total);
    } catch (err) {
      toast.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  }, [page, stage, search]);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  useEffect(() => {
    dealService.getDealStats().then(r => setStats(r.data.data)).catch(() => {});
    clientService.getClients({ limit: 200 }).then(r => setClients(r.data.data.clients || [])).catch(() => {});
  }, []);

  const openCreate = () => { setEditDeal(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (deal) => {
    setEditDeal(deal);
    setForm({
      title: deal.title, client: deal.client?._id || '', amount: deal.amount,
      probability: deal.probability, stage: deal.stage, priority: deal.priority,
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.slice(0, 10) : '',
      description: deal.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editDeal) {
        await dealService.updateDeal(editDeal._id, form);
        toast.success('Deal updated');
      } else {
        await dealService.createDeal(form);
        toast.success('Deal created');
      }
      setModalOpen(false);
      fetchDeals();
      dealService.getDealStats().then(r => setStats(r.data.data)).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save deal');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dealService.deleteDeal(id);
      toast.success('Deal deleted');
      setDeleteId(null);
      fetchDeals();
    } catch (err) {
      toast.error('Failed to delete deal');
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
            <h1 className="text-2xl font-bold text-white">Deals Pipeline</h1>
            <p className="text-gray-500 text-sm mt-1">{total} deals · ${stats?.totalAmount?.toLocaleString() || 0} total value</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
            <FiPlus size={16} /> New Deal
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Prospect', count: stats.byStage.prospect, color: 'text-yellow-400' },
              { label: 'Negotiation', count: stats.byStage.negotiation, color: 'text-blue-400' },
              { label: 'Proposal', count: stats.byStage.proposal, color: 'text-purple-400' },
              { label: 'Won', count: stats.byStage.won, color: 'text-green-400' },
              { label: 'Lost', count: stats.byStage.lost, color: 'text-red-400' },
            ].map(s => (
              <button
                key={s.label}
                onClick={() => setStage(stage === s.label.toLowerCase() ? '' : s.label.toLowerCase())}
                className={`bg-gray-900 border rounded-xl p-4 text-center transition-all hover:border-gray-600 ${
                  stage === s.label.toLowerCase() ? 'border-gray-500 bg-gray-800' : 'border-gray-800'
                }`}
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
              placeholder="Search deals..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-600"
            />
          </div>
          <select
            value={stage}
            onChange={e => { setStage(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option value="">All Stages</option>
            <option value="prospect">Prospect</option>
            <option value="negotiation">Negotiation</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            </div>
          ) : deals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
              <FiTrendingUp size={48} className="mb-3 opacity-30" />
              <p className="text-base font-medium">No deals found</p>
              <button onClick={openCreate} className="mt-4 flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-xl text-sm">
                <FiPlus size={14} /> Create Deal
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Client</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Probability</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Close Date</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {deals.map(deal => (
                    <tr key={deal._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white text-sm">{deal.title}</p>
                        <p className={`text-xs mt-0.5 ${PRIORITY_COLORS[deal.priority]}`}>{deal.priority} priority</p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-gray-300 text-sm">{deal.client?.companyName || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-semibold text-sm">${deal.amount?.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${STAGE_COLORS[deal.stage]}`}>
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                            <div
                              className="bg-green-400 rounded-full h-1.5"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs w-8">{deal.probability}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-gray-500 text-xs">
                          {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(deal)} className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                            <FiEdit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteId(deal._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                            <FiTrash2 size={15} />
                          </button>
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

      {/* Deal Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editDeal ? 'Edit Deal' : 'New Deal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Deal Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Enterprise License" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Client *</label>
              <select name="client" value={form.client} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                <option value="">Select Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Amount ($) *</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} required min="0" placeholder="50000" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Stage</label>
              <select name="stage" value={form.stage} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                {['prospect', 'negotiation', 'proposal', 'won', 'lost'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Probability (%)</label>
              <input type="number" name="probability" value={form.probability} onChange={handleChange} min="0" max="100" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Expected Close Date</label>
              <input type="date" name="expectedCloseDate" value={form.expectedCloseDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm hover:bg-green-400 disabled:opacity-50">
              {formLoading ? 'Saving...' : 'Save Deal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Deal">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <FiTrash2 size={24} className="text-red-400" />
          </div>
          <p className="text-gray-300">Are you sure you want to delete this deal?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm hover:bg-red-400">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Deals;
