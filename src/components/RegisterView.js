import React, { useState } from 'react';
import { api } from '../services/api';
import Card from './ui/Card';
import InputField from './ui/InputField';
import Button from './ui/Button';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterView({ onRegisterSuccess, onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.register(name.trim(), email.trim(), password);
      onRegisterSuccess(response);
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
            <UserPlus size={40} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Self-registered users default to the Team Member role.</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ ...styles.errorAlert, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />

          <InputField
            label="Email Address"
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />


          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
              style={styles.checkbox}
            />
            <label htmlFor="terms" style={styles.checkboxLabel}>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <Button
            type="submit"
            loading={loading}
            style={{ width: '100%', marginTop: '12px' }}
          >
            Register Account
          </Button>
        </form>

        <div style={styles.loginPrompt}>
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} style={styles.linkBtn}>
            Sign in instead
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
    background: 'radial-gradient(circle, rgba(217, 70, 239, 0.05) 0%, rgba(0,0,0,0) 70%)',
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
    cursor: 'pointer'
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
    marginTop: '4px',
    lineHeight: '1.4'
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
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '12px 0'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: 'var(--primary)',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    userSelect: 'none'
  },
  loginPrompt: {
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
  }
};
