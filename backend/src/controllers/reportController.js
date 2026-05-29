import mongoose from 'mongoose';
import Report from '../models/Report.js';
import Client from '../models/Post.js';
import Deal from '../models/Deal.js';
import Task from '../models/Task.js';
import Interaction from '../models/Interaction.js';
import { sendResponse } from '../utils/helpers.js';

// Helper to map module string to Mongoose Model
const getModelForModule = (moduleName) => {
  switch (moduleName) {
    case 'clients': return Client;
    case 'deals': return Deal;
    case 'tasks': return Task;
    case 'interactions': return Interaction;
    default: throw new Error('Invalid module');
  }
};

// Helper to build MongoDB match query from filters
const buildMatchQuery = (filters, userId, role) => {
  const query = {};
  
  // Data isolation
  if (role !== 'admin') {
    // We assume most models use 'owner', 'assignedTo', or 'createdBy'
    // This logic might need tweaking based on exact model schema, we use $or for safety
    query.$or = [
      { owner: userId },
      { assignedTo: userId },
      { createdBy: userId }
    ];
  }

  if (!filters || filters.length === 0) return query;

  const andConditions = [];
  if (query.$or) {
    andConditions.push({ $or: query.$or });
    delete query.$or;
  }

  filters.forEach(filter => {
    const { field, operator, value, value2 } = filter;
    let condition = {};

    switch (operator) {
      case 'equals': condition[field] = value; break;
      case 'not_equals': condition[field] = { $ne: value }; break;
      case 'contains': condition[field] = { $regex: value, $options: 'i' }; break;
      case 'greater_than': condition[field] = { $gt: value }; break;
      case 'less_than': condition[field] = { $lt: value }; break;
      case 'between': condition[field] = { $gte: value, $lte: value2 }; break;
      case 'in': condition[field] = { $in: Array.isArray(value) ? value : [value] }; break;
      case 'is_empty': condition[field] = { $in: [null, ''] }; break;
      case 'is_not_empty': condition[field] = { $nin: [null, ''] }; break;
    }
    
    if (Object.keys(condition).length > 0) {
      andConditions.push(condition);
    }
  });

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  return query;
};

// Create a new report configuration
export const createReport = async (req, res) => {
  try {
    const reportData = { ...req.body, createdBy: req.user._id };
    const report = new Report(reportData);
    await report.save();
    sendResponse(res, 201, true, 'Report created successfully', report);
  } catch (error) {
    console.error('Create report error:', error);
    sendResponse(res, 500, false, 'Error creating report');
  }
};

// Get all reports (shared + user's own)
export const getReports = async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? {} 
      : { $or: [{ createdBy: req.user._id }, { isShared: true }] };

    const reports = await Report.find(query).populate('createdBy', 'username firstName lastName');
    sendResponse(res, 200, true, 'Reports retrieved successfully', reports);
  } catch (error) {
    console.error('Get reports error:', error);
    sendResponse(res, 500, false, 'Error fetching reports');
  }
};

// Get a single report
export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return sendResponse(res, 404, false, 'Report not found');
    sendResponse(res, 200, true, 'Report retrieved successfully', report);
  } catch (error) {
    console.error('Get report error:', error);
    sendResponse(res, 500, false, 'Error fetching report');
  }
};

// Update report
export const updateReport = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    if (!report) return sendResponse(res, 404, false, 'Report not found');
    
    if (report.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this report');
    }

    report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    sendResponse(res, 200, true, 'Report updated successfully', report);
  } catch (error) {
    console.error('Update report error:', error);
    sendResponse(res, 500, false, 'Error updating report');
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return sendResponse(res, 404, false, 'Report not found');

    if (report.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this report');
    }

    await Report.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, 'Report deleted successfully');
  } catch (error) {
    console.error('Delete report error:', error);
    sendResponse(res, 500, false, 'Error deleting report');
  }
};

// Run a report dynamically
export const runReport = async (req, res) => {
  try {
    let reportConfig;
    
    // Can run an ad-hoc report by sending config in body, or a saved report by passing ID
    if (req.params.id) {
      reportConfig = await Report.findById(req.params.id);
      if (!reportConfig) return sendResponse(res, 404, false, 'Report not found');
    } else {
      reportConfig = req.body;
    }

    const { module, filters, groupBy, aggregateBy, columns, sortBy } = reportConfig;
    const Model = getModelForModule(module);
    const matchQuery = buildMatchQuery(filters, req.user._id, req.user.role);

    // 1. Fetch raw table data (with selected columns)
    let selectString = columns && columns.length > 0 ? columns.join(' ') : '';
    let sortObj = {};
    if (sortBy && sortBy.field) {
      sortObj[sortBy.field] = sortBy.order === 'desc' ? -1 : 1;
    } else {
      sortObj.createdAt = -1; // default
    }

    // Pagination for table data
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const data = await Model.find(matchQuery)
      .select(selectString)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalRecords = await Model.countDocuments(matchQuery);

    // 2. Fetch Aggregation for Charts (if grouping is defined)
    let chartData = [];
    if (groupBy) {
      const aggPipeline = [
        { $match: matchQuery },
        { 
          $group: {
            _id: `$${groupBy}`,
            value: aggregateBy && aggregateBy.field && aggregateBy.function !== 'count'
                   ? { [`$${aggregateBy.function}`]: `$${aggregateBy.field}` }
                   : { $sum: 1 }
          }
        },
        { $sort: { value: -1 } },
        {
          $project: {
            _id: 0,
            name: { $ifNull: ["$_id", "Unspecified"] },
            value: 1
          }
        }
      ];
      chartData = await Model.aggregate(aggPipeline);
    }

    sendResponse(res, 200, true, 'Report executed successfully', {
      reportName: reportConfig.name || 'Custom Report',
      module: module,
      data,
      chartData,
      pagination: {
        page,
        limit,
        total: totalRecords,
        pages: Math.ceil(totalRecords / limit)
      }
    });

  } catch (error) {
    console.error('Run report error:', error);
    sendResponse(res, 500, false, 'Error executing report');
  }
};

export default {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  runReport
};
