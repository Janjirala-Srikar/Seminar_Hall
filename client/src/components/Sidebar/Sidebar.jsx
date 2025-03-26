import React from 'react';
import { FaTachometerAlt, FaCalendarCheck, FaUsers, FaDoorOpen, 
         FaChartBar, FaCog, FaBars, FaChevronRight } from 'react-icons/fa';
import '../Sidebar/Sidebar.css';

const Sidebar = ({ collapsed, toggleSidebar, activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'bookingRequests', label: 'Booking Requests', icon: FaCalendarCheck },
    { id: 'adminClubs', label: 'Admins & Clubs', icon: FaUsers },
    { id: 'seminarHalls', label: 'Seminar Halls', icon: FaDoorOpen },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];
  
  return (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Toggle button section */}
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars size={18} />
        </button>
      </div>
      
      {/* User profile section */}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <span>DR</span>
        </div>
        {!collapsed && (
          <div className="profile-info">
            <h6 className="mb-0 fs-6">Dr. Ramanathan</h6>
            <span className="text-muted fs-7">Director</span>
          </div>
        )}
      </div>
      
      {/* Navigation items */}
      <div className="sidebar-nav">
        {navItems.map(item => (
          <div 
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''} ${collapsed ? 'nav-item-collapsed' : ''}`}
            onClick={() => {
              console.log("Setting active section:", item.id); // Debugging log
              setActiveSection(item.id);
            }}
          >
            <div className="nav-item-content">
              <item.icon className={`nav-icon ${collapsed ? 'icon-centered' : ''}`} size={16} />
              {!collapsed && <span className="nav-label fs-6">{item.label}</span>}
            </div>
            {!collapsed && <FaChevronRight className={`nav-arrow ${activeSection === item.id ? 'visible' : ''}`} size={12} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;