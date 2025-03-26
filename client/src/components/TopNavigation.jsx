import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const TopNavigation = ({ activeSection }) => {
  const sectionTitles = {
    dashboard: "Dashboard",
    bookingRequests: "Booking Requests",
    adminClubs: "Admins & Clubs",
    seminarHalls: "Seminar Halls",
    reports: "Reports",
    settings: "Settings"
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <h4 className="navbar-brand mb-0">{sectionTitles[activeSection] || "Dashboard"}</h4>
        
        <div className="d-flex align-items-center gap-4">
          <FaUserCircle className="text-muted fs-4" role="button" />
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
