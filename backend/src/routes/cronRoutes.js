import express from 'express';
import Interaction from '../models/Interaction.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import { sendResponse } from '../utils/helpers.js';

const router = express.Router();

router.get('/reminders', async (req, res) => {
  try {
    // 1. Verify authorization header from Vercel Crons
    const authHeader = req.headers.authorization;
    if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return sendResponse(res, 401, false, 'Unauthorized');
    }

    // 2. Query for interactions with nextFollowUp scheduled for today (00:00:00 to 23:59:59)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const interactions = await Interaction.find({
      nextFollowUp: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    })
    .populate('client')
    .populate('createdBy');

    console.log(`[Cron] Found ${interactions.length} follow-up reminders scheduled for today.`);

    let sentCount = 0;
    for (const item of interactions) {
      if (item.createdBy && item.createdBy.email) {
        const clientName = item.client ? item.client.companyName : 'Unknown Client';
        const template = emailTemplates.followUpReminder(
          clientName,
          item.subject,
          item.type,
          item.description
        );

        await sendEmail(item.createdBy.email, template.subject, template.html);
        sentCount++;
      }
    }

    return sendResponse(res, 200, true, `Processed follow-up reminders successfully. Sent: ${sentCount}`);
  } catch (error) {
    console.error('[Cron] Error processing follow-up reminders:', error);
    return sendResponse(res, 500, false, 'Error processing follow-up reminders');
  }
});

export default router;
