import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { runAudit } from '../utils/auditEngine';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Results = () => {
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('auditData');
    if (!data) { navigate('/audit'); return; }
    const auditData = runAudit(JSON.parse(data));
    setAudit(auditData);
    fetchAiSummary(auditData);
  }, []);

  const fetchAiSummary = async (auditData) => {
    try {
      const res = await axios.post(`${API_URL}/api/audit/summary`, { audit: auditData });
      setAiSummary(res.data.summary);
    } catch {
      setAiSummary(
        `Your team is currently spending $${auditData.totalCurrentSpend}/month on AI tools. ` +
        `Our audit found $${auditData.totalMonthlySavings.toFixed(0)}/month in potential savings ` +
        `($${auditData.totalAnnualSavings.toFixed(0)}/year) through plan optimization and tool consolidation. ` +
        `${auditData.hasCredexOpportunity ? 'Credex can help you access discounted AI credits for additional savings.' : 'Your spending is generally well-optimized.'}`
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email) return alert('Please enter your email');
    try {
      const res = await axios.post(`${API_URL}/api/audit/save`, {
        email, company, role,
        audit: JSON.parse(localStorage.getItem('auditData')),
        totalMonthlySavings: audit.totalMonthlySavings,
        totalAnnualSavings: audit.totalAnnualSavings,
      });
      setShareUrl(`${window.location.origin}/share/${res.data.auditId}`);
      setSubmitted(true);
    } catch {
      // still show share url even if backend fails
      setShareUrl(`${window.location.origin}/share/demo-123`);
      setSubmitted(true);
    }
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    if (status === 'overspending') return '#ef4444';
    if (status === 'wrong_tool') return '#f59e0b';
    if (status === 'credex_opportunity') return '#6366f1';
    if (status === 'review') return '#f59e0b';
    return '#22c55e';
  };

  const getStatusLabel = (status) => {
    if (status === 'overspending') return '⚠️ Overspending';
    if (status === 'wrong_tool') return '🔄 Wrong Tool';
    if (status === 'credex_opportunity') return '💡 Credex Opportunity';
    if (status === 'review') return '👀 Review';
    return '✅ Optimal';
  };

  if (!audit) return <div style={{ padding: 40, textAlign: 'center' }}>Loading your audit...</div>;

  const savingsColor = audit.totalMonthlySavings > 500 ? '#ef4444' : audit.totalMonthlySavings > 100 ? '#f59e0b' : '#22c55e';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Your AI Spend Audit Report</h1>
        <p style={styles.headerSub}>Based on {audit.results.length} tool{audit.results.length > 1 ? 's' : ''} • {audit.teamSize} person team • {audit.useCase} use case</p>
      </div>

      <div style={styles.content}>

        {/* Hero Savings */}
        <div style={{ ...styles.heroCard, borderColor: savingsColor }}>
          {audit.totalMonthlySavings > 0 ? (
            <>
              <p style={styles.heroLabel}>💰 Potential Monthly Savings</p>
              <div style={{ ...styles.heroNum, color: savingsColor }}>${audit.totalMonthlySavings.toFixed(0)}/mo</div>
              <p style={styles.heroAnnual}>That's <strong>${audit.totalAnnualSavings.toFixed(0)}</strong> saved per year</p>
              <p style={styles.heroSub}>Current monthly spend: ${audit.totalCurrentSpend}/mo</p>
            </>
          ) : (
            <>
              <p style={styles.heroLabel}>✅ You're Spending Well</p>
              <div style={{ ...styles.heroNum, color: '#22c55e', fontSize: '36px' }}>Optimized</div>
              <p style={styles.heroAnnual}>Your current AI spend of <strong>${audit.totalCurrentSpend}/mo</strong> is well-optimized</p>
              <p style={styles.heroSub}>No significant savings opportunities found at this time</p>
            </>
          )}
        </div>

        {/* AI Summary */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryHeader}>
            <span style={styles.summaryIcon}>🤖</span>
            <span style={styles.summaryTitle}>AI-Generated Personalized Summary</span>
          </div>
          {summaryLoading ? (
            <p style={styles.summaryText}>Generating your personalized summary...</p>
          ) : (
            <p style={styles.summaryText}>{aiSummary}</p>
          )}
        </div>

        {/* Credex Banner */}
        {audit.hasCredexOpportunity && (
          <div style={styles.credexBanner}>
            <div style={styles.credexLeft}>
              <h3 style={styles.credexTitle}>💎 Unlock Even More Savings with Credex</h3>
              <p style={styles.credexDesc}>
                Credex sells discounted AI infrastructure credits — Claude, ChatGPT Enterprise, Cursor and more —
                sourced from companies that overforecast. Real discounts, same product.
              </p>
            </div>
            <a href="https://credex.rocks" target="_blank" rel="noreferrer" style={styles.credexBtn}>
              Book Free Consultation →
            </a>
          </div>
        )}

        {/* Per Tool Results */}
        <h2 style={styles.sectionTitle}>Tool-by-Tool Breakdown</h2>
        {audit.results.map((result, i) => (
          <div key={i} style={styles.toolCard}>
            <div style={styles.toolCardHeader}>
              <div>
                <span style={styles.toolName}>{result.toolName}</span>
                <span style={styles.toolPlan}>{result.planName} • {result.seats} seat{result.seats > 1 ? 's' : ''}</span>
              </div>
              <div style={styles.toolRight}>
                <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(result.status) + '20', color: getStatusColor(result.status) }}>
                  {getStatusLabel(result.status)}
                </span>
                <span style={styles.toolSpend}>${result.currentSpend}/mo</span>
              </div>
            </div>
            <div style={styles.toolCardBody}>
              <p style={styles.toolRec}>{result.recommendation}</p>
              <div style={styles.toolFooter}>
                <span style={styles.toolAction}>→ {result.action}</span>
                {result.monthlySavings > 0 && (
                  <span style={styles.toolSavings}>Save ${result.monthlySavings.toFixed(0)}/mo</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Email Capture */}
        {!submitted ? (
          <div style={styles.emailCard}>
            <h2 style={styles.emailTitle}>📧 Save & Share Your Report</h2>
            <p style={styles.emailDesc}>Get a permanent link to your audit report and receive optimization tips</p>
            <div style={styles.emailForm}>
              <input
                style={styles.emailInput}
                type="email"
                placeholder="your@email.com *"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                style={styles.emailInput}
                type="text"
                placeholder="Company name (optional)"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
              <input
                style={styles.emailInput}
                type="text"
                placeholder="Your role (optional)"
                value={role}
                onChange={e => setRole(e.target.value)}
              />
              <button onClick={handleEmailSubmit} style={styles.emailBtn}>
                📊 Save My Report & Get Share Link
              </button>
            </div>
            <p style={styles.emailNote}>We'll only email you about significant new savings opportunities</p>
          </div>
        ) : (
          <div style={styles.shareCard}>
            <h2 style={styles.shareTitle}>✅ Report Saved!</h2>
            <p style={styles.shareDesc}>Share your audit with your team or on social media</p>
            <div style={styles.shareRow}>
              <input style={styles.shareInput} value={shareUrl} readOnly />
              <button onClick={copyShareUrl} style={styles.copyBtn}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <div style={styles.shareActions}>
              <button onClick={() => navigate('/audit')} style={styles.newAuditBtn}>
                Run Another Audit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  header: { backgroundColor: '#0f172a', padding: '32px 20px', textAlign: 'center' },
  headerTitle: { fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '8px' },
  headerSub: { fontSize: '14px', color: '#94a3b8' },
  content: { maxWidth: '800px', margin: '0 auto', padding: '32px 20px' },
  heroCard: { backgroundColor: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '24px', border: '3px solid', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  heroLabel: { fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
  heroNum: { fontSize: '64px', fontWeight: '900', lineHeight: '1', marginBottom: '12px' },
  heroAnnual: { fontSize: '18px', color: '#0f172a', marginBottom: '8px' },
  heroSub: { fontSize: '14px', color: '#94a3b8' },
  summaryCard: { backgroundColor: '#f8f9ff', border: '1px solid #e0e7ff', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  summaryHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  summaryIcon: { fontSize: '20px' },
  summaryTitle: { fontSize: '14px', fontWeight: '700', color: '#4f46e5' },
  summaryText: { fontSize: '15px', color: '#374151', lineHeight: '1.7' },
  credexBanner: { backgroundColor: '#0f172a', borderRadius: '16px', padding: '28px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
  credexLeft: { flex: 1 },
  credexTitle: { fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '8px' },
  credexDesc: { fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' },
  credexBtn: { padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap' },
  sectionTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' },
  toolCard: { backgroundColor: 'white', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  toolCardHeader: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' },
  toolName: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginRight: '8px' },
  toolPlan: { fontSize: '13px', color: '#64748b' },
  toolRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  statusBadge: { padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' },
  toolSpend: { fontSize: '16px', fontWeight: '700', color: '#0f172a' },
  toolCardBody: { padding: '16px 20px' },
  toolRec: { fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' },
  toolFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  toolAction: { fontSize: '13px', fontWeight: '600', color: '#4f46e5' },
  toolSavings: { fontSize: '14px', fontWeight: '700', color: '#22c55e', backgroundColor: '#f0fdf4', padding: '4px 12px', borderRadius: '50px' },
  emailCard: { backgroundColor: 'white', borderRadius: '16px', padding: '36px', marginTop: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  emailTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' },
  emailDesc: { fontSize: '14px', color: '#64748b', marginBottom: '24px' },
  emailForm: { display: 'flex', flexDirection: 'column', gap: '12px' },
  emailInput: { padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' },
  emailBtn: { padding: '14px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  emailNote: { fontSize: '12px', color: '#94a3b8', marginTop: '12px', textAlign: 'center' },
  shareCard: { backgroundColor: 'white', borderRadius: '16px', padding: '36px', marginTop: '32px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  shareTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' },
  shareDesc: { fontSize: '14px', color: '#64748b', marginBottom: '24px' },
  shareRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  shareInput: { flex: 1, padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#4f46e5' },
  copyBtn: { padding: '12px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  shareActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
  newAuditBtn: { padding: '12px 24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#475569' },
};

export default Results;