import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { loginLimiter, createAccountLimiter } from '../middleware/rateLimiter.js';
import { validateRegister, validateLogin, handleValidationErrors } from '../validators/index.js';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  verifyEmail,
  resendVerification,
  googleLogin,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', createAccountLimiter, validateRegister, handleValidationErrors, register);
router.post('/login', loginLimiter, validateLogin, handleValidationErrors, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/google', googleLogin);
router.get('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

export default router;
