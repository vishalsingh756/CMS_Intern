import express from 'express';
import multer from 'multer';
import path from 'path';
import { exportData, importData } from '../controllers/importExportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

router.use(protect);

router.post('/export', exportData);
router.post('/import', upload.single('file'), importData);

export default router;
