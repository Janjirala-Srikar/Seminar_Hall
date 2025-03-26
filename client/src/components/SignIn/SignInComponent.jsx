import React, { useState, useEffect } from 'react';
import './signin.css';

function SigInComponent() {
  const [activeTab, setActiveTab] = useState('user');
  const [currentPage, setCurrentPage] = useState('login');
  const [animationState, setAnimationState] = useState('enter');
  const [inputFocus, setInputFocus] = useState({
    facultyId: false,
    facultyPassword: false,
    adminEmail: false,
    adminPassword: false,
    clubName: false,
    clubEmail: false,
    facultyCoordinator: false
  });

  // Handle page transitions with animation
  const changePage = (page) => {
    setAnimationState('exit');
    
    setTimeout(() => {
      setCurrentPage(page);
      setAnimationState('enter');
    }, 400);
  };

  const handleTabChange = (tab) => {
    // Animate tab change
    setActiveTab(tab);
  };

  const handleInputFocus = (field, isFocused) => {
    setInputFocus(prev => ({
      ...prev,
      [field]: isFocused
    }));
  };

  // Render the login page with tabs
  const renderLoginPage = () => (
    <div className={`login-wrapper ${animationState === 'enter' ? 'page-enter' : 'page-exit'}`}>
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => handleTabChange('user')}
          >
            <span className="tab-text">User</span>
          </button>
          <button 
            className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
          >
            <span className="tab-text">Admin</span>
          </button>
          <div 
            className="tab-indicator" 
            style={{ transform: `translateX(${activeTab === 'user' ? '0' : '100'}%)` }} 
          />
        </div>
      </div>

      <div className="card login-card">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          
          {activeTab === 'user' ? (
            <form className="login-form">
              <div className={`form-group ${inputFocus.facultyId ? 'focused' : ''}`}>
                <label htmlFor="facultyId">Faculty ID</label>
                <input
                  type="text"
                  id="facultyId"
                  placeholder="Enter Faculty ID"
                  onFocus={() => handleInputFocus('facultyId', true)}
                  onBlur={() => handleInputFocus('facultyId', false)}
                />
                <div className="focus-border"></div>
              </div>
              <div className={`form-group ${inputFocus.facultyPassword ? 'focused' : ''}`}>
                <label htmlFor="facultyPassword">Password</label>
                <input
                  type="password"
                  id="facultyPassword"
                  placeholder="Enter password"
                  onFocus={() => handleInputFocus('facultyPassword', true)}
                  onBlur={() => handleInputFocus('facultyPassword', false)}
                />
                <div className="focus-border"></div>
              </div>
              <button 
                type="submit" 
                className="btn-primary"
              >
                Login
              </button>
              
              <div className="form-footer">
                <a href="#" className="form-link">Forgot password?</a>
                <button 
                  type="button" 
                  className="club-link"
                  onClick={() => changePage('club')}
                >
                  Are you a club?
                </button>
              </div>
            </form>
          ) : (
            <form className="login-form">
              <div className={`form-group ${inputFocus.adminEmail ? 'focused' : ''}`}>
                <label htmlFor="adminEmail">Email</label>
                <input
                  type="email"
                  id="adminEmail"
                  placeholder="Enter email"
                  onFocus={() => handleInputFocus('adminEmail', true)}
                  onBlur={() => handleInputFocus('adminEmail', false)}
                />
                <div className="focus-border"></div>
              </div>
              <div className={`form-group ${inputFocus.adminPassword ? 'focused' : ''}`}>
                <label htmlFor="adminPassword">Password</label>
                <input
                  type="password"
                  id="adminPassword"
                  placeholder="Enter password"
                  onFocus={() => handleInputFocus('adminPassword', true)}
                  onBlur={() => handleInputFocus('adminPassword', false)}
                />
                <div className="focus-border"></div>
              </div>
              <button 
                type="submit" 
                className="btn-primary"
              >
                Login
              </button>
              
              <div className="form-footer">
                <a href="#" className="form-link">Forgot password?</a>
                <button 
                  type="button" 
                  className="club-link"
                  onClick={() => changePage('club')}
                >
                  Are you a club?
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  // Render the club registration page
  const renderClubPage = () => (
    <div className={`login-wrapper ${animationState === 'enter' ? 'page-enter' : 'page-exit'}`}>
      <div className="card club-card">
        <div className="card-body">
          <h2 className="card-title">Club Details</h2>
          <form className="login-form">
            <div className={`form-group ${inputFocus.clubName ? 'focused' : ''}`}>
              <label htmlFor="clubName">Club Name</label>
              <input
                type="text"
                id="clubName"
                placeholder="Enter club name"
                onFocus={() => handleInputFocus('clubName', true)}
                onBlur={() => handleInputFocus('clubName', false)}
              />
              <div className="focus-border"></div>
            </div>
            <div className={`form-group ${inputFocus.clubEmail ? 'focused' : ''}`}>
              <label htmlFor="clubEmail">Club Email</label>
              <input
                type="email"
                id="clubEmail"
                placeholder="Enter club email"
                onFocus={() => handleInputFocus('clubEmail', true)}
                onBlur={() => handleInputFocus('clubEmail', false)}
              />
              <div className="focus-border"></div>
            </div>
            <div className={`form-group ${inputFocus.facultyCoordinator ? 'focused' : ''}`}>
              <label htmlFor="facultyCoordinator">Faculty Coordinator ID</label>
              <input
                type="text"
                id="facultyCoordinator"
                placeholder="Enter faculty coordinator ID"
                onFocus={() => handleInputFocus('facultyCoordinator', true)}
                onBlur={() => handleInputFocus('facultyCoordinator', false)}
              />
              <div className="focus-border"></div>
            </div>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Submit
            </button>
            <div className="form-footer">
              <button 
                type="button" 
                className="club-link back-link"
                onClick={() => changePage('login')}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="login-container">
      <header className="header">
        <h1 className="title">VNR VJIET</h1>
      </header>

      {currentPage === 'login' ? renderLoginPage() : renderClubPage()}
    </div>
  );
}

export default SigInComponent;