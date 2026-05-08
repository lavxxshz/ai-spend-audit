# Tests

## Automated Tests

All tests cover the audit engine in `frontend/src/utils/auditEngine.test.js`

### How to Run
```bash
cd frontend
npm test
```

### Test List

| Test | File | What It Covers |
|---|---|---|
| Cursor Enterprise downsell for small teams | auditEngine.test.js | Team of 3 on Cursor Enterprise should recommend Business |
| Copilot Business to Individual for solo user | auditEngine.test.js | 1 seat on Copilot Business should recommend Individual |
| Claude Max downsell | auditEngine.test.js | Single user on Claude Max should recommend Pro |
| Wrong tool detection — Cursor for writing | auditEngine.test.js | Cursor Pro for writing use case should flag as wrong tool |
| API spend Credex opportunity | auditEngine.test.js | Anthropic API spend over $500 should surface Credex |
| Total savings calculation | auditEngine.test.js | Sum of all tool savings matches totalMonthlySavings |
| Zero savings for optimal spend | auditEngine.test.js | Correctly optimized setup returns 0 savings |