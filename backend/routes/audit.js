const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Groq = require('groq-sdk');
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
    console.error(err);
    res.status(500).json({ msg: 'AI summary failed' });
  }
});

// Save Audit + Email
router.post('/save', async (req, res) => {
  try {
    const { email, company, role, audit, totalMonthlySavings, totalAnnualSavings } = req.body;
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

    res.json({ auditId, msg: 'Audit saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error saving audit' });
  }
});

// Get Shared Audit
router.get('/share/:id', async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id);
    if (!audit) return res.status(404).json({ msg: 'Audit not found' });

    // Strip private info
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