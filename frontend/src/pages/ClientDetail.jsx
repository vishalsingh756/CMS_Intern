import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit2, FiPlus, FiMail, FiPhone, FiGlobe,
  FiMapPin, FiCalendar, FiMessageSquare, FiTrendingUp, FiCheckSquare, FiX
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { clientService, dealService, taskService, interactionService, noteService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const STATUS_COLORS = {
  prospect: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  active: 'bg-green-500/10 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  lost: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const DEAL_STAGE_COLORS = {
  prospect: 'text-yellow-400', negotiation: 'text-blue-400', proposal: 'text-purple-400',
  won: 'text-green-400', lost: 'text-red-400',
};

const INTERACTION_ICONS = {
  email: '📧', phone: '📞', meeting: '🤝', note: '📝', site_visit: '🏢',
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [client, setClient] = useState(null);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  const [interactionModal, setInteractionModal] = useState(false);
  const [interactionForm, setInteractionForm] = useState({
    type: 'email', subject: '', description: '', date: '', outcome: 'pending', nextFollowUp: '',
  });
  const [taskModal, setTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', status: 'open',
  });
  const [noteModal, setNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, d, t, i, n] = await Promise.allSettled([
          clientService.getClient(id),
          dealService.getDeals({ client: id, limit: 100 }),
          taskService.getTasks({ client: id, limit: 100 }),
          interactionService.getClientInteractions(id),
          noteService.getNotes({ entityType: 'client', entityId: id }),
        ]);
        if (c.status === 'fulfilled') setClient(c.value.data.data);
        if (d.status === 'fulfilled') setDeals(d.value.data.data.deals || []);
        if (t.status === 'fulfilled') setTasks(t.value.data.data.tasks || []);
        if (i.status === 'fulfilled') setInteractions(i.value.data.data.interactions || []);
        if (n.status === 'fulfilled') setNotes(n.value.data.data || []);
      } catch (err) {
        toast.error('Failed to load client details');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await interactionService.createInteraction({ ...interactionForm, client: id });
      toast.success('Interaction added');
      setInteractionModal(false);
      const res = await interactionService.getClientInteractions(id);
      setInteractions(res.data.data.interactions || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add interaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskService.createTask({ ...taskForm, client: id, assignedTo: user.id });
      toast.success('Task created');
      setTaskModal(false);
      const res = await taskService.getTasks({ client: id, limit: 100 });
      setTasks(res.data.data.tasks || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await noteService.createNote({
        content: noteForm.content,
        entityType: 'client',
        entityId: id,
      });
      toast.success('Note added');
      setNoteModal(false);
      setNoteForm({ content: '' });
      const res = await noteService.getNotes({ entityType: 'client', entityId: id });
      setNotes(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePinNote = async (noteId) => {
    try {
      await noteService.togglePin(noteId);
      const res = await noteService.getNotes({ entityType: 'client', entityId: id });
      setNotes(res.data.data || []);
      toast.success('Note pin status updated');
    } catch {
      toast.error('Failed to toggle pin');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await noteService.deleteNote(noteId);
      const res = await noteService.getNotes({ entityType: 'client', entityId: id });
      setNotes(res.data.data || []);
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="p-8 text-center text-gray-500">Client not found.</div>
      </Layout>
    );
  }  
  const creationEvent = client ? [{
    id: 'creation',
    type: 'creation',
    date: client.createdAt,
    title: 'Client Record Created',
    description: `Client profile for ${client.companyName} was established.`,
  }] : [];

  const interactionEvents = interactions.map(i => ({
    id: i._id,
    type: 'interaction',
    date: i.date || i.createdAt,
    title: `Logged Interaction: ${i.subject}`,
    description: i.description,
    meta: `${i.type.replace('_', ' ')} · ${i.outcome} · by ${i.createdBy?.username || 'user'}`,
  }));

  const noteEvents = notes.map(n => ({
    id: n._id,
    type: 'note',
    date: n.createdAt,
    title: n.isPinned ? '📌 Note (Pinned)' : 'Collaborative Note',
    description: n.content,
    meta: `by ${n.createdBy?.username || 'user'}`,
    isPinned: n.isPinned,
    actions: (
      <div className="flex gap-2 mt-2">
        <button onClick={() => handleTogglePinNote(n._id)} className="text-xs text-cyan-400 hover:underline">
          {n.isPinned ? 'Unpin' : 'Pin'}
        </button>
        <button onClick={() => handleDeleteNote(n._id)} className="text-xs text-red-400 hover:underline">
          Delete
        </button>
      </div>
    )
  }));

  const dealEvents = deals.map(d => ({
    id: d._id,
    type: 'deal',
    date: d.createdAt,
    title: `Deal Linked: ${d.title}`,
    description: `Amount: $${d.amount?.toLocaleString()} | Stage: ${d.stage} | Probability: ${d.probability}%`,
  }));

  const taskEvents = tasks.map(t => ({
    id: t._id,
    type: 'task',
    date: t.createdAt,
    title: `Task Assigned: ${t.title}`,
    description: `Priority: ${t.priority} | Due Date: ${new Date(t.dueDate).toLocaleDateString()} | Status: ${t.status}`,
  }));

  const timelineItems = [
    ...creationEvent,
    ...interactionEvents,
    ...noteEvents,
    ...dealEvents,
    ...taskEvents,
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredTimeline = timelineItems.filter(item => {
    if (timelineFilter === 'all') return true;
    return item.type === timelineFilter;
  });

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Back + Header */}
        <div className="flex items-start gap-4">
          <button onClick={() => navigate('/clients')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
            <FiArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{client.companyName}</h1>
              <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium border ${STATUS_COLORS[client.status]}`}>
                {client.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">{client.contactName} · {client.industry || 'No industry'}</p>
          </div>
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-xl hover:bg-gray-700 transition-all"
          >
            <FiEdit2 size={14} /> Edit
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Contact Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Info</h3>
            {[
              { icon: FiMail, label: client.email },
              { icon: FiPhone, label: client.phone },
              { icon: FiGlobe, label: client.website || 'No website' },
              { icon: FiMapPin, label: [client.address?.city, client.address?.country].filter(Boolean).join(', ') || 'No address' },
              { icon: FiCalendar, label: `Added ${new Date(client.createdAt).toLocaleDateString()}` },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Icon size={14} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-300 truncate">{label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Deals', value: deals.length, color: 'text-blue-400', icon: FiTrendingUp },
                { label: 'Tasks', value: tasks.length, color: 'text-yellow-400', icon: FiCheckSquare },
                { label: 'Contacts', value: interactions.length, color: 'text-purple-400', icon: FiMessageSquare },
              ].map((s, i) => (
                <div key={i} className="text-center bg-gray-800/50 rounded-xl p-3">
                  <s.icon size={18} className={`${s.color} mx-auto mb-1`} />
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Notes</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {client.notes || 'No notes added for this client.'}
            </p>
            {client.source && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500">Lead Source</p>
                <p className="text-sm text-gray-300 mt-1">{client.source}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-800 overflow-x-auto">
            {[
              { key: 'timeline', label: 'Timeline', count: timelineItems.length },
              { key: 'interactions', label: 'Interactions', count: interactions.length },
              { key: 'notes', label: 'Collaborative Notes', count: notes.length },
              { key: 'deals', label: 'Deals', count: deals.length },
              { key: 'tasks', label: 'Tasks', count: tasks.length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-cyan-400/20 text-cyan-400' : 'bg-gray-800 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 uppercase font-semibold">Filter Timeline:</span>
                    <select
                      value={timelineFilter}
                      onChange={e => setTimelineFilter(e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none"
                    >
                      <option value="all">All Activities</option>
                      <option value="creation">Creation</option>
                      <option value="interaction">Interactions</option>
                      <option value="note">Notes</option>
                      <option value="deal">Deals</option>
                      <option value="task">Tasks</option>
                    </select>
                  </div>
                </div>

                <div className="relative border-l-2 border-gray-800 ml-4 space-y-6">
                  {filteredTimeline.length === 0 ? (
                    <p className="text-gray-600 text-sm py-4 ml-4">No timeline activities match this filter</p>
                  ) : filteredTimeline.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-gray-900 bg-cyan-500" />
                      <div className="bg-gray-850 border border-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <h4 className="font-semibold text-sm text-white">{item.title}</h4>
                          <span className="text-[11px] text-gray-500">{new Date(item.date).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-450 text-xs mt-1.5 leading-relaxed">{item.description}</p>
                        {item.meta && <p className="text-[10px] text-gray-500 mt-2 font-medium">{item.meta}</p>}
                        {item.actions}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactions Tab */}
            {activeTab === 'interactions' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">Communication history</p>
                  <button
                    onClick={() => setInteractionModal(true)}
                    className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-cyan-400 transition-all"
                  >
                    <FiPlus size={14} /> Log Interaction
                  </button>
                </div>
                <div className="space-y-3">
                  {interactions.length === 0 ? (
                    <p className="text-gray-600 text-sm text-center py-8">No interactions logged yet</p>
                  ) : interactions.map((i) => (
                    <div key={i._id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{INTERACTION_ICONS[i.type] || '📌'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-white text-sm">{i.subject}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${
                              i.outcome === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                              i.outcome === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                              'bg-gray-500/10 text-gray-400 border-gray-500/30'
                            }`}>
                              {i.outcome}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{i.description}</p>
                          <p className="text-gray-600 text-xs mt-2">{new Date(i.date).toLocaleString()} · by {i.createdBy?.username}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">Collaborative team notes</p>
                  <button
                    onClick={() => setNoteModal(true)}
                    className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-cyan-400 transition-all"
                  >
                    <FiPlus size={14} /> Add Collaborative Note
                  </button>
                </div>
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-gray-600 text-sm text-center py-8">No collaborative notes yet</p>
                  ) : notes.map((n) => (
                    <div key={n._id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-200 text-sm leading-relaxed">{n.content}</p>
                          <p className="text-gray-600 text-[11px] mt-2">Added on {new Date(n.createdAt).toLocaleString()} · by {n.createdBy?.username}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleTogglePinNote(n._id)} className="text-gray-400 hover:text-cyan-400" title={n.isPinned ? 'Unpin Note' : 'Pin Note'}>
                            <span style={{ fontSize: '13px' }}>{n.isPinned ? '📌' : '📍'}</span>
                          </button>
                          <button onClick={() => handleDeleteNote(n._id)} className="text-gray-400 hover:text-red-400" title="Delete Note">
                            <span style={{ fontSize: '13px' }}>🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deals Tab */}
            {activeTab === 'deals' && (
              <div className="space-y-3">
                {deals.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8">No deals linked to this client</p>
                ) : deals.map((deal) => (
                  <div key={deal._id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">{deal.title}</p>
                      <p className={`text-xs mt-1 ${DEAL_STAGE_COLORS[deal.stage]}`}>{deal.stage} · {deal.priority} priority</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${deal.amount?.toLocaleString()}</p>
                      <p className="text-gray-500 text-xs mt-1">{deal.probability}% probability</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">Tasks for this client</p>
                  <button
                    onClick={() => setTaskModal(true)}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-yellow-400 transition-all"
                  >
                    <FiPlus size={14} /> Add Task
                  </button>
                </div>
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <p className="text-gray-600 text-sm text-center py-8">No tasks for this client</p>
                  ) : tasks.map((task) => (
                    <div key={task._id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          task.status === 'completed' ? 'bg-green-400' :
                          task.status === 'in_progress' ? 'bg-blue-400' :
                          task.status === 'cancelled' ? 'bg-red-400' : 'bg-yellow-400'
                        }`} />
                        <div>
                          <p className="font-medium text-white text-sm">{task.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-lg ${
                        task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Interaction Modal */}
      <Modal open={interactionModal} onClose={() => setInteractionModal(false)} title="Log Interaction">
        <form onSubmit={handleAddInteraction} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Type *</label>
              <select
                value={interactionForm.type}
                onChange={e => setInteractionForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {['email', 'phone', 'meeting', 'note', 'site_visit'].map(t => (
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Outcome</label>
              <select
                value={interactionForm.outcome}
                onChange={e => setInteractionForm(f => ({ ...f, outcome: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {['positive', 'negative', 'neutral', 'pending'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Subject *</label>
            <input
              value={interactionForm.subject}
              onChange={e => setInteractionForm(f => ({ ...f, subject: e.target.value }))}
              required
              placeholder="Call regarding proposal..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description *</label>
            <textarea
              value={interactionForm.description}
              onChange={e => setInteractionForm(f => ({ ...f, description: e.target.value }))}
              required
              rows={3}
              placeholder="Describe the interaction..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Date *</label>
              <input
                type="datetime-local"
                value={interactionForm.date}
                onChange={e => setInteractionForm(f => ({ ...f, date: e.target.value }))}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Next Follow-up</label>
              <input
                type="date"
                value={interactionForm.nextFollowUp}
                onChange={e => setInteractionForm(f => ({ ...f, nextFollowUp: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setInteractionModal(false)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-all">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-xl text-sm hover:bg-cyan-400 transition-all disabled:opacity-50">
              {submitting ? 'Saving...' : 'Log Interaction'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal open={taskModal} onClose={() => setTaskModal(false)} title="Add Task">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Task Title *</label>
            <input
              value={taskForm.title}
              onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
              required
              placeholder="Follow up with client..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description</label>
            <textarea
              value={taskForm.description}
              onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Priority</label>
              <select
                value={taskForm.priority}
                onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Status</label>
              <select
                value={taskForm.status}
                onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {['open', 'in_progress', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Due Date *</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setTaskModal(false)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-xl text-sm hover:bg-yellow-400 transition-all disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Collaborative Note Modal */}
      <Modal open={noteModal} onClose={() => setNoteModal(false)} title="Add Collaborative Note">
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Note Content *</label>
            <textarea
              value={noteForm.content}
              onChange={e => setNoteForm(f => ({ ...f, content: e.target.value }))}
              required
              rows={4}
              placeholder="Type your collaborative note here... Use @username to mention or write key updates."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setNoteModal(false)} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-xl text-sm hover:bg-cyan-400 transition-all disabled:opacity-50">
              {submitting ? 'Saving...' : 'Add Note'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default ClientDetail;
