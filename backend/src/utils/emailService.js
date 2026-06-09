import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email notification.
 * @param {string} to   - Recipient email
 * @param {string} subject
 * @param {string} html - HTML body
 */
export const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] Skipped — EMAIL_USER / EMAIL_PASS not set in .env');
    return;
  }
  try {
    await transporter.sendMail({
      from: `"CMS Notifications" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${subject}`);
  } catch (err) {
    console.error('[Email] Failed to send:', err.message);
  }
};

// ── Email Templates ─────────────────────────────────────────────────

export const emailTemplates = {
  dealWon: (dealTitle, amount, clientName) => ({
    subject: `🎉 Deal Won: ${dealTitle}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#0071E3,#34aadc);border-radius:10px;padding:20px 24px;margin-bottom:24px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">🎉 Deal Won!</h1>
        </div>
        <p style="color:#1D1D1F;font-size:15px;margin-bottom:8px;">Congratulations! The deal <strong>${dealTitle}</strong> has been marked as <strong>Won</strong>.</p>
        <div style="background:#F5F5F7;border-radius:8px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 6px;color:#6E6E73;font-size:13px;">Client</p>
          <p style="margin:0;font-weight:700;font-size:16px;color:#1D1D1F;">${clientName}</p>
          <p style="margin:8px 0 6px;color:#6E6E73;font-size:13px;">Deal Value</p>
          <p style="margin:0;font-weight:800;font-size:22px;color:#34C759;">$${Number(amount).toLocaleString()}</p>
        </div>
        <p style="color:#6E6E73;font-size:13px;margin-top:24px;">This is an automated message from your CMS.</p>
      </div>`,
  }),

  taskOverdue: (taskTitle, dueDate, assignee) => ({
    subject: `⚠️ Overdue Task: ${taskTitle}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="background:#FF3B30;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">⚠️ Task Overdue</h1>
        </div>
        <p style="color:#1D1D1F;font-size:15px;">The task <strong>${taskTitle}</strong> assigned to <strong>${assignee}</strong> is overdue.</p>
        <div style="background:#fff1f0;border:1px solid rgba(255,59,48,0.2);border-radius:8px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 4px;color:#6E6E73;font-size:13px;">Due Date</p>
          <p style="margin:0;font-weight:700;font-size:16px;color:#FF3B30;">${new Date(dueDate).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        <p style="color:#6E6E73;font-size:13px;">Please update the task status or extend the deadline.</p>
      </div>`,
  }),

  newLead: (leadName, source, email) => ({
    subject: `🎯 New Lead: ${leadName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#AF52DE,#007AFF);border-radius:10px;padding:20px 24px;margin-bottom:24px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">🎯 New Lead Captured</h1>
        </div>
        <p style="color:#1D1D1F;font-size:15px;">A new lead has been added to your pipeline.</p>
        <div style="background:#F5F5F7;border-radius:8px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 4px;color:#6E6E73;font-size:13px;">Name</p>
          <p style="margin:0 0 12px;font-weight:700;color:#1D1D1F;">${leadName}</p>
          <p style="margin:0 0 4px;color:#6E6E73;font-size:13px;">Source</p>
          <p style="margin:0 0 12px;font-weight:600;color:#1D1D1F;">${source || 'Unknown'}</p>
          <p style="margin:0 0 4px;color:#6E6E73;font-size:13px;">Email</p>
          <p style="margin:0;font-weight:600;color:#0071E3;">${email || 'N/A'}</p>
        </div>
        <p style="color:#6E6E73;font-size:13px;">Log in to your CMS to review and assign this lead.</p>
      </div>`,
  }),

  verificationCode: (code) => ({
    subject: `🔑 Your CMS Verification Code`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#4F46E5,#6366F1);border-radius:10px;padding:20px 24px;margin-bottom:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">🔑 Email Verification</h1>
        </div>
        <p style="color:#1D1D1F;font-size:15px;line-height:1.6;margin-bottom:24px;">
          Thank you for registering! Please use the verification code below to complete your account setup. This code is valid for 24 hours.
        </p>
        <div style="background:#F5F5F7;border-radius:8px;padding:24px;margin:20px 0;text-align:center;">
          <p style="margin:0 0 8px;color:#6E6E73;font-size:13px;text-transform:uppercase;letter-spacing:0.04em;">Your Verification Code</p>
          <p style="margin:0;font-weight:900;font-size:32px;color:#4F46E5;letter-spacing:0.1em;">${code}</p>
        </div>
        <p style="color:#6E6E73;font-size:13px;margin-top:24px;line-height:1.5;">
          If you did not request this, please ignore this email.
        </p>
      </div>`,
  }),
};
