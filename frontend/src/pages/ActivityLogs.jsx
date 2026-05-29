import { useState, useEffect } from 'react';
import { FiActivity, FiFilter } from 'react-icons/fi';
import Layout from '../components/Layout';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const ACTION_ICONS = {
  login: '🔐',
  logout: '🚪',
  create_client: '👤',
  edit_client: '✏️',
  delete_client: '🗑️',
  create_deal: '💰',
  edit_deal: '✏️',
  delete_deal: '🗑️',
  win_deal: '🏆',
  lose_deal: '😞',
  create_task: '✅',
  update_task: '🔄',
  complete_task: '✅',
  delete_task: '🗑️',
  create_interaction: '💬',
  edit_interaction: '✏️',
  delete_interaction: '🗑️',
  create_user: '👤',
  edit_user: '✏️',
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/activity', { params: { page, limit: 20 } });
        setLogs(res.data.data.logs || res.data.data || []);
        setTotalPages(res.data.data.pagination?.pages || 1);
      } catch (err) {
        // Fallback: try different endpoint
        try {
          const res2 = await apiClient.get('/auth/activity', { params: { page, limit: 20 } });
          setLogs(res2.data.data || []);
        } catch (err2) {
          toast.error('Failed to load activity logs');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page]);

  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
          <p className="text-gray-500 text-sm mt-1">System-wide activity history</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
              <FiActivity size={48} className="mb-3 opacity-30" />
              <p>No activity logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {logs.map((log, i) => (
                <div key={log._id || i} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
                    {ACTION_ICONS[log.action] || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium">
                        {log.action?.replace(/_/g, ' ') || 'Action'}
                      </p>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-500 text-xs capitalize">{log.entityType}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">
                      by {log.user?.username || log.userId?.username || 'Unknown'} ·{' '}
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Unknown time'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1 ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActivityLogs;
