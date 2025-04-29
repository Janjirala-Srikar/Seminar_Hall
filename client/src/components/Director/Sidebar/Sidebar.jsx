import React from 'react';
import './Sidebar.css';
import { FaHome, FaCalendarAlt, FaClipboardList, FaUserFriends, FaCog } from 'react-icons/fa';

function Sidebar({ collapsed, activeSection, setActiveSection }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FaHome className="sidebar-icon" />
    },
   {
     id: 'bookingCalender',
    label: 'Booking Calendar',
     icon: <FaCalendarAlt className="sidebar-icon" />
   },
    {
      id: 'bookingRequests',
      label: 'Booking Requests',
      icon: <FaClipboardList className="sidebar-icon" />
    },
    {
      id: 'clubRequests',
      label: 'Club Requests',
      icon: <FaUserFriends className="sidebar-icon" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <FaCog className="sidebar-icon" />
    }
  ];

  return (
    <div className={`director-sidebar ${collapsed ? 'director-sidebar-collapsed' : ''}`}>
      <div className="director-sidebar-content">
        <ul className="director-sidebar-menu">
          {menuItems.map(item => (
            <li 
              key={item.id}
              className={activeSection === item.id ? 'director-active' : ''}
              onClick={() => setActiveSection(item.id)}
            >
              <div className="director-menu-item">
                {item.icon}
                <span className="director-menu-text">{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;