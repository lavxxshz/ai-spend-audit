# Dev Log — SpendLens AI (Credex Assignment)

## Day 1 — 2026-05-07

**Hours worked:** 5

**What I did:**
- Read and analyzed the full Credex assignment carefully
- Decided on tech stack: React.js frontend, Node.js + Express backend, MySQL database, Groq LLaMA AI API
- Set up GitHub repository and complete project folder structure
- Built the landing page with hero section, how it works, and stats
- Built the audit input form with all 8 required AI tools and their plans
- Created DEVLOG, README and initial project files

**What I learned:**
- Understood the audit engine logic — comparing AI tool plans vs actual usage patterns
- Learned about Open Graph meta tags for shareable URLs
- Studied pricing pages of all 8 required AI tools

**Blockers / what I'm stuck on:**
- Need to research and verify exact current pricing for all tools
- Planning the audit engine decision logic carefully

**Plan for tomorrow:**
- Complete audit engine with full pricing logic
- Build results page with savings breakdown
- Start backend with MySQL and Groq AI integration

---

## Day 2 — 2026-05-08

**Hours worked:** 6

**What I did:**
- Built complete audit engine (auditEngine.js) with pricing logic for all 8 tools
- Implemented plan recommendation logic — checks team size, use case fit, cheaper alternatives
- Built full Results page with hero savings, AI summary, tool breakdown, email capture
- Built backend with Node.js + Express + MySQL on Railway cloud
- Integrated Groq LLaMA AI for personalized audit summaries
- Built Share page for public shareable audit URLs
- Tested full end-to-end flow — form → audit → results → AI summary working

**What I learned:**
- How to structure audit engine logic that is defensible to a finance person
- Groq API integration for fast AI summaries
- Sequelize ORM with Railway cloud MySQL

**Blockers / what I'm stuck on:**
- Need to add rate limiting and abuse protection
- Share page needs Open Graph meta tags for proper social previews
- Need to write all required markdown documentation files

**Plan for tomorrow:**
- Add rate limiting to backend
- Deploy frontend to Vercel and backend to Railway
- Write ARCHITECTURE.md, PRICING_DATA.md, GTM.md, ECONOMICS.md
- Add GitHub Actions CI workflow
- Write 5 automated tests for audit engine

---

## Day 3 — 2026-05-09

**Hours worked:** 4

**What I did:**
- Added rate limiting to backend API using express-rate-limit
- Added redundancy detection — flags when users pay for overlapping tools
- Fixed share URL bug — backend port mismatch between Railway and server
- Fixed email save flow — resend null check added
- Tested full end to end flow on live deployed URL
- Both Cursor + Copilot and Claude + ChatGPT redundancy now detected

**What I learned:**
- Railway uses dynamic PORT — must use process.env.PORT not hardcoded value
- Resend requires verified domain for sending to arbitrary emails
- Rate limiting should be applied at API level not route level

**Blockers / what I'm stuck on:**
- Email sending requires verified domain on Resend — using dummy key for now
- Need to add more audit rules for edge cases

**Plan for tomorrow:**
- Add benchmark comparison feature
- Improve UI with better mobile responsiveness
- Add more test cases for redundancy detection
- Polish landing page copy

---

## Day 4 — 2026-05-10

**Hours worked:** 3

**What I did:**
- Added industry benchmark comparison to results page
- Shows spend per developer vs industry average of $45/month
- Fixed duplicate rateLimit declaration crash in server.js
- Improved mobile responsiveness on landing page
- Tested full flow end to end on live URL

**What I learned:**
- Duplicate variable declarations crash Node.js immediately on startup
- Mobile responsiveness needs flexWrap on flex containers
- Industry benchmarks make audit results more meaningful to users

**Blockers / what I'm stuck on:**
- Resend email requires verified domain — using fallback for now
- Need one more day of commits before submission

**Plan for tomorrow:**
- Final UI polish
- Add screenshots to README
- Final check all markdown files
- Submit to Credex Google Form

---

## Day 5 — 2026-05-11

**Hours worked:** 3

**What I did:**
- Added screenshots to README — landing page, audit form, results page, shareable link
- Final testing of all 6 MVP features on live deployed URL
- Verified GitHub Actions CI still green
- Verified shareable URL working end to end
- Checked all required markdown files are complete
- Prepared Google Form submission

**What I learned:**
- Building a complete full stack AI product in 5 days is possible with clear priorities
- Client-side audit engine was the best architectural decision — zero latency
- User interviews revealed real insights — redundancy between Cursor and Copilot was most common overspend pattern

**Blockers / what I'm stuck on:**
- Resend email requires verified domain — documented this limitation
- Railway hobby plan has occasional queuing delays

**Plan for tomorrow:**
- Await Credex Round 2 invitation