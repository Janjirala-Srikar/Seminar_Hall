import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../TopNavigation';
import WelcomeSection from '../Welcome/WelcomeSection';
import AdminClub from '../Admin_Club/AdminClub';
import SeminarHall from '../Seminar_Hall/SeminarHall';
import 'bootstrap/dist/css/bootstrap.min.css';
import RequestDashboard from '../Request/RequestDashBoard';

const DirectorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderContent = () => {
    console.log("Rendering content for:", activeSection); 
    switch (activeSection) {
      case 'adminClubs':
        return <AdminClub />;
      case 'seminarHalls':
        return <SeminarHall />;
      case 'bookingRequests':
        return <RequestDashboard/>
      case 'dashboard':
      default:
        return <WelcomeSection />;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar 
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <div className={`flex-grow-1 min-vh-100 ${collapsed ? 'ps-0' : 'ps-16'}`}>
        <TopNavigation activeSection={activeSection} />
        
        <div className="">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
