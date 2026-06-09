import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { reportService } from '../services/api';
import {
  FiPlay, FiSave, FiTrash2, FiPlus, FiX, FiDownload,
  FiBarChart2, FiList, FiUpload, FiCheckCircle, FiAlertCircle,
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { toast } from 'react-toastify';

/* ── Module definitions ──────────────────────────────────── */
const MODULES = {
  clients: {
    label: 'Clients',
    color: 'var(--blue)',
    bg: 'var(--blue-s)',
    columns: [
      { key: 'name',        label: 'Name' },
      { key: 'email',       label: 'Email' },
      { key: 'phone',       label: 'Phone' },
      { key: 'company',     label: 'Company' },
      { key: 'status',      label: 'Status' },
      { key: 'industry',    label: 'Industry' },
      { key: 'source',      label: 'Source' },
      { key: 'createdAt',   label: 'Created Date' },
    ],
    groupFields: ['status', 'industry', 'source'],
  },
  deals: {
    label: 'Deals',
    color: 'var(--green)',
    bg: 'var(--green-s)',
    columns: [
      { key: 'title',               label: 'Title' },
      { key: 'amount',              label: 'Amount' },
      { key: 'stage',               label: 'Stage' },
      { key: 'priority',            label: 'Priority' },
      { key: 'probability',         label: 'Probability %' },
      { key: 'expectedCloseDate',   label: 'Close Date' },
      { key: 'createdAt',           label: 'Created Date' },
    ],
    groupFields: ['stage', 'priority'],
  },
  tasks: {
    label: 'Tasks',
    color: 'var(--purple)',
    bg: 'var(--purple-s)',
    columns: [
      { key: 'title',       label: 'Title' },
      { key: 'status',      label: 'Status' },
      { key: 'priority',    label: 'Priority' },
      { key: 'dueDate',     label: 'Due Date' },
      { key: 'completedAt', label: 'Completed At' },
      { key: 'createdAt',   label: 'Created Date' },
    ],
    groupFields: ['status', 'priority'],
  },
  interactions: {
    label: 'Interactions',
    color: 'var(--orange)',
    bg: 'var(--orange-s)',
    columns: [
      { key: 'type',        label: 'Type' },
      { key: 'subject',     label: 'Subject' },
      { key: 'outcome',     label: 'Outcome' },
      { key: 'date',        label: 'Date' },
      { key: 'createdAt',   label: 'Created Date' },
    ],
    groupFields: ['type', 'outcome'],
  },
};

const OPERATORS = [
  { value: 'equals',       label: '=' },
  { value: 'not_equals',   label: '≠' },
  { value: 'contains',     label: 'contains' },
  { value: 'greater_than', label: '>' },
  { value: 'less_than',    label: '<' },
  { value: 'between',      label: 'between' },
  { value: 'in',           label: 'in (comma list)' },
  { value: 'is_empty',     label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
];

const CHART_TYPES = [
  { value: 'table_only', label: 'Table only' },
  { value: 'bar',        label: 'Bar chart' },
  { value: 'pie',        label: 'Pie chart' },
  { value: 'line',       label: 'Line chart' },
];

const COLORS = ['#4f46e5','#059669','#d97706','#dc2626','#7c3aed','#2563eb','#ea580c','#0891b2'];

const fmt = (key, val) => {
  if (val === null || val === undefined) return '—';
  if (key.toLowerCase().includes('date') || key === 'completedAt') {
    return val ? new Date(val).toLocaleDateString() : '—';
  }
  if (key === 'amount') return `₹${Number(val).toLocaleString()}`;
  if (key === 'probability') return `${val}%`;
  return String(val);
};

const emptyFilter = () => ({ field: '', operator: 'equals', value: '', value2: '' });

/* ── Main component ──────────────────────────────────────── */
export default function Reports() {
  const [savedReports, setSavedReports]   = useState([]);
  const [activeReport,  setActiveReport]  = useState(null); // { id } or null (builder)

  // Builder state
  const [module,     setModule]     = useState('deals');
  const [columns,    setColumns]    = useState(['title', 'amount', 'stage', 'createdAt']);
  const [filters,    setFilters]    = useState([]);
  const [groupBy,    setGroupBy]    = useState('');
  const [chartType,  setChartType]  = useState('table_only');
  const [sortField,  setSortField]  = useState('createdAt');
  const [sortOrder,  setSortOrder]  = useState('desc');
  const [reportName, setReportName] = useState('');

  // Results state
  const [results,   setResults]   = useState(null);
  const [chartData, setChartData] = useState([]);
  const [running,   setRunning]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [page,      setPage]      = useState(1);

  // Import modal state
  const [importOpen,    setImportOpen]    = useState(false);
  const [importModule,  setImportModule]  = useState('clients');
  const [importFile,    setImportFile]    = useState(null);
  const [importing,     setImporting]     = useState(false);
  const [importResult,  setImportResult]  = useState(null); // { totalRows, successCount, errorCount, errors }

  const mod = MODULES[module];

  /* Load saved reports */
  const loadSaved = useCallback(async () => {
    try {
      const res = await reportService.getReports();
      setSavedReports(res.data?.data || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  /* Column toggle */
  const toggleCol = (key) => {
    setColumns(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  /* Filter helpers */
  const addFilter    = ()          => setFilters(f => [...f, emptyFilter()]);
  const removeFilter = (i)         => setFilters(f => f.filter((_, idx) => idx !== i));
  const updateFilter = (i, patch)  => setFilters(f => f.map((x, idx) => idx === i ? { ...x, ...patch } : x));

  /* Reset when module changes */
  const changeModule = (m) => {
    setModule(m);
    setColumns(MODULES[m].columns.slice(0, 4).map(c => c.key));
    setFilters([]);
    setGroupBy('');
    setResults(null);
    setChartData([]);
  };

  const buildConfig = () => {
    const config = {
      module,
      columns,
      filters: filters.filter(f => f.field),
      groupBy: groupBy || null,
      chartType,
      sortBy: { field: sortField, order: sortOrder },
    };
    if (groupBy) {
      config.aggregateBy = { field: 'amount', function: 'sum' };
    }
    return config;
  };

  /* Run report */
  const runReport = async (pg = 1) => {
    setRunning(true);
    setPage(pg);
    try {
      let res;
      if (activeReport) {
        res = await reportService.runSaved(activeReport.id, { page: pg, limit: 25 });
      } else {
        res = await reportService.runAdHoc(buildConfig(), { page: pg, limit: 25 });
      }
      const d = res.data?.data;
      setResults(d);
      setChartData(d?.chartData || []);
    } catch (e) {
      toast.error('Failed to run report');
    } finally {
      setRunning(false);
    }
  };

  /* Save report */
  const saveReport = async () => {
    if (!reportName.trim()) return toast.error('Enter a report name first');
    setSaving(true);
    try {
      const config = { ...buildConfig(), name: reportName };
      if (activeReport) {
        await reportService.updateReport(activeReport.id, config);
        toast.success('Report updated');
      } else {
        await reportService.createReport(config);
        toast.success('Report saved');
      }
      loadSaved();
    } catch {
      toast.error('Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  /* Load saved report into builder */
  const loadReport = async (rep) => {
    setModule(rep.module);
    setColumns(rep.columns || []);
    setFilters(rep.filters || []);
    setGroupBy(rep.groupBy || '');
    setChartType(rep.chartType || 'table_only');
    setSortField(rep.sortBy?.field || 'createdAt');
    setSortOrder(rep.sortBy?.order || 'desc');
    setReportName(rep.name);
    setActiveReport({ id: rep._id });
    setResults(null);
  };

  /* Delete report */
  const deleteReport = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await reportService.deleteReport(id);
      setSavedReports(p => p.filter(r => r._id !== id));
      if (activeReport?.id === id) { setActiveReport(null); setResults(null); }
      toast.success('Report deleted');
    } catch { toast.error('Delete failed'); }
  };

  /* Import CSV */
  const handleImport = async () => {
    if (!importFile) return toast.error('Please select a CSV file');
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('module', importModule);
    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/data/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        setImportResult(json.data);
        toast.success(`Imported ${json.data.successCount} records`);
      } else {
        toast.error(json.message || 'Import failed');
      }
    } catch {
      toast.error('Import request failed');
    } finally {
      setImporting(false);
    }
  };

  /* Export CSV */
  const exportCSV = () => {
    if (!results?.data?.length) return;
    const header = columns.join(',');
    const rows   = results.data.map(row =>
      columns.map(c => `"${String(row[c] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url;
    a.download = `${reportName || 'report'}_${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  /* ── Render chart ────────────────────────────────────── */
  const renderChart = () => {
    if (!chartData.length || chartType === 'table_only') return null;
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 12 }}>
          Chart — grouped by {groupBy}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><Legend />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  /* ── Layout ──────────────────────────────────────────── */
  return (
    <Layout>
      <div className="page" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* ── Saved reports sidebar ── */}
        <div style={{ width: 210, flexShrink: 0 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Saved Reports
            </div>
            <button
              onClick={() => { setActiveReport(null); setResults(null); setReportName(''); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: !activeReport ? 'var(--accent-s)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: !activeReport ? 'var(--accent)' : 'var(--text-2)', borderBottom: '1px solid var(--border)' }}
            >
              <FiPlus size={12} /> New Report
            </button>
            {savedReports.map(rep => (
              <div key={rep._id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', background: activeReport?.id === rep._id ? 'var(--accent-s)' : 'transparent' }}>
                <button
                  onClick={() => loadReport(rep)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, color: activeReport?.id === rep._id ? 'var(--accent)' : 'var(--text-2)', textAlign: 'left' }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: MODULES[rep.module]?.color || 'var(--text-3)', flexShrink: 0 }} />
                  <span className="truncate">{rep.name}</span>
                </button>
                <button className="btn-icon danger" style={{ width: 24, height: 24, marginRight: 6, flexShrink: 0 }} onClick={() => deleteReport(rep._id)}>
                  <FiTrash2 size={11} />
                </button>
              </div>
            ))}
            {!savedReports.length && (
              <div style={{ padding: '20px 14px', fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>No saved reports yet</div>
            )}
          </div>
        </div>

        {/* ── Builder + Results ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div className="page-header" style={{ marginBottom: 16 }}>
            <div>
              <div className="page-title">Reports</div>
              <div className="page-sub">Build and run dynamic reports on your CRM data</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-ghost"
                onClick={() => { setImportOpen(true); setImportResult(null); setImportFile(null); }}
                style={{ fontSize: 13 }}
              >
                <FiUpload size={13} /> Import CSV
              </button>
              {results?.data?.length > 0 && (
                <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize: 13 }}>
                  <FiDownload size={13} /> Export CSV
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => runReport(1)} disabled={running} style={{ fontSize: 13 }}>
                {running ? <><div className="spinner spinner-sm" /> Running…</> : <><FiPlay size={13} /> Run</>}
              </button>
              <button className="btn btn-primary" onClick={saveReport} disabled={saving} style={{ fontSize: 13 }}>
                {saving ? <div className="spinner spinner-sm spinner-white" /> : <FiSave size={13} />}
                {activeReport ? 'Update' : 'Save'}
              </button>
            </div>
          </div>

          {/* Report name */}
          <div style={{ marginBottom: 12 }}>
            <input
              className="input"
              placeholder="Report name…"
              value={reportName}
              onChange={e => setReportName(e.target.value)}
              style={{ fontSize: 14, fontWeight: 600 }}
            />
          </div>

          {/* Builder card */}
          <div className="section-card" style={{ marginBottom: 16 }}>

            {/* Module */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div className="label">Module</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(MODULES).map(([key, m]) => (
                  <button
                    key={key}
                    onClick={() => changeModule(key)}
                    style={{ padding: '5px 14px', borderRadius: 7, border: `1.5px solid ${module === key ? m.color : 'var(--border)'}`, background: module === key ? m.bg : 'transparent', color: module === key ? m.color : 'var(--text-2)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', transition: 'all 0.12s' }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Columns */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div className="label">Columns</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {mod.columns.map(col => (
                  <label key={col.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, cursor: 'pointer', padding: '4px 10px', borderRadius: 6, background: columns.includes(col.key) ? 'var(--accent-s)' : 'var(--surface-2)', border: `1px solid ${columns.includes(col.key) ? '#c7d2fe' : 'var(--border)'}`, color: columns.includes(col.key) ? 'var(--accent)' : 'var(--text-2)', fontWeight: 500 }}>
                    <input type="checkbox" checked={columns.includes(col.key)} onChange={() => toggleCol(col.key)} style={{ accentColor: 'var(--accent)' }} />
                    {col.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div className="label" style={{ marginBottom: 0 }}>Filters</div>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '3px 10px' }} onClick={addFilter}>
                  <FiPlus size={11} /> Add Filter
                </button>
              </div>
              {!filters.length && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No filters — all records will be included</div>}
              {filters.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <select className="input" style={{ flex: 1, fontSize: 12.5 }} value={f.field} onChange={e => updateFilter(i, { field: e.target.value })}>
                    <option value="">— Field —</option>
                    {mod.columns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                  <select className="input" style={{ width: 130, fontSize: 12.5 }} value={f.operator} onChange={e => updateFilter(i, { operator: e.target.value })}>
                    {OPERATORS.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                  </select>
                  {!['is_empty', 'is_not_empty'].includes(f.operator) && (
                    <input className="input" style={{ flex: 1, fontSize: 12.5 }} placeholder="Value…" value={f.value} onChange={e => updateFilter(i, { value: e.target.value })} />
                  )}
                  {f.operator === 'between' && (
                    <input className="input" style={{ flex: 1, fontSize: 12.5 }} placeholder="Value 2…" value={f.value2} onChange={e => updateFilter(i, { value2: e.target.value })} />
                  )}
                  <button className="btn-icon danger" onClick={() => removeFilter(i)}><FiX size={13} /></button>
                </div>
              ))}
            </div>

            {/* Group By / Chart / Sort */}
            <div style={{ padding: '14px 18px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div className="label">Group By</div>
                <select className="input" style={{ fontSize: 12.5 }} value={groupBy} onChange={e => setGroupBy(e.target.value)}>
                  <option value="">None</option>
                  {mod.groupFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div className="label">Chart Type</div>
                <select className="input" style={{ fontSize: 12.5 }} value={chartType} onChange={e => setChartType(e.target.value)} disabled={!groupBy}>
                  {CHART_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div className="label">Sort By</div>
                <select className="input" style={{ fontSize: 12.5 }} value={sortField} onChange={e => setSortField(e.target.value)}>
                  {mod.columns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 100 }}>
                <div className="label">Order</div>
                <select className="input" style={{ fontSize: 12.5 }} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Results ── */}
          {running && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 10, color: 'var(--text-3)', fontSize: 13 }}>
              <div className="spinner" /> Running report…
            </div>
          )}

          {!running && results && (
            <>
              {renderChart()}

              <div className="section-card">
                <div className="section-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiList size={14} style={{ color: 'var(--text-3)' }} />
                    <span className="section-title">
                      {results.pagination?.total ?? results.data?.length ?? 0} records
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    Page {results.pagination?.page ?? 1} of {results.pagination?.pages ?? 1}
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        {columns.map(c => {
                          const def = mod.columns.find(x => x.key === c);
                          return <th key={c}>{def?.label || c}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {results.data?.length ? results.data.map((row, i) => (
                        <tr key={row._id || i}>
                          {columns.map(c => <td key={c}>{fmt(c, row[c])}</td>)}
                        </tr>
                      )) : (
                        <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-3)', padding: 32 }}>No records matched your filters</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {results.pagination?.pages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
                    {Array.from({ length: results.pagination.pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => runReport(p)}
                        style={{ width: 30, height: 30, borderRadius: 6, border: `1.5px solid ${p === page ? 'var(--accent)' : 'var(--border)'}`, background: p === page ? 'var(--accent)' : 'transparent', color: p === page ? '#fff' : 'var(--text-2)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!running && !results && (
            <div className="empty" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <FiBarChart2 size={36} className="empty-icon" />
              <div className="empty-title">Configure and run your report</div>
              <div className="empty-sub">Select a module, pick columns, add filters, then click Run</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Import CSV Modal ── */}
      {importOpen && (
        <div className="modal-overlay" onClick={() => setImportOpen(false)}>
          <div className="modal-box" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Import CSV</span>
              <button className="btn-icon" onClick={() => setImportOpen(false)}><FiX size={15} /></button>
            </div>
            <div className="modal-body">
              {/* Module */}
              <div style={{ marginBottom: 16 }}>
                <div className="label">Target Module</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['clients', 'deals'].map(m => (
                    <button
                      key={m}
                      onClick={() => setImportModule(m)}
                      style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `1.5px solid ${importModule === m ? MODULES[m].color : 'var(--border)'}`, background: importModule === m ? MODULES[m].bg : 'transparent', color: importModule === m ? MODULES[m].color : 'var(--text-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                    >
                      {MODULES[m].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CSV columns hint */}
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--text-2)' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Expected CSV columns for {importModule}:</div>
                <code style={{ fontSize: 11, color: 'var(--accent)' }}>
                  {importModule === 'clients'
                    ? 'name, email, phone, company, status, industry, source'
                    : 'title, amount, stage, priority, probability, expectedCloseDate'}
                </code>
              </div>

              {/* File picker */}
              <div style={{ marginBottom: 16 }}>
                <div className="label">Select CSV File</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1.5px dashed var(--border-2)', borderRadius: 8, cursor: 'pointer', background: 'var(--surface-2)', transition: 'border-color 0.15s' }}>
                  <FiUpload size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: importFile ? 'var(--text-1)' : 'var(--text-3)' }}>
                    {importFile ? importFile.name : 'Click to browse .csv file…'}
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={e => { setImportFile(e.target.files[0] || null); setImportResult(null); }}
                  />
                </label>
              </div>

              {/* Result */}
              {importResult && (
                <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 8, background: importResult.errorCount === 0 ? 'var(--green-s)' : 'var(--yellow-s)', border: `1px solid ${importResult.errorCount === 0 ? '#a7f3d0' : '#fde68a'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {importResult.errorCount === 0
                      ? <FiCheckCircle size={15} style={{ color: 'var(--green)' }} />
                      : <FiAlertCircle size={15} style={{ color: 'var(--yellow)' }} />}
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>Import complete</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.8 }}>
                    Total rows: <strong>{importResult.totalRows}</strong><br />
                    ✅ Imported: <strong style={{ color: 'var(--green)' }}>{importResult.successCount}</strong><br />
                    {importResult.errorCount > 0 && <>❌ Errors: <strong style={{ color: 'var(--red)' }}>{importResult.errorCount}</strong><br /></>}
                  </div>
                  {importResult.errors?.length > 0 && (
                    <details style={{ marginTop: 8 }}>
                      <summary style={{ fontSize: 12, cursor: 'pointer', color: 'var(--text-3)' }}>Show errors</summary>
                      <div style={{ maxHeight: 120, overflowY: 'auto', fontSize: 11, marginTop: 6, color: 'var(--red)' }}>
                        {importResult.errors.map((e, i) => <div key={i}>{e.error}</div>)}
                      </div>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setImportOpen(false)} style={{ fontSize: 13 }}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={handleImport}
                  disabled={!importFile || importing}
                  style={{ fontSize: 13 }}
                >
                  {importing ? <><div className="spinner spinner-sm spinner-white" /> Importing…</> : <><FiUpload size={13} /> Import</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
