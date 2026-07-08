const BASE_URL = 'http://localhost:5001/api';

// Map between frontend selections and backend date format
const WEEK_MAP = {
  'July 06 - July 12, 2026': { start: '2026-07-06', end: '2026-07-12' },
  'June 29 - July 05, 2026': { start: '2026-06-29', end: '2026-07-05' },
  'June 22 - June 28, 2026': { start: '2026-06-22', end: '2026-06-28' },
  'June 15 - June 21, 2026': { start: '2026-06-15', end: '2026-06-21' },
  'June 08 - June 14, 2026': { start: '2026-06-08', end: '2026-06-14' }
};

const getDatesForWeek = (weekStr) => {
  if (WEEK_MAP[weekStr]) {
    return WEEK_MAP[weekStr];
  }
  try {
    const parts = weekStr.split(' - ');
    const startStr = parts[0];
    const endStr = parts[1].split(',')[0];
    const yearStr = weekStr.split(',')[1]?.trim() || '2026';
    return {
      start: new Date(`${startStr} ${yearStr}`).toISOString().split('T')[0],
      end: new Date(`${endStr} ${yearStr}`).toISOString().split('T')[0]
    };
  } catch (e) {
    return {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    };
  }
};

const getWeekStrFromDates = (startDate, endDate) => {
  if (!startDate) return 'July 06 - July 12, 2026';
  const startIso = new Date(startDate).toISOString().split('T')[0];
  for (const [weekStr, dates] of Object.entries(WEEK_MAP)) {
    if (dates.start === startIso) {
      return weekStr;
    }
  }
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = ['June', 'June', 'June', 'July', 'July', 'July', 'July', 'August'];
    const formatPart = (d) => `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
    return `${formatPart(start)} - ${formatPart(end)}, ${start.getFullYear()}`;
  } catch (e) {
    return 'July 06 - July 12, 2026';
  }
};

// Role translation
const mapRoleToFrontend = (backendRole) => {
  if (backendRole === 'MANAGER' || backendRole === 'ADMIN') {
    return 'manager';
  }
  return 'member';
};



// Project mapping
const mapProjectToFrontend = (p) => ({
  id: p._id,
  name: p.name,
  type: p.type || 'PROJECT',
  description: p.description || ''
});

// User mapping
const mapUserToFrontend = (u) => ({
  id: u._id,
  name: `${u.firstName} ${u.lastName}`,
  email: u.email,
  role: mapRoleToFrontend(u.role)
});

// Report mapping
const mapReportToFrontend = (r) => {
  const userId = r.user?._id || r.user || '';
  const userName = r.user?.firstName && r.user?.lastName 
    ? `${r.user.firstName} ${r.user.lastName}` 
    : (r.userName || 'Team Member');
    
  const projectTag = r.project?.name || (typeof r.project === 'string' ? r.project : 'Internal Tooling');
  
  let frontendStatus = 'Draft';
  if (r.status === 'SUBMITTED') frontendStatus = 'Submitted';
  if (r.status === 'LATE') frontendStatus = 'Late';

  return {
    id: r._id,
    userId,
    userName,
    week: getWeekStrFromDates(r.weekStartDate, r.weekEndDate),
    projectId: r.project?._id || r.project,
    projectTag,
    tasksCompleted: r.tasksCompleted,
    tasksPlanned: r.tasksPlanned,
    blockers: r.blockers,
    hoursWorked: r.hoursWorked || '',
    notes: r.notes || '',
    status: frontendStatus,
    submittedAt: r.submittedAt || r.createdAt
  };
};

const request = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  // Authenticate user & return token
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    return {
      token: data.token,
      user: {
        id: data._id,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: mapRoleToFrontend(data.role)
      }
    };
  },

  // Register new member user & return token
  register: async (name, email, password) => {
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || 'Member';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        role: 'TEAM_MEMBER'
      })
    });

    return {
      token: data.token,
      user: {
        id: data._id,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: mapRoleToFrontend(data.role)
      }
    };
  },

  // Update a user's role (Protected: Manager/Admin only)
  updateUserRole: async (token, userId, backendRole) => {
    const data = await request(`/auth/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        role: backendRole
      })
    });
    return mapUserToFrontend(data);
  },

  // Fetch Projects List (Requires active token)
  getProjects: async (token) => {
    const data = await request('/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data.map(mapProjectToFrontend);
  },

  // Save Project (Protected: Manager only RBAC check)
  saveProject: async (token, project) => {
    const isUpdate = !!project.id;
    const url = isUpdate ? `/projects/${project.id}` : '/projects';
    
    const data = await request(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: project.name,
        type: 'PROJECT',
        description: project.description
      })
    });

    return mapProjectToFrontend(data);
  },

  // Delete Project (Protected: Manager only RBAC check)
  deleteProject: async (token, projectId) => {
    await request(`/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return { success: true };
  },

  // Fetch Team Members (Protected: Manager only)
  getMembers: async (token) => {
    const data = await request('/auth/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data.map(mapUserToFrontend);
  },

  // Fetch Reports (Protected: RBAC enforces filter scoping)
  getReports: async (token, userRole) => {
    // If the user is a manager, load `/reports` to get all team reports.
    // If the user is a team member, load `/reports/my-reports` to get their own.
    const url = userRole === 'manager' ? '/reports' : '/reports/my-reports';
    const data = await request(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data.map(mapReportToFrontend);
  },

  // Save Report (Requires active token, assigns user automatically)
  saveReport: async (token, report) => {
    const isUpdate = !!report.id;
    const url = isUpdate ? `/reports/${report.id}` : '/reports';
    
    // Resolve dates
    const dates = getDatesForWeek(report.week);
    
    // Resolve project ID from name tag
    // Since frontend sends category tag string, we need to locate its ObjectId.
    // Let's load the active project catalog to resolve the tag to its ObjectId.
    const projects = await request('/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const matchedProject = projects.find(p => p.name.toLowerCase() === report.projectTag.toLowerCase());
    if (!matchedProject) {
      throw new Error(`Project tag "${report.projectTag}" not found in database catalog.`);
    }

    let backendStatus = 'PENDING'; // Draft
    if (report.status === 'Submitted') backendStatus = 'SUBMITTED';
    if (report.status === 'Late') backendStatus = 'LATE';

    const data = await request(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        project: matchedProject._id,
        weekStartDate: dates.start,
        weekEndDate: dates.end,
        tasksCompleted: report.tasksCompleted,
        tasksPlanned: report.tasksPlanned,
        blockers: report.blockers || 'None',
        hoursWorked: report.hoursWorked ? parseFloat(report.hoursWorked) : null,
        notes: report.notes || '',
        status: backendStatus
      })
    });

    return mapReportToFrontend(data);
  },

  // AI assistant chat endpoint (Protected)
  askAi: async (token, question) => {
    const data = await request('/ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ question })
    });
    return data; // returns { question, answer }
  }
};
