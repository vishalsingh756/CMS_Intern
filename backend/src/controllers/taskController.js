import Task from '../models/Task.js';
import { paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createTask = async (req, res) => {
  try {
    const { title, client, deal, description, status, priority, assignedTo, dueDate, remindBefore } = req.body;

    const task = new Task({
      title,
      client,
      deal,
      description,
      status: status || 'open',
      priority: priority || 'medium',
      assignedTo,
      dueDate,
      remindBefore: remindBefore || 24,
    });

    await task.save();
    await task.populate('client', 'companyName');
    await task.populate('deal', 'title');
    await task.populate('assignedTo', 'username email');

    // Log activity
    await logActivity(req.user._id, 'create_task', 'task', task._id, { title, priority }, req);

    sendResponse(res, 201, true, 'Task created successfully', task);
  } catch (error) {
    console.error('Create task error:', error);
    sendResponse(res, 500, false, 'Error creating task');
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, completedAt } = req.body;

    let task = await Task.findById(id);

    if (!task) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    // Check authorization
    if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this task');
    }

    const wasCompleted = task.status !== 'completed' && status === 'completed';

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (wasCompleted) task.completedAt = completedAt || new Date();

    await task.save();
    await task.populate('client', 'companyName');
    await task.populate('deal', 'title');
    await task.populate('assignedTo', 'username email');

    // Log activity
    const action = wasCompleted ? 'complete_task' : 'update_task';
    await logActivity(req.user._id, action, 'task', task._id, { title, status }, req);

    sendResponse(res, 200, true, 'Task updated successfully', task);
  } catch (error) {
    console.error('Update task error:', error);
    sendResponse(res, 500, false, 'Error updating task');
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    // Check authorization
    if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this task');
    }

    await Task.findByIdAndDelete(id);

    // Log activity
    await logActivity(req.user._id, 'delete_task', 'task', id, { title: task.title }, req);

    sendResponse(res, 200, true, 'Task deleted successfully');
  } catch (error) {
    console.error('Delete task error:', error);
    sendResponse(res, 500, false, 'Error deleting task');
  }
};

export const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, assignedTo, search, client, deal } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (client) query.client = client;
    if (deal) query.deal = deal;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Non-admin users can only see their own tasks
    if (req.user.role !== 'admin') {
      query.assignedTo = req.user._id;
    }

    const { skip, limit: pageLimit } = paginate(page, limit);

    const tasks = await Task.find(query)
      .populate('client', 'companyName')
      .populate('deal', 'title')
      .populate('assignedTo', 'username email')
      .sort({ dueDate: 1 })
      .limit(pageLimit)
      .skip(skip);

    const total = await Task.countDocuments(query);

    sendResponse(res, 200, true, 'Tasks retrieved successfully', {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    sendResponse(res, 500, false, 'Error fetching tasks');
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const { status = 'open' } = req.query;

    const tasks = await Task.find({
      assignedTo: req.user._id,
      status: status || { $in: ['open', 'in_progress'] },
    })
      .populate('client', 'companyName')
      .populate('deal', 'title')
      .populate('assignedTo', 'username email')
      .sort({ dueDate: 1 });

    sendResponse(res, 200, true, 'My tasks retrieved successfully', tasks);
  } catch (error) {
    console.error('Get my tasks error:', error);
    sendResponse(res, 500, false, 'Error fetching tasks');
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.user._id;
    const query = userId ? { assignedTo: userId } : {};

    const tasks = await Task.find(query);

    const stats = {
      total: tasks.length,
      open: tasks.filter(t => t.status === 'open').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      overdue: tasks.filter(t => t.dueDate < new Date() && t.status !== 'completed').length,
    };

    sendResponse(res, 200, true, 'Task statistics retrieved', stats);
  } catch (error) {
    console.error('Get task stats error:', error);
    sendResponse(res, 500, false, 'Error fetching statistics');
  }
};

export default {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getMyTasks,
  getTaskStats,
};
