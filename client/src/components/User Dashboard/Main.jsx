import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { getAuth, signOut } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookingCalender from '../Calender/BookingCalender'
import { FaHome, FaCalendarCheck, FaListAlt, FaCog, FaSignOutAlt, FaUser, FaBars } from 'react-icons/fa';

function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [activePage, setActivePage] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  
  useEffect(() => {
    // Get current user from Firebase Auth
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUserEmail(user.email || 'No email available');
      } else {
        // User is signed out, redirect to home/login page
        navigate('/');
      }
    });

    // Check screen size on initial load
    handleResize();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate, auth]);

  const handleResize = () => {
    if (window.innerWidth < 992) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The navigation to '/' will happen automatically due to the auth state change
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Render the selected component
  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeComponent />; 
      case 'bookHall':
        return <BookingCalender />; 
      case 'manageBookings':
        return <ManageBookingsComponent />; 
      case 'settings':
        return <SettingsComponent />; 
      default:
        return <HomeComponent />; 
    }
  };

  // Placeholder components
  const HomeComponent = () => (
    <div className=""></div>
  );

  const ManageBookingsComponent = () => (
    <div className=""></div>
  );
  
  const SettingsComponent = () => (
    <div className=""></div>
  );

  return (
    <div className="hbs_dashboard-container">
      {/* Top Navigation Bar */}
      <nav className="hbs_top-navbar">
        <div className="hbs_navbar-container">
          <div className="hbs_navbar-left">
            <button 
              className="hbs_sidebar-toggle" 
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
            <div className="hbs_brand">
              <h3>Hall Booking System</h3>
            </div>
          </div>
          <div className="hbs_navbar-right">
            <div className="hbs_user-info">
              <FaUser className="hbs_user-icon" />
              <span className="hbs_user-email">{userEmail}</span>
              <button 
                onClick={handleLogout}
                className="hbs_logout-btn"
              >
                <FaSignOutAlt />
                <span className="hbs_btn-text d-none d-md-inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="hbs_content-wrapper">
        {/* Sidebar */}
        <div className={`hbs_sidebar ${sidebarCollapsed ? 'hbs_sidebar-collapsed' : ''}`}>
          <div className="hbs_sidebar-content">
            <ul className="hbs_sidebar-menu">
              <li 
                className={activePage === 'home' ? 'hbs_active' : ''} 
                onClick={() => setActivePage('home')}
              >
                <div className="hbs_menu-item">
                  <FaHome className="hbs_sidebar-icon" />
                  <span className="hbs_menu-text">Dashboard</span>
                </div>
              </li>
              <li 
                className={activePage === 'bookHall' ? 'hbs_active' : ''} 
                onClick={() => setActivePage('bookHall')}
              >
                <div className="hbs_menu-item">
                  <FaCalendarCheck className="hbs_sidebar-icon" />
                  <span className="hbs_menu-text">Book a Hall</span>
                </div>
              </li>
              <li 
                className={activePage === 'manageBookings' ? 'hbs_active' : ''} 
                onClick={() => setActivePage('manageBookings')}
              >
                <div className="hbs_menu-item">
                  <FaListAlt className="hbs_sidebar-icon" />
                  <span className="hbs_menu-text">Manage Bookings</span>
                </div>
              </li>
              <li 
                className={activePage === 'settings' ? 'hbs_active' : ''} 
                onClick={() => setActivePage('settings')}
              >
                <div className="hbs_menu-item">
                  <FaCog className="hbs_sidebar-icon" />
                  <span className="hbs_menu-text">Settings</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`hbs_main-content ${sidebarCollapsed ? 'hbs_content-expanded' : ''}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;