import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import { Users, Trash2 } from 'lucide-react';

export default function UsersView({ currentUser, token, triggerToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const allUsers = await api.getMembers(token);
      setUsers(allUsers);
    } catch (err) {
      triggerToast(err.message || 'Error loading users.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate and remove user "${name}" from the system?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await api.deleteUser(token, id);
      triggerToast(`User ${name} has been deactivated.`, 'success');
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading user catalog...</p>
      </div>
    );
  }

  // Filter out the current user so they can't delete themselves easily
  // And filter out deactivated ones if we added an isActive flag mapping, but since we didn't map isActive in getMembers, let's just show all for now.
  
  return (
    <div style={styles.container} className="animate-fade-in">
      <Card
        title={`System Users (${users.length})`}
        subtitle="Manage team members and their access to the system."
        actions={<Users size={18} style={{ color: 'var(--primary)' }} />}
      >
        <div style={styles.usersList}>
          {users.map((user) => (
            <div key={user.id} style={styles.userCard}>
              <div style={styles.userInfo}>
                <h3 style={styles.userTitle}>{user.name}</h3>
                <p style={styles.userDesc}>{user.email}</p>
                <div style={styles.badgeRow}>
                  <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={styles.actionColumn}>
                {currentUser.id !== user.id && (
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.id, user.name)}
                    style={{ ...styles.actionBtn, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                    disabled={actionLoading}
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '20px'
  },
  userCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    gap: '16px'
  },
  userInfo: {
    flex: 1
  },
  userTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  userDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
    lineHeight: '1.4'
  },
  badgeRow: {
    marginTop: '12px'
  },
  actionColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px',
    width: '90px',
    flexShrink: 0
  },
  actionBtn: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '0.75rem',
    minHeight: '28px'
  }
};
