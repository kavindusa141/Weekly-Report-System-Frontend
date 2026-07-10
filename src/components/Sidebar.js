import React from 'react';
import { BarChart3, LayoutDashboard, Folder, ClipboardList, Sun, Moon, LogOut, Users } from 'lucide-react';

export default function Sidebar({ currentUser, currentView, onViewChange, onLogout, theme, onToggleTheme }) {
  if (!currentUser) return null;

  const isManager = currentUser.role === 'manager';

  return (
    <div style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brand}>
        <BarChart3 size={28} style={{ color: 'var(--primary)' }} />
        <div>
          <h1 style={styles.brandTitle}>Weekly Report System</h1>
        </div>
      </div>

      {/* User Profile Info */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div style={styles.profileText}>
          <div style={styles.profileName} title={currentUser.name}>
            {currentUser.name}
          </div>
          <span className={`badge ${isManager ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.65rem', padding: '3px 8px' }}>
            {isManager ? 'Manager' : 'Member'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        {isManager ? (
          <>
            <button
              onClick={() => onViewChange('dashboard')}
              style={{
                ...styles.navBtn,
                ...(currentView === 'dashboard' ? styles.activeNavBtn : {}),
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onViewChange('projects')}
              style={{
                ...styles.navBtn,
                ...(currentView === 'projects' ? styles.activeNavBtn : {}),
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Folder size={18} />
              <span>Projects / Tags</span>
            </button>
            <button
              onClick={() => onViewChange('users')}
              style={{
                ...styles.navBtn,
                ...(currentView === 'users' ? styles.activeNavBtn : {}),
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Users size={18} />
              <span>User Management</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => onViewChange('reports')}
            style={{
              ...styles.navBtn,
              ...(currentView === 'reports' ? styles.activeNavBtn : {}),
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <ClipboardList size={18} />
            <span>My Weekly Reports</span>
          </button>
        )}
      </nav>

      {/* Footer Controls */}
      <div style={styles.footer}>
        <button
          onClick={onToggleTheme}
          style={styles.controlBtn}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={16} />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <button
          onClick={onLogout}
          style={styles.logoutBtn}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    padding: '24px 16px',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    paddingLeft: '8px'
  },
  logoIcon: {
    fontSize: '2rem'
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: '1.1'
  },
  brandVersion: {
    fontSize: '0.7rem',
    color: 'var(--text-tertiary)',
    fontWeight: '500'
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    marginBottom: '28px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
    flexShrink: 0
  },
  profileText: {
    overflow: 'hidden'
  },
  profileName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activeNavBtn: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontWeight: '600'
  },
  footer: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  controlBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--danger-light)',
    color: 'var(--danger)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};
