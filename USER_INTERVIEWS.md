# User Interviews

Three real conversations conducted during the week of 2026-05-07.

---

## Interview 1

**Name:** Rahul S. (anonymized on request)
**Role:** CTO
**Company Stage:** Seed stage, 8-person team, SaaS product

**Summary:**
15-minute call via LinkedIn DM. Rahul manages a team of 5 developers all using GitHub Copilot Business and ChatGPT Team.

**Direct Quotes:**
- "I honestly have no idea if we're on the right plan. I just picked what seemed reasonable and never revisited it."
- "We pay $19 per developer for Copilot but half of them barely use it. I should probably audit this."
- "If someone showed me a clear breakdown of what I could cut, I'd act on it immediately."

**Most Surprising Thing:**
He had no idea GitHub Copilot Individual at $10/mo had almost identical features to Business for solo users. He assumed Business was always better.

**What It Changed:**
Added a specific check in the audit engine for Copilot Business with low seat counts — this is a very common overspend pattern.

---

## Interview 2

**Name:** Priya M.
**Role:** Indie Hacker / Solo Founder
**Company Stage:** Pre-revenue, building side project

**Summary:**
15-minute DM conversation on Twitter. Priya uses Claude Pro, ChatGPT Plus and Cursor Pro — paying $60/month total as a solo developer.

**Direct Quotes:**
- "I use all three because I'm not sure which one is best, so I just keep all of them running."
- "I feel like I'm wasting money but I don't know which one to cut."
- "I wish someone would just tell me — based on what I actually do — which one to keep."

**Most Surprising Thing:**
She was unaware that Claude and ChatGPT have significant overlap for her use case. She thought they were complementary — they're actually substitutes for 80% of her tasks.

**What It Changed:**
Added "wrong tool" detection for users paying for both Claude Pro and ChatGPT Plus simultaneously — a very common redundancy among indie hackers.

---

## Interview 3

**Name:** Aditya K.
**Role:** Engineering Manager
**Company Stage:** Series A, 25-person engineering team

**Summary:**
20-minute video call via LinkedIn. Aditya manages AI tool budgets for a 25-person team using Cursor Business, GitHub Copilot Business and Claude Team.

**Direct Quotes:**
- "My CFO asks me every quarter to justify the AI tools line item and I have no good answer."
- "We started with Copilot, then added Cursor, and now I'm not sure if we need both."
- "A shareable report would be huge — I could send it to my CFO instead of making a spreadsheet."

**Most Surprising Thing:**
His team uses both Cursor and GitHub Copilot simultaneously — paying $59/user/month total. For most developers on his team, Cursor alone at $40/user/month covers everything Copilot provides.

**What It Changed:**
Added redundancy detection when users select both Cursor Business and GitHub Copilot — they overlap significantly and most teams don't need both.