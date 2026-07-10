import React, { useState } from 'react';
import { api } from '../services/api';
import Card from './ui/Card';
import InputField from './ui/InputField';
import Button from './ui/Button';
import { ArrowLeft, BarChart3, AlertCircle } from 'lucide-react';

export default function LoginView({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login(email.trim(), password);
      onLoginSuccess(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.glow} />

      <div style={styles.backNav}>
        <button
          onClick={() => onNavigate('landing')}
          style={{
            ...styles.backBtn,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Homepage</span>
        </button>
      </div>

      <Card style={styles.card}>
        <div style={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <BarChart3 size={40} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={styles.title}>Sign in to Weekly Report System</h2>
          <p style={styles.subtitle}>Enter your details or use a pre-seeded developer profile.</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ ...styles.errorAlert, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <InputField
            label="Email Address"
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <Button
            type="submit"
            loading={loading}
            style={{ width: '100%', marginTop: '12px' }}
          >
            Sign In
          </Button>
        </form>

        <div style={styles.registerPrompt}>
          Don't have an account?{' '}
          <button onClick={() => onNavigate('register')} style={styles.linkBtn}>
            Register here
          </button>
        </div>

      </Card>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '20px',
    position: 'relative'
  },
  glow: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0) 70%)',
    top: '30%',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none'
  },
  backNav: {
    width: '100%',
    maxWidth: '450px',
    marginBottom: '16px',
    textAlign: 'left'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '36px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px'
  },
  logoIcon: {
    fontSize: '2.5rem',
    marginBottom: '8px'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  errorAlert: {
    display: 'block',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    textAlign: 'left',
    marginBottom: '20px',
    textTransform: 'none',
    letterSpacing: 'normal'
  },
  registerPrompt: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '20px'
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0
  },
  quickLoginSection: {
    marginTop: '28px'
  },
  quickLoginDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--border-color)'
  },
  dividerText: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: 'var(--text-tertiary)',
    letterSpacing: '0.08em'
  },
  quickLoginGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  quickBtn: {
    justifyContent: 'flex-start',
    fontSize: '0.8rem',
    padding: '10px 14px'
  }
};
