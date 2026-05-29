import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createClient,
  updateClient,
  deleteClient,
  getClient,
  getClients,
  getClientStats,
} from '../controllers/clientController.js';

const router = express.Router();

// Protected routes - All authenticated users can access
router.get('/', protect, getClients);
router.get('/stats', protect, getClientStats);
router.post('/', protect, createClient);

// Individual client routes
router.get('/:id', protect, getClient);
router.put('/:id', protect, updateClient);
router.delete('/:id', protect, authorize('admin'), deleteClient);

export default router;
