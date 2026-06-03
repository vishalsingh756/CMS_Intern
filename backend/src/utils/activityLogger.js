import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (userId, action, entityType = null, entityId = null, metadata = {}, req = null) => {
  try {
    const logData = {
      user: userId,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress: req?.ip || '127.0.0.1',
      userAgent: req?.get('user-agent') || '',
    };

    await ActivityLog.create(logData);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const getActivityLogs = async (filters = {}, limit = 50, skip = 0) => {
  const query = {};

  if (filters.userId) query.user = filters.userId;
  if (filters.action) query.action = filters.action;
  if (filters.entityType) query.entityType = filters.entityType;

  const logs = await ActivityLog.find(query)
    .populate('user', 'username email firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await ActivityLog.countDocuments(query);

  return {
    logs,
    total,
    pages: Math.ceil(total / limit),
  };
};
