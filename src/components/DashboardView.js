import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from './ui/Card';
import InputField from './ui/InputField';
import Button from './ui/Button';
import {
  Clock,
  Folder,
  AlertTriangle,
  Mail,
  ChevronDown,
  ChevronUp,
  Lock,
  ListChecks,
  ClipboardList,
  Link,
  BarChart2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

const WEEK_OPTIONS = [
  'July 06 - July 12, 2026',
  'June 29 - July 05, 2026',
  'June 22 - June 28, 2026',
  'June 15 - June 21, 2026',
  'June 08 - June 14, 2026'
];

export default function DashboardView({ currentUser, token, triggerToast }) {
  const [reports, setReports] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [remindedMembers, setRemindedMembers] = useState({}); // { memberId: boolean }
  const [roleChanging, setRoleChanging] = useState({});

  // Filters State
  const [selectedWeek, setSelectedWeek] = useState('July 06 - July 12, 2026');
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [onlyBlockers, setOnlyBlockers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Copilot Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  
  // Interaction State
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState('trend');

  const loadData = async () => {
    setLoading(true);
    setAccessDenied(false);
    try {
      // Parallel fetches (Protected endpoints!)
      const [allReports, allMembers, allProjects] = await Promise.all([
        api.getReports(token, currentUser.role),
        api.getMembers(token),
        api.getProjects(token)
      ]);

      setReports(allReports);
      setMembers(allMembers);
      setProjects(allProjects);
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setAccessDenied(true);
      } else {
        triggerToast(err.message || 'Error loading dashboard.', 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (accessDenied) {
    return (
      <div style={styles.deniedContainer} className="animate-fade-in">
        <Lock size={48} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
        <h2 style={styles.deniedTitle}>Access Denied (403)</h2>
        <p style={styles.deniedText}>
          Your user profile does not possess the credentials required to view the consolidated team statistics dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Calculating team metrics...</p>
      </div>
    );
  }

  // Filtered Reports for calculations & feed
  const activeWeekReports = reports.filter(r => r.week === selectedWeek);

  // Compute stats for the current selected week
  const totalMembersCount = members.length;
  const submittedReports = activeWeekReports.filter(r => r.status === 'Submitted' || r.status === 'Late');
  const totalSubmittedCount = submittedReports.length;
  
  // Compliance Rate
  const complianceRate = totalMembersCount > 0 
    ? Math.round((totalSubmittedCount / totalMembersCount) * 100) 
    : 0;

  // Open Blockers Count
  const openBlockersCount = activeWeekReports.filter(
    r => r.blockers && r.blockers.toLowerCase() !== 'none' && r.blockers.trim() !== ''
  ).length;

  // Total Hours Worked
  const totalHoursWorked = activeWeekReports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);

  // Remind member action simulation
  const handleSendReminder = (memberId, memberName) => {
    setRemindedMembers(prev => ({ ...prev, [memberId]: true }));
    triggerToast(`Reminder notification sent to ${memberName}!`, 'success');
    setTimeout(() => {
      setRemindedMembers(prev => ({ ...prev, [memberId]: false }));
    }, 4000);
  };

  const handleRoleChange = async (memberId, newRole) => {
    setRoleChanging(prev => ({ ...prev, [memberId]: true }));
    try {
      await api.updateUserRole(token, memberId, newRole);
      triggerToast('User role updated successfully!', 'success');
      // Reload members list to reflect changes
      const updatedMembers = await api.getMembers(token);
      setMembers(updatedMembers);
    } catch (err) {
      triggerToast(err.message || 'Failed to update user role.', 'danger');
    } finally {
      setRoleChanging(prev => ({ ...prev, [memberId]: false }));
    }
  };

  // AI Copilot handlers
  const handleAskPreset = async (question) => {
    setChatLoading(true);
    try {
      const response = await api.askAi(token, question);
      setChatHistory(prev => [...prev, { question, answer: response.answer }]);
    } catch (err) {
      triggerToast(err.message || 'Failed to connect to AI server.', 'danger');
    } finally {
      setChatLoading(false);
    }
  };

  const handleAskCustom = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const question = chatInput.trim();
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await api.askAi(token, question);
      setChatHistory(prev => [...prev, { question, answer: response.answer }]);
    } catch (err) {
      triggerToast(err.message || 'Failed to connect to AI server.', 'danger');
    } finally {
      setChatLoading(false);
    }
  };

  // Compile visual charts data dynamically
  const trendData = WEEK_OPTIONS.slice().reverse().map(week => {
    const weekReps = reports.filter(r => r.week === week && (r.status === 'Submitted' || r.status === 'Late'));
    const taskCount = weekReps.reduce((sum, r) => {
      const lines = r.tasksCompleted.split('\n').filter(line => line.trim().length > 0);
      return sum + (lines.length || 1);
    }, 0);
    const totalHours = weekReps.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
    return { week, taskCount, totalHours };
  });

  const projectDistribution = projects.map(proj => {
    const projReps = activeWeekReports.filter(r => r.projectTag === proj.name);
    const hours = projReps.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
    const count = projReps.length;
    return { name: proj.name, hours, count };
  }).filter(p => p.hours > 0 || p.count > 0);

  // Compile compliance states for each team member
  const teamComplianceStatus = members.map(m => {
    const report = activeWeekReports.find(r => r.userId === m.id);
    let status = 'Pending';
    let reportId = null;
    
    if (report) {
      status = report.status;
      reportId = report.id;
    }
    
    return {
      memberId: m.id,
      memberName: m.name,
      email: m.email,
      status,
      reportId
    };
  });

  // Filter feed reports dynamically based on selections
  const filteredFeedReports = activeWeekReports.filter(r => {
    if (selectedMember !== 'all' && r.userId !== selectedMember) return false;
    if (selectedProject !== 'all' && r.projectTag !== selectedProject) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (onlyBlockers && (!r.blockers || r.blockers.toLowerCase() === 'none' || r.blockers.trim() === '')) return false;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchName = r.userName.toLowerCase().includes(query);
      const matchProject = r.projectTag.toLowerCase().includes(query);
      const matchCompleted = r.tasksCompleted.toLowerCase().includes(query);
      const matchPlanned = r.tasksPlanned.toLowerCase().includes(query);
      const matchBlockers = r.blockers.toLowerCase().includes(query);
      return matchName || matchProject || matchCompleted || matchPlanned || matchBlockers;
    }

    return true;
  });

  const maxTrendTasks = Math.max(...trendData.map(d => d.taskCount), 10);
  const maxProjectHours = Math.max(...projectDistribution.map(d => d.hours), 10);

  return (
    <div style={styles.container} className="animate-fade-in">
      
      {/* Filters Bar */}
      <Card style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', width: '100%' }}>
          <InputField
            label="Select Week"
            type="select"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            options={WEEK_OPTIONS.map(w => ({ value: w, label: w }))}
            style={{ flex: 1, minWidth: '130px', marginBottom: 0 }}
          />

          <InputField
            label="Team Member"
            type="select"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            options={[{ value: 'all', label: 'All Members' }, ...members.map(m => ({ value: m.id, label: m.name }))]}
            style={{ flex: 1.2, minWidth: '150px', marginBottom: 0 }}
          />

          <InputField
            label="Project Tag"
            type="select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={[{ value: 'all', label: 'All Projects' }, ...projects.map(p => ({ value: p.name, label: p.name }))]}
            style={{ flex: 1.2, minWidth: '150px', marginBottom: 0 }}
          />

          <InputField
            label="Status"
            type="select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Submitted', label: 'Submitted' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Late', label: 'Late' }
            ]}
            style={{ flex: 1, minWidth: '130px', marginBottom: 0 }}
          />

          <InputField
            label="Search Keywords"
            type="text"
            placeholder="Search tasks, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1.8, minWidth: '200px', marginBottom: 0 }}
          />
        </div>
      </Card>

      {/* Summary Metrics Cards */}
      <div style={styles.metricsGrid}>
        
        {/* Compliance Card */}
        <div style={styles.metricCard} className="glass-card">
          <div style={styles.metricInfo}>
            <span style={styles.metricTitle}>Submission Compliance</span>
            <span style={styles.metricVal}>{complianceRate}%</span>
            <span style={styles.metricSub}>{totalSubmittedCount} of {totalMembersCount} submitted</span>
          </div>
          <div style={styles.metricIconBox} className="badge-primary">
            <ShieldAlert size={20} />
          </div>
        </div>

        {/* Blockers Card */}
        <div
          style={{
            ...styles.metricCard,
            cursor: 'pointer',
            border: onlyBlockers ? '1px solid var(--warning)' : '1px solid var(--glass-border)'
          }}
          className="glass-card"
          onClick={() => setOnlyBlockers(!onlyBlockers)}
          title="Click to filter reports with active blockers"
        >
          <div style={styles.metricInfo}>
            <span style={styles.metricTitle}>Open Blockers</span>
            <span style={{ ...styles.metricVal, color: openBlockersCount > 0 ? 'var(--warning)' : 'inherit' }}>
              {openBlockersCount}
            </span>
            <span style={styles.metricSub}>{onlyBlockers ? 'Showing blockers only' : 'Click to filter reports'}</span>
          </div>
          <div style={styles.metricIconBox} className={openBlockersCount > 0 ? 'badge-warning' : 'badge-primary'}>
            <AlertTriangle size={20} />
          </div>
        </div>

        {/* Total Hours Card */}
        <div style={styles.metricCard} className="glass-card">
          <div style={styles.metricInfo}>
            <span style={styles.metricTitle}>Total Team Hours</span>
            <span style={styles.metricVal}>{totalHoursWorked} hrs</span>
            <span style={styles.metricSub}>Worked in {selectedWeek}</span>
          </div>
          <div style={styles.metricIconBox} className="badge-success">
            <Clock size={20} />
          </div>
        </div>

        {/* Active Projects Card */}
        <div style={styles.metricCard} className="glass-card">
          <div style={styles.metricInfo}>
            <span style={styles.metricTitle}>Active Projects</span>
            <span style={styles.metricVal}>{projects.length}</span>
            <span style={styles.metricSub}>Categorized tag options</span>
          </div>
          <div style={styles.metricIconBox} className="badge-primary">
            <Folder size={20} />
          </div>
        </div>

      </div>

      {/* Main Grid Layout */}
      <div style={styles.mainGrid}>
        
        {/* Left Side: Compliance Board & Activity Feed */}
        <div style={styles.leftColumn}>
          
          {/* Submission Checkboard */}
          <Card
            title={`Submission Checkboard (${selectedWeek})`}
            subtitle="Monitor compliance statuses of all team members."
            actions={<ListChecks size={18} style={{ color: 'var(--primary)' }} />}
            style={{ marginBottom: '32px' }}
          >
            <div style={styles.complianceGrid}>
              {teamComplianceStatus.map(statusObj => {
                const isReminded = remindedMembers[statusObj.memberId];
                return (
                  <div key={statusObj.memberId} style={styles.complianceRow}>
                    <div style={styles.memberMeta}>
                      <span style={styles.memberName}>{statusObj.memberName}</span>
                      <span style={styles.memberEmail}>{statusObj.email}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {statusObj.status === 'Submitted' && (
                        <span className="badge badge-success">Submitted</span>
                      )}
                      {statusObj.status === 'Late' && (
                        <span className="badge badge-danger">Late</span>
                      )}
                      {statusObj.status === 'Draft' && (
                        <span className="badge badge-warning">Draft Mode</span>
                      )}
                      {statusObj.status === 'Pending' && (
                        <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                          Pending
                        </span>
                      )}

                      {(statusObj.status === 'Pending' || statusObj.status === 'Draft') && (
                        <Button
                          variant="secondary"
                          onClick={() => handleSendReminder(statusObj.memberId, statusObj.memberName)}
                          style={{ ...styles.reminderBtn, display: 'flex', alignItems: 'center', gap: '6px' }}
                          disabled={isReminded}
                        >
                          <Mail size={12} />
                          <span>{isReminded ? 'Sent' : 'Remind'}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Activity / Report Feed */}
          <Card
            title="Consolidated Report Feed"
            subtitle={`Showing ${filteredFeedReports.length} filtered entries for ${selectedWeek}.`}
            actions={<ClipboardList size={18} style={{ color: 'var(--primary)' }} />}
          >
            {filteredFeedReports.length === 0 ? (
              <div style={styles.emptyFeed}>
                <ClipboardList size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                <p>No report entries found matching the filter criteria.</p>
              </div>
            ) : (
              <div style={styles.feedList}>
                {filteredFeedReports.map(rep => {
                  const isExpanded = expandedReportId === rep.id;
                  const isLate = rep.status === 'Late';
                  return (
                    <div key={rep.id} style={styles.feedCard}>
                      
                      <div
                        style={styles.feedHeader}
                        onClick={() => setExpandedReportId(isExpanded ? null : rep.id)}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={styles.feedMemberName}>{rep.userName}</h4>
                            {isLate && <span className="badge badge-danger" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>LATE</span>}
                          </div>
                          <span style={{ ...styles.feedProjectTag, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Folder size={12} />
                            <span>{rep.projectTag}</span>
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            <span>{rep.hoursWorked || 'N/A'} hrs</span>
                          </span>
                          <span style={styles.chevron}>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={styles.feedDetails}>
                          <div style={styles.feedBlock}>
                            <h5 style={styles.feedLabel}>Completed Tasks</h5>
                            <p style={styles.feedText}>{rep.tasksCompleted}</p>
                          </div>

                          <div style={styles.feedBlock}>
                            <h5 style={styles.feedLabel}>Planned for Next Week</h5>
                            <p style={styles.feedText}>{rep.tasksPlanned}</p>
                          </div>

                          {rep.blockers && rep.blockers.toLowerCase() !== 'none' && (
                            <div style={styles.feedBlock}>
                              <h5 style={{ ...styles.feedLabel, color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={14} />
                                <span>Active Blockers</span>
                              </h5>
                              <p style={{ ...styles.feedText, color: 'var(--warning)', fontWeight: '500' }}>
                                {rep.blockers}
                              </p>
                            </div>
                          )}

                          {rep.notes && (
                            <div style={styles.feedFooter}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Link size={12} />
                                <span>Notes/Reference: </span>
                              </span>
                              {rep.notes.startsWith('http') ? (
                                <a href={rep.notes} target="_blank" rel="noopener noreferrer" style={styles.feedLink}>
                                  {rep.notes}
                                </a>
                              ) : (
                                <span>{rep.notes}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Charts Pane */}
        <div style={styles.rightColumn}>
          <Card>
            <div style={styles.chartTabsHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={styles.chartSectionTitle}>Visual Insights</h3>
              </div>
              <div style={styles.chartTabs}>
                <button
                  onClick={() => setActiveChartTab('trend')}
                  style={{
                    ...styles.chartTabBtn,
                    ...(activeChartTab === 'trend' ? styles.activeChartTabBtn : {})
                  }}
                >
                  Trends
                </button>
                <button
                  onClick={() => setActiveChartTab('workload')}
                  style={{
                    ...styles.chartTabBtn,
                    ...(activeChartTab === 'workload' ? styles.activeChartTabBtn : {})
                  }}
                >
                  Workload
                </button>
                <button
                  onClick={() => setActiveChartTab('compliance')}
                  style={{
                    ...styles.chartTabBtn,
                    ...(activeChartTab === 'compliance' ? styles.activeChartTabBtn : {})
                  }}
                >
                  Compliance
                </button>
                <button
                  onClick={() => setActiveChartTab('roster')}
                  style={{
                    ...styles.chartTabBtn,
                    ...(activeChartTab === 'roster' ? styles.activeChartTabBtn : {})
                  }}
                >
                  Roster
                </button>
              </div>
            </div>

            {/* TAB CONTENT: Completed Tasks Trend Line/Area Chart */}
            {activeChartTab === 'trend' && (
              <div>
                <p style={styles.chartDesc}>Completed tasks trend line across the team (Weeks 24-28).</p>
                <div style={styles.chartWrapper}>
                  <svg width="100%" height="220" viewBox="0 0 400 220" style={styles.svg}>
                    <line x1="40" y1="20" x2="380" y2="20" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3" />
                    <line x1="40" y1="70" x2="380" y2="70" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3" />
                    <line x1="40" y1="120" x2="380" y2="120" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3" />
                    <line x1="40" y1="170" x2="380" y2="170" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3" />
                    
                    {(() => {
                      const points = trendData.map((d, i) => {
                        const x = 50 + i * 80;
                        const y = 170 - (d.taskCount / maxTrendTasks) * 140;
                        return { x, y, week: d.week, count: d.taskCount };
                      });
                      
                      const pathD = points.reduce((acc, p, i) => 
                        acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), '');
                      
                      const areaD = pathD + ` L ${points[points.length-1].x} 170 L ${points[0].x} 170 Z`;
                      
                      return (
                        <>
                          <defs>
                            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d={areaD} fill="url(#chartGlow)" />
                          <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
                          
                          {points.map((p, i) => (
                            <g key={i} className="tooltip">
                              <circle cx={p.x} cy={p.y} r="5" fill="var(--bg-secondary)" stroke="var(--primary)" strokeWidth="2.5" />
                              <text x={p.x} y={p.y - 12} textAnchor="middle" fill="var(--text-primary)" fontSize="10" fontWeight="600">
                                {p.count}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}

                    <line x1="40" y1="170" x2="380" y2="170" stroke="var(--text-tertiary)" strokeWidth="1" />
                    {trendData.map((d, i) => (
                      <text key={i} x={50 + i * 80} y="192" textAnchor="middle" fill="var(--text-secondary)" fontSize="9">
                        {d.week.split(',')[0]}
                      </text>
                    ))}
                  </svg>
                </div>
                
                <div style={styles.chartLegend}>
                  <div style={styles.legendRow}>
                    <div style={{ ...styles.legendDot, backgroundColor: 'var(--primary)' }} />
                    <span style={styles.legendText}>Tasks Completed (Quantity of action bullet items)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Workload / Task Distribution by Project */}
            {activeChartTab === 'workload' && (
              <div>
                <p style={styles.chartDesc}>Hours allocation by active category tags ({selectedWeek}).</p>
                <div style={styles.chartWrapper}>
                  {projectDistribution.length === 0 ? (
                    <div style={styles.emptyChart}>No hours submitted for this week.</div>
                  ) : (
                    <svg width="100%" height="220" viewBox="0 0 400 220" style={styles.svg}>
                      {projectDistribution.map((p, i) => {
                        const barWidth = (p.hours / maxProjectHours) * 260;
                        const y = 25 + i * 45;
                        return (
                          <g key={p.name}>
                            <text x="15" y={y + 16} fill="var(--text-secondary)" fontSize="9" fontWeight="600" textAnchor="start">
                              {p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name}
                            </text>
                            <rect x="110" y={y} width="260" height="22" rx="4" fill="var(--bg-tertiary)" />
                            <rect x="110" y={y} width={barWidth} height="22" rx="4" fill="var(--primary)" />
                            <text x={110 + barWidth + 8} y={y + 14} fill="var(--text-primary)" fontSize="9" fontWeight="700">
                              {p.hours}h
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </div>

                <div style={styles.chartLegend}>
                  <div style={styles.legendRow}>
                    <div style={{ ...styles.legendDot, backgroundColor: 'var(--primary)' }} />
                    <span style={styles.legendText}>Cumulative Hours worked per project Tag</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Compliance Gauge */}
            {activeChartTab === 'compliance' && (
              <div>
                <p style={styles.chartDesc}>Overall report completion status across {totalMembersCount} members ({selectedWeek}).</p>
                <div style={styles.chartWrapper}>
                  <div style={styles.donutContainer}>
                    <svg width="180" height="180" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-tertiary)" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="var(--primary)"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * complianceRate) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      />
                      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fill="var(--text-primary)" fontSize="16" fontWeight="700">
                        {complianceRate}%
                      </text>
                      <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" fill="var(--text-secondary)" fontSize="7" fontWeight="600">
                        SUBMITTED
                      </text>
                    </svg>

                    <div style={styles.complianceLegend}>
                      <div style={styles.legendRow}>
                        <div style={{ ...styles.legendDot, backgroundColor: 'var(--success)' }} />
                        <span style={styles.legendText}>{totalSubmittedCount} Submitted / Late</span>
                      </div>
                      <div style={styles.legendRow}>
                        <div style={{ ...styles.legendDot, backgroundColor: 'var(--warning)' }} />
                        <span style={styles.legendText}>{totalMembersCount - totalSubmittedCount} Pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Roster (Role Management) */}
            {activeChartTab === 'roster' && (
              <div>
                <p style={styles.chartDesc}>Manage team members and their access roles.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {members.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px' }}>No members found.</p>
                  ) : (
                    members.map(member => (
                      <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', color: 'var(--primary)', fontWeight: 'bold' }}>
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 2px 0' }}>{member.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{member.email}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <select
                            value={member.role === 'admin' || member.role === 'manager' ? 'MANAGER' : 'TEAM_MEMBER'}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            disabled={roleChanging[member.id] || member.id === currentUser?.id}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-secondary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.8rem',
                              outline: 'none',
                              cursor: roleChanging[member.id] || member.id === currentUser?.id ? 'not-allowed' : 'pointer',
                              opacity: roleChanging[member.id] || member.id === currentUser?.id ? 0.6 : 1
                            }}
                          >
                            <option value="TEAM_MEMBER">Team Member</option>
                            <option value="MANAGER">Manager / Admin</option>
                          </select>
                          {roleChanging[member.id] && <div className="spinner" style={{ width: '16px', height: '16px' }} />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* AI Copilot RAG Section */}
          <Card
            title="AI Management Assistant"
            subtitle="Ask Groq Llama 3.1 RAG about team reports, compliance, or blockers."
            actions={<Sparkles size={18} style={{ color: 'var(--primary)' }} />}
            style={{ marginTop: '32px' }}
          >
            <div style={styles.chatContainer}>
              <div style={styles.chatMessages}>
                {chatHistory.length === 0 ? (
                  <div style={styles.chatPlaceholder}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      No queries run yet. Click a preset prompt or type a custom question below.
                    </p>
                    <div style={styles.presetGrid}>
                      <button onClick={() => handleAskPreset("What are the most common blockers the team is facing this week?")} style={styles.presetBtn}>
                        What blockers exist?
                      </button>
                      <button onClick={() => handleAskPreset("Summarize the tasks completed by the team.")} style={styles.presetBtn}>
                        Summarize tasks
                      </button>
                      <button onClick={() => handleAskPreset("Identify any workload imbalances or high capacities.")} style={styles.presetBtn}>
                        Workload imbalances
                      </button>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((chat, idx) => (
                    <div key={idx} style={styles.chatBubbleGroup}>
                      <div style={styles.userBubble}>
                        <strong>You:</strong> {chat.question}
                      </div>
                      <div style={styles.aiBubble}>
                        <strong>Llama 3.1:</strong> {chat.answer}
                      </div>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div style={styles.typingIndicator}>
                    <span>AI is reading recent reports...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleAskCustom} style={styles.chatForm}>
                <InputField
                  placeholder="Ask about team speed, tasks or blockers..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                  style={{ marginBottom: 0, flex: 1 }}
                />
                <Button type="submit" loading={chatLoading} style={{ minHeight: '38px', padding: '0 16px' }}>
                  Ask
                </Button>
              </form>
            </div>
          </Card>
        </div>

      </div>

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
  deniedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '400px',
    padding: '24px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  deniedIcon: {
    fontSize: '3.5rem',
    marginBottom: '16px'
  },
  deniedTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--danger)'
  },
  deniedText: {
    fontSize: '0.90rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginTop: '12px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  metricCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px'
  },
  metricInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  metricTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  metricVal: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginTop: '6px'
  },
  metricSub: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    marginTop: '4px'
  },
  metricIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '28px',
    alignItems: 'start'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  rightColumn: {
    minWidth: 0
  },
  complianceGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  complianceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)'
  },
  memberMeta: {
    display: 'flex',
    flexDirection: 'column'
  },
  memberName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  memberEmail: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  reminderBtn: {
    padding: '4px 10px',
    fontSize: '0.75rem',
    borderRadius: '6px',
    minHeight: '28px'
  },
  emptyFeed: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: 'var(--text-tertiary)',
    gap: '8px'
  },
  feedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  feedCard: {
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    overflow: 'hidden'
  },
  feedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  feedMemberName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  feedProjectTag: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  chevron: {
    fontSize: '0.7rem',
    color: 'var(--text-tertiary)'
  },
  feedDetails: {
    padding: '16px',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-tertiary)'
  },
  feedBlock: {
    marginBottom: '12px'
  },
  feedLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '4px'
  },
  feedText: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    whiteSpace: 'pre-line'
  },
  feedFooter: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px dotted var(--border-color)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  feedLink: {
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: '500',
    wordBreak: 'break-all'
  },
  chartTabsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px'
  },
  chartSectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  chartTabs: {
    display: 'flex',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '2px',
    borderRadius: '8px'
  },
  chartTabBtn: {
    border: 'none',
    background: 'none',
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activeChartTabBtn: {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--primary)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  chartDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '16px'
  },
  chartWrapper: {
    minHeight: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  svg: {
    overflow: 'visible'
  },
  chartLegend: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-color)'
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  legendText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  emptyChart: {
    fontSize: '0.85rem',
    color: 'var(--text-tertiary)',
    textAlign: 'center'
  },
  donutContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    width: '100%'
  },
  complianceLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: '350px'
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  chatPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    gap: '12px',
    padding: '16px'
  },
  presetGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    maxWidth: '280px',
    marginTop: '8px'
  },
  presetBtn: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  },
  chatBubbleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    padding: '8px 12px',
    borderRadius: '12px 12px 0 12px',
    fontSize: '0.8rem',
    maxWidth: '85%',
    lineHeight: '1.4'
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    padding: '8px 12px',
    borderRadius: '12px 12px 12px 0',
    fontSize: '0.8rem',
    maxWidth: '85%',
    lineHeight: '1.4',
    border: '1px solid var(--border-color)',
    whiteSpace: 'pre-line'
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic'
  },
  chatForm: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  }
};
