import Interaction from '../models/Interaction.js';
import { paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createInteraction = async (req, res) => {
  try {
    const { client, type, subject, description, date, outcome, nextFollowUp } = req.body;

    const interaction = new Interaction({
      client,
      type,
      subject,
      description,
      date,
      outcome,
      nextFollowUp,
      createdBy: req.user._id,
    });

    await interaction.save();
    await interaction.populate('client', 'companyName contactName');
    await interaction.populate('createdBy', 'username email');

    // Log activity
    await logActivity(req.user._id, 'create_interaction', 'interaction', interaction._id, { type, subject }, req);

    sendResponse(res, 201, true, 'Interaction created successfully', interaction);
  } catch (error) {
    console.error('Create interaction error:', error);
    sendResponse(res, 500, false, 'Error creating interaction');
  }
};

export const updateInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, subject, description, date, outcome, nextFollowUp } = req.body;

    let interaction = await Interaction.findById(id);

    if (!interaction) {
      return sendResponse(res, 404, false, 'Interaction not found');
    }

    // Check authorization
    if (interaction.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this interaction');
    }

    // Update fields
    if (type) interaction.type = type;
    if (subject) interaction.subject = subject;
    if (description) interaction.description = description;
    if (date) interaction.date = date;
    if (outcome) interaction.outcome = outcome;
    if (nextFollowUp) interaction.nextFollowUp = nextFollowUp;

    await interaction.save();
    await interaction.populate('client', 'companyName contactName');
    await interaction.populate('createdBy', 'username email');

    // Log activity
    await logActivity(req.user._id, 'edit_interaction', 'interaction', interaction._id, { type, subject }, req);

    sendResponse(res, 200, true, 'Interaction updated successfully', interaction);
  } catch (error) {
    console.error('Update interaction error:', error);
    sendResponse(res, 500, false, 'Error updating interaction');
  }
};

export const deleteInteraction = async (req, res) => {
  try {
    const { id } = req.params;

    const interaction = await Interaction.findById(id);

    if (!interaction) {
      return sendResponse(res, 404, false, 'Interaction not found');
    }

    // Check authorization
    if (interaction.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this interaction');
    }

    await Interaction.findByIdAndDelete(id);

    // Log activity
    await logActivity(req.user._id, 'delete_interaction', 'interaction', id, { type: interaction.type }, req);

    sendResponse(res, 200, true, 'Interaction deleted successfully');
  } catch (error) {
    console.error('Delete interaction error:', error);
    sendResponse(res, 500, false, 'Error deleting interaction');
  }
};

export const getInteractions = async (req, res) => {
  try {
    const { page = 1, limit = 10, client, type } = req.query;
    const query = {};

    if (client) query.client = client;
    if (type) query.type = type;

    // Non-admin users can only see interactions they created
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const { skip, limit: pageLimit } = paginate(page, limit);

    const interactions = await Interaction.find(query)
      .populate('client', 'companyName contactName')
      .populate('createdBy', 'username email')
      .sort({ date: -1 })
      .limit(pageLimit)
      .skip(skip);

    const total = await Interaction.countDocuments(query);

    sendResponse(res, 200, true, 'Interactions retrieved successfully', {
      interactions,
      pagination: {
        page: parseInt(page),
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error('Get interactions error:', error);
    sendResponse(res, 500, false, 'Error fetching interactions');
  }
};

export const getClientInteractions = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { skip, limit: pageLimit } = paginate(page, limit);

    const interactions = await Interaction.find({ client: clientId })
      .populate('client', 'companyName contactName')
      .populate('createdBy', 'username email')
      .sort({ date: -1 })
      .limit(pageLimit)
      .skip(skip);

    const total = await Interaction.countDocuments({ client: clientId });

    sendResponse(res, 200, true, 'Client interactions retrieved successfully', {
      interactions,
      pagination: {
        page: parseInt(page),
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error('Get client interactions error:', error);
    sendResponse(res, 500, false, 'Error fetching interactions');
  }
};

export default {
  createInteraction,
  updateInteraction,
  deleteInteraction,
  getInteractions,
  getClientInteractions,
};
