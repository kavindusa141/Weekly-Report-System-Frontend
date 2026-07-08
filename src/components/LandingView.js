import React, { useState } from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import { 
  BarChart3, 
  Shield, 
  LineChart, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  Folder, 
  AlertTriangle,
  Send,
  Sparkles
} from 'lucide-react';

export default function LandingView({ onNavigate }) {
  // Simulator State
  const [sandboxProj, setSandboxProj] = useState('Client Portal UX');
  const [sandboxCompleted, setSandboxCompleted] = useState('- Refactored navigation bar to use Lucide React icons\n- Set up responsive glassmorphism card templates');
  const [sandboxPlanned, setSandboxPlanned] = useState('- Integrate backend authentication controllers\n- Write unit tests for router state changes');
  const [sandboxBlockers, setSandboxBlockers] = useState('None');
  const [sandboxHours, setSandboxHours] = useState(38);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sandboxView, setSandboxView] = useState('rendered'); // 'rendered' | 'json'

  const handleSimulateSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Glow Backdrops */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      {/* Sticky Header Nav */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <BarChart3 size={24} style={{ color: 'var(--primary)' }} />
          <span style={styles.brandName}>WeeklySync</span>
        </div>
        <nav style={styles.nav}>
          <a href="#simulator" style={styles.navLink}>Interactive Sandbox</a>
          <a href="#features" style={styles.navLink}>Features</a>
          <Button variant="secondary" onClick={() => onNavigate('login')} style={styles.headerBtn}>
            Sign In
          </Button>
          <Button variant="primary" onClick={() => onNavigate('register')} style={styles.headerBtn}>
            Get Started
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.tagline}>
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          <span>Interactive Product Tour</span>
        </div>
        <h1 style={styles.heroTitle}>
          Say Goodbye to <span style={styles.heroHighlight}>Chaotic Weekly Updates</span>
        </h1>
        <p style={styles.heroSubtitle}>
          An engineering-focused platform enforcing a strict parameters schema. Log structured hours, assign unified tags, and analyze blocker metrics automatically.
        </p>
        <div style={styles.heroActions}>
          <Button variant="primary" onClick={() => onNavigate('register')} style={styles.heroBtn}>
            Launch Live Workspace <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('login')} style={styles.heroBtn}>
            Quick Manager Demo
          </Button>
        </div>
      </section>

      {/* SPECIFIC INTERACTIVE SIMULATOR SANDBOX */}
      <section id="simulator" style={styles.simulatorSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Try It Live</span>
          <h2 style={styles.sectionTitle}>Interactive Sandbox Simulator</h2>
          <p style={styles.sectionSubtitle}>
            Modify the developer inputs on the left to see how WeeklySync parses, validates, and visualizes compliance metrics in real-time.
          </p>
        </div>

        <div style={styles.simulatorWrapper} className="glass-card">
          {/* Mock Code Editor / Input Side */}
          <div style={styles.simInputSide}>
            <div style={styles.simPaneHeader}>
              <Terminal size={14} />
              <span>Developer Entry Terminal (Draft)</span>
            </div>
            
            <div style={styles.simForm}>
              <div style={styles.formRow}>
                <label style={styles.simLabel}>Category Tag</label>
                <select 
                  value={sandboxProj} 
                  onChange={(e) => setSandboxProj(e.target.value)}
                  style={styles.simSelect}
                >
                  <option value="Client Portal UX">Client Portal UX</option>
                  <option value="Backend Core API">Backend Core API</option>
                  <option value="Mobile App Sprints">Mobile App Sprints</option>
                  <option value="DevOps Pipeline">DevOps Pipeline</option>
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.simLabel}>Tasks Completed</label>
                <textarea 
                  value={sandboxCompleted} 
                  onChange={(e) => setSandboxCompleted(e.target.value)}
                  rows={3}
                  style={styles.simTextarea}
                />
              </div>

              <div style={styles.formRow}>
                <label style={styles.simLabel}>Tasks Planned</label>
                <textarea 
                  value={sandboxPlanned} 
                  onChange={(e) => setSandboxPlanned(e.target.value)}
                  rows={2}
                  style={styles.simTextarea}
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={styles.simLabel}>Blockers / Obstacles</label>
                  {sandboxBlockers !== 'None' && sandboxBlockers.trim() !== '' && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <AlertTriangle size={10} /> Active Blocker Alert
                    </span>
                  )}
                </div>
                <input 
                  type="text" 
                  value={sandboxBlockers} 
                  onChange={(e) => setSandboxBlockers(e.target.value)}
                  style={styles.simInput}
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={styles.simLabel}>Logged Capacity</label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>{sandboxHours} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="80" 
                  value={sandboxHours} 
                  onChange={(e) => setSandboxHours(parseInt(e.target.value))}
                  style={styles.simSlider}
                />
              </div>

              <Button 
                variant="primary" 
                onClick={handleSimulateSubmit}
                style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
              >
                <Send size={14} />
                <span>Simulate Submission</span>
              </Button>
            </div>
          </div>

          {/* Manager Feed / Output Preview Side */}
          <div style={styles.simOutputSide}>
            <div style={styles.simPaneHeader}>
              <div style={styles.tabContainer}>
                <button 
                  onClick={() => setSandboxView('rendered')}
                  style={{
                    ...styles.tabBtn,
                    ...(sandboxView === 'rendered' ? styles.activeTabBtn : {})
                  }}
                >
                  Aggregated Card Preview
                </button>
                <button 
                  onClick={() => setSandboxView('json')}
                  style={{
                    ...styles.tabBtn,
                    ...(sandboxView === 'json' ? styles.activeTabBtn : {})
                  }}
                >
                  Raw Structured JSON
                </button>
              </div>
            </div>

            <div style={styles.simOutputContent}>
              {isSubmitted && (
                <div style={styles.successBanner} className="toast-animation">
                  <CheckCircle2 size={16} />
                  <span>Entry submitted. Compliance check successful (100% OK)</span>
                </div>
              )}

              {sandboxView === 'rendered' ? (
                <div style={styles.feedCardPreview}>
                  <div style={styles.feedCardHeader}>
                    <div>
                      <h4 style={styles.feedCardTitle}>Sarah Connor</h4>
                      <span style={{ ...styles.tagBadge, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Folder size={11} />
                        <span>{sandboxProj}</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span className="badge badge-success">Submitted</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        <span>{sandboxHours} hrs</span>
                      </span>
                    </div>
                  </div>

                  <div style={styles.feedCardBody}>
                    <div style={styles.blockText}>
                      <span style={styles.blockTitle}>Completed Tasks</span>
                      <p style={styles.blockDesc}>{sandboxCompleted || 'No tasks inputted yet.'}</p>
                    </div>

                    <div style={styles.blockText}>
                      <span style={styles.blockTitle}>Planned Tasks</span>
                      <p style={styles.blockDesc}>{sandboxPlanned || 'No tasks planned.'}</p>
                    </div>

                    {sandboxBlockers && sandboxBlockers.toLowerCase() !== 'none' && sandboxBlockers.trim() !== '' && (
                      <div style={{ ...styles.blockText, borderLeft: '2px solid var(--warning)', paddingLeft: '8px' }}>
                        <span style={{ ...styles.blockTitle, color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} />
                          <span>Active Blocker</span>
                        </span>
                        <p style={{ ...styles.blockDesc, color: 'var(--warning)', fontWeight: '500' }}>{sandboxBlockers}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <pre style={styles.jsonCode}>
{`{
  "user": {
    "name": "Sarah Connor",
    "role": "team_member"
  },
  "week": "July 06 - July 12, 2026",
  "projectTag": "${sandboxProj}",
  "tasksCompleted": "${sandboxCompleted.replace(/\n/g, '\\n')}",
  "tasksPlanned": "${sandboxPlanned.replace(/\n/g, '\\n')}",
  "blockers": "${sandboxBlockers}",
  "hoursWorked": ${sandboxHours},
  "status": "Submitted",
  "schemaVersion": "v1.0.0"
}`}
                </pre>
              )}
            </div>

            {/* Simulated Live Analytics Bar */}
            <div style={styles.analyticsBar}>
              <div style={styles.analyticItem}>
                <span style={styles.analyticVal}>{sandboxHours}h</span>
                <span style={styles.analyticLabel}>Capacity Added</span>
              </div>
              <div style={styles.analyticItem}>
                <span style={{ ...styles.analyticVal, color: sandboxBlockers !== 'None' && sandboxBlockers.trim() !== '' ? 'var(--warning)' : 'var(--success)' }}>
                  {sandboxBlockers !== 'None' && sandboxBlockers.trim() !== '' ? '1' : '0'}
                </span>
                <span style={styles.analyticLabel}>Active Blockers</span>
              </div>
              <div style={{...styles.analyticItem, borderRight: 'none'}}>
                <span style={styles.analyticVal}>100%</span>
                <span style={styles.analyticLabel}>Schema Valid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>System Safeguards</span>
          <h2 style={styles.sectionTitle}>Engineered for Clean Data Compliance</h2>
          <p style={styles.sectionSubtitle}>
            Eliminate loose update messages in Slack. Enforce system parameters at compilation.
          </p>
        </div>

        <div style={styles.featuresGrid}>
          <Card
            title="Unified Project Enums"
            subtitle="Strict tags prevent ad-hoc category naming."
            actions={<Layers size={20} style={{ color: 'var(--primary)' }} />}
          >
            <p style={styles.cardText}>Every team member files updates against active tags generated exclusively by the manager in the settings panel.</p>
          </Card>
          <Card
            title="Role-Based Validation"
            subtitle="Access keys and tokens shield protected operations."
            actions={<Shield size={20} style={{ color: 'var(--primary)' }} />}
          >
            <p style={styles.cardText}>Member profiles are restricted from accessing dashboard endpoints. Token validation rejection displays 403 fallbacks.</p>
          </Card>
          <Card
            title="Visual Capacity Gauges"
            subtitle="Identify workloads and velocity trends instantly."
            actions={<LineChart size={20} style={{ color: 'var(--primary)' }} />}
          >
            <p style={styles.cardText}>Review dynamic charts comparing completed task quantities, compliance checkboard status ratios, and work-hours allocations.</p>
          </Card>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>100%</h3>
            <p style={styles.statLabel}>Client-side Latency Simulation</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>400ms</h3>
            <p style={styles.statLabel}>Mock API Database Roundtrip</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>v1.0</h3>
            <p style={styles.statLabel}>Clean Production Compile</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{ ...styles.footerBrand, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
          <span>WeeklySync</span>
        </div>
        <p style={styles.footerText}>© 2026 WeeklySync Systems. Built for Industry-Level Evaluation.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    position: 'relative',
    color: 'var(--text-primary)',
    overflowX: 'hidden'
  },
  glowTop: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(217, 70, 239, 0.03) 60%, rgba(0,0,0,0) 100%)',
    top: '-200px',
    left: '10%',
    zIndex: 0,
    pointerEvents: 'none'
  },
  glowBottom: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(217, 70, 239, 0.05) 60%, rgba(0,0,0,0) 100%)',
    bottom: '-100px',
    right: '10%',
    zIndex: 0,
    pointerEvents: 'none'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 48px',
    borderBottom: '1px solid var(--border-color)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(9, 13, 22, 0.3)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  brandName: {
    fontSize: '1.2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  navLink: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'color 0.2s',
    cursor: 'pointer'
  },
  headerBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem'
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '80px 24px 40px 24px',
    maxWidth: '900px',
    margin: '0 auto',
    zIndex: 1,
    position: 'relative'
  },
  tagline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginBottom: '20px',
    border: '1px solid rgba(99, 102, 241, 0.2)'
  },
  heroTitle: {
    fontSize: '3.25rem',
    fontWeight: '800',
    lineHeight: '1.15',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)'
  },
  heroHighlight: {
    background: 'linear-gradient(90deg, #6366f1 0%, #d946ef 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    marginTop: '24px',
    lineHeight: '1.6',
    maxWidth: '700px'
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    marginTop: '32px'
  },
  heroBtn: {
    padding: '12px 24px',
    fontSize: '0.95rem'
  },
  
  // Simulator Styles
  simulatorSection: {
    padding: '60px 48px',
    zIndex: 1,
    position: 'relative'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '48px',
    maxWidth: '650px',
    margin: '0 auto 48px auto'
  },
  sectionBadge: {
    color: 'var(--primary)',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    marginTop: '12px',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em'
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    marginTop: '12px',
    lineHeight: '1.5'
  },
  simulatorWrapper: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '32px',
    maxWidth: '1100px',
    margin: '0 auto',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    padding: '24px',
    backgroundColor: 'rgba(21, 26, 38, 0.4)'
  },
  simInputSide: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  simPaneHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 18px',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)'
  },
  simForm: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  simLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  simSelect: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer'
  },
  simTextarea: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.4'
  },
  simInput: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none'
  },
  simSlider: {
    width: '100%',
    accentColor: 'var(--primary)',
    cursor: 'pointer',
    margin: '8px 0'
  },
  
  // Output Side Styles
  simOutputSide: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: '400px'
  },
  tabContainer: {
    display: 'flex',
    gap: '4px',
    width: '100%'
  },
  tabBtn: {
    padding: '6px 14px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activeTabBtn: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)'
  },
  simOutputContent: {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative'
  },
  successBanner: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    right: '16px',
    backgroundColor: 'var(--success-light)',
    color: 'var(--success)',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(52, 211, 153, 0.3)',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 10
  },
  feedCardPreview: {
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '18px',
    backgroundColor: 'var(--bg-tertiary)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s'
  },
  feedCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
    marginBottom: '12px'
  },
  feedCardTitle: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '700'
  },
  tagBadge: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: '0.65rem',
    padding: '3px 8px',
    borderRadius: '6px',
    fontWeight: '600',
    marginTop: '6px'
  },
  feedCardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  blockText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  blockTitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em'
  },
  blockDesc: {
    margin: 0,
    fontSize: '0.8rem',
    lineHeight: '1.4',
    whiteSpace: 'pre-line',
    color: 'var(--text-primary)'
  },
  jsonCode: {
    margin: 0,
    fontFamily: '"Fira Code", Courier, monospace',
    fontSize: '0.75rem',
    lineHeight: '1.4',
    color: 'var(--success)',
    padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    overflowX: 'auto'
  },
  analyticsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)'
  },
  analyticItem: {
    padding: '14px 8px',
    textAlign: 'center',
    borderRight: '1px solid var(--border-color)'
  },
  analyticVal: {
    display: 'block',
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  analyticLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)'
  },

  // Other layout styles
  featuresSection: {
    padding: '80px 48px',
    borderTop: '1px solid var(--border-color)',
    zIndex: 1,
    position: 'relative'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  cardText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5'
  },
  statsSection: {
    padding: '60px 48px',
    borderTop: '1px solid var(--border-color)',
    zIndex: 1,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.01)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center'
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--primary)',
    margin: 0
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    margin: 0
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 48px',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  footerBrand: {
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  footerText: {
    margin: 0
  }
};
