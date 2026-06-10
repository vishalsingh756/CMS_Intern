import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit2, FiPlus, FiMail, FiPhone, FiGlobe,
  FiMapPin, FiCalendar, FiMessageSquare, FiTrendingUp, FiCheckSquare, FiX, FiUsers
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { clientService, dealService, taskService, interactionService, noteService } from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../utils/authStore';

const STATUS_COLORS = {
  prospect: 'badge badge-yellow',
  active: 'badge badge-green',
  inactive: 'badge badge-gray',
  lost: 'badge badge-red',
};

const DEAL_STAGE_COLORS = {
  prospect: 'var(--yellow)', negotiation: 'var(--blue)', proposal: 'var(--purple)',
  won: 'var(--green)', lost: 'var(--red)',
};

const INTERACTION_ICONS = {
  email: '📧', phone: '📞', meeting: '🤝', note: '📝', site_visit: '🏢',
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 512 }}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn-icon" onClick={onClose}><FiX size={15} /></button>
        </div>
        <div className="modal-body">{children}</div>
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
  const [contactModal, setContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', role: '' });

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

  const handleAddContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updatedContacts = [...(client.contacts || []), contactForm];
      const res = await clientService.updateClient(id, { contacts: updatedContacts });
      setClient(res.data.data);
      toast.success('Contact added');
      setContactModal(false);
      setContactForm({ name: '', email: '', phone: '', role: '' });
    } catch (err) {
      toast.error('Failed to add contact');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async (idx) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      const updatedContacts = (client.contacts || []).filter((_, i) => i !== idx);
      const res = await clientService.updateClient(id, { contacts: updatedContacts });
      setClient(res.data.data);
      toast.success('Contact deleted');
    } catch {
      toast.error('Failed to delete contact');
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
    description: `Amount: ₹${d.amount?.toLocaleString()} | Stage: ${d.stage} | Probability: ${d.probability}%`,
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
      <div className="page">
        {/* Back + Header */}
        <div className="page-header" style={{ alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={() => navigate('/clients')} className="btn-icon" title="Back">
              <FiArrowLeft size={18} />
            </button>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                <h1 className="page-title">{client.companyName}</h1>
                <span className={STATUS_COLORS[client.status] || 'badge badge-gray'}>
                  {client.status}
                </span>
              </div>
              <p className="page-sub" style={{ marginTop: '4px' }}>{client.contactName} · {client.industry || 'No industry'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/clients')}
            className="btn btn-ghost"
          >
            <FiEdit2 size={13} /> Edit
          </button>
        </div>

        {/* Info Cards */}
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {/* Contact Info */}
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Contact Info</h3>
            {[
              { icon: FiMail, label: client.email },
              { icon: FiPhone, label: client.phone },
              { icon: FiGlobe, label: client.website || 'No website' },
              { icon: FiMapPin, label: [client.address?.city, client.address?.country].filter(Boolean).join(', ') || 'No address' },
              { icon: FiCalendar, label: `Added ${new Date(client.createdAt).toLocaleDateString()}` },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Icon size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-2)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { label: 'Deals', value: deals.length, color: 'var(--blue)', bg: 'var(--blue-s)', icon: FiTrendingUp },
                { label: 'Tasks', value: tasks.length, color: 'var(--yellow)', bg: 'var(--yellow-s)', icon: FiCheckSquare },
                { label: 'Contacts', value: (client.contacts || []).length + 1, color: 'var(--purple)', bg: 'var(--purple-s)', icon: FiUsers },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', background: 'var(--surface-2)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border)' }}>
                  <s.icon size={16} style={{ color: s.color, margin: '0 auto 6px', display: 'block' }} />
                  <p style={{ fontSize: '18px', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                  <p style={{ color: 'var(--text-3)', fontSize: '11px', marginTop: '2px', margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Notes</h3>
            <p style={{ color: 'var(--text-2)', fontSize: '13.5px', lineHeight: 1.5 }}>
              {client.notes || 'No notes added for this client.'}
            </p>
            {client.source && (
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>Lead Source</p>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px', fontWeight: 600 }}>{client.source}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto', background: 'var(--surface-2)' }}>
            {[
              { key: 'timeline', label: 'Timeline', count: timelineItems.length },
              { key: 'contacts', label: 'Contacts', count: (client.contacts || []).length + 1 },
              { key: 'interactions', label: 'Interactions', count: interactions.length },
              { key: 'notes', label: 'Collaborative Notes', count: notes.length },
              { key: 'deals', label: 'Deals', count: deals.length },
              { key: 'tasks', label: 'Tasks', count: tasks.length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeTab === tab.key ? 'var(--accent-s)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--indigo)' : 'var(--text-3)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--indigo)' : 'none',
                }}
              >
                {tab.label}
                <span className={`badge ${activeTab === tab.key ? 'badge-blue' : 'badge-gray'}`} style={{ fontSize: '10.5px' }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-5 anim-fade-in" key={activeTab}>
            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600 }}>Filter Timeline:</span>
                    <select
                      value={timelineFilter}
                      onChange={e => setTimelineFilter(e.target.value)}
                      className="input"
                      style={{ padding: '4px 10px', height: '30px', minWidth: '130px', fontSize: '12px' }}
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

                <div className="relative border-l-2 ml-4 space-y-6" style={{ borderLeft: '2px solid var(--border)' }}>
                  {filteredTimeline.length === 0 ? (
                    <p style={{ color: 'var(--text-3)', fontSize: '13.5px', padding: '16px 0', marginLeft: '16px' }}>No timeline activities match this filter</p>
                  ) : filteredTimeline.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="relative pl-6" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
                      <div className="absolute top-1 w-4 h-4 rounded-full border-2 bg-indigo-600" style={{ border: '2px solid var(--bg-surface)', left: '-9px', top: '4px' }} />
                      <div className="card" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                          <h4 style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-1)' }}>{item.title}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{new Date(item.date).toLocaleString()}</span>
                        </div>
                        <p style={{ color: 'var(--text-2)', fontSize: '12.5px', marginTop: '6px', lineHeight: 1.5 }}>{item.description}</p>
                        {item.meta && <p style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '8px', fontWeight: 500 }}>{item.meta}</p>}
                        {item.actions}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-3)' }}>Additional company contacts</p>
                  <button
                    onClick={() => setContactModal(true)}
                    className="btn btn-primary"
                  >
                    <FiPlus size={14} /> Add Contact
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {/* Primary Contact (from Client root) */}
                  <div className="card" style={{ padding: '16px', position: 'relative', background: 'var(--accent-s)' }}>
                    <span className="badge badge-blue" style={{ position: 'absolute', top: '12px', right: '12px' }}>Primary</span>
                    <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '14px' }}>{client.contactName}</p>
                    <p style={{ color: 'var(--text-3)', fontSize: '12px', marginTop: '4px' }}>Role: Primary Account Contact</p>
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: 'var(--text-2)' }}>
                      <p>✉️ {client.email}</p>
                      <p>📞 {client.phone}</p>
                    </div>
                  </div>
                  {/* Additional Contacts */}
                  {(client.contacts || []).map((c, idx) => (
                    <div key={idx} className="card" style={{ padding: '16px', position: 'relative' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '14px' }}>{c.name}</p>
                      <p style={{ color: 'var(--text-3)', fontSize: '12px', marginTop: '4px' }}>Role: {c.role || 'Not specified'}</p>
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: 'var(--text-2)' }}>
                        <p>✉️ {c.email}</p>
                        {c.phone && <p>📞 {c.phone}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteContact(idx)}
                        style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'none', border: 'none', color: 'var(--red)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactions Tab */}
            {activeTab === 'interactions' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-3)' }}>Communication history</p>
                  <button
                    onClick={() => setInteractionModal(true)}
                    className="btn btn-primary"
                  >
                    <FiPlus size={14} /> Log Interaction
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {interactions.length === 0 ? (
                    <p style={{ color: 'var(--text-3)', fontSize: '13.5px', textAlign: 'center', padding: '32px 0' }}>No interactions logged yet</p>
                  ) : interactions.map((i) => (
                    <div key={i._id} className="card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{INTERACTION_ICONS[i.type] || '📌'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '14px' }}>{i.subject}</p>
                            <span className={`badge ${
                              i.outcome === 'positive' ? 'badge-green' :
                              i.outcome === 'negative' ? 'badge-red' : 'badge-gray'
                            }`} style={{ fontSize: '10px' }}>
                              {i.outcome}
                            </span>
                          </div>
                          <p style={{ color: 'var(--text-2)', fontSize: '13px', marginTop: '6px', lineHeight: 1.4 }}>{i.description}</p>
                          <p style={{ color: 'var(--text-3)', fontSize: '11px', marginTop: '8px' }}>{new Date(i.date).toLocaleString()} · by {i.createdBy?.username}</p>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-3)' }}>Collaborative team notes</p>
                  <button
                    onClick={() => setNoteModal(true)}
                    className="btn btn-primary"
                  >
                    <FiPlus size={14} /> Add Collaborative Note
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notes.length === 0 ? (
                    <p style={{ color: 'var(--text-3)', fontSize: '13.5px', textAlign: 'center', padding: '32px 0' }}>No collaborative notes yet</p>
                  ) : notes.map((n) => (
                    <div key={n._id} className="card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: 'var(--text-2)', fontSize: '13.5px', lineHeight: 1.5 }}>{n.content}</p>
                          <p style={{ color: 'var(--text-3)', fontSize: '11px', marginTop: '8px' }}>Added on {new Date(n.createdAt).toLocaleString()} · by {n.createdBy?.username}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleTogglePinNote(n._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.8 }} title={n.isPinned ? 'Unpin Note' : 'Pin Note'}>
                            <span style={{ fontSize: '13px' }}>{n.isPinned ? '📌' : '📍'}</span>
                          </button>
                          <button onClick={() => handleDeleteNote(n._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.8 }} title="Delete Note">
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {deals.length === 0 ? (
                  <p style={{ color: 'var(--text-3)', fontSize: '13.5px', textAlign: 'center', padding: '32px 0' }}>No deals linked to this client</p>
                ) : deals.map((deal) => (
                  <div key={deal._id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '14px' }}>{deal.title}</p>
                      <p style={{ fontSize: '12px', marginTop: '4px', color: DEAL_STAGE_COLORS[deal.stage] || 'var(--text-3)', fontWeight: 600 }}>{deal.stage} · {deal.priority} priority</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'var(--text-1)', fontWeight: 700 }}>₹{deal.amount?.toLocaleString()}</p>
                      <p style={{ color: 'var(--text-3)', fontSize: '11.5px', marginTop: '4px' }}>{deal.probability}% probability</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-3)' }}>Tasks for this client</p>
                  <button
                    onClick={() => setTaskModal(true)}
                    className="btn btn-primary"
                  >
                    <FiPlus size={14} /> Add Task
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.length === 0 ? (
                    <p style={{ color: 'var(--text-3)', fontSize: '13.5px', textAlign: 'center', padding: '32px 0' }}>No tasks for this client</p>
                  ) : tasks.map((task) => (
                    <div key={task._id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: task.status === 'completed' ? 'var(--green)' :
                                      task.status === 'in_progress' ? 'var(--blue)' :
                                      task.status === 'cancelled' ? 'var(--text-3)' : 'var(--yellow)'
                        }} />
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '14px' }}>{task.title}</p>
                          <p style={{ color: 'var(--text-3)', fontSize: '11.5px', marginTop: '4px' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`badge ${
                        task.priority === 'high' ? 'badge-red' :
                        task.priority === 'medium' ? 'badge-yellow' : 'badge-gray'
                      }`} style={{ fontSize: '10.5px' }}>
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
        <form onSubmit={handleAddInteraction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-grid">
            <div>
              <label className="label">Type *</label>
              <select
                value={interactionForm.type}
                onChange={e => setInteractionForm(f => ({ ...f, type: e.target.value }))}
                className="input"
              >
                {['email', 'phone', 'meeting', 'note', 'site_visit'].map(t => (
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Outcome</label>
              <select
                value={interactionForm.outcome}
                onChange={e => setInteractionForm(f => ({ ...f, outcome: e.target.value }))}
                className="input"
              >
                {['positive', 'negative', 'neutral', 'pending'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Subject *</label>
            <input
              value={interactionForm.subject}
              onChange={e => setInteractionForm(f => ({ ...f, subject: e.target.value }))}
              required
              placeholder="Call regarding proposal..."
              className="input"
            />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea
              value={interactionForm.description}
              onChange={e => setInteractionForm(f => ({ ...f, description: e.target.value }))}
              required
              rows={3}
              placeholder="Describe the interaction..."
              className="input"
              style={{ resize: 'none' }}
            />
          </div>
          <div className="form-grid">
            <div>
              <label className="label">Date *</label>
              <input
                type="datetime-local"
                value={interactionForm.date}
                onChange={e => setInteractionForm(f => ({ ...f, date: e.target.value }))}
                required
                className="input"
              />
            </div>
            <div>
              <label className="label">Next Follow-up</label>
              <input
                type="date"
                value={interactionForm.nextFollowUp}
                onChange={e => setInteractionForm(f => ({ ...f, nextFollowUp: e.target.value }))}
                className="input"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={() => setInteractionModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
              {submitting ? 'Saving...' : 'Log Interaction'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal open={taskModal} onClose={() => setTaskModal(false)} title="Add Task">
        <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="label">Task Title *</label>
            <input
              value={taskForm.title}
              onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
              required
              placeholder="Follow up with client..."
              className="input"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={taskForm.description}
              onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="input"
              style={{ resize: 'none' }}
            />
          </div>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div>
              <label className="label">Priority</label>
              <select
                value={taskForm.priority}
                onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                className="input"
              >
                {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={taskForm.status}
                onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))}
                className="input"
              >
                {['open', 'in_progress', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Due Date *</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                required
                className="input"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={() => setTaskModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Collaborative Note Modal */}
      <Modal open={noteModal} onClose={() => setNoteModal(false)} title="Add Collaborative Note">
        <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="label">Note Content *</label>
            <textarea
              value={noteForm.content}
              onChange={e => setNoteForm(f => ({ ...f, content: e.target.value }))}
              required
              rows={4}
              placeholder="Type your collaborative note here... Use @username to mention or write key updates."
              className="input"
              style={{ resize: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={() => setNoteModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
              {submitting ? 'Saving...' : 'Add Note'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Contact Modal */}
      <Modal open={contactModal} onClose={() => setContactModal(false)} title="Add Company Contact">
        <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="label">Full Name *</label>
            <input
              value={contactForm.name}
              onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="Jane Doe"
              className="input"
            />
          </div>
          <div>
            <label className="label">Email Address *</label>
            <input
              type="email"
              value={contactForm.email}
              onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
              required
              placeholder="jane.doe@company.com"
              className="input"
            />
          </div>
          <div className="form-grid">
            <div>
              <label className="label">Phone Number</label>
              <input
                value={contactForm.phone}
                onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 019-2834"
                className="input"
              />
            </div>
            <div>
              <label className="label">Role / Title</label>
              <input
                value={contactForm.role}
                onChange={e => setContactForm(f => ({ ...f, role: e.target.value }))}
                placeholder="Technical Lead"
                className="input"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={() => setContactModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
              {submitting ? 'Saving...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default ClientDetail;
