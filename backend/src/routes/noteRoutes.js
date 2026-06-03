import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
  togglePinNote,
} from '../controllers/noteController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createNote)
  .get(getNotes);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

router.put('/:id/pin', togglePinNote);

export default router;
