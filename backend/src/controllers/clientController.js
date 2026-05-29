import Client from '../models/Post.js'; // Using Post.js which now contains Client model
import User from '../models/User.js';
import { paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const createClient = async (req, res) => {
  try {
    const { companyName, contactName, email, phone, address, industry, status, source, website, notes } = req.body;

    // Check if client with same email exists
    let existingClient = await Client.findOne({ email });
    if (existingClient) {
      return sendResponse(res, 409, false, 'Client with this email already exists');
    }

    const client = new Client({
      companyName,
      contactName,
      email,
      phone,
      address,
      industry: industry || undefined,
      status: status || 'prospect',
      source: source || undefined,
      website: website || undefined,
      notes: notes || undefined,
      assignedTo: req.user._id,
    });

    await client.save();
    await client.populate('assignedTo', 'username email');

    // Log activity
    await logActivity(req.user._id, 'create_client', 'client', client._id, { companyName, status }, req);

    sendResponse(res, 201, true, 'Client created successfully', client);
  } catch (error) {
    console.error('Create client error:', error);
    sendResponse(res, 500, false, 'Error creating client');
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, contactName, email, phone, address, industry, status, source, website, notes, lastContact } = req.body;

    let client = await Client.findById(id);

    if (!client) {
      return sendResponse(res, 404, false, 'Client not found');
    }

    // Check authorization - allow admin or assigned user
    if (client.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to update this client');
    }

    // Update fields
    if (companyName) client.companyName = companyName;
    if (contactName) client.contactName = contactName;
    if (email) client.email = email;
    if (phone) client.phone = phone;
    if (address) client.address = address;
    if (industry) client.industry = industry;
    if (status) client.status = status;
    if (source) client.source = source;
    if (website) client.website = website;
    if (notes) client.notes = notes;
    if (lastContact) client.lastContact = lastContact;

    await client.save();
    await client.populate('assignedTo', 'username email');

    // Log activity
    await logActivity(req.user._id, 'edit_client', 'client', client._id, { companyName, status }, req);

    sendResponse(res, 200, true, 'Client updated successfully', client);
  } catch (error) {
    console.error('Update client error:', error);
    sendResponse(res, 500, false, 'Error updating client');
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return sendResponse(res, 404, false, 'Client not found');
    }

    // Check authorization
    if (client.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to delete this client');
    }

    await Client.findByIdAndDelete(id);

    // Log activity
    await logActivity(req.user._id, 'delete_client', 'client', id, { companyName: client.companyName }, req);

    sendResponse(res, 200, true, 'Client deleted successfully');
  } catch (error) {
    console.error('Delete client error:', error);
    sendResponse(res, 500, false, 'Error deleting client');
  }
};

export const getClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, assignedTo } = req.query;
    const query = {};

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Non-admin users can only see their own clients or all if they want to browse
    if (req.user.role !== 'admin') {
      query.assignedTo = req.user._id;
    }

    const { skip, limit: pageLimit } = paginate(page, limit);

    const clients = await Client.find(query)
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 })
      .limit(pageLimit)
      .skip(skip);

    const total = await Client.countDocuments(query);

    sendResponse(res, 200, true, 'Clients retrieved successfully', {
      clients,
      pagination: {
        page: parseInt(page),
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error('Get clients error:', error);
    sendResponse(res, 500, false, 'Error fetching clients');
  }
};

export const getClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id).populate('assignedTo', 'username email');

    if (!client) {
      return sendResponse(res, 404, false, 'Client not found');
    }

    // Check authorization
    if (client.assignedTo._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized to view this client');
    }

    sendResponse(res, 200, true, 'Client retrieved successfully', client);
  } catch (error) {
    console.error('Get client error:', error);
    sendResponse(res, 500, false, 'Error fetching client');
  }
};

export const getClientStats = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.user._id;
    const query = userId ? { assignedTo: userId } : {};

    const stats = {
      total: await Client.countDocuments(query),
      prospects: await Client.countDocuments({ ...query, status: 'prospect' }),
      active: await Client.countDocuments({ ...query, status: 'active' }),
      inactive: await Client.countDocuments({ ...query, status: 'inactive' }),
      lost: await Client.countDocuments({ ...query, status: 'lost' }),
    };

    sendResponse(res, 200, true, 'Client statistics retrieved', stats);
  } catch (error) {
    console.error('Get client stats error:', error);
    sendResponse(res, 500, false, 'Error fetching statistics');
  }
};

export default {
  createClient,
  updateClient,
  deleteClient,
  getClients,
  getClient,
  getClientStats,
};
