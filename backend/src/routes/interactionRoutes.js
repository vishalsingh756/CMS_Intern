import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createInteraction,
  updateInteraction,
  deleteInteraction,
  getInteractions,
  getClientInteractions,
} from '../controllers/interactionController.js';

const router = express.Router();

// Protected routes
router.get('/', protect, getInteractions);
router.post('/', protect, createInteraction);

// Client interactions
router.get('/client/:clientId', protect, getClientInteractions);

// Individual interaction routes
router.put('/:id', protect, updateInteraction);
router.delete('/:id', protect, deleteInteraction);

export default router;
