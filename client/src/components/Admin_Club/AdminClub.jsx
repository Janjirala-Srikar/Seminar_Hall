import React, { useState } from 'react';
import { FaCircle, FaUserShield, FaUsers } from 'react-icons/fa';
import './AdminClub.css'; // Custom CSS file

const AdminClub = () => {
  const sampleData = {
    adminRequests: [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        department: "Computer Science",
        email: "sarah.j@university.edu",
        status: "pending",
        requestDate: "2024-02-15"
      },
      {
        id: 2,
        name: "Prof. Michael Chen",
        department: "Electronics",
        email: "m.chen@university.edu",
        status: "approved",
        requestDate: "2024-02-14"
      }
    ],
    clubRequests: [
      {
        id: 1,
        clubName: "Tech Innovation Club",
        coordinatorName: "John Smith",
        department: "Computer Science",
        email: "tech.club@university.edu",
        status: "pending",
        requestDate: "2024-02-16"
      },
      {
        id: 2,
        clubName: "Robotics Society",
        coordinatorName: "Emma Watson",
        department: "Mechanical",
        email: "robotics@university.edu",
        status: "approved",
        requestDate: "2024-02-13"
      }
    ]
  };

  const [activeTab, setActiveTab] = useState('admin');
  const [adminStatus, setAdminStatus] = useState('all');
  const [clubStatus, setClubStatus] = useState('all');

  const filterRequests = (requests, statusFilter) => {
    return requests.filter(request => 
      statusFilter === 'all' || request.status === statusFilter
    );
  };

  const getPendingCount = (requests) => {
    return requests.filter(request => request.status === 'pending').length;
  };

  const StatusDropdown = ({ value, onChange, counts }) => (
    <select 
      className="form-select custom-select" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">All ({counts.all})</option>
      <option value="pending">Pending ({counts.pending})</option>
      <option value="approved">Approved ({counts.approved})</option>
      <option value="rejected">Rejected ({counts.rejected})</option>
    </select>
  );

  const StatusIndicator = ({ status }) => {
    const statusColors = {
      pending: 'var(--warning)',
      approved: 'var(--success)',
      rejected: 'var(--danger)'
    };
    
    return (
      <span className="status-indicator">
        <FaCircle style={{ color: statusColors[status] }} />
        <span className={`status-text status-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </span>
    );
  };

  const ActionButtons = ({ status }) => (
    <div className="action-buttons">
      {status !== 'approved' && (
        <button className="btn btn-approve">
          Accept
        </button>
      )}
      {status !== 'rejected' && (
        <button className="btn btn-reject">
          Reject
        </button>
      )}
    </div>
  );

  const AdminRequestsContent = () => {
    const counts = {
      all: sampleData.adminRequests.length,
      pending: sampleData.adminRequests.filter(r => r.status === 'pending').length,
      approved: sampleData.adminRequests.filter(r => r.status === 'approved').length,
      rejected: sampleData.adminRequests.filter(r => r.status === 'rejected').length
    };

    return (
      <div className="request-content">
        <div className="header-container">
          <div className="section-header">
            <h5>Admin Access Requests</h5>
            <p className="text-muted">Manage requests for admin privileges</p>
          </div>
          <StatusDropdown value={adminStatus} onChange={setAdminStatus} counts={counts} />
        </div>
        <div className="table-container">
          <table className="table custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterRequests(sampleData.adminRequests, adminStatus).map(request => (
                <tr key={`admin-${request.id}`}>
                  <td className="name-cell">{request.name}</td>
                  <td>{request.department}</td>
                  <td>{request.email}</td>
                  <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                  <td>
                    <StatusIndicator status={request.status} />
                  </td>
                  <td>
                    <ActionButtons status={request.status} />
                  </td>
                </tr>
              ))}
              {filterRequests(sampleData.adminRequests, adminStatus).length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="empty-state">
                      <p>No admin requests matching the selected filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ClubRequestsContent = () => {
    const counts = {
      all: sampleData.clubRequests.length,
      pending: sampleData.clubRequests.filter(r => r.status === 'pending').length,
      approved: sampleData.clubRequests.filter(r => r.status === 'approved').length,
      rejected: sampleData.clubRequests.filter(r => r.status === 'rejected').length
    };

    return (
      <div className="request-content">
        <div className="header-container">
          <div className="section-header">
            <h5>Club Registration Requests</h5>
            <p className="text-muted">Manage club registration applications</p>
          </div>
          <StatusDropdown value={clubStatus} onChange={setClubStatus} counts={counts} />
        </div>
        <div className="table-container">
          <table className="table custom-table">
            <thead>
              <tr>
                <th>Club Name</th>
                <th>Coordinator</th>
                <th>Department</th>
                <th>Email</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterRequests(sampleData.clubRequests, clubStatus).map(request => (
                <tr key={`club-${request.id}`}>
                  <td className="name-cell">{request.clubName}</td>
                  <td>{request.coordinatorName}</td>
                  <td>{request.department}</td>
                  <td>{request.email}</td>
                  <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                  <td>
                    <StatusIndicator status={request.status} />
                  </td>
                  <td>
                    <ActionButtons status={request.status} />
                  </td>
                </tr>
              ))}
              {filterRequests(sampleData.clubRequests, clubStatus).length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="empty-state">
                      <p>No club requests matching the selected filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h4>Request Management</h4>
          <p className="text-muted">Review and manage pending admin and club requests</p>
        </div>
        
        {/* Custom Navigation Tabs */}
        <ul className="custom-tabs">
          <li className={`tab-item ${activeTab === 'admin' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('admin')}>
              <FaUserShield className="tab-icon" />
              <span>Admin Requests</span>
              {getPendingCount(sampleData.adminRequests) > 0 && (
                <span className="badge-count">
                  {getPendingCount(sampleData.adminRequests)}
                </span>
              )}
            </button>
          </li>
          <li className={`tab-item ${activeTab === 'club' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('club')}>
              <FaUsers className="tab-icon" />
              <span>Club Requests</span>
              {getPendingCount(sampleData.clubRequests) > 0 && (
                <span className="badge-count">
                  {getPendingCount(sampleData.clubRequests)}
                </span>
              )}
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === 'admin' ? <AdminRequestsContent /> : <ClubRequestsContent />}
        </div>
      </div>
    </div>
  );
};

export default AdminClub;