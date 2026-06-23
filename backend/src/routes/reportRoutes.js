import express from 'express';
import { getReportData } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// GET /api/reports/:type?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/:type', getReportData);

export default router;
