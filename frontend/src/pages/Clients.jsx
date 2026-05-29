import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiMail, FiPhone,
  FiGlobe, FiX, FiChevronLeft, FiChevronRight, FiEye,
} from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import Layout from '../components/Layout';
import { clientService, userService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const STATUS_COLORS = {
  prospect: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  active: 'bg-green-500/10 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  lost: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Other'];
const SOURCES = ['Website', 'Referral', 'Cold Call', 'Email', 'Social Media', 'Other'];

const emptyForm = {
  companyName: '', contactName: '', email: '', phone: '',
  address: { street: '', city: '', state: '', country: '', postalCode: '' },
  industry: '', status: 'prospect', source: '', website: '', notes: '',
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FiX size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
    <input
      {...props}
      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-gray-600 transition-all"
    />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
    <select
      {...props}
      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const ClientForm = ({ form, setForm, onSubmit, loading, onClose }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm(f => ({ ...f, address: { ...f.address, [key]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Company Name *" name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Acme Corp" />
        <InputField label="Contact Name *" name="contactName" value={form.contactName} onChange={handleChange} required placeholder="John Doe" />
        <InputField label="Email *" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@acme.com" />
        <InputField label="Phone *" name="phone" value={form.phone} onChange={handleChange} required placeholder="+1 234 567 8900" />
        <InputField label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://acme.com" />
        <SelectField
          label="Industry"
          name="industry"
          value={form.industry}
          onChange={handleChange}
          options={[{ value: '', label: 'Select Industry' }, ...INDUSTRIES.map(i => ({ value: i, label: i }))]}
        />
        <SelectField
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={[
            { value: 'prospect', label: 'Prospect' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'lost', label: 'Lost' },
          ]}
        />
        <SelectField
          label="Lead Source"
          name="source"
          value={form.source}
          onChange={handleChange}
          options={[{ value: '', label: 'Select Source' }, ...SOURCES.map(s => ({ value: s, label: s }))]}
        />
      </div>

      <div className="border-t border-gray-800 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Address</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Street" name="address.street" value={form.address?.street || ''} onChange={handleChange} placeholder="123 Main St" />
          <InputField label="City" name="address.city" value={form.address?.city || ''} onChange={handleChange} placeholder="New York" />
          <InputField label="State" name="address.state" value={form.address?.state || ''} onChange={handleChange} placeholder="NY" />
          <InputField label="Country" name="address.country" value={form.address?.country || ''} onChange={handleChange} placeholder="USA" />
          <InputField label="Postal Code" name="address.postalCode" value={form.address?.postalCode || ''} onChange={handleChange} placeholder="10001" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Additional notes about this client..."
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none placeholder-gray-600 resize-none transition-all"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-5 py-2.5 text-sm bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-5 py-2.5 text-sm bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Client'}
        </button>
      </div>
    </form>
  );
};

const Clients = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientService.getClients({
        page, limit: 10,
        status: status || undefined,
        search: search || undefined,
      });
      setClients(res.data.data.clients);
      setTotalPages(res.data.data.pagination.pages);
      setTotal(res.data.data.pagination.total);
    } catch (err) {
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const openCreate = () => {
    setEditClient(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditClient(client);
    setForm({
      companyName: client.companyName || '',
      contactName: client.contactName || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || { street: '', city: '', state: '', country: '', postalCode: '' },
      industry: client.industry || '',
      status: client.status || 'prospect',
      source: client.source || '',
      website: client.website || '',
      notes: client.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Strip empty strings for optional enum fields so Mongoose doesn't reject them
      const cleanForm = { ...form };
      if (!cleanForm.industry) delete cleanForm.industry;
      if (!cleanForm.source) delete cleanForm.source;
      if (!cleanForm.website) delete cleanForm.website;
      if (!cleanForm.notes) delete cleanForm.notes;

      if (editClient) {
        await clientService.updateClient(editClient._id, cleanForm);
        toast.success('Client updated successfully');
      } else {
        await clientService.createClient(cleanForm);
        toast.success('Client created successfully');
      }
      setModalOpen(false);
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save client');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await clientService.deleteClient(id);
      toast.success('Client deleted');
      setDeleteId(null);
      fetchClients();
    } catch (err) {
      toast.error('Failed to delete client');
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <p className="text-gray-500 text-sm mt-1">{total} clients total</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <FiPlus size={16} /> Add Client
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search clients, contacts, emails..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none placeholder-gray-600"
              />
            </div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="">All Status</option>
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
              <MdBusiness size={48} className="mb-3 opacity-30" />
              <p className="text-base font-medium">No clients found</p>
              <p className="text-sm mt-1">Create your first client to get started</p>
              <button
                onClick={openCreate}
                className="mt-4 flex items-center gap-2 bg-cyan-500 text-white px-5 py-2 rounded-xl text-sm"
              >
                <FiPlus size={14} /> Add Client
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Industry</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Added</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
                            {client.companyName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{client.companyName}</p>
                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                              <FiMail size={10} /> {client.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-gray-300 text-sm">{client.contactName}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                          <FiPhone size={10} /> {client.phone}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-gray-400 text-sm">{client.industry || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${STATUS_COLORS[client.status]}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-gray-500 text-xs">{new Date(client.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/clients/${client._id}`)}
                            className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                            title="View"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            onClick={() => openEdit(client)}
                            className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => setDeleteId(client._id)}
                              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <FiTrash2 size={15} />
                            </button>
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
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-all"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-all"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editClient ? 'Edit Client' : 'Add New Client'}>
        <ClientForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={formLoading} onClose={() => setModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Client">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <FiTrash2 size={24} className="text-red-400" />
          </div>
          <p className="text-gray-300">Are you sure you want to delete this client? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 text-sm transition-all">
              Cancel
            </button>
            <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-400 text-sm transition-all">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Clients;
