import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createLead,
  updateLead,
  getLeads,
  getLead,
  deleteLead,
  addLeadScore,
  convertLead,
} from '../controllers/leadController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createLead)
  .get(getLeads);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

router.post('/:id/score', addLeadScore);
router.post('/:id/convert', convertLead);

export default router;
