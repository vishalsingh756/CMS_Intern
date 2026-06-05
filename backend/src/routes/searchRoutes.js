import express from 'express';
import { protect } from '../middleware/auth.js';
import Client from '../models/Post.js';
import Deal from '../models/Deal.js';
import Task from '../models/Task.js';
import Interaction from '../models/Interaction.js';
import Lead from '../models/Lead.js';
import { sendResponse } from '../utils/helpers.js';

const router = express.Router();

// GET /api/search?q=keyword
router.get('/', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return sendResponse(res, 400, false, 'Query must be at least 2 characters');
    }

    const rx = { $regex: q.trim(), $options: 'i' };
    const isAdmin = req.user.role === 'admin';
    const userId  = req.user._id;

    const [clients, deals, tasks, interactions, leads] = await Promise.all([
      Client.find({ $or: [{ companyName: rx }, { contactName: rx }, { email: rx }] })
        .select('companyName contactName email industry').limit(5).lean(),

      Deal.find({
        $and: [
          { $or: [{ title: rx }, { description: rx }] },
          ...(isAdmin ? [] : [{ owner: userId }]),
        ],
      }).populate('client', 'companyName').select('title stage amount client').limit(5).lean(),

      Task.find({
        $and: [
          { $or: [{ title: rx }, { description: rx }] },
          ...(isAdmin ? [] : [{ assignedTo: userId }]),
        ],
      }).select('title status priority dueDate').limit(5).lean(),

      Interaction.find({
        $and: [
          { $or: [{ subject: rx }, { description: rx }] },
          ...(isAdmin ? [] : [{ createdBy: userId }]),
        ],
      }).populate('client', 'companyName').select('subject type date client').limit(5).lean(),

      Lead.find({
        $and: [
          { $or: [{ name: rx }, { email: rx }, { company: rx }] },
          ...(isAdmin ? [] : [{ assignedTo: userId }]),
        ],
      }).select('name email company status score').limit(5).lean(),
    ]);

    sendResponse(res, 200, true, 'Search results', {
      clients, deals, tasks, interactions, leads,
      total: clients.length + deals.length + tasks.length + interactions.length + leads.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    sendResponse(res, 500, false, 'Search failed');
  }
});

export default router;
