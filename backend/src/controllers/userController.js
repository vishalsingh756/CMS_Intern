import User from '../models/User.js';
import { paginate, sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search, role } = req.query;
    const { skip, limit: paginationLimit } = paginate(page, limit);

    // Only admin can view all users
    if (req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized');
    }

    const query = {};

    if (role) query.role = role;

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(paginationLimit);

    const total = await User.countDocuments(query);

    sendResponse(res, 200, true, 'Users retrieved successfully', users, {
      page: Math.floor(skip / paginationLimit) + 1,
      limit: paginationLimit,
      total,
      pages: Math.ceil(total / paginationLimit),
    });
  } catch (error) {
    console.error('Get users error:', error);
    sendResponse(res, 500, false, 'Error fetching users');
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User retrieved successfully', user);
  } catch (error) {
    console.error('Get user error:', error);
    sendResponse(res, 500, false, 'Error fetching user');
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, isActive } = req.body;

    if (req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized');
    }

    const user = await User.findById(id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    // Log activity
    await logActivity(req.user._id, 'edit_user', 'user', user._id, { role: user.role }, req);

    sendResponse(res, 200, true, 'User updated successfully', user);
  } catch (error) {
    console.error('Update user error:', error);
    sendResponse(res, 500, false, 'Error updating user');
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return sendResponse(res, 403, false, 'Not authorized');
    }

    if (id === req.user._id.toString()) {
      return sendResponse(res, 400, false, 'Cannot delete your own account');
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Log activity
    await logActivity(req.user._id, 'delete_user', 'user', id, { username: user.username }, req);

    sendResponse(res, 200, true, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    sendResponse(res, 500, false, 'Error deleting user');
  }
};
