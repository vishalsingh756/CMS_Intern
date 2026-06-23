import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';

// Helper to decode base64 JWT payload (Google token)
const decodeGoogleToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return sendResponse(res, 409, false, 'User already exists with this email or username');
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Set role to admin for the specific email address
    const role = email === (process.env.ADMIN_EMAIL || 'admin@example.com') ? 'admin' : 'author';

    // Create new user
    user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      emailVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    await user.save();

    console.log(`[AUTH DEBUG] Verification code for ${email} is: ${verificationCode}`);

    // Send verification email
    const template = emailTemplates.verificationCode(verificationCode);
    await sendEmail(email, template.subject, template.html);

    // Log activity
    await logActivity(user._id, 'create_user', 'user', user._id, { type: 'registration_pending_verification' }, req);

    sendResponse(res, 201, true, 'Verification code sent to your email. Please verify your account.', {
      email: user.email,
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

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate code if not exists or expired
      if (!user.verificationCode || user.verificationCodeExpires < new Date()) {
        user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();
      }

      console.log(`[AUTH DEBUG] Verification code for ${user.email} is: ${user.verificationCode}`);

      // Send/resend verification email
      const template = emailTemplates.verificationCode(user.verificationCode);
      await sendEmail(user.email, template.subject, template.html);

      return res.status(403).json({
        success: false,
        isUnverified: true,
        email: user.email,
        message: 'Please verify your email first. A new code has been sent.',
      });
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

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return sendResponse(res, 400, false, 'Email and code are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    if (user.emailVerified) {
      return sendResponse(res, 400, false, 'Email is already verified');
    }

    if (user.verificationCode !== code) {
      return sendResponse(res, 400, false, 'Invalid verification code');
    }

    if (user.verificationCodeExpires < new Date()) {
      return sendResponse(res, 400, false, 'Verification code has expired');
    }

    // Mark as verified
    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    user.lastLogin = new Date();
    await user.save();

    // Log activity
    await logActivity(user._id, 'verify_email', 'user', user._id, {}, req);

    // Generate token
    const token = generateToken(user._id, user.role);

    sendResponse(res, 200, true, 'Email verified successfully', {
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
    console.error('Verify email error:', error);
    sendResponse(res, 500, false, 'Error during verification');
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(res, 400, false, 'Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    if (user.emailVerified) {
      return sendResponse(res, 400, false, 'Email is already verified');
    }

    // Generate new code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    console.log(`[AUTH DEBUG] Resent verification code for ${email} is: ${verificationCode}`);

    // Send code
    const template = emailTemplates.verificationCode(verificationCode);
    await sendEmail(email, template.subject, template.html);

    sendResponse(res, 200, true, 'Verification code resent successfully');
  } catch (error) {
    console.error('Resend verification error:', error);
    sendResponse(res, 500, false, 'Error resending verification code');
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return sendResponse(res, 400, false, 'Google token is required');
    }

    const payload = decodeGoogleToken(token);
    if (!payload || !payload.email) {
      return sendResponse(res, 400, false, 'Invalid Google token');
    }

    const { email, given_name, family_name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a unique username
      let username = (given_name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900);
      let usernameExists = await User.findOne({ username });
      while (usernameExists) {
        username = (given_name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900);
        usernameExists = await User.findOne({ username });
      }

      // Generate a secure random password since schema requires one
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);

      // Set role to admin for the specific email address
      const role = email === (process.env.ADMIN_EMAIL || 'admin@example.com') ? 'admin' : 'author';

      user = new User({
        username,
        email,
        password: randomPassword,
        firstName: given_name || '',
        lastName: family_name || '',
        avatar: picture || null,
        role,
        emailVerified: true, // Google accounts are pre-verified
      });

      await user.save();
      await logActivity(user._id, 'create_user', 'user', user._id, { type: 'google_registration' }, req);
    } else {
      user.lastLogin = new Date();
      if (!user.emailVerified) {
        user.emailVerified = true;
      }
      await user.save();
      await logActivity(user._id, 'login', 'user', user._id, { type: 'google_login' }, req);
    }

    if (!user.isActive) {
      return sendResponse(res, 403, false, 'Account is inactive');
    }

    const appToken = generateToken(user._id, user.role);

    sendResponse(res, 200, true, 'Google authentication successful', {
      token: appToken,
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
    console.error('Google login error:', error);
    sendResponse(res, 500, false, 'Error authenticating with Google');
  }
};
