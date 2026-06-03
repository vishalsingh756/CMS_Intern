import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell,
} from 'recharts';
import {
  FiUsers, FiTrendingUp, FiCheckSquare, FiActivity,
  FiPlus, FiArrowRight, FiArrowUpRight,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import useAuthStore from '../utils/authStore';
import { clientService, dealService, taskService } from '../services/api';

const COLORS = ['#4f46e5','#059669','#d97706','#2563eb','#dc2626'];

const monthly = [
  { m:'Jan', clients:3,  deals:5,  rev:24000 },
  { m:'Feb', clients:5,  deals:8,  rev:38000 },
  { m:'Mar', clients:4,  deals:6,  rev:31000 },
  { m:'Apr', clients:8,  deals:12, rev:67000 },
  { m:'May', clients:6,  deals:9,  rev:51000 },
  { m:'Jun', clients:10, deals:15, rev:89000 },
];

const TT = { contentStyle:{ background:'#fff', border:'1px solid #e4e7ec', borderRadius:'8px', fontSize:'12px', color:'#0d1117', boxShadow:'0 4px 12px rgba(0,0,0,0.08)' } };

function KpiCard({ icon: Icon, label, value, sub, iconBg, iconColor, trend, onClick }) {
  return (
    <div className="kpi-card anim-fade-up" onClick={onClick}>
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

function SCard({ title, action, actionLabel, children, noPad }) {
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
      <div style={noPad ? {} : { padding:'18px' }}>{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [cs, setCs] = useState(null);
  const [ds, setDs] = useState(null);
  const [ts, setTs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      clientService.getClientStats(),
      dealService.getDealStats(),
      taskService.getTaskStats(),
    ]).then(([c, d, t]) => {
      if (c.status==='fulfilled') setCs(c.value.data.data);
      if (d.status==='fulfilled') setDs(d.value.data.data);
      if (t.status==='fulfilled') setTs(t.value.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const pieData = ds ? [
    { name:'Prospect',    v: ds.byStage?.prospect    || 0 },
    { name:'Proposal',    v: ds.byStage?.proposal    || 0 },
    { name:'Negotiation', v: ds.byStage?.negotiation || 0 },
    { name:'Won',         v: ds.byStage?.won         || 0 },
    { name:'Lost',        v: ds.byStage?.lost        || 0 },
  ] : [];

  const v = (val) => loading ? '—' : (val ?? 0);
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="page">
        {/* ── Welcome banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, #6366f1 60%, #818cf8 100%)',
          borderRadius: '14px',
          padding: '22px 26px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 8px 24px rgba(79,70,229,0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circle */}
          <div style={{
            position:'absolute', right:'-40px', top:'-40px',
            width:'180px', height:'180px', borderRadius:'50%',
            background:'rgba(255,255,255,0.07)',
          }} />
          <div style={{ position:'relative' }}>
            <h1 style={{ fontSize:'19px', fontWeight:800, color:'#fff', letterSpacing:'-0.03em' }}>
              {greet}, {user?.firstName || user?.username}! 👋
            </h1>
            <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.75)', marginTop:'4px' }}>
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

        {/* ── KPI row ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'12px', marginBottom:'20px' }}
          className="stagger">
          <KpiCard icon={FiUsers}       label="Total Clients"    value={v(cs?.total)}          sub={`${cs?.active||0} active`}       iconBg="#eef2ff" iconColor="var(--accent)" trend={12} onClick={() => navigate('/clients')} />
          <KpiCard icon={FiTrendingUp}  label="Total Deals"      value={v(ds?.totalDeals)}     sub={`$${(ds?.totalAmount||0).toLocaleString()} pipeline`} iconBg="#ecfdf5" iconColor="var(--green)" trend={8}  onClick={() => navigate('/deals')} />
          <KpiCard icon={FiCheckSquare} label="Open Tasks"       value={v(ts?.open)}           sub={`${ts?.overdue||0} overdue`}     iconBg="#fffbeb" iconColor="var(--yellow)" onClick={() => navigate('/tasks')} />
          <KpiCard icon={FiActivity}    label="Completed Tasks"  value={v(ts?.completed)}      sub={`${ts?.inProgress||0} in progress`} iconBg="#eff6ff" iconColor="var(--blue)" trend={5}  onClick={() => navigate('/tasks')} />
        </div>

        {/* ── Charts ── */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'14px', marginBottom:'16px' }}>
          <SCard title="Revenue Overview" actionLabel="6 months">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip {...TT} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} cursor={{ fill:'rgba(79,70,229,0.04)' }} />
                <Bar dataKey="rev" fill="var(--accent)" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </SCard>

          <SCard title="Deal Stages">
            {pieData.some(d => d.v > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="v">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...TT} />
                  <Legend iconSize={7} wrapperStyle={{ fontSize:'11px', color:'var(--text-3)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty" style={{ padding:'40px 0' }}>
                <FiTrendingUp size={28} className="empty-icon" />
                <p className="empty-sub">No deals yet</p>
              </div>
            )}
          </SCard>
        </div>

        {/* ── Line chart ── */}
        <SCard title="Growth Trends" action={() => navigate('/clients')} actionLabel="View all">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:11 }} />
              <Tooltip {...TT} />
              <Legend iconSize={7} wrapperStyle={{ fontSize:'11px', color:'var(--text-3)' }} />
              <Line type="monotone" dataKey="clients" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill:'var(--accent)', r:3 }} name="Clients" />
              <Line type="monotone" dataKey="deals"   stroke="var(--green)"  strokeWidth={2.5} dot={{ fill:'var(--green)', r:3 }}  name="Deals"   />
            </LineChart>
          </ResponsiveContainer>
        </SCard>

        {/* ── Quick stats ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'10px', marginTop:'14px' }}>
          {[
            { label:'Prospects',     value: cs?.prospects           || 0, color:'var(--accent)' },
            { label:'Active Clients',value: cs?.active              || 0, color:'var(--green)'  },
            { label:'Won Deals',     value: ds?.byStage?.won        || 0, color:'var(--blue)'   },
            { label:'Avg Deal Size', value:`$${Math.round(ds?.avgAmount||0).toLocaleString()}`, color:'var(--yellow)' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding:'14px 16px', textAlign:'center' }}>
              <div style={{ fontSize:'22px', fontWeight:900, color: s.color, letterSpacing:'-0.03em' }}>
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
