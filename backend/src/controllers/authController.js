import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return sendResponse(res, 409, false, 'User already exists with this email or username');
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: 'author', // Default role
    });

    await user.save();

    // Log activity
    await logActivity(user._id, 'create_user', 'user', user._id, { type: 'registration' }, req);

    // Generate token
    const token = generateToken(user._id, user.role);

    sendResponse(res, 201, true, 'User registered successfully', {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    sendResponse(res, 500, false, 'Error during registration');
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return sendResponse(res, 400, false, 'Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    if (!user.isActive) {
      return sendResponse(res, 403, false, 'Account is inactive');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log activity
    await logActivity(user._id, 'login', 'user', user._id, {}, req);

    // Generate token
    const token = generateToken(user._id, user.role);

    sendResponse(res, 200, true, 'Login successful', {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, 'Error during login');
  }
};

export const logout = async (req, res) => {
  try {
    // Log activity
    await logActivity(req.user._id, 'logout', 'user', req.user._id, {}, req);

    sendResponse(res, 200, true, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse(res, 500, false, 'Error during logout');
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User retrieved successfully', {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    sendResponse(res, 500, false, 'Error fetching user');
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, bio },
      { new: true, runValidators: true }
    );

    // Log activity
    await logActivity(req.user._id, 'edit_user', 'user', user._id, { fields: ['firstName', 'lastName', 'bio'] }, req);

    sendResponse(res, 200, true, 'Profile updated successfully', {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    sendResponse(res, 500, false, 'Error updating profile');
  }
};
