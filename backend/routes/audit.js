const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Groq = require('groq-sdk');
const resend = process.env.RESEND_API_KEY ? new (require('resend').Resend)(process.env.RESEND_API_KEY) : null;
const Audit = require('../models/Audit');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy' });

// Generate AI Summary
router.post('/summary', async (req, res) => {
  try {
    const { audit } = req.body;

    const prompt = `You are an AI spend optimization expert. Write a 100-word personalized summary for a startup team based on this audit data:
- Team size: ${audit.teamSize}
- Use case: ${audit.useCase}
- Total monthly spend: $${audit.totalCurrentSpend}
- Potential monthly savings: $${audit.totalMonthlySavings.toFixed(0)}
- Tools analyzed: ${audit.results.map(r => r.toolName).join(', ')}
- Main issues: ${audit.results.filter(r => r.status !== 'optimal').map(r => r.action).join(', ')}

Write directly to the user. Be specific, honest and helpful. Mention actual numbers. Keep it under 100 words.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (err) {
    console.error('AI summary error:', err);
    // Graceful fallback
    res.json({
      summary: `Based on your audit, your team of ${req.body.audit?.teamSize || 'your'} is spending on AI tools. We found optimization opportunities worth reviewing. Consider right-sizing plans to your actual team size and use case to reduce unnecessary spend.`
    });
  }
});

// Save Audit + Email
router.post('/save', async (req, res) => {
  try {
    const { email, company, role, audit, totalMonthlySavings, totalAnnualSavings, _honeypot } = req.body;

    // Honeypot check — bots fill this field, humans don't see it
    if (_honeypot) {
      return res.status(200).json({ auditId: 'blocked', msg: 'OK' });
    }

    // Basic email validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ msg: 'Valid email required' });
    }

    const auditId = uuidv4().substring(0, 8);

    await Audit.create({
      id: auditId,
      email,
      company: company || '',
      role: role || '',
      auditData: JSON.stringify(audit),
      totalMonthlySavings,
      totalAnnualSavings,
    });

    // Send confirmation email (non-blocking — don't fail save if email fails)
    sendConfirmationEmail(email, company, totalMonthlySavings, totalAnnualSavings, auditId)
      .catch(err => console.error('Email send failed (non-fatal):', err));

    res.json({ auditId, msg: 'Audit saved successfully' });
  } catch (err) {
    console.error('Save audit error:', err);
    res.status(500).json({ msg: 'Error saving audit' });
  }
});

async function sendConfirmationEmail(email, company, monthlySavings, annualSavings, auditId) {
  if (!resend) {
    console.log('Email skipped — no RESEND_API_KEY configured');
    return;
  }
  const isHighSavings = monthlySavings > 500;
  const shareUrl = `${process.env.FRONTEND_URL}/share/${auditId}`;

  await resend.emails.send({
    from: 'SpendLens <audit@yourdomain.com>', // update with your verified domain
    to: email,
    subject: `Your AI Spend Audit — $${Math.round(monthlySavings)}/mo savings found`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="margin-top: 0;">Your AI Spend Audit is ready</h2>
        <p>Hi${company ? ` from ${company}` : ''},</p>
        <p>We analyzed your AI tool stack and found potential savings of:</p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <div style="font-size: 32px; font-weight: bold; color: #1D9E75;">$${Math.round(monthlySavings)}/mo</div>
          <div style="color: #666; margin-top: 4px;">$${Math.round(annualSavings)} annually</div>
        </div>
        <p>View and share your full report: <a href="${shareUrl}">${shareUrl}</a></p>
        ${isHighSavings ? `
        <div style="background: #fff3cd; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <strong>You qualify for a Credex consultation.</strong><br/>
          With $${Math.round(monthlySavings)}/mo in potential savings, our team can help you capture these savings through discounted AI credits.
          <br/><a href="https://credex.rocks" style="color: #1D9E75;">Book a free consultation →</a>
        </div>` : ''}
        <p style="color: #999; font-size: 12px;">SpendLens by Credex · <a href="https://credex.rocks">credex.rocks</a></p>
      </div>
    `,
  });
}

// Get Shared Audit
router.get('/share/:id', async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id);
    if (!audit) return res.status(404).json({ msg: 'Audit not found' });

    const publicData = {
      auditData: JSON.parse(audit.auditData),
      totalMonthlySavings: audit.totalMonthlySavings,
      totalAnnualSavings: audit.totalAnnualSavings,
      createdAt: audit.createdAt,
    };

    res.json(publicData);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching audit' });
  }
});

module.exports = router;