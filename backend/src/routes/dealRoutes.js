import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createDeal,
  updateDeal,
  deleteDeal,
  getDeals,
  getDealStats,
} from '../controllers/dealController.js';

const router = express.Router();

// Protected routes
router.get('/', protect, getDeals);
router.get('/stats', protect, getDealStats);
router.post('/', protect, createDeal);

// Individual deal routes
router.put('/:id', protect, updateDeal);
router.delete('/:id', protect, deleteDeal);

export default router;
