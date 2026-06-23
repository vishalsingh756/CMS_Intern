import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { reportService } from '../services/api';
import {
  FiTrendingUp, FiUsers, FiCheckSquare, FiMessageCircle,
  FiDownload, FiBarChart2, FiPieChart,
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* ── Config ──────────────────────────────────────────────── */
const REPORT_TYPES = [
  { type: 'deals_by_stage',       label: 'Deals by Stage',       Icon: FiTrendingUp,    color: '#10b981', bg: '#ecfdf5' },
  { type: 'clients_by_status',    label: 'Clients by Status',    Icon: FiUsers,          color: '#6366f1', bg: '#eef2ff' },
  { type: 'tasks_by_status',      label: 'Tasks by Status',      Icon: FiCheckSquare,   color: '#a855f7', bg: '#faf5ff' },
  { type: 'interactions_by_type', label: 'Interactions by Type', Icon: FiMessageCircle, color: '#f59e0b', bg: '#fffbeb' },
];

const COLUMNS = {
  deals_by_stage:       [{ key: 'title', label: 'Title' }, { key: 'amount', label: 'Amount' }, { key: 'stage', label: 'Stage' }, { key: 'priority', label: 'Priority' }, { key: 'createdAt', label: 'Created' }],
  clients_by_status:    [{ key: 'name',  label: 'Name'  }, { key: 'email',  label: 'Email'  }, { key: 'company', label: 'Company' }, { key: 'status', label: 'Status' }, { key: 'createdAt', label: 'Created' }],
  tasks_by_status:      [{ key: 'title', label: 'Title' }, { key: 'status', label: 'Status' }, { key: 'priority', label: 'Priority' }, { key: 'dueDate', label: 'Due Date' }, { key: 'createdAt', label: 'Created' }],
  interactions_by_type: [{ key: 'subject', label: 'Subject' }, { key: 'type', label: 'Type' }, { key: 'outcome', label: 'Outcome' }, { key: 'date', label: 'Date' }, { key: 'createdAt', label: 'Created' }],
};

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#3b82f6', '#f97316'];

const TT_STYLE = {
  contentStyle: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, fontSize: 12, color: 'var(--text-1)',
  },
};

const fmt = (key, val) => {
  if (val == null) return '—';
  if (['createdAt', 'dueDate', 'date'].includes(key)) return new Date(val).toLocaleDateString();
  if (key === 'amount') return `₹${Number(val).toLocaleString()}`;
  return String(val);
};

/* ── Component ───────────────────────────────────────────── */
export default function Reports() {
  const [activeType, setActiveType] = useState('deals_by_stage');
  const [from,       setFrom]       = useState('');
  const [to,         setTo]         = useState('');
  const [chartMode,  setChartMode]  = useState('bar');
  const [loading,    setLoading]    = useState(false);
  const [data,       setData]       = useState(null);

  const report  = REPORT_TYPES.find(r => r.type === activeType);
  const columns = COLUMNS[activeType];

  const loadReport = async (type = activeType) => {
    setLoading(true);
    setData(null);
    try {
      const params = {};
      if (from) params.from = from;
      if (to)   params.to   = to;
      const res = await reportService.getReportData(type, params);
      setData(res.data?.data || null);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  // Auto-run when report type changes
  useEffect(() => { loadReport(activeType); }, [activeType]); // eslint-disable-line

  const switchType = (type) => {
    setActiveType(type);
    setData(null);
  };

  const exportCSV = () => {
    if (!data?.records?.length) return;
    const header = columns.map(c => c.label).join(',');
    const rows   = data.records.map(row =>
      columns.map(c => `"${String(row[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${activeType}_${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const top = data?.chartData?.[0];

  return (
    <Layout>
      <div className="page">

        {/* ── Header ── */}
        <div className="page-header" style={{ marginBottom: 20 }}>
          <div>
            <div className="page-title">Reports</div>
            <div className="page-sub">Pre-built reports on your CRM data</div>
          </div>
          {data?.records?.length > 0 && (
            <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: 13 }}>
              <FiDownload size={13} /> Export CSV
            </button>
          )}
        </div>

        {/* ── Report type tabs ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          {REPORT_TYPES.map(({ type, label, Icon, color, bg }) => {
            const active = activeType === type;
            return (
              <button
                key={type}
                onClick={() => switchType(type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 10,
                  border: `1.5px solid ${active ? color : 'var(--border)'}`,
                  background: active ? bg : 'var(--surface)',
                  color: active ? color : 'var(--text-2)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>

        {/* ── Filters row ── */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>From</span>
            <input type="date" className="input" style={{ width: 148, fontSize: 12.5 }} value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>To</span>
            <input type="date" className="input" style={{ width: 148, fontSize: 12.5 }} value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 12.5 }} onClick={() => loadReport()}>Apply</button>
          {(from || to) && (
            <button className="btn btn-ghost" style={{ fontSize: 12.5 }} onClick={() => { setFrom(''); setTo(''); }}>Clear</button>
          )}

          {/* Chart mode toggle */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {[{ mode: 'bar', Icon: FiBarChart2 }, { mode: 'pie', Icon: FiPieChart }].map(({ mode, Icon }) => (
              <button
                key={mode}
                title={`${mode} chart`}
                onClick={() => setChartMode(mode)}
                style={{
                  padding: '6px 10px', borderRadius: 7,
                  border: `1.5px solid ${chartMode === mode ? 'var(--accent)' : 'var(--border)'}`,
                  background: chartMode === mode ? 'var(--accent-s)' : 'transparent',
                  color: chartMode === mode ? 'var(--accent)' : 'var(--text-3)', cursor: 'pointer',
                }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 64, gap: 12, color: 'var(--text-3)', fontSize: 13 }}>
            <div className="spinner" /> Loading report…
          </div>
        )}

        {/* ── Results ── */}
        {!loading && data && (
          <>
            {/* Summary cards */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Total Records',  value: data.totalCount,           sub: null },
                { label: 'Categories',     value: data.chartData?.length ?? 0, sub: null },
                top ? { label: 'Top Category', value: top.name, sub: `${top.value} records`, color: report.color } : null,
              ].filter(Boolean).map((card, i) => (
                <div key={i} style={{ flex: 1, minWidth: 130, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{card.label}</div>
                  <div style={{ fontSize: card.sub ? 17 : 26, fontWeight: 800, color: card.color || 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.value}</div>
                  {card.sub && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{card.sub}</div>}
                </div>
              ))}
            </div>

            {/* Chart */}
            {data.chartData?.length > 0 && (
              <div className="section-card" style={{ marginBottom: 16 }}>
                <div className="section-header">
                  <span className="section-title">{report.label}</span>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <ResponsiveContainer width="100%" height={240}>
                    {chartMode === 'pie' ? (
                      <PieChart>
                        <Pie data={data.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {data.chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip {...TT_STYLE} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    ) : (
                      <BarChart data={data.chartData} barSize={38}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                        <Tooltip {...TT_STYLE} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {data.chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="section-card">
              <div className="section-header">
                <span className="section-title">{data.records?.length} records</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Showing up to 100 most recent</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr>
                  </thead>
                  <tbody>
                    {data.records?.length ? (
                      data.records.map((row, i) => (
                        <tr key={row._id || i}>
                          {columns.map(c => <td key={c.key}>{fmt(c.key, row[c.key])}</td>)}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-3)', padding: 32 }}>
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Empty ── */}
        {!loading && !data && (
          <div className="empty" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <FiBarChart2 size={36} className="empty-icon" />
            <div className="empty-title">No data available</div>
            <div className="empty-sub">Try adjusting the date range or check back later</div>
          </div>
        )}

      </div>
    </Layout>
  );
}
