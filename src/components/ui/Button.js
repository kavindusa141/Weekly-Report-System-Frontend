import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  style = {},
  ...props
}) {
  const getButtonClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn btn-secondary';
      case 'danger':
        return 'btn btn-danger';
      default:
        return 'btn btn-primary';
    }
  };

  return (
    <button
      type={type}
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minHeight: '40px',
        ...style
      }}
      {...props}
    >
      {loading && (
        <span style={styles.spinner} />
      )}
      <span style={{ opacity: loading ? 0 : 1, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        {children}
      </span>
    </button>
  );
}

const styles = {
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    position: 'absolute',
  }
};

// Add standard keyframe animation for the spinner inline to guarantee it works
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleTag);
