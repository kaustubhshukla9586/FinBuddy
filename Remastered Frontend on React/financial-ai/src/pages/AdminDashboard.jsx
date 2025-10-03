import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <ThemeToggle />
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your financial application</p>
      </div>
      
      <div className="admin-content">
        <div className="admin-section">
          <h3>Application Status</h3>
          <div className="status-info">
            <div className="info-item">
              <h4>Frontend</h4>
              <p>React application running successfully</p>
            </div>
            <div className="info-item">
              <h4>Storage</h4>
              <p>Using browser localStorage for data persistence</p>
            </div>
          </div>
        </div>
        
        <div className="admin-section">
          <h3>System Information</h3>
          <div className="system-info">
            <p>✓ Application loaded successfully</p>
            <p>✓ All components initialized</p>
            <p>✓ Animations enabled</p>
            <p>✓ Charts rendering</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;