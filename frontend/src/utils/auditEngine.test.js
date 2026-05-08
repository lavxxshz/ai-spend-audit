import { runAudit } from './auditEngine';

// Helper to create test form data
const makeAudit = (tools, teamSize = 5, useCase = 'coding') => runAudit({
  tools,
  teamSize,
  useCase,
});

// Test 1 — Cursor Enterprise downsell for small teams
test('Cursor Enterprise should recommend downgrade for team of 3', () => {
  const result = makeAudit([{
    toolId: 'cursor',
    planId: 'enterprise',
    seats: 3,
    monthlySpend: 300,
  }]);
  const tool = result.results[0];
  expect(tool.status).toBe('overspending');
  expect(tool.monthlySavings).toBeGreaterThan(0);
});

// Test 2 — Copilot Business to Individual for solo user
test('GitHub Copilot Business for 1 seat should recommend Individual', () => {
  const result = makeAudit([{
    toolId: 'github_copilot',
    planId: 'business',
    seats: 1,
    monthlySpend: 19,
  }]);
  const tool = result.results[0];
  expect(tool.status).toBe('overspending');
  expect(tool.monthlySavings).toBe(9);
});

// Test 3 — Claude Max downsell for single user
test('Claude Max for single user should recommend Pro', () => {
  const result = makeAudit([{
    toolId: 'claude',
    planId: 'max',
    seats: 1,
    monthlySpend: 100,
  }]);
  const tool = result.results[0];
  expect(tool.status).toBe('overspending');
  expect(tool.monthlySavings).toBe(80);
});

// Test 4 — Wrong tool detection
test('Cursor Pro for writing use case should be flagged as wrong tool', () => {
  const result = makeAudit([{
    toolId: 'cursor',
    planId: 'pro',
    seats: 1,
    monthlySpend: 20,
  }], 1, 'writing');
  const tool = result.results[0];
  expect(tool.status).toBe('wrong_tool');
});

// Test 5 — Credex opportunity for high API spend
test('Anthropic API spend over $500 should surface Credex opportunity', () => {
  const result = makeAudit([{
    toolId: 'anthropic_api',
    planId: 'pay_as_you_go',
    seats: 1,
    monthlySpend: 600,
  }]);
  const tool = result.results[0];
  expect(tool.status).toBe('credex_opportunity');
  expect(tool.monthlySavings).toBeGreaterThan(0);
});

// Test 6 — Total savings calculation
test('Total monthly savings should equal sum of all tool savings', () => {
  const result = makeAudit([
    { toolId: 'cursor', planId: 'enterprise', seats: 3, monthlySpend: 300 },
    { toolId: 'github_copilot', planId: 'business', seats: 1, monthlySpend: 19 },
  ]);
  const expectedTotal = result.results.reduce((sum, r) => sum + r.monthlySavings, 0);
  expect(result.totalMonthlySavings).toBe(expectedTotal);
});

// Test 7 — Zero savings for optimal spend
test('Optimal plan should return zero savings', () => {
  const result = makeAudit([{
    toolId: 'cursor',
    planId: 'pro',
    seats: 5,
    monthlySpend: 100,
  }], 5, 'coding');
  const tool = result.results[0];
  expect(tool.status).toBe('optimal');
  expect(tool.monthlySavings).toBe(0);
});