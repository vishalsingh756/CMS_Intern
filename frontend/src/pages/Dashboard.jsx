import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  FiUsers, FiTrendingUp, FiCheckSquare, FiActivity,
  FiPlus, FiArrowRight, FiArrowUpRight, FiRefreshCw,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import useAuthStore from '../utils/authStore';
import { clientService, dealService, taskService, dashboardService } from '../services/api';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const COLORS      = ['#6366F1','#10B981','#F59E0B','#3B82F6','#EF4444','#8B5CF6','#F97316'];
const TT_STYLE    = {
  contentStyle: {
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#0F172A',
    boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
  },
};

/* ── Sub-components ──────────────────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, sub, iconBg, iconColor, trend, onClick }) {
  return (
    <div className="kpi-card anim-fade-up" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div className="kpi-icon" style={{ background: iconBg }}>
          <Icon size={17} color={iconColor} />
        </div>
        {trend !== undefined && (
          <span style={{
            display:'flex', alignItems:'center', gap:'3px',
            fontSize:'11px', fontWeight:700,
            color: trend >= 0 ? 'var(--green)' : 'var(--red)',
            background: trend >= 0 ? 'var(--green-s)' : 'var(--red-s)',
            padding:'2px 7px', borderRadius:'99px',
          }}>
            <FiArrowUpRight size={11} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="kpi-val">{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

function SCard({ title, action, actionLabel, children }) {
  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">{title}</span>
        {action && (
          <button onClick={action} style={{
            display:'flex', alignItems:'center', gap:'4px', fontSize:'12px',
            color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontWeight:600,
          }}>
            {actionLabel} <FiArrowRight size={12} />
          </button>
        )}
      </div>
      <div style={{ padding:'18px' }}>{children}</div>
    </div>
  );
}

function EmptyChart({ icon: Icon, label }) {
  return (
    <div className="empty" style={{ padding:'40px 0' }}>
      <Icon size={28} className="empty-icon" />
      <p className="empty-sub">{label}</p>
    </div>
  );
}

/* ── Custom PieChart label ───────────────────────────────────────────────── */
const renderCustomLabel = ({ name, percent }) =>
  percent > 0.04 ? `${(percent * 100).toFixed(0)}%` : '';

/* ── Dashboard ───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user }  = useAuthStore();

  /* KPI stats */
  const [cs, setCs] = useState(null);
  const [ds, setDs] = useState(null);
  const [ts, setTs] = useState(null);

  /* Chart data from real DB aggregation */
  const [overview, setOverview]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError]     = useState(false);

  /* ── Initial load ──────────────────────────────────────────────────────── */
  useEffect(() => {
    // KPI cards — existing stats endpoints
    Promise.allSettled([
      clientService.getClientStats(),
      dealService.getDealStats(),
      taskService.getTaskStats(),
    ]).then(([c, d, t]) => {
      if (c.status === 'fulfilled') setCs(c.value.data.data);
      if (d.status === 'fulfilled') setDs(d.value.data.data);
      if (t.status === 'fulfilled') setTs(t.value.data.data);
    }).finally(() => setLoading(false));

    // Chart data — new overview endpoint
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setChartLoading(true);
    setChartError(false);
    try {
      const res = await dashboardService.getOverview();
      setOverview(res.data.data);
    } catch (err) {
      console.error('Dashboard overview error:', err);
      setChartError(true);
    } finally {
      setChartLoading(false);
    }
  };

  /* ── Helpers ─────────────────────────────────────────────────────────────*/
  const fmt   = (val) => loading ? '—' : (val ?? 0);
  const hr    = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';

  /* Strip months that have all-zero values for a cleaner chart */
  const monthly = overview?.monthly ?? [];
  const hasAnyData = monthly.some(m => m.clients || m.deals || m.tasks || m.wonRevenue);

  /* Pie data */
  const dealPie   = (overview?.dealBreakdown   ?? []).filter(d => d.value > 0);
  const taskPie   = (overview?.taskBreakdown   ?? []).filter(d => d.value > 0);
  const clientPie = (overview?.clientBreakdown ?? []).filter(d => d.value > 0);

  /* ── Chart loading / error state ─────────────────────────────────────── */
  const ChartPlaceholder = ({ height = 220 }) => (
    <div style={{
      height,
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      gap:'10px',
      color:'var(--text-3)',
      fontSize:'13px',
    }}>
      {chartLoading ? (
        <>
          <div className="spinner" style={{ width:22, height:22 }} />
          <span>Loading chart data…</span>
        </>
      ) : chartError ? (
        <>
          <FiActivity size={24} />
          <span>Could not load chart data</span>
          <button className="btn btn-ghost" onClick={fetchOverview}
            style={{ fontSize:'11px', padding:'5px 12px', marginTop:'4px', display:'flex', alignItems:'center', gap:'5px' }}>
            <FiRefreshCw size={11} /> Retry
          </button>
        </>
      ) : (
        <>
          <FiTrendingUp size={24} />
          <span>No data yet — start adding records!</span>
        </>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="page">

        {/* ── Welcome banner ─────────────────────────────────────────────── */}
        <div style={{
          background:'linear-gradient(135deg,#6366F1 0%,#4F46E5 55%,#06B6D4 100%)',
          borderRadius:'20px',
          padding:'28px 32px',
          marginBottom:'28px',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          flexWrap:'wrap',
          gap:'16px',
          boxShadow:'0 8px 32px rgba(99,102,241,0.28)',
          position:'relative',
          overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', right:'-50px', top:'-50px',
            width:'200px', height:'200px', borderRadius:'50%',
            background:'rgba(255,255,255,0.07)',
          }} />
          <div style={{ position:'relative' }}>
            <h1 style={{ fontSize:'20px', fontWeight:800, color:'#fff', letterSpacing:'-0.03em' }}>
              {greet}, {user?.firstName || user?.username}! 👋
            </h1>
            <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.72)', marginTop:'4px' }}>
              Here's your business overview for today
            </p>
          </div>
          <div style={{ display:'flex', gap:'8px', position:'relative' }}>
            <button onClick={() => navigate('/clients')} className="btn"
              style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(8px)' }}>
              <FiUsers size={14} /> Clients
            </button>
            <button onClick={() => navigate('/clients')} className="btn"
              style={{ background:'#fff', color:'var(--accent)', fontWeight:700 }}>
              <FiPlus size={14} /> Add Client
            </button>
          </div>
        </div>

        {/* ── KPI row ────────────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'12px', marginBottom:'24px' }}
          className="stagger">
          <KpiCard icon={FiUsers}       label="Total Clients"    value={fmt(cs?.total)}      sub={`${cs?.active||0} active`}                  iconBg="rgba(99,102,241,0.08)"  iconColor="var(--accent)" trend={12} onClick={() => navigate('/clients')} />
          <KpiCard icon={FiTrendingUp}  label="Total Deals"      value={fmt(ds?.totalDeals)} sub={`₹${(ds?.totalAmount||0).toLocaleString()} pipeline`} iconBg="rgba(16,185,129,0.1)"   iconColor="var(--green)"  trend={8}  onClick={() => navigate('/deals')}   />
          <KpiCard icon={FiCheckSquare} label="Open Tasks"       value={fmt(ts?.open)}       sub={`${ts?.overdue||0} overdue`}                iconBg="rgba(245,158,11,0.1)"   iconColor="var(--yellow)"             onClick={() => navigate('/tasks')}   />
          <KpiCard icon={FiActivity}    label="Completed Tasks"  value={fmt(ts?.completed)}  sub={`${ts?.inProgress||0} in progress`}         iconBg="rgba(59,130,246,0.08)"  iconColor="var(--blue)"   trend={5}  onClick={() => navigate('/tasks')}   />
        </div>

        {/* ── Row 1: Revenue over time (full width) ──────────────────────── */}
        <SCard title="Won Revenue — Last 12 Months">
          {chartLoading || chartError || !hasAnyData ? (
            <ChartPlaceholder height={220} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'#94A3B8', fontSize:11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill:'#94A3B8', fontSize:11 }}
                  tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                <Tooltip {...TT_STYLE} formatter={v => [`₹${Number(v).toLocaleString()}`, 'Won Revenue']} />
                <Area type="monotone" dataKey="wonRevenue" name="Won Revenue"
                  stroke="var(--accent)" strokeWidth={2.5}
                  fillOpacity={1} fill="url(#gradRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </SCard>

        {/* ── Row 2: Clients & Leads growth | Deal stages pie ────────────── */}
        <div className="grid-2-1" style={{ marginTop:'14px' }}>

          <SCard title="Growth Trends — Clients & Deals">
            {chartLoading || chartError || !hasAnyData ? (
              <ChartPlaceholder height={230} />
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'#94A3B8', fontSize:11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill:'#94A3B8', fontSize:11 }} allowDecimals={false} />
                  <Tooltip {...TT_STYLE} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize:'11px', color:'#64748B' }} />
                  <Line type="monotone" dataKey="clients" name="Clients" stroke="var(--accent)" strokeWidth={2.5} dot={{ r:3, fill:'var(--accent)' }} activeDot={{ r:5 }} />
                  <Line type="monotone" dataKey="deals"   name="Deals"   stroke="var(--green)"  strokeWidth={2.5} dot={{ r:3, fill:'var(--green)'  }} activeDot={{ r:5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </SCard>

          <SCard title="Deal Pipeline Stages">
            {chartLoading || chartError ? (
              <ChartPlaceholder height={230} />
            ) : dealPie.length === 0 ? (
              <EmptyChart icon={FiTrendingUp} label="No deals yet" />
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={dealPie} cx="50%" cy="45%" innerRadius={50} outerRadius={80}
                    paddingAngle={3} dataKey="value" label={renderCustomLabel} labelLine={false}>
                    {dealPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...TT_STYLE} />
                  <Legend iconSize={7} wrapperStyle={{ fontSize:'11px', color:'var(--text-3)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </SCard>
        </div>

        {/* ── Row 3: Task breakdown | Client status | Monthly activity bar ── */}
        <div className="grid-3" style={{ marginTop:'14px' }}>

          {/* Task status breakdown */}
          <SCard title="Task Status Breakdown">
            {chartLoading || chartError ? (
              <ChartPlaceholder height={200} />
            ) : taskPie.length === 0 ? (
              <EmptyChart icon={FiCheckSquare} label="No tasks yet" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={taskPie} cx="50%" cy="45%" innerRadius={42} outerRadius={68}
                    paddingAngle={3} dataKey="value" label={renderCustomLabel} labelLine={false}>
                    {taskPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...TT_STYLE} />
                  <Legend iconSize={7} wrapperStyle={{ fontSize:'11px', color:'var(--text-3)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </SCard>

          {/* Client status breakdown */}
          <SCard title="Client Status Breakdown">
            {chartLoading || chartError ? (
              <ChartPlaceholder height={200} />
            ) : clientPie.length === 0 ? (
              <EmptyChart icon={FiUsers} label="No clients yet" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={clientPie} cx="50%" cy="45%" innerRadius={42} outerRadius={68}
                    paddingAngle={3} dataKey="value" label={renderCustomLabel} labelLine={false}>
                    {clientPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...TT_STYLE} />
                  <Legend iconSize={7} wrapperStyle={{ fontSize:'11px', color:'var(--text-3)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </SCard>

          {/* Monthly activity volume (bar) */}
          <SCard title="Monthly Activity Volume">
            {chartLoading || chartError || !hasAnyData ? (
              <ChartPlaceholder height={200} />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthly} barSize={14} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'#94A3B8', fontSize:10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill:'#94A3B8', fontSize:10 }} allowDecimals={false} />
                  <Tooltip {...TT_STYLE} />
                  <Legend iconSize={7} wrapperStyle={{ fontSize:'10px', color:'#64748B' }} />
                  <Bar dataKey="clients" name="Clients" fill="var(--accent)" radius={[4,4,0,0]} />
                  <Bar dataKey="tasks"   name="Tasks"   fill="var(--yellow)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </SCard>
        </div>

        {/* ── Row 4: Quick-stat chips ─────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'10px', marginTop:'14px' }}>
          {[
            { label:'Prospects',      value: cs?.prospects            || 0,  color:'var(--accent)' },
            { label:'Active Clients', value: cs?.active               || 0,  color:'var(--green)'  },
            { label:'Won Deals',      value: ds?.byStage?.won         || 0,  color:'var(--blue)'   },
            { label:'Lost Deals',     value: ds?.byStage?.lost        || 0,  color:'var(--red)'    },
            { label:'Avg Deal Size',  value:`₹${Math.round(ds?.avgAmount||0).toLocaleString()}`,  color:'var(--yellow)' },
            { label:'Tasks Overdue',  value: ts?.overdue              || 0,  color:'var(--orange)' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding:'14px 16px', textAlign:'center' }}>
              <div style={{ fontSize:'22px', fontWeight:900, color:s.color, letterSpacing:'-0.03em' }}>
                {loading ? '—' : s.value}
              </div>
              <div style={{ fontSize:'11.5px', color:'var(--text-3)', marginTop:'3px', fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
