import Lead from '../models/Lead.js';
import Client from '../models/Post.js'; // Client model
import Deal from '../models/Deal.js';
import User from '../models/User.js';
import { paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createLead = async (req, res) => {
  try {
    const { name, company, email, phone, source, industry, budget, notes, tags } = req.body;

    const lead = new Lead({
      name,
      company,
      email,
      phone,
      source: source || 'other',
      industry,
      budget: budget || 0,
      notes,
      tags: tags || [],
      owner: req.user._id,
      createdBy: req.user._id,
    });

    await lead.save();

    await logActivity(req.user._id, 'create_lead', 'lead', lead._id, { name, company, status: lead.status }, req);
    sendResponse(res, 201, true, 'Lead created successfully', lead);
  } catch (error) {
    console.error('Create lead error:', error);
    sendResponse(res, 500, false, 'Error creating lead');
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, email, phone, source, industry, budget, notes, tags, status } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) return sendResponse(res, 404, false, 'Lead not found');

    if (lead.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this lead');
    }

    if (name) lead.name = name;
    if (company !== undefined) lead.company = company;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (source) lead.source = source;
    if (industry !== undefined) lead.industry = industry;
    if (budget !== undefined) lead.budget = budget;
    if (notes !== undefined) lead.notes = notes;
    if (tags) lead.tags = tags;
    if (status) lead.status = status;

    await lead.save();

    await logActivity(req.user._id, 'edit_lead', 'lead', lead._id, { name: lead.name, status: lead.status }, req);
    sendResponse(res, 200, true, 'Lead updated successfully', lead);
  } catch (error) {
    console.error('Update lead error:', error);
    sendResponse(res, 500, false, 'Error updating lead');
  }
};

export const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, owner, category } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (owner) query.owner = owner;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (req.user.role !== 'admin') {
      query.owner = req.user._id;
    }

    const { skip, limit: pageLimit } = paginate(page, limit);

    const leads = await Lead.find(query)
      .populate('owner', 'username email firstName lastName')
      .sort({ createdAt: -1 })
      .limit(pageLimit)
      .skip(skip);

    const total = await Lead.countDocuments(query);

    sendResponse(res, 200, true, 'Leads retrieved successfully', {
      leads,
      pagination: {
        page: parseInt(page),
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    sendResponse(res, 500, false, 'Error fetching leads');
  }
};

export const getLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate('owner', 'username email firstName lastName');

    if (!lead) return sendResponse(res, 404, false, 'Lead not found');

    if (lead.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to view this lead');
    }

    sendResponse(res, 200, true, 'Lead retrieved successfully', lead);
  } catch (error) {
    console.error('Get lead error:', error);
    sendResponse(res, 500, false, 'Error fetching lead');
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) return sendResponse(res, 404, false, 'Lead not found');

    if (lead.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this lead');
    }

    await Lead.findByIdAndDelete(id);

    await logActivity(req.user._id, 'delete_lead', 'lead', id, { name: lead.name }, req);
    sendResponse(res, 200, true, 'Lead deleted successfully');
  } catch (error) {
    console.error('Delete lead error:', error);
    sendResponse(res, 500, false, 'Error deleting lead');
  }
};

export const addLeadScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { factor, points, note } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) return sendResponse(res, 404, false, 'Lead not found');

    lead.scoreFactors.push({
      factor,
      points: Number(points),
      note,
      addedBy: req.user._id,
      date: new Date()
    });

    lead.score += Number(points);
    await lead.save();

    await logActivity(req.user._id, 'add_lead_score', 'lead', lead._id, { factor, points, score: lead.score }, req);
    sendResponse(res, 200, true, 'Lead score added successfully', lead);
  } catch (error) {
    console.error('Add lead score error:', error);
    sendResponse(res, 500, false, 'Error adding lead score');
  }
};

export const convertLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) return sendResponse(res, 404, false, 'Lead not found');
    if (lead.status === 'converted') {
      return sendResponse(res, 400, false, 'Lead has already been converted');
    }

    // 1. Create client
    const client = new Client({
      companyName: lead.company || `${lead.name}'s Company`,
      contactName: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: 'active',
      source: lead.source,
      industry: lead.industry,
      notes: lead.notes,
      assignedTo: lead.owner,
    });
    await client.save();

    // 2. Create deal
    const deal = new Deal({
      title: `${lead.company || lead.name} - Deal`,
      client: client._id,
      amount: lead.budget || 0,
      probability: 20,
      stage: 'prospect',
      owner: lead.owner,
    });
    await deal.save();

    // 3. Mark lead as converted
    lead.status = 'converted';
    lead.convertedTo = client._id;
    lead.convertedAt = new Date();
    await lead.save();

    await logActivity(req.user._id, 'convert_lead', 'lead', lead._id, { clientName: client.contactName, dealTitle: deal.title }, req);
    sendResponse(res, 200, true, 'Lead converted successfully', { lead, client, deal });
  } catch (error) {
    console.error('Convert lead error:', error);
    sendResponse(res, 500, false, 'Error converting lead');
  }
};

export default {
  createLead,
  updateLead,
  getLeads,
  getLead,
  deleteLead,
  addLeadScore,
  convertLead,
};
