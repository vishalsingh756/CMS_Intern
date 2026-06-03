import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getActivityLogs } from '../utils/activityLogger.js';
import { sendResponse } from '../utils/helpers.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, action, entityType, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Non-admins see team activity (all logs) but cannot filter by userId;
    // Admins can filter by any userId.
    const resolvedUserId = req.user.role === 'admin' ? userId : undefined;

    const result = await getActivityLogs(
      { userId: resolvedUserId, action, entityType },
      parseInt(limit),
      skip
    );

    sendResponse(res, 200, true, 'Activity logs retrieved', {
      logs: result.logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    sendResponse(res, 500, false, 'Error fetching activity logs');
  }
});

export default router;
