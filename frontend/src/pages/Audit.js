import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOOLS = [
  {
    id: 'cursor',
    name: 'Cursor',
    plans: [
      { id: 'hobby', name: 'Hobby', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'business', name: 'Business', price: 40 },
      { id: 'enterprise', name: 'Enterprise', price: 100 },
    ]
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    plans: [
      { id: 'individual', name: 'Individual', price: 10 },
      { id: 'business', name: 'Business', price: 19 },
      { id: 'enterprise', name: 'Enterprise', price: 39 },
    ]
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'max', name: 'Max', price: 100 },
      { id: 'team', name: 'Team', price: 30 },
      { id: 'enterprise', name: 'Enterprise', price: 60 },
    ]
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'plus', name: 'Plus', price: 20 },
      { id: 'team', name: 'Team', price: 30 },
      { id: 'enterprise', name: 'Enterprise', price: 60 },
    ]
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    plans: [
      { id: 'pay_as_you_go', name: 'Pay as you go', price: 0 },
    ]
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    plans: [
      { id: 'pay_as_you_go', name: 'Pay as you go', price: 0 },
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'ultra', name: 'Ultra', price: 30 },
    ]
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 15 },
      { id: 'teams', name: 'Teams', price: 35 },
    ]
  },
];

const USE_CASES = ['coding', 'writing', 'data', 'research', 'mixed'];

const defaultTool = () => ({
  toolId: '',
  planId: '',
  seats: 1,
  monthlySpend: '',
});

const Audit = () => {
  const navigate = useNavigate();
  const saved = localStorage.getItem('auditForm');
  const [form, setForm] = useState(saved ? JSON.parse(saved) : {
    teamSize: '',
    useCase: '',
    tools: [defaultTool()],
  });

  const save = (updated) => {
    setForm(updated);
    localStorage.setItem('auditForm', JSON.stringify(updated));
  };

  const updateTool = (index, field, value) => {
    const tools = [...form.tools];
    tools[index] = { ...tools[index], [field]: value };
    if (field === 'toolId') {
      const tool = TOOLS.find(t => t.id === value);
      tools[index].planId = tool?.plans[0]?.id || '';
      tools[index].monthlySpend = tool?.plans[0]?.price || '';
    }
    if (field === 'planId') {
      const tool = TOOLS.find(t => t.id === tools[index].toolId);
      const plan = tool?.plans.find(p => p.id === value);
      if (plan) tools[index].monthlySpend = plan.price * tools[index].seats;
    }
    if (field === 'seats') {
      const tool = TOOLS.find(t => t.id === tools[index].toolId);
      const plan = tool?.plans.find(p => p.id === tools[index].planId);
      if (plan) tools[index].monthlySpend = plan.price * value;
    }
    save({ ...form, tools });
  };

  const addTool = () => save({ ...form, tools: [...form.tools, defaultTool()] });

  const removeTool = (index) => {
    const tools = form.tools.filter((_, i) => i !== index);
    save({ ...form, tools });
  };

  const handleSubmit = () => {
    if (!form.teamSize || !form.useCase) return alert('Please fill team size and use case');
    const validTools = form.tools.filter(t => t.toolId && t.planId);
    if (validTools.length === 0) return alert('Please add at least one AI tool');
    localStorage.setItem('auditData', JSON.stringify({ ...form, tools: validTools }));
    navigate('/results');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>💰 AI Spend Audit</h1>
          <p style={styles.subtitle}>Tell us about your AI tool usage to get your personalized audit</p>
        </div>

        {/* Team Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Team Information</h2>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Team Size</label>
              <input
                style={styles.input}
                type="number"
                placeholder="e.g. 5"
                value={form.teamSize}
                onChange={e => save({ ...form, teamSize: e.target.value })}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Primary Use Case</label>
              <select
                style={styles.input}
                value={form.useCase}
                onChange={e => save({ ...form, useCase: e.target.value })}>
                <option value="">Select use case</option>
                {USE_CASES.map(u => (
                  <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Your AI Tools</h2>
          {form.tools.map((tool, index) => {
            const selectedTool = TOOLS.find(t => t.id === tool.toolId);
            return (
              <div key={index} style={styles.toolCard}>
                <div style={styles.toolHeader}>
                  <span style={styles.toolNum}>Tool {index + 1}</span>
                  {form.tools.length > 1 && (
                    <button onClick={() => removeTool(index)} style={styles.removeBtn}>✕ Remove</button>
                  )}
                </div>
                <div style={styles.toolRow}>
                  <div style={styles.field}>
                    <label style={styles.label}>AI Tool</label>
                    <select
                      style={styles.input}
                      value={tool.toolId}
                      onChange={e => updateTool(index, 'toolId', e.target.value)}>
                      <option value="">Select tool</option>
                      {TOOLS.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Plan</label>
                    <select
                      style={styles.input}
                      value={tool.planId}
                      onChange={e => updateTool(index, 'planId', e.target.value)}
                      disabled={!tool.toolId}>
                      <option value="">Select plan</option>
                      {selectedTool?.plans.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — ${p.price}/user/mo</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.fieldSmall}>
                    <label style={styles.label}>Seats</label>
                    <input
                      style={styles.input}
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={e => updateTool(index, 'seats', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div style={styles.fieldSmall}>
                    <label style={styles.label}>Monthly Spend ($)</label>
                    <input
                      style={styles.input}
                      type="number"
                      value={tool.monthlySpend}
                      onChange={e => updateTool(index, 'monthlySpend', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <button onClick={addTool} style={styles.addBtn}>
            + Add Another Tool
          </button>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} style={styles.submitBtn}>
          🔍 Generate My Audit Report →
        </button>
        <p style={styles.note}>Free • No login required • Results in seconds</p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px 20px' },
  card: { maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' },
  header: { backgroundColor: '#4f46e5', padding: '32px 40px', textAlign: 'center' },
  title: { fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '8px' },
  subtitle: { fontSize: '15px', color: '#a5b4fc' },
  section: { padding: '32px 40px', borderBottom: '1px solid #f0f0f0' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' },
  row: { display: 'flex', gap: '16px' },
  field: { flex: 1 },
  fieldSmall: { width: '120px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' },
  toolCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  toolHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  toolNum: { fontSize: '13px', fontWeight: '700', color: '#4f46e5' },
  removeBtn: { fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' },
  toolRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  addBtn: { width: '100%', padding: '12px', border: '2px dashed #4f46e5', borderRadius: '10px', backgroundColor: 'white', color: '#4f46e5', fontWeight: '700', cursor: 'pointer', fontSize: '14px' },
  submitBtn: { display: 'block', width: 'calc(100% - 80px)', margin: '32px 40px 16px', padding: '16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '800', cursor: 'pointer' },
  note: { textAlign: 'center', fontSize: '13px', color: '#94a3b8', paddingBottom: '32px' },
};

export default Audit;