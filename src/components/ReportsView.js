import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from './ui/Card';
import InputField from './ui/InputField';
import Button from './ui/Button';
import { ClipboardList, Lock, Save, Send, History, ChevronDown, ChevronUp, Clock, Link, FileEdit, AlertCircle, AlertTriangle } from 'lucide-react';

const WEEK_OPTIONS = [
  { value: 'July 06 - July 12, 2026', label: 'July 06 - July 12, 2026 (Current)' },
  { value: 'June 29 - July 05, 2026', label: 'June 29 - July 05, 2026' },
  { value: 'June 22 - June 28, 2026', label: 'June 22 - June 28, 2026' },
  { value: 'June 15 - June 21, 2026', label: 'June 15 - June 21, 2026' },
  { value: 'June 08 - June 14, 2026', label: 'June 08 - June 14, 2026' }
];

export default function ReportsView({ currentUser, token, triggerToast }) {
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Form State
  const [selectedWeek, setSelectedWeek] = useState('July 06 - July 12, 2026');
  const [projectTag, setProjectTag] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [tasksPlanned, setTasksPlanned] = useState('');
  const [blockers, setBlockers] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [notes, setNotes] = useState('');
  const [reportId, setReportId] = useState(null);
  const [status, setStatus] = useState('Draft');
  
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // Parallel fetches
      const [allProjects, allReports] = await Promise.all([
        api.getProjects(token),
        api.getReports(token, currentUser.role)
      ]);

      setProjects(allProjects);
      
      const userReports = allReports
        .filter(r => r.userId === currentUser.id)
        .sort((a, b) => b.week.localeCompare(a.week));
      setReports(userReports);

      // Look for report matching selectedWeek
      const activeReport = userReports.find(r => r.week === selectedWeek);
      if (activeReport) {
        setReportId(activeReport.id);
        setProjectTag(activeReport.projectTag);
        setTasksCompleted(activeReport.tasksCompleted);
        setTasksPlanned(activeReport.tasksPlanned);
        setBlockers(activeReport.blockers);
        setHoursWorked(activeReport.hoursWorked || '');
        setNotes(activeReport.notes || '');
        setStatus(activeReport.status);
      } else {
        // Reset form
        setReportId(null);
        if (allProjects.length > 0) {
          setProjectTag(allProjects[0].name);
        } else {
          setProjectTag('');
        }
        setTasksCompleted('');
        setTasksPlanned('');
        setBlockers('');
        setHoursWorked('');
        setNotes('');
        setStatus('Draft');
      }
    } catch (err) {
      triggerToast(err.message || 'Error fetching reports.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, currentUser.id, token]);

  const handleSave = async (e, nextStatus = 'Draft') => {
    e.preventDefault();
    setFormError('');

    if (!projectTag) {
      setFormError('Please select a project/category tag.');
      return;
    }
    if (!tasksCompleted.trim()) {
      setFormError('Completed tasks field is required.');
      return;
    }
    if (!tasksPlanned.trim()) {
      setFormError('Planned tasks field is required.');
      return;
    }

    setActionLoading(true);
    try {
      await api.saveReport(token, {
        id: reportId,
        week: selectedWeek,
        projectTag,
        tasksCompleted,
        tasksPlanned,
        blockers: blockers.trim() || 'None',
        hoursWorked: hoursWorked ? parseFloat(hoursWorked) : null,
        notes,
        status: nextStatus
      });

      triggerToast(
        nextStatus === 'Submitted' ? 'Report submitted successfully!' : 'Draft saved successfully!',
        'success'
      );
      
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const isReadOnly = status === 'Submitted' || status === 'Late';

  const getStatusBadge = (reportStatus) => {
    switch (reportStatus) {
      case 'Submitted':
        return <span className="badge badge-success">Submitted</span>;
      case 'Late':
        return <span className="badge badge-danger">Late</span>;
      default:
        return <span className="badge badge-warning">Draft</span>;
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading your workspace...</p>
      </div>
    );
  }

  const projectOptions = projects.map(p => ({ value: p.name, label: p.name }));

  return (
    <div style={styles.gridContainer} className="animate-fade-in">
      {/* Form Section */}
      <Card
        title="Submit Weekly Report"
        subtitle="Submit structured, comparable progress entries."
        actions={<ClipboardList size={20} style={{ color: 'var(--primary)' }} />}
      >
        {formError && (
          <div className="badge badge-danger" style={{ ...styles.alert, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        {isReadOnly && (
          <div style={{ ...styles.lockedBanner, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={14} />
            <span>
              This report is locked. It was submitted on{' '}
              {new Date(reports.find(r => r.id === reportId)?.submittedAt).toLocaleDateString()} at{' '}
              {new Date(reports.find(r => r.id === reportId)?.submittedAt).toLocaleTimeString()}.
            </span>
          </div>
        )}

        <form style={styles.form}>
          <InputField
            label="Week / Date Range"
            type="select"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            disabled={isReadOnly || actionLoading}
            options={WEEK_OPTIONS}
            required
          />

          <InputField
            label="Project / Work Category"
            type="select"
            value={projectTag}
            onChange={(e) => setProjectTag(e.target.value)}
            disabled={isReadOnly || actionLoading}
            options={projectOptions.length > 0 ? projectOptions : [{ value: '', label: 'No projects active' }]}
            required
          />

          <InputField
            label="Tasks Completed This Week"
            type="textarea"
            placeholder="Describe what you completed. Add line breaks if needed."
            value={tasksCompleted}
            onChange={(e) => setTasksCompleted(e.target.value)}
            disabled={isReadOnly || actionLoading}
            rows={4}
            required
          />

          <InputField
            label="Tasks Planned for Next Week"
            type="textarea"
            placeholder="What will you work on next?"
            value={tasksPlanned}
            onChange={(e) => setTasksPlanned(e.target.value)}
            disabled={isReadOnly || actionLoading}
            rows={3}
            required
          />

          <InputField
            label="Blockers / Challenges"
            type="textarea"
            placeholder="Detail any bottlenecks slowing you down. Write 'None' if none."
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            disabled={isReadOnly || actionLoading}
            rows={2}
          />

          <div style={styles.row}>
            <InputField
              label="Hours Worked (Optional)"
              type="number"
              placeholder="e.g. 40"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              disabled={isReadOnly || actionLoading}
              min="0"
              max="168"
              style={{ flex: 1 }}
            />
            
            <InputField
              label="Notes or Links (Optional)"
              type="text"
              placeholder="e.g. FIG-23, PR link"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isReadOnly || actionLoading}
              style={{ flex: 2 }}
            />
          </div>

          {!isReadOnly && (
            <div style={styles.btnRow}>
              <Button
                variant="secondary"
                onClick={(e) => handleSave(e, 'Draft')}
                loading={actionLoading}
                style={{ flex: 1 }}
              >
                <Save size={14} />
                <span>Save as Draft</span>
              </Button>
              <Button
                variant="primary"
                onClick={(e) => handleSave(e, 'Submitted')}
                loading={actionLoading}
                style={{ flex: 1 }}
              >
                <Send size={14} />
                <span>Submit Report</span>
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* History Section */}
      <Card
        title="Report History"
        subtitle="Your submitted reports and active drafts."
        actions={<History size={20} style={{ color: 'var(--primary)' }} />}
      >
        {reports.length === 0 ? (
          <div style={styles.emptyState}>
            <ClipboardList size={40} style={{ color: 'var(--text-tertiary)' }} />
            <p>No report history found.</p>
          </div>
        ) : (
          <div style={styles.historyList}>
            {reports.map((rep) => {
              const isExpanded = expandedReportId === rep.id;
              return (
                <div
                  key={rep.id}
                  style={{
                    ...styles.historyCard,
                    borderColor: rep.id === reportId ? 'var(--primary)' : 'var(--border-color)'
                  }}
                >
                  <div
                    style={styles.historySummary}
                    onClick={() => setExpandedReportId(isExpanded ? null : rep.id)}
                  >
                    <div>
                      <h4 style={styles.historyWeek}>{rep.week}</h4>
                      <span style={styles.historyProject}>{rep.projectTag}</span>
                    </div>
                    
                    <div style={styles.historyStatusRow}>
                      {getStatusBadge(rep.status)}
                      <span style={styles.chevron}>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.historyDetails}>
                      <div style={styles.detailBlock}>
                        <h5 style={styles.detailLabel}>Completed Tasks</h5>
                        <p style={styles.detailText}>{rep.tasksCompleted}</p>
                      </div>
                      
                      <div style={styles.detailBlock}>
                        <h5 style={styles.detailLabel}>Planned Tasks</h5>
                        <p style={styles.detailText}>{rep.tasksPlanned}</p>
                      </div>
                      
                      {rep.blockers && rep.blockers !== 'None' && (
                        <div style={styles.detailBlock}>
                          <h5 style={{ ...styles.detailLabel, display: 'flex', alignItems: 'center', gap: '4px' }} className="text-warning">
                            <AlertTriangle size={14} />
                            <span>Blockers</span>
                          </h5>
                          <p style={{ ...styles.detailText, color: 'var(--warning)' }}>{rep.blockers}</p>
                        </div>
                      )}

                      <div style={styles.detailFooter}>
                        {rep.hoursWorked && (
                          <span style={{ ...styles.footerItem, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            <span>{rep.hoursWorked} hrs</span>
                          </span>
                        )}
                        {rep.notes && (
                          <span style={{ ...styles.footerItem, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Link size={12} />
                            {rep.notes.startsWith('http') ? (
                              <a href={rep.notes} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                Link
                              </a>
                            ) : (
                              <span>{rep.notes}</span>
                            )}
                          </span>
                        )}
                        {rep.status === 'Draft' && (
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedWeek(rep.week)}
                            style={{ padding: '4px 10px', fontSize: '0.75rem', marginLeft: 'auto', minHeight: '30px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <FileEdit size={12} />
                            <span>Edit Draft</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
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
  row: {
    display: 'flex',
    gap: '16px'
  },
  btnRow: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px'
  },
  lockedBanner: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '500',
    marginBottom: '20px',
    border: '1px solid rgba(99, 102, 241, 0.2)'
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
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  historyCard: {
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  },
  historySummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  historyWeek: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  historyProject: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  historyStatusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  chevron: {
    fontSize: '0.7rem',
    color: 'var(--text-tertiary)'
  },
  historyDetails: {
    padding: '0 16px 16px 16px',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-tertiary)'
  },
  detailBlock: {
    marginTop: '12px'
  },
  detailLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px'
  },
  detailText: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    whiteSpace: 'pre-line'
  },
  detailFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px dotted var(--border-color)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  footerItem: {
    backgroundColor: 'var(--bg-secondary)',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)'
  },
  link: {
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: '500'
  }
};
