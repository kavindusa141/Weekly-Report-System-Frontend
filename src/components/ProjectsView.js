import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from './ui/Card';
import InputField from './ui/InputField';
import Button from './ui/Button';
import { FolderPlus, FolderGit, Edit, Trash2, AlertCircle, BarChart3, Users } from 'lucide-react';

export default function ProjectsView({ currentUser, token, triggerToast }) {
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [systemUsers, setSystemUsers] = useState([]);
  const [managingMembersFor, setManagingMembersFor] = useState(null);
  
  // Form State
  const [projectId, setProjectId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [allProjects, allReports] = await Promise.all([
        api.getProjects(token),
        api.getReports(token, currentUser.role)
      ]);
      setProjects(allProjects);
      setReports(allReports);
      
      if (currentUser.role === 'manager') {
        const users = await api.getMembers(token);
        setSystemUsers(users);
      }
    } catch (err) {
      triggerToast(err.message || 'Error loading projects.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Project name is required.');
      return;
    }

    // Check duplicate name
    const isDuplicate = projects.some(
      p => p.name.toLowerCase() === name.trim().toLowerCase() && p.id !== projectId
    );
    if (isDuplicate) {
      setFormError('A project with this name already exists.');
      return;
    }

    setActionLoading(true);
    try {
      await api.saveProject(token, {
        id: projectId,
        name: name.trim(),
        description: description.trim()
      });

      triggerToast(
        projectId ? 'Project updated successfully!' : 'Project created successfully!',
        'success'
      );
      
      // Reset form
      setProjectId(null);
      setName('');
      setDescription('');
      
      // Refresh
      const [allProjects, allReports] = await Promise.all([
        api.getProjects(token),
        api.getReports(token, currentUser.role)
      ]);
      setProjects(allProjects);
      setReports(allReports);
    } catch (err) {
      triggerToast(err.message, 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormError('');
    setProjectId(project.id);
    setName(project.name);
    setDescription(project.description);
  };

  const handleDelete = async (id, projName) => {
    setFormError('');
    
    // Check if project is used in any reports
    const usageCount = reports.filter(r => r.projectTag === projName).length;
    if (usageCount > 0) {
      if (!window.confirm(`Warning: This project is assigned to ${usageCount} weekly report entries. Deleting it will keep the historical reports but they will reference a deleted project. Proceed?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete project "${projName}"?`)) {
        return;
      }
    }

    setActionLoading(true);
    try {
      await api.deleteProject(token, id);
      triggerToast('Project deleted successfully!', 'success');
      
      if (projectId === id) {
        setProjectId(null);
        setName('');
        setDescription('');
      }

      // Refresh
      const [allProjects, allReports] = await Promise.all([
        api.getProjects(token),
        api.getReports(token, currentUser.role)
      ]);
      setProjects(allProjects);
      setReports(allReports);
    } catch (err) {
      triggerToast(err.message, 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setProjectId(null);
    setName('');
    setDescription('');
    setFormError('');
  };

  const toggleMember = async (projId, userId, isMember) => {
    setActionLoading(true);
    try {
      if (isMember) {
        await api.removeProjectMember(token, projId, userId);
      } else {
        await api.addProjectMember(token, projId, userId);
      }
      
      // Update local state to avoid full reload
      const updatedProjects = await api.getProjects(token);
      setProjects(updatedProjects);
      
      // Update the managingMembersFor reference so the modal updates live
      const updatedProj = updatedProjects.find(p => p.id === projId);
      setManagingMembersFor(updatedProj);
      
      triggerToast(isMember ? 'Member removed from project.' : 'Member added to project.', 'success');
    } catch (err) {
      triggerToast(err.message, 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProjectUsage = (projName) => {
    return reports.filter(r => r.projectTag === projName).length;
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading project catalog...</p>
      </div>
    );
  }

  return (
    <div style={styles.gridContainer} className="animate-fade-in">
      {/* Add / Edit Form Pane */}
      <Card
        title={projectId ? 'Edit Project' : 'Add Project Category'}
        subtitle="Define organizational boundaries for team timesheets."
        actions={projectId ? <Edit size={18} style={{ color: 'var(--primary)' }} /> : <FolderPlus size={18} style={{ color: 'var(--primary)' }} />}
      >
        {formError && (
          <div className="badge badge-danger" style={{ ...styles.alert, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <InputField
            label="Project / Category Name"
            placeholder="e.g. Client A Portal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={actionLoading}
            required
          />

          <InputField
            label="Description"
            type="textarea"
            placeholder="Summarize the project work scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={actionLoading}
            rows={4}
          />

          <div style={styles.btnRow}>
            {projectId && (
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={actionLoading}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              loading={actionLoading}
              style={{ flex: 2 }}
            >
              {projectId ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Projects List Pane */}
      <Card
        title={`Active Projects (${projects.length})`}
        subtitle="These categories are assignable to report entries."
        actions={<FolderGit size={18} style={{ color: 'var(--primary)' }} />}
      >
        {/* Search */}
        <InputField
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        {filteredProjects.length === 0 ? (
          <div style={styles.emptyState}>
            <FolderGit size={40} style={{ color: 'var(--text-tertiary)' }} />
            <p>No projects match your query.</p>
          </div>
        ) : (
          <div style={styles.projectsList}>
            {filteredProjects.map((proj) => {
              const usage = getProjectUsage(proj.name);
              return (
                <div key={proj.id} style={styles.projectCard}>
                  <div style={styles.projectInfo}>
                    <h3 style={styles.projectTitle}>{proj.name}</h3>
                    <p style={styles.projectDesc}>
                      {proj.description || 'No description provided.'}
                    </p>
                    <div style={styles.badgeRow}>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <BarChart3 size={12} />
                        <span>{usage} Reports</span>
                      </span>
                    </div>
                  </div>

                  <div style={styles.actionColumn}>
                    {currentUser.role === 'manager' && (
                      <Button
                        variant="secondary"
                        onClick={() => setManagingMembersFor(proj)}
                        style={{ ...styles.actionBtn, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                        disabled={actionLoading}
                      >
                        <Users size={12} />
                        <span>Members</span>
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(proj)}
                      style={{ ...styles.actionBtn, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                      disabled={actionLoading}
                    >
                      <Edit size={12} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(proj.id, proj.name)}
                      style={{ ...styles.actionBtn, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                      disabled={actionLoading}
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Member Management Modal */}
      {managingMembersFor && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Manage Members: {managingMembersFor.name}</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {systemUsers.map(u => {
                const isMember = managingMembersFor.members.some(m => (m._id || m) === u.id);
                return (
                  <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </div>
                    <Button 
                       variant={isMember ? 'danger' : 'secondary'}
                       onClick={() => toggleMember(managingMembersFor.id, u.id, isMember)}
                       disabled={actionLoading}
                       style={{ padding: '6px 14px', fontSize: '0.8rem', minHeight: 'auto' }}
                    >
                       {isMember ? 'Remove' : 'Assign'}
                    </Button>
                  </div>
                )
              })}
              {systemUsers.length === 0 && (
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No users available.</p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
               <Button variant="secondary" onClick={() => setManagingMembersFor(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)'
  },
  modalContent: {
    backgroundColor: 'var(--bg-secondary)',
    padding: '24px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
  },
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
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '32px',
    alignItems: 'start'
  },
  alert: {
    display: 'block',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    textAlign: 'left',
    marginBottom: '20px',
    textTransform: 'none',
    letterSpacing: 'normal'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: 'var(--text-tertiary)',
    fontSize: '0.9rem',
    gap: '12px'
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  projectCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    gap: '16px'
  },
  projectInfo: {
    flex: 1
  },
  projectTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  projectDesc: {
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
    width: '80px',
    flexShrink: 0
  },
  actionBtn: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '0.75rem',
    minHeight: '28px'
  }
};
