import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendResponse } from '../utils/helpers.js';
import Client from '../models/Post.js';
import Deal from '../models/Deal.js';
import Task from '../models/Task.js';

const router = express.Router();

/**
 * GET /api/dashboard/overview
 * Returns:
 *  - monthly[]  : last-12-month time series { month, clients, deals, tasks, leads, revenue }
 *  - taskBreakdown[] : { name, value } for pie
 *  - dealBreakdown[] : { name, value } for pie
 *  - clientBreakdown[]: { name, value } by status
 *  - recentActivity counts
 */
router.get('/overview', protect, async (req, res) => {
  try {
    const now = new Date();
    // Start of 12 months ago (beginning of that month)
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const isAdmin = req.user.role === 'admin';
    const userId = req.user._id;

    // ── Helper: build a monthly time-series for any model ──────────────
    const monthlyAgg = async (Model, matchField, extraMatch = {}) => {
      const match = {
        createdAt: { $gte: twelveMonthsAgo },
        ...extraMatch,
      };
      if (!isAdmin && matchField) match[matchField] = userId;

      return Model.aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              year:  { $year:  '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count:   { $sum: 1 },
            revenue: { $sum: { $ifNull: ['$amount', 0] } },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);
    };

    // ── Run all aggregations in parallel ────────────────────────────────
    const [clientRows, dealRows, taskRows] = await Promise.all([
      monthlyAgg(Client, 'assignedTo'),
      monthlyAgg(Deal,   'owner'),
      monthlyAgg(Task,   'assignedTo'),
    ]);

    // ── Build a filled 12-month array ───────────────────────────────────
    const toMap = (rows, valueKey = 'count', revenueKey = null) => {
      const m = {};
      rows.forEach(r => {
        const key = `${r._id.year}-${String(r._id.month).padStart(2, '0')}`;
        m[key] = { count: r[valueKey], revenue: r.revenue || 0 };
      });
      return m;
    };

    const clientMap  = toMap(clientRows);
    const dealMap    = toMap(dealRows);
    const taskMap    = toMap(taskRows);

    const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthly = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthly.push({
        m:       MONTH_LABELS[d.getMonth()],
        year:    d.getFullYear(),
        clients: clientMap[key]?.count   || 0,
        deals:   dealMap[key]?.count     || 0,
        tasks:   taskMap[key]?.count     || 0,
        revenue: dealMap[key]?.revenue   || 0,
      });
    }

    // ── Breakdown queries ────────────────────────────────────────────────
    const baseClientQuery = isAdmin ? {} : { assignedTo: userId };
    const baseDealQuery   = isAdmin ? {} : { owner: userId };
    const baseTaskQuery   = isAdmin ? {} : { assignedTo: userId };

    const [
      clientStatuses,
      dealStages,
      taskStatuses,
      dealAmountData,
    ] = await Promise.all([
      Client.aggregate([
        { $match: baseClientQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Deal.aggregate([
        { $match: baseDealQuery },
        { $group: { _id: '$stage', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: baseTaskQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      // Monthly revenue from won deals only
      Deal.aggregate([
        { $match: { ...baseDealQuery, stage: 'won', createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    const capitalize = s => s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : s;

    const clientBreakdown = clientStatuses.map(s => ({ name: capitalize(s._id || 'Unknown'), value: s.count }));
    const dealBreakdown   = dealStages.map(s    => ({ name: capitalize(s._id || 'Unknown'), value: s.count }));
    const taskBreakdown   = taskStatuses.map(s  => ({ name: capitalize(s._id || 'Unknown'), value: s.count }));

    // Merge won-deal revenue into monthly array
    const wonRevenueMap = {};
    dealAmountData.forEach(r => {
      const key = `${r._id.year}-${String(r._id.month).padStart(2, '0')}`;
      wonRevenueMap[key] = r.revenue;
    });
    monthly.forEach((m, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      m.wonRevenue = wonRevenueMap[key] || 0;
    });

    sendResponse(res, 200, true, 'Dashboard overview retrieved', {
      monthly,
      clientBreakdown,
      dealBreakdown,
      taskBreakdown,
    });
  } catch (err) {
    console.error('Dashboard overview error:', err);
    sendResponse(res, 500, false, 'Error fetching dashboard overview');
  }
});

export default router;
