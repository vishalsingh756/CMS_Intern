import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validateComment, handleValidationErrors } from '../validators/index.js';
import {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
  approveComment,
  rejectComment,
} from '../controllers/commentController.js';

const router = express.Router();

// Public routes
router.get('/post/:postId', getPostComments);

// Protected routes
router.post('/', protect, validateComment, handleValidationErrors, createComment);
router.put('/:id', protect, validateComment, handleValidationErrors, updateComment);
router.delete('/:id', protect, deleteComment);

// Admin routes
router.put('/:id/approve', protect, authorize('admin', 'editor'), approveComment);
router.put('/:id/reject', protect, authorize('admin', 'editor'), rejectComment);

export default router;
