import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validateTag, handleValidationErrors } from '../validators/index.js';
import {
  createTag,
  updateTag,
  deleteTag,
  getTags,
  getTag,
} from '../controllers/tagController.js';

const router = express.Router();

// Public routes
router.get('/', getTags);
router.get('/:id', getTag);

// Protected routes - Editor or Admin
router.post('/', protect, authorize('editor', 'admin'), validateTag, handleValidationErrors, createTag);
router.put('/:id', protect, authorize('editor', 'admin'), validateTag, handleValidationErrors, updateTag);
router.delete('/:id', protect, authorize('editor', 'admin'), deleteTag);

export default router;
