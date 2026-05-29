import Deal from '../models/Deal.js';
import { paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createDeal = async (req, res) => {
  try {
    const { title, client, amount, probability, stage, expectedCloseDate, description, priority, products } = req.body;

    const deal = new Deal({
      title,
      client,
      amount,
      probability: probability || 0,
      stage: stage || 'prospect',
      owner: req.user._id,
      expectedCloseDate,
      description,
      priority: priority || 'medium',
      products: products || [],
    });

    await deal.save();
    await deal.populate('client', 'companyName contactName');
    await deal.populate('owner', 'username email');

    // Log activity
    await logActivity(req.user._id, 'create_deal', 'deal', deal._id, { title, amount }, req);

    sendResponse(res, 201, true, 'Deal created successfully', deal);
  } catch (error) {
    console.error('Create deal error:', error);
    sendResponse(res, 500, false, 'Error creating deal');
  }
};

export const updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, probability, stage, expectedCloseDate, actualCloseDate, description, priority, products } = req.body;

    let deal = await Deal.findById(id);

    if (!deal) {
      return sendResponse(res, 404, false, 'Deal not found');
    }

    // Check authorization
    if (deal.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this deal');
    }

    const wasWon = deal.stage !== 'won' && stage === 'won';
    const wasLost = deal.stage !== 'lost' && stage === 'lost';

    // Update fields
    if (title) deal.title = title;
    if (amount) deal.amount = amount;
    if (probability !== undefined) deal.probability = probability;
    if (stage) deal.stage = stage;
    if (expectedCloseDate) deal.expectedCloseDate = expectedCloseDate;
    if (actualCloseDate) deal.actualCloseDate = actualCloseDate;
    if (description) deal.description = description;
    if (priority) deal.priority = priority;
    if (products) deal.products = products;

    await deal.save();
    await deal.populate('client', 'companyName contactName');
    await deal.populate('owner', 'username email');

    // Log activity with appropriate action
    const action = wasWon ? 'win_deal' : wasLost ? 'lose_deal' : 'edit_deal';
    await logActivity(req.user._id, action, 'deal', deal._id, { title, stage }, req);

    sendResponse(res, 200, true, 'Deal updated successfully', deal);
  } catch (error) {
    console.error('Update deal error:', error);
    sendResponse(res, 500, false, 'Error updating deal');
  }
};

export const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findById(id);

    if (!deal) {
      return sendResponse(res, 404, false, 'Deal not found');
    }

    // Check authorization
    if (deal.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this deal');
    }

    await Deal.findByIdAndDelete(id);

    // Log activity
    await logActivity(req.user._id, 'delete_deal', 'deal', id, { title: deal.title }, req);

    sendResponse(res, 200, true, 'Deal deleted successfully');
  } catch (error) {
    console.error('Delete deal error:', error);
    sendResponse(res, 500, false, 'Error deleting deal');
  }
};

export const getDeals = async (req, res) => {
  try {
    const { page = 1, limit = 10, stage, client, owner, search } = req.query;
    const query = {};

    if (stage) query.stage = stage;
    if (client) query.client = client;
    if (owner) query.owner = owner;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Non-admin users can only see their own deals
    if (req.user.role !== 'admin') {
      query.owner = req.user._id;
    }

    const { skip, limit: pageLimit } = paginate(page, limit);

    const deals = await Deal.find(query)
      .populate('client', 'companyName')
      .populate('owner', 'username email')
      .sort({ expectedCloseDate: 1 })
      .limit(pageLimit)
      .skip(skip);

    const total = await Deal.countDocuments(query);

    sendResponse(res, 200, true, 'Deals retrieved successfully', {
      deals,
      pagination: {
        page: parseInt(page),
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error('Get deals error:', error);
    sendResponse(res, 500, false, 'Error fetching deals');
  }
};

export const getDealStats = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.user._id;
    const query = userId ? { owner: userId } : {};

    const deals = await Deal.find(query);
    const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);
    const winProbability = deals.length > 0 ? (deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length) : 0;

    const stats = {
      totalDeals: deals.length,
      totalAmount,
      avgAmount: deals.length > 0 ? (totalAmount / deals.length) : 0,
      avgProbability: Math.round(winProbability),
      byStage: {
        prospect: deals.filter(d => d.stage === 'prospect').length,
        negotiation: deals.filter(d => d.stage === 'negotiation').length,
        proposal: deals.filter(d => d.stage === 'proposal').length,
        won: deals.filter(d => d.stage === 'won').length,
        lost: deals.filter(d => d.stage === 'lost').length,
      },
    };

    sendResponse(res, 200, true, 'Deal statistics retrieved', stats);
  } catch (error) {
    console.error('Get deal stats error:', error);
    sendResponse(res, 500, false, 'Error fetching statistics');
  }
};

export default {
  createDeal,
  updateDeal,
  deleteDeal,
  getDeals,
  getDealStats,
};
