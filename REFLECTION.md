# Reflection

## 1. Hardest Bug This Week

The hardest bug was the `.env` file not loading in the backend. The server was starting but all environment variables were empty — Sequelize was connecting to `''@localhost` instead of Railway.

**Hypotheses I formed:**
- Wrong file path for dotenv
- dotenv not installed
- Environment variable names mismatch

**What I tried:**
- Added `console.log(process.env)` to check what was loading — showed empty values
- Checked that dotenv was in package.json — it was there
- Realized the issue: dotenvx was intercepting the .env load before dotenv could read it

**What worked:**
Moving the `require('dotenv').config()` call to the very first line of server.js, before any other imports. The order of requires matters — dotenv must run before any module that needs env variables.

---

## 2. A Decision I Reversed Mid-Week

Initially I planned to run the entire audit engine on the backend — user submits form, backend calculates everything, returns results.

I reversed this decision on Day 2 after realizing:
- It adds unnecessary API latency for a purely mathematical calculation
- If the backend is down, the whole app breaks
- The audit logic has no sensitive data that needs server protection

Running the audit engine client-side in `auditEngine.js` means results are instant, work offline, and the backend is only needed for AI summary and saving the audit. This is a better architecture for this use case.

---

## 3. What I Would Build in Week 2

- **Redundancy detection** — flag when users are paying for two tools that heavily overlap (e.g. Cursor + Copilot, Claude + ChatGPT)
- **Benchmark mode** — "your AI spend per developer is $X, companies your size average $Y"
- **PDF export** — downloadable audit report for sharing with CFO
- **Embeddable widget** — script tag a blogger could drop in
- **Email drip sequence** — follow up with high-savings users after 7 days
- **Real pricing API** — scrape/sync official pricing pages weekly instead of hardcoding

---

## 4. How I Used AI Tools

**Tools used:** Claude (main), ChatGPT (second opinion), Groq (production AI summary)

**What I used Claude for:**
- Generating boilerplate React components
- Debugging Sequelize connection errors
- Drafting the audit engine logic structure
- Writing markdown documentation

**What I didn't trust AI with:**
- The audit engine decision logic — I wrote and reviewed every rule manually. A finance person needs to agree with the reasoning, and AI-generated rules often sound plausible but are wrong on edge cases.
- Pricing data — I verified every number against official pricing pages manually. AI confidently gave me wrong prices for Cursor Enterprise.

**One time AI was wrong:**
Claude told me Cursor Business was $50/user/month. The actual price is $40/user/month. I caught it by checking cursor.com/pricing directly. This would have made every Cursor Business recommendation wrong. Always verify pricing data from the official source.

---

## 5. Self-Rating

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | 7/10 | Committed daily but could have started earlier in the day |
| Code Quality | 7/10 | Clean components and separation of concerns, but needs more error handling |
| Design Sense | 7/10 | Clean and professional UI but not exceptional |
| Problem Solving | 8/10 | Made good architectural decisions, especially client-side audit engine |
| Entrepreneurial Thinking | 8/10 | User interviews shaped real product decisions, not just checkbox |