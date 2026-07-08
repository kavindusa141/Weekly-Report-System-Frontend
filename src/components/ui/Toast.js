import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function Toast({
  message,
  type = 'info', // 'success' | 'warning' | 'danger' | 'info'
  onClose,
  duration = 4000
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'var(--success-light)',
          color: 'var(--success)',
          border: '1px solid rgba(52, 211, 153, 0.3)'
        };
      case 'warning':
        return {
          backgroundColor: 'var(--warning-light)',
          color: 'var(--warning)',
          border: '1px solid rgba(251, 191, 36, 0.3)'
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          border: '1px solid rgba(248, 113, 113, 0.3)'
        };
      default:
        return {
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} />;
      case 'warning': return <AlertTriangle size={18} />;
      case 'danger': return <AlertCircle size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div style={{ ...styles.container, ...getToastStyle() }} className="toast-animation">
      <div style={styles.content}>
        <span style={styles.icon}>{getIcon()}</span>
        <span style={styles.text}>{message}</span>
      </div>
      <button onClick={onClose} style={styles.closeBtn}>×</button>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxWidth: '380px',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  icon: {
    fontSize: '1.1rem'
  },
  text: {
    fontSize: '0.85rem',
    fontWeight: '500',
    lineHeight: '1.4'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0 4px',
    marginLeft: '12px',
    opacity: 0.7,
    transition: 'opacity 0.2s',
    lineHeight: '1'
  }
};

// Add standard keyframe animation for the Toast slide-in inline to guarantee it works
if (!document.getElementById('toast-style-tag')) {
  const toastStyleTag = document.createElement('style');
  toastStyleTag.id = 'toast-style-tag';
  toastStyleTag.innerHTML = `
    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast-animation {
      animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;
  document.head.appendChild(toastStyleTag);
}
