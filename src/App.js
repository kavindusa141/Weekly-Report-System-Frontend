import React, { useState, useEffect } from 'react';
import './App.css';

// Views
import LandingView from './components/LandingView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import ReportsView from './components/ReportsView';
import UsersView from './components/UsersView';

// UI Layout & Alerts
import Sidebar from './components/Sidebar';
import Toast from './components/ui/Toast';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // landing | login | register | dashboard | reports | projects
  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Initialize DB and load active session on mount
  useEffect(() => {
    // Load persisted tokens & user data
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setCurrentUser(parsedUser);
        setCurrentView(parsedUser.role === 'manager' ? 'dashboard' : 'reports');
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentView('landing');
      }
    } else {
      setCurrentView('landing');
    }

    // Set preference theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const triggerToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (response) => {
    setToken(response.token);
    setCurrentUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    setCurrentView(response.user.role === 'manager' ? 'dashboard' : 'reports');
    triggerToast(`Welcome back, ${response.user.name}!`, 'success');
  };

  const handleRegisterSuccess = (response) => {
    setToken(response.token);
    setCurrentUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Self-registered defaults to reports workspace
    setCurrentView('reports');
    triggerToast(`Account created successfully. Welcome, ${response.user.name}!`, 'success');
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    

    setCurrentView('landing');
    triggerToast('You have successfully signed out.', 'success');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
  };

  // Render Page Content
  const renderViewContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView onNavigate={setCurrentView} />;
      case 'login':
        return <LoginView onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentView} />;
      case 'register':
        return <RegisterView onRegisterSuccess={handleRegisterSuccess} onNavigate={setCurrentView} />;
      
      // Protected App Screens
      case 'dashboard':
        return <DashboardView currentUser={currentUser} token={token} triggerToast={triggerToast} />;
      case 'projects':
        return <ProjectsView currentUser={currentUser} token={token} triggerToast={triggerToast} />;
      case 'reports':
        return <ReportsView currentUser={currentUser} token={token} triggerToast={triggerToast} />;
      case 'users':
        return <UsersView currentUser={currentUser} token={token} triggerToast={triggerToast} />;
      default:
        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>404 Page Not Found</h2>
            <button onClick={() => setCurrentView('landing')} className="btn btn-primary" style={{ marginTop: '16px' }}>
              Back to Home
            </button>
          </div>
        );
    }
  };

  // Check if active view is a public auth / landing screen
  const isPublicRoute = ['landing', 'login', 'register'].includes(currentView);

  if (isPublicRoute) {
    return (
      <div style={styles.publicContainer}>
        {renderViewContent()}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'info' })}
        />
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <Sidebar
        currentUser={currentUser}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main style={styles.mainContent}>
        {renderViewContent()}
      </main>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}

const styles = {
  publicContainer: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)'
  },
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  },
  mainContent: {
    marginLeft: '260px',
    flex: 1,
    padding: '36px 40px',
    minWidth: 0
  }
};

export default App;
