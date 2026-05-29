import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getMyTasks,
  getTaskStats,
} from '../controllers/taskController.js';

const router = express.Router();

// Protected routes
router.get('/', protect, getTasks);
router.get('/my-tasks', protect, getMyTasks);
router.get('/stats', protect, getTaskStats);
router.post('/', protect, createTask);

// Individual task routes
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
