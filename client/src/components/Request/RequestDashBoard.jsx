import React, { useState } from 'react';
import { BsCheckCircle, BsXCircle, BsClock, BsCollection } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Request/RequestDashBoard.css';

const RequestDashboard = () => {
  const [activeView, setActiveView] = useState('all');
  const [requests, setRequests] = useState([
    {
      id: 1,
      title: 'Annual Technical Symposium',
      department: 'CS Department',
      venue: 'Main Auditorium',
      date: 'Mar 15, 2025',
      time: '9:00 AM - 5:00 PM',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Photography Club Exhibition',
      department: 'Photography Club',
      venue: 'Exhibition Hall',
      date: 'Mar 18-20, 2025',
      time: 'All Day',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Guest Lecture: AI Ethics',
      department: 'Philosophy Department',
      venue: 'Seminar Hall B',
      date: 'Mar 22, 2025',
      time: '2:00 PM - 4:00 PM',
      status: 'pending'
    }
  ]);

  const stats = {
    all: requests.length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    waitlisted: requests.filter(r => r.status === 'waitlisted').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  const handleStatusChange = (id, newStatus) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  const StatCard = ({ title, count, icon, color, view }) => (
    <div 
      className={`stat-card ${activeView === view ? 'active' : ''}`}
      onClick={() => setActiveView(view)}
    >
      <div className={`icon-wrapper ${color}`}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{count}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  const RequestCard = ({ request }) => {
    const getActions = () => {
      switch (request.status) {
        case 'pending':
          return (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleStatusChange(request.id, 'accepted')}
              >
                <BsCheckCircle /> Accept
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleStatusChange(request.id, 'waitlisted')}
              >
                <BsClock /> Waitlist
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleStatusChange(request.id, 'rejected')}
              >
                <BsXCircle /> Reject
              </button>
            </>
          );
        case 'accepted':
          return (
            <>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleStatusChange(request.id, 'waitlisted')}
              >
                <BsClock /> Move to Waitlist
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleStatusChange(request.id, 'rejected')}
              >
                <BsXCircle /> Reject
              </button>
            </>
          );
        case 'waitlisted':
          return (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleStatusChange(request.id, 'accepted')}
              >
                <BsCheckCircle /> Accept
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleStatusChange(request.id, 'rejected')}
              >
                <BsXCircle /> Reject
              </button>
            </>
          );
        case 'rejected':
          return (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleStatusChange(request.id, 'accepted')}
              >
                <BsCheckCircle /> Accept
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleStatusChange(request.id, 'waitlisted')}
              >
                <BsClock /> Move to Waitlist
              </button>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="request-card">
        <div className="card-header-custom">
          <h5>{request.title}</h5>
          <span className={`status-badge status-${request.status}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
        
        <div className="card-details">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Department:</strong> {request.department}</p>
              <p><strong>Venue:</strong> {request.venue}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Date:</strong> {request.date}</p>
              <p><strong>Time:</strong> {request.time}</p>
            </div>
          </div>
        </div>

        <div className="card-actions">
          {getActions()}
        </div>
      </div>
    );
  };

  const filteredRequests = activeView === 'all' 
    ? requests 
    : requests.filter(request => request.status === activeView);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Request Dashboard</h2>
      
      <div className="stats-grid">
        <StatCard 
          title="All Requests"
          count={stats.all}
          icon={<BsCollection />}
          color="blue"
          view="all"
        />
        <StatCard 
          title="Accepted"
          count={stats.accepted}
          icon={<BsCheckCircle />}
          color="green"
          view="accepted"
        />
        <StatCard 
          title="Waitlisted"
          count={stats.waitlisted}
          icon={<BsClock />}
          color="yellow"
          view="waitlisted"
        />
        <StatCard 
          title="Rejected"
          count={stats.rejected}
          icon={<BsXCircle />}
          color="red"
          view="rejected"
        />
      </div>

      <div className="requests-section">
        <h3 className="section-title">
          {activeView.charAt(0).toUpperCase() + activeView.slice(1)} Requests
        </h3>
        <div className="requests-grid">
          {filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
          {filteredRequests.length === 0 && (
            <div className="no-requests">
              No {activeView} requests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDashboard;