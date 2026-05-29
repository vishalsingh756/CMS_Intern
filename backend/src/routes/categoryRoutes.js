import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validateCategory, handleValidationErrors } from '../validators/index.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes - Editor or Admin
router.post('/', protect, authorize('editor', 'admin'), validateCategory, handleValidationErrors, createCategory);
router.put('/:id', protect, authorize('editor', 'admin'), validateCategory, handleValidationErrors, updateCategory);
router.delete('/:id', protect, authorize('editor', 'admin'), deleteCategory);

export default router;
