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
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Glow Backdrops */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      {/* Sticky Header Nav */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <BarChart3 size={24} style={{ color: 'var(--primary)' }} />
          <span style={styles.brandName}>Weekly Report System</span>
        </div>
        <nav style={styles.nav}>
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
          <span>Interactive Reporting</span>
        </div>
        <h1 style={styles.heroTitle}>
          Say Goodbye to <span style={styles.heroHighlight}>Chaotic Weekly Updates</span>
        </h1>
        <p style={styles.heroSubtitle}>
          An engineering-focused platform enforcing a strict parameters schema. Log structured hours, assign unified tags, and analyze blocker metrics automatically.
        </p>
        <div style={styles.heroActions}>
          <Button variant="primary" onClick={() => onNavigate('register')} style={styles.heroBtn}>
            Get Start <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('login')} style={styles.heroBtn}>
            Sign In
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div style={styles.footerBrandCol}>
            <div style={{ ...styles.footerBrand, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <BarChart3 size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>Weekly Report System</span>
            </div>
            <p style={styles.footerDesc}>
              A modern engineering-focused platform for tracking weekly progress, managing capacity, and identifying team blockers in real-time.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialIcon}>Twitter</a>
              <a href="#" style={styles.socialIcon}>GitHub</a>
              <a href="#" style={styles.socialIcon}>LinkedIn</a>
            </div>
          </div>

          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerColTitle}>Company</h4>
            <a href="#" style={styles.footerLink}>About Us</a>
            <a href="#" style={styles.footerLink}>Careers</a>
            <a href="#" style={styles.footerLink}>Blog</a>
            <a href="#" style={styles.footerLink}>Contact</a>
          </div>

          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerColTitle}>Legal</h4>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <a href="#" style={styles.footerLink}>Terms of Service</a>
            <a href="#" style={styles.footerLink}>Security</a>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.footerText}>© {new Date().getFullYear()} Weekly Report System. All rights reserved.</p>
        </div>
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
  footer: {
    padding: '60px 48px 30px 48px',
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    color: 'var(--text-secondary)'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
    maxWidth: '1100px',
    margin: '0 auto',
    marginBottom: '48px'
  },
  footerBrandCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  footerBrand: {
    color: 'var(--text-primary)'
  },
  footerDesc: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    marginBottom: '24px',
    maxWidth: '300px'
  },
  socialLinks: {
    display: 'flex',
    gap: '16px'
  },
  socialIcon: {
    color: 'var(--text-secondary)',
    transition: 'color 0.2s',
    textDecoration: 'none'
  },
  footerLinkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  footerColTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  footerLink: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.85rem',
    transition: 'color 0.2s'
  },
  footerBottom: {
    paddingTop: '24px',
    borderTop: '1px solid var(--border-color)',
    textAlign: 'center',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  footerText: {
    fontSize: '0.8rem',
    margin: 0
  }
};
