import Client from '../models/Client.js';
import Deal from '../models/Deal.js';
import Task from '../models/Task.js';
import Interaction from '../models/Interaction.js';
import { sendResponse } from '../utils/helpers.js';

// Predefined report configurations
const REPORTS = {
  deals_by_stage: {
    Model: Deal,
    groupField: 'stage',
    fields: 'title amount stage priority createdAt',
  },
  clients_by_status: {
    Model: Client,
    groupField: 'status',
    fields: 'name email company status createdAt',
  },
  tasks_by_status: {
    Model: Task,
    groupField: 'status',
    fields: 'title status priority dueDate createdAt',
  },
  interactions_by_type: {
    Model: Interaction,
    groupField: 'type',
    fields: 'subject type outcome date createdAt',
  },
};

// Build scoped match query (role-based isolation + optional date range)
const buildMatch = (userId, role, from, to) => {
  const query = {};
  if (role !== 'admin') {
    query.$or = [
      { owner: userId },
      { assignedTo: userId },
      { createdBy: userId },
    ];
  }
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to)   query.createdAt.$lte = new Date(to);
  }
  return query;
};

// GET /api/reports/:type?from=&to=
export const getReportData = async (req, res) => {
  try {
    const config = REPORTS[req.params.type];
    if (!config) return sendResponse(res, 400, false, 'Invalid report type');

    const { Model, groupField, fields } = config;
    const match = buildMatch(req.user._id, req.user.role, req.query.from, req.query.to);

    const [chartData, records, totalCount] = await Promise.all([
      Model.aggregate([
        { $match: match },
        { $group: { _id: `$${groupField}`, value: { $sum: 1 } } },
        { $project: { _id: 0, name: { $ifNull: ['$_id', 'Unspecified'] }, value: 1 } },
        { $sort: { value: -1 } },
      ]),
      Model.find(match).select(fields).sort({ createdAt: -1 }).limit(100).lean(),
      Model.countDocuments(match),
    ]);

    sendResponse(res, 200, true, 'Report generated', { chartData, records, totalCount });
  } catch (error) {
    console.error('Report error:', error);
    sendResponse(res, 500, false, 'Error generating report');
  }
};
