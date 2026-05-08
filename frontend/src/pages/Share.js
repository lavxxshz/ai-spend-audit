import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { runAudit } from '../utils/auditEngine';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Share = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/audit/share/${id}`);
        const auditResult = runAudit(res.data.auditData);
        setData({ ...res.data, audit: auditResult });
      } catch (err) {
        console.error('Share fetch error:', err);
        setError('Audit not found or expired.');
      }
    };
    fetchAudit();
  }, [id]);

  if (error) return (
    <div style={styles.center}>
      <h2>😕 {error}</h2>
      <a href="/" style={styles.link}>Run your own audit →</a>
    </div>
  );

  if (!data) return <div style={styles.center}>Loading audit...</div>;

  const { audit } = data;
  const savingsColor = audit.totalMonthlySavings > 500 ? '#ef4444' : audit.totalMonthlySavings > 100 ? '#f59e0b' : '#22c55e';

  return (
    <div style={styles.container}>
      {/* OG Meta would go here in a real Next.js app */}
      <div style={styles.header}>
        <div style={styles.badge}>💰 SpendLens AI — Shared Audit Report</div>
        <h1 style={styles.title}>AI Spend Audit Results</h1>
        <p style={styles.sub}>{audit.teamSize} person team • {audit.useCase} use case • {audit.results.length} tools analyzed</p>
      </div>

      <div style={styles.content}>
        {/* Hero */}
        <div style={{ ...styles.heroCard, borderColor: savingsColor }}>
          {audit.totalMonthlySavings > 0 ? (
            <>
              <p style={styles.heroLabel}>💰 Potential Monthly Savings Found</p>
              <div style={{ ...styles.heroNum, color: savingsColor }}>${audit.totalMonthlySavings.toFixed(0)}/mo</div>
              <p style={styles.heroSub}>That's ${audit.totalAnnualSavings.toFixed(0)}/year in savings</p>
            </>
          ) : (
            <>
              <p style={styles.heroLabel}>✅ Spending Optimized</p>
              <div style={{ ...styles.heroNum, color: '#22c55e', fontSize: '36px' }}>Well Optimized</div>
              <p style={styles.heroSub}>Current spend: ${audit.totalCurrentSpend}/mo</p>
            </>
          )}
        </div>

        {/* Tool Breakdown */}
        <h2 style={styles.sectionTitle}>Tool Breakdown</h2>
        {audit.results.map((result, i) => (
          <div key={i} style={styles.toolCard}>
            <div style={styles.toolHeader}>
              <span style={styles.toolName}>{result.toolName}</span>
              <span style={styles.toolSpend}>${result.currentSpend}/mo</span>
            </div>
            <p style={styles.toolRec}>{result.recommendation}</p>
            {result.monthlySavings > 0 && (
              <span style={styles.savings}>💰 Save ${result.monthlySavings.toFixed(0)}/mo</span>
            )}
          </div>
        ))}

        {/* CTA */}
        <div style={styles.cta}>
          <h3 style={styles.ctaTitle}>Want to audit your own AI spend?</h3>
          <p style={styles.ctaDesc}>Free • No login required • Results in seconds</p>
          <a href="/" style={styles.ctaBtn}>🚀 Start Your Free Audit →</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px' },
  link: { color: '#4f46e5', fontWeight: '700' },
  header: { backgroundColor: '#0f172a', padding: '40px 20px', textAlign: 'center' },
  badge: { display: 'inline-block', backgroundColor: 'rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '6px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', marginBottom: '16px' },
  title: { fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '8px' },
  sub: { fontSize: '14px', color: '#94a3b8' },
  content: { maxWidth: '700px', margin: '0 auto', padding: '32px 20px' },
  heroCard: { backgroundColor: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '32px', border: '3px solid', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  heroLabel: { fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
  heroNum: { fontSize: '56px', fontWeight: '900', lineHeight: '1', marginBottom: '8px' },
  heroSub: { fontSize: '16px', color: '#64748b' },
  sectionTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' },
  toolCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  toolHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  toolName: { fontSize: '16px', fontWeight: '700', color: '#0f172a' },
  toolSpend: { fontSize: '16px', fontWeight: '700', color: '#0f172a' },
  toolRec: { fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '8px' },
  savings: { fontSize: '13px', fontWeight: '700', color: '#22c55e', backgroundColor: '#f0fdf4', padding: '4px 12px', borderRadius: '50px' },
  cta: { backgroundColor: '#4f46e5', borderRadius: '16px', padding: '36px', textAlign: 'center', marginTop: '32px' },
  ctaTitle: { fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '8px' },
  ctaDesc: { fontSize: '14px', color: '#a5b4fc', marginBottom: '24px' },
  ctaBtn: { display: 'inline-block', padding: '14px 32px', backgroundColor: 'white', color: '#4f46e5', borderRadius: '10px', fontWeight: '800', textDecoration: 'none', fontSize: '15px' },
};

export default Share;