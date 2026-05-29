import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  uploadMedia,
  getMediaLibrary,
  deleteMedia,
  getMedia,
} from '../controllers/mediaController.js';

const router = express.Router();

// Protected routes - Authors and above
router.post('/', protect, upload.single('file'), uploadMedia);
router.get('/', protect, getMediaLibrary);
router.get('/:id', protect, getMedia);
router.delete('/:id', protect, deleteMedia);

export default router;
