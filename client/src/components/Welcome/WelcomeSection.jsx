import React from 'react';
import { FaChartLine, FaBell, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import './WelcomeSection.css';

const WelcomeSection = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const quickActions = [
    { icon: <FaUsers />, title: 'User Management', description: 'Add or modify system users' },
    { icon: <FaChartLine />, title: 'Analytics', description: 'View system performance metrics' },
    { icon: <FaCalendarAlt />, title: 'Schedule', description: 'Manage upcoming events' },
    { icon: <FaBell />, title: 'Notifications', description: 'Review system alerts' }
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-header ">
          <div className="welcome-intro">
            <h2 className="welcome-title">Welcome to Director Dashboard</h2>
            <p className="welcome-subtitle">Select a section from the sidebar to manage different aspects of the system.</p>
            <p className="welcome-date">{currentDate}</p>
          </div>
          <div className="welcome-graphics">
            <div className="welcome-illustration"></div>
            
          </div>
        </div>
        
        <div className="quick-actions">
          <h3 className="actions-title">Quick Actions</h3>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div className="action-card" key={index}>
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h4 className="action-title">{action.title}</h4>
                  <p className="action-description">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="system-status">
          <div className="status-header">
            <h3 className="status-title">System Status</h3>
            <span className="status-badge">All Systems Operational</span>
          </div>
          <div className="status-metrics">
            <div className="metric-card">
              <div className="metric-value">99.9%</div>
              <div className="metric-label">Uptime</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">24</div>
              <div className="metric-label">Active Users</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">8</div>
              <div className="metric-label">Pending Tasks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;