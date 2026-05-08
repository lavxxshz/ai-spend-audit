# SpendLens AI — AI Spend Audit Tool

> Find out if you're overpaying for AI tools in under 2 minutes.

## What It Does

SpendLens is a free web app that audits your AI tool spending across Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, OpenAI API, Anthropic API and Windsurf. It shows exactly where you're overspending, what to switch to, and how much you can save — instantly, with no login required.

Built as a lead generation tool for [Credex](https://credex.rocks) — which sells discounted AI infrastructure credits to startups.

## Live Demo

🚀 **[ai-spend-audit-teal.vercel.app](https://ai-spend-audit-teal.vercel.app)**

## Screenshots

![Landing Page](screenshots/landing.png)
![Audit Form](screenshots/audit.png)
![Results Page](screenshots/results.png)

## Quick Start

### Run Locally

```bash
# Clone the repo
git clone https://github.com/lavxxshz/ai-spend-audit.git
cd ai-spend-audit

# Frontend
cd frontend
npm install
npm start

# Backend (new terminal)
cd backend
npm install
node server.js
```

### Environment Variables

**Backend `.env`:**