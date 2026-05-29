import express from 'express';
import {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  runReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All report routes require authentication

router.route('/')
  .post(createReport)
  .get(getReports);

router.post('/run', runReport); // Ad-hoc run
router.get('/:id/run', runReport); // Run saved report

router.route('/:id')
  .get(getReport)
  .put(updateReport)
  .delete(deleteReport);

export default router;
