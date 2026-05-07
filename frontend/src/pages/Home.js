import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.brand}>💰 SpendLens AI</div>
        <button onClick={() => navigate('/audit')} style={styles.navBtn}>
          Start Free Audit →
        </button>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.badge}>🔍 Free AI Spend Analyzer</div>
        <h1 style={styles.title}>
          Are You Overpaying for <span style={styles.highlight}>AI Tools?</span>
        </h1>
        <p style={styles.subtitle}>
          Get an instant audit of your AI tool spending. See exactly where you're wasting money
          and how much you could save — in under 2 minutes.
        </p>
        <button onClick={() => navigate('/audit')} style={styles.ctaBtn}>
          🚀 Start Free Audit — No Login Required
        </button>
        <p style={styles.ctaSub}>Trusted by 500+ startup founders and engineering managers</p>
      </div>

      {/* Tools supported */}
      <div style={styles.toolsSection}>
        <p style={styles.toolsLabel}>Analyzes spending across</p>
        <div style={styles.toolsList}>
          {['Cursor', 'Claude', 'ChatGPT', 'GitHub Copilot', 'Gemini', 'OpenAI API', 'Anthropic API', 'Windsurf'].map(tool => (
            <span key={tool} style={styles.toolTag}>{tool}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.steps}>
          {[
            { num: '01', title: 'Enter Your Tools', desc: 'Tell us which AI tools you pay for, your plan, and monthly spend' },
            { num: '02', title: 'Get Instant Audit', desc: 'Our engine analyzes your spend against optimal plans and alternatives' },
            { num: '03', title: 'Save Money', desc: 'See exactly how much you can save and what to switch to' },
          ].map(step => (
            <div key={step.num} style={styles.step}>
              <div style={styles.stepNum}>{step.num}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsSection}>
        {[
          { num: '$2,400', label: 'Average annual savings found' },
          { num: '8', label: 'AI tools analyzed' },
          { num: '2 min', label: 'Time to complete audit' },
          { num: '100%', label: 'Free, no login required' },
        ].map(stat => (
          <div key={stat.label} style={styles.stat}>
            <div style={styles.statNum}>{stat.num}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA Bottom */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Find Out How Much You're Overspending</h2>
        <p style={styles.ctaDesc}>Takes 2 minutes. No credit card. No login.</p>
        <button onClick={() => navigate('/audit')} style={styles.ctaBtn}>
          Start Your Free Audit →
        </button>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Built for startup founders and engineering managers • Powered by Credex</p>
      </footer>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#ffffff' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 80px', borderBottom: '1px solid #f0f0f0' },
  brand: { fontSize: '22px', fontWeight: '800', color: '#0f172a' },
  navBtn: { padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  hero: { textAlign: 'center', padding: '80px 20px 60px', maxWidth: '800px', margin: '0 auto' },
  badge: { display: 'inline-block', backgroundColor: '#ede9fe', color: '#4f46e5', padding: '6px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', marginBottom: '24px' },
  title: { fontSize: '56px', fontWeight: '900', color: '#0f172a', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-1.5px' },
  highlight: { color: '#4f46e5' },
  subtitle: { fontSize: '18px', color: '#64748b', lineHeight: '1.7', marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px' },
  ctaBtn: { padding: '16px 36px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '800', cursor: 'pointer', display: 'inline-block' },
  ctaSub: { fontSize: '13px', color: '#94a3b8', marginTop: '12px' },
  toolsSection: { textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc' },
  toolsLabel: { fontSize: '13px', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' },
  toolsList: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' },
  toolTag: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '50px', fontSize: '13px', fontWeight: '600', color: '#475569' },
  howSection: { padding: '80px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
  sectionTitle: { fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '48px' },
  steps: { display: 'flex', gap: '32px', justifyContent: 'center' },
  step: { flex: 1, textAlign: 'center', padding: '32px 24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' },
  stepNum: { fontSize: '36px', fontWeight: '900', color: '#4f46e5', marginBottom: '12px' },
  stepTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
  stepDesc: { fontSize: '14px', color: '#64748b', lineHeight: '1.6' },
  statsSection: { display: 'flex', justifyContent: 'center', gap: '48px', padding: '60px 20px', backgroundColor: '#4f46e5' },
  stat: { textAlign: 'center' },
  statNum: { fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '4px' },
  statLabel: { fontSize: '13px', color: '#a5b4fc', fontWeight: '600' },
  ctaSection: { textAlign: 'center', padding: '80px 20px' },
  ctaTitle: { fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' },
  ctaDesc: { fontSize: '16px', color: '#64748b', marginBottom: '32px' },
  footer: { textAlign: 'center', padding: '24px', backgroundColor: '#f8fafc', color: '#94a3b8', fontSize: '13px', borderTop: '1px solid #e2e8f0' },
};

export default Home;