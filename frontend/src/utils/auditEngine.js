const PRICING = {
  cursor: {
    hobby: { price: 0, name: 'Hobby' },
    pro: { price: 20, name: 'Pro' },
    business: { price: 40, name: 'Business' },
    enterprise: { price: 100, name: 'Enterprise' },
  },
  github_copilot: {
    individual: { price: 10, name: 'Individual' },
    business: { price: 19, name: 'Business' },
    enterprise: { price: 39, name: 'Enterprise' },
  },
  claude: {
    free: { price: 0, name: 'Free' },
    pro: { price: 20, name: 'Pro' },
    max: { price: 100, name: 'Max' },
    team: { price: 30, name: 'Team' },
    enterprise: { price: 60, name: 'Enterprise' },
  },
  chatgpt: {
    free: { price: 0, name: 'Free' },
    plus: { price: 20, name: 'Plus' },
    team: { price: 30, name: 'Team' },
    enterprise: { price: 60, name: 'Enterprise' },
  },
  anthropic_api: {
    pay_as_you_go: { price: 0, name: 'Pay as you go' },
  },
  openai_api: {
    pay_as_you_go: { price: 0, name: 'Pay as you go' },
  },
  gemini: {
    free: { price: 0, name: 'Free' },
    pro: { price: 20, name: 'Pro' },
    ultra: { price: 30, name: 'Ultra' },
  },
  windsurf: {
    free: { price: 0, name: 'Free' },
    pro: { price: 15, name: 'Pro' },
    teams: { price: 35, name: 'Teams' },
  },
};

const TOOL_NAMES = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API',
  openai_api: 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
};

const auditTool = (tool, teamSize, useCase) => {
  const { toolId, planId, seats, monthlySpend } = tool;
  const currentSpend = parseFloat(monthlySpend) || 0;
  const planPrice = PRICING[toolId]?.[planId]?.price || 0;
  const planName = PRICING[toolId]?.[planId]?.name || planId;
  const toolName = TOOL_NAMES[toolId] || toolId;

  let recommendation = '';
  let action = '';
  let monthlySavings = 0;
  let status = 'optimal';

  // Cursor analysis
  if (toolId === 'cursor') {
    if (planId === 'enterprise' && seats <= 10) {
      recommendation = `Cursor Enterprise at $${planPrice}/user/mo is overkill for ${seats} users. Business plan at $40/user/mo has all features small teams need.`;
      action = 'Downgrade to Business';
      monthlySavings = (planPrice - 40) * seats;
      status = 'overspending';
    } else if (planId === 'business' && seats <= 2) {
      recommendation = `For ${seats} users, Cursor Pro at $20/user/mo gives the same core AI coding features. Business adds admin features you likely don't need yet.`;
      action = 'Downgrade to Pro';
      monthlySavings = (40 - 20) * seats;
      status = 'overspending';
    } else if (planId === 'pro' && useCase === 'writing') {
      recommendation = `Cursor is optimized for coding. For writing use cases, Claude Pro at $20/mo per user may be more effective.`;
      action = 'Consider switching to Claude for writing';
      monthlySavings = 0;
      status = 'wrong_tool';
    } else {
      recommendation = `Cursor ${planName} is appropriate for your team size and coding use case.`;
      action = 'Keep current plan';
      status = 'optimal';
    }
  }

  // GitHub Copilot analysis
  if (toolId === 'github_copilot') {
    if (planId === 'enterprise' && seats <= 20) {
      recommendation = `GitHub Copilot Enterprise at $39/user/mo adds features like custom models. For ${seats} users, Business at $19/user/mo covers all core needs.`;
      action = 'Downgrade to Business';
      monthlySavings = (39 - 19) * seats;
      status = 'overspending';
    } else if (planId === 'business' && seats === 1) {
      recommendation = `GitHub Copilot Business for 1 user costs $19/mo. Individual plan at $10/mo has identical features for solo developers.`;
      action = 'Downgrade to Individual';
      monthlySavings = 9;
      status = 'overspending';
    } else if (useCase === 'writing' || useCase === 'research') {
      recommendation = `GitHub Copilot is coding-focused. For ${useCase}, consider Claude Pro ($20/mo) which is better suited for non-coding tasks.`;
      action = 'Consider Claude for non-coding tasks';
      monthlySavings = 0;
      status = 'wrong_tool';
    } else {
      recommendation = `GitHub Copilot ${planName} is well-suited for your coding team of ${seats}.`;
      action = 'Keep current plan';
      status = 'optimal';
    }
  }

  // Claude analysis
  if (toolId === 'claude') {
    if (planId === 'max' && seats === 1) {
      recommendation = `Claude Max at $100/mo gives 5x more usage than Pro. Unless you're hitting Pro limits daily, Pro at $20/mo is sufficient for most users.`;
      action = 'Downgrade to Pro';
      monthlySavings = 80;
      status = 'overspending';
    } else if (planId === 'enterprise' && seats <= 5) {
      recommendation = `Claude Enterprise at $60/user/mo is designed for large organizations. Team plan at $30/user/mo covers teams under 20 people with similar features.`;
      action = 'Downgrade to Team';
      monthlySavings = (60 - 30) * seats;
      status = 'overspending';
    } else if (planId === 'team' && seats <= 2) {
      recommendation = `Claude Team for ${seats} users costs $${30 * seats}/mo. Individual Pro plans at $20/user/mo total $${20 * seats}/mo with similar capabilities.`;
      action = 'Switch to individual Pro plans';
      monthlySavings = (30 - 20) * seats;
      status = 'overspending';
    } else {
      recommendation = `Claude ${planName} is a good fit for your ${useCase} use case with ${seats} users.`;
      action = 'Keep current plan';
      status = 'optimal';
    }
  }

  // ChatGPT analysis
  if (toolId === 'chatgpt') {
    if (planId === 'enterprise' && seats <= 10) {
      recommendation = `ChatGPT Enterprise at $60/user/mo is designed for 150+ seat deployments. Team plan at $30/user/mo covers everything for ${seats} users.`;
      action = 'Downgrade to Team';
      monthlySavings = (60 - 30) * seats;
      status = 'overspending';
    } else if (planId === 'team' && seats <= 2) {
      recommendation = `ChatGPT Team for ${seats} users costs $${30 * seats}/mo. Plus plan at $20/user gives same GPT-4 access for $${20 * seats}/mo.`;
      action = 'Switch to Plus plans';
      monthlySavings = (30 - 20) * seats;
      status = 'overspending';
    } else if (planId === 'plus' && useCase === 'coding') {
      recommendation = `For coding, Cursor Pro at $20/mo or GitHub Copilot Individual at $10/mo are purpose-built and more efficient than ChatGPT Plus.`;
      action = 'Consider Cursor or Copilot for coding';
      monthlySavings = 0;
      status = 'wrong_tool';
    } else {
      recommendation = `ChatGPT ${planName} is appropriate for your team.`;
      action = 'Keep current plan';
      status = 'optimal';
    }
  }

  // Gemini analysis
  if (toolId === 'gemini') {
    if (planId === 'ultra' && useCase === 'coding') {
      recommendation = `Gemini Ultra at $30/mo is Google's most capable model but Cursor Pro at $20/mo is purpose-built for coding and more effective.`;
      action = 'Switch to Cursor for coding';
      monthlySavings = 10 * seats;
      status = 'wrong_tool';
    } else if (planId === 'pro' && seats > 1) {
      recommendation = `Gemini Pro is per-user at $20/user/mo. For a team of ${seats}, Claude Team at $30/user/mo may offer better collaboration features and value.`;
      action = 'Evaluate Claude Team';
      monthlySavings = 0;
      status = 'review';
    } else {
      recommendation = `Gemini ${planName} is reasonable for your ${useCase} use case.`;
      action = 'Keep current plan';
      status = 'optimal';
    }
  }

  // Windsurf analysis
  if (toolId === 'windsurf') {
    if (planId === 'teams' && seats <= 3) {
      recommendation = `Windsurf Teams at $35/user/mo for ${seats} users costs $${35 * seats}/mo. Pro plan at $15/user/mo saves $${(35 - 15) * seats}/mo with similar AI coding features.`;
      action = 'Downgrade to Pro';
      monthlySavings = (35 - 15) * seats;
      status = 'overspending';
    } else if (planId === 'pro' && useCase === 'writing') {
      recommendation = `Windsurf is an AI coding editor. For writing, Claude Pro at $20/mo is a much better fit.`;
      action = 'Switch to Claude for writing';
      monthlySavings = 0;
      status = 'wrong_tool';
    } else {
      recommendation = `Windsurf ${planName} is appropriate for your coding workflow.`;
      action = 'Keep current plan';
      status = 'optimal';
    }
  }

  // API tools
  if (toolId === 'anthropic_api' || toolId === 'openai_api') {
    if (currentSpend > 500) {
      recommendation = `Your ${toolName} spend of $${currentSpend}/mo is significant. Credex offers discounted AI credits that could reduce this by 20-40%.`;
      action = 'Explore Credex credits';
      monthlySavings = currentSpend * 0.3;
      status = 'credex_opportunity';
    } else {
      recommendation = `Your ${toolName} API spend of $${currentSpend}/mo is within normal range for your usage.`;
      action = 'Keep current usage';
      status = 'optimal';
    }
  }

  return {
    toolId,
    toolName,
    planName,
    seats,
    currentSpend,
    recommendation,
    action,
    monthlySavings: Math.max(0, monthlySavings),
    annualSavings: Math.max(0, monthlySavings * 12),
    status,
  };
};

export const runAudit = (formData) => {
  const { tools, teamSize, useCase } = formData;
  const results = tools.map(tool => auditTool(tool, parseInt(teamSize), useCase));
  const totalMonthlySavings = results.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalCurrentSpend = results.reduce((sum, r) => sum + r.currentSpend, 0);
  const hasCredexOpportunity = totalMonthlySavings > 500 || results.some(r => r.status === 'credex_opportunity');

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    totalCurrentSpend,
    hasCredexOpportunity,
    teamSize,
    useCase,
  };
};