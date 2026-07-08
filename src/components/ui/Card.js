import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  actions,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      {...props}
    >
      {/* Card Header */}
      {(title || subtitle || actions) && (
        <div style={styles.header}>
          <div style={styles.titleArea}>
            {title && <h3 style={styles.title}>{title}</h3>}
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div style={styles.actions}>{actions}</div>}
        </div>
      )}

      {/* Card Body */}
      <div style={styles.body}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
    marginBottom: '20px',
    gap: '12px'
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '3px'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
};
