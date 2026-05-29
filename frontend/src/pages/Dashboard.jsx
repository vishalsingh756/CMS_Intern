import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { FiUsers, FiTrendingUp, FiCheckSquare, FiMessageSquare, FiPlus, FiArrowRight } from 'react-icons/fi';
import Layout from '../components/Layout';
import useAuthStore from '../utils/authStore';
import { clientService, dealService, taskService } from '../services/api';

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const StatCard = ({ icon: Icon, label, value, sub, color, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-gray-600 transition-all hover:-translate-y-0.5 group`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-2">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [clientStats, setClientStats] = useState(null);
  const [dealStats, setDealStats] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthlyData = [
    { month: 'Jan', clients: 3, deals: 5, revenue: 24000 },
    { month: 'Feb', clients: 5, deals: 8, revenue: 38000 },
    { month: 'Mar', clients: 4, deals: 6, revenue: 31000 },
    { month: 'Apr', clients: 8, deals: 12, revenue: 67000 },
    { month: 'May', clients: 6, deals: 9, revenue: 51000 },
    { month: 'Jun', clients: 10, deals: 15, revenue: 89000 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cStats, dStats, tStats] = await Promise.allSettled([
          clientService.getClientStats(),
          dealService.getDealStats(),
          taskService.getTaskStats(),
        ]);
        if (cStats.status === 'fulfilled') setClientStats(cStats.value.data.data);
        if (dStats.status === 'fulfilled') setDealStats(dStats.value.data.data);
        if (tStats.status === 'fulfilled') setTaskStats(tStats.value.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const dealPieData = dealStats
    ? [
        { name: 'Prospect', value: dealStats.byStage?.prospect || 0 },
        { name: 'Negotiation', value: dealStats.byStage?.negotiation || 0 },
        { name: 'Proposal', value: dealStats.byStage?.proposal || 0 },
        { name: 'Won', value: dealStats.byStage?.won || 0 },
        { name: 'Lost', value: dealStats.byStage?.lost || 0 },
      ]
    : [];

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-purple-900/30 border border-cyan-800/40 rounded-2xl p-6 lg:p-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Welcome back, {user?.firstName || user?.username}! 👋
          </h1>
          <p className="text-gray-400 mt-2">Here's what's happening with your clients today.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => navigate('/clients')}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <FiPlus size={16} /> Add Client
            </button>
            <button
              onClick={() => navigate('/deals')}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all border border-gray-700"
            >
              <FiTrendingUp size={16} /> View Deals
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={FiUsers}
            label="Total Clients"
            value={loading ? '—' : clientStats?.total || 0}
            sub={`${clientStats?.active || 0} active`}
            color="bg-cyan-500"
            onClick={() => navigate('/clients')}
          />
          <StatCard
            icon={FiTrendingUp}
            label="Total Deals"
            value={loading ? '—' : dealStats?.totalDeals || 0}
            sub={`$${dealStats?.totalAmount?.toLocaleString() || 0} value`}
            color="bg-blue-500"
            onClick={() => navigate('/deals')}
          />
          <StatCard
            icon={FiCheckSquare}
            label="Open Tasks"
            value={loading ? '—' : taskStats?.open || 0}
            sub={`${taskStats?.overdue || 0} overdue`}
            color="bg-yellow-500"
            onClick={() => navigate('/tasks')}
          />
          <StatCard
            icon={FiMessageSquare}
            label="Completed Tasks"
            value={loading ? '—' : taskStats?.completed || 0}
            sub={`${taskStats?.inProgress || 0} in progress`}
            color="bg-purple-500"
            onClick={() => navigate('/tasks')}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Revenue Overview</h2>
              <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '10px', color: '#fff' }}
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Deal stages pie */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-6">Deal Stages</h2>
            {dealPieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dealPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {dealPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }}
                  />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                <FiTrendingUp size={32} className="mb-2 opacity-40" />
                <p className="text-sm">No deals yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Clients + Tasks growth */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-white">Client & Deal Growth</h2>
            <button
              onClick={() => navigate('/clients')}
              className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
            >
              View all <FiArrowRight size={14} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '10px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
              <Line type="monotone" dataKey="clients" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 4 }} name="Clients" />
              <Line type="monotone" dataKey="deals" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} name="Deals" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Prospects', value: clientStats?.prospects || 0, color: 'text-cyan-400' },
            { label: 'Active Clients', value: clientStats?.active || 0, color: 'text-green-400' },
            { label: 'Won Deals', value: dealStats?.byStage?.won || 0, color: 'text-blue-400' },
            { label: 'Avg Deal Size', value: `$${Math.round(dealStats?.avgAmount || 0).toLocaleString()}`, color: 'text-purple-400' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs mb-2">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
