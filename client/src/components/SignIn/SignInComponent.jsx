import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc7SGt6vMAEClxHsPXOe77n5UMHRUvYBo",
  authDomain: "seminarhall-c1280.firebaseapp.com",
  projectId: "seminarhall-c1280",
  storageBucket: "seminarhall-c1280.firebasestorage.app",
  messagingSenderId: "1019317812425",
  appId: "1:1019317812425:web:ab4314fec649173e54a118",
  measurementId: "G-L59FVKDYT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function SignInComponent() {
  // Get auth instance
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('user');
  const [currentPage, setCurrentPage] = useState('login');
  const [animationState, setAnimationState] = useState('enter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form inputs state
  const [formInputs, setFormInputs] = useState({
    facultyId: '',
    facultyPassword: '',
    adminEmail: '',
    adminPassword: '',
    clubName: '',
    clubEmail: '',
    facultyCoordinator: ''
  });
  
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
    setError('');
    
    setTimeout(() => {
      setCurrentPage(page);
      setAnimationState('enter');
    }, 400);
  };

  const handleTabChange = (tab) => {
    // Animate tab change
    setActiveTab(tab);
    setError('');
  };

  const handleInputFocus = (field, isFocused) => {
    setInputFocus(prev => ({
      ...prev,
      [field]: isFocused
    }));
  };

  const handleInputChange = (field, value) => {
    setFormInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle user login for Faculty (User)
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // For faculty login, we're assuming the facultyId is the email or we'd modify it to be a valid email
      const userEmail = formInputs.facultyId.includes('@') 
        ? formInputs.facultyId 
        : `${formInputs.facultyId}@vnrvjiet.edu.in`; // Example domain
        
      await signInWithEmailAndPassword(auth, userEmail, formInputs.facultyPassword);
      console.log('User logged in successfully');
      // Navigate to Home page on successful login
      navigate('/Home');
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, formInputs.adminEmail, formInputs.adminPassword);
      console.log('Admin logged in successfully');
      // Navigate to Home page on successful login
      navigate('/Home');
    } catch (error) {
      console.error('Admin login error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle club registration
  const handleClubRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Here you would typically call an API to register the club
      // For this example, we'll just create a Firebase user with the club email
      await createUserWithEmailAndPassword(auth, formInputs.clubEmail, 'temporary-password');
      console.log('Club registered successfully');
      // Navigate to Home or a success page
      navigate('/Home');
    } catch (error) {
      console.error('Club registration error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
          
          {error && <div className="error-message">{error}</div>}
          
          {activeTab === 'user' ? (
            <form className="login-form" onSubmit={handleUserLogin}>
              <div className={`form-group ${inputFocus.facultyId ? 'focused' : ''}`}>
                <label htmlFor="facultyId">Faculty ID</label>
                <input
                  type="text"
                  id="facultyId"
                  placeholder="Enter Faculty ID"
                  value={formInputs.facultyId}
                  onChange={(e) => handleInputChange('facultyId', e.target.value)}
                  onFocus={() => handleInputFocus('facultyId', true)}
                  onBlur={() => handleInputFocus('facultyId', false)}
                  required
                />
                <div className="focus-border"></div>
              </div>
              <div className={`form-group ${inputFocus.facultyPassword ? 'focused' : ''}`}>
                <label htmlFor="facultyPassword">Password</label>
                <input
                  type="password"
                  id="facultyPassword"
                  placeholder="Enter password"
                  value={formInputs.facultyPassword}
                  onChange={(e) => handleInputChange('facultyPassword', e.target.value)}
                  onFocus={() => handleInputFocus('facultyPassword', true)}
                  onBlur={() => handleInputFocus('facultyPassword', false)}
                  required
                />
                <div className="focus-border"></div>
              </div>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
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
            <form className="login-form" onSubmit={handleAdminLogin}>
              <div className={`form-group ${inputFocus.adminEmail ? 'focused' : ''}`}>
                <label htmlFor="adminEmail">Email</label>
                <input
                  type="email"
                  id="adminEmail"
                  placeholder="Enter email"
                  value={formInputs.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  onFocus={() => handleInputFocus('adminEmail', true)}
                  onBlur={() => handleInputFocus('adminEmail', false)}
                  required
                />
                <div className="focus-border"></div>
              </div>
              <div className={`form-group ${inputFocus.adminPassword ? 'focused' : ''}`}>
                <label htmlFor="adminPassword">Password</label>
                <input
                  type="password"
                  id="adminPassword"
                  placeholder="Enter password"
                  value={formInputs.adminPassword}
                  onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                  onFocus={() => handleInputFocus('adminPassword', true)}
                  onBlur={() => handleInputFocus('adminPassword', false)}
                  required
                />
                <div className="focus-border"></div>
              </div>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
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
          
          {error && <div className="error-message">{error}</div>}
          
          <form className="login-form" onSubmit={handleClubRegistration}>
            <div className={`form-group ${inputFocus.clubName ? 'focused' : ''}`}>
              <label htmlFor="clubName">Club Name</label>
              <input
                type="text"
                id="clubName"
                placeholder="Enter club name"
                value={formInputs.clubName}
                onChange={(e) => handleInputChange('clubName', e.target.value)}
                onFocus={() => handleInputFocus('clubName', true)}
                onBlur={() => handleInputFocus('clubName', false)}
                required
              />
              <div className="focus-border"></div>
            </div>
            <div className={`form-group ${inputFocus.clubEmail ? 'focused' : ''}`}>
              <label htmlFor="clubEmail">Club Email</label>
              <input
                type="email"
                id="clubEmail"
                placeholder="Enter club email"
                value={formInputs.clubEmail}
                onChange={(e) => handleInputChange('clubEmail', e.target.value)}
                onFocus={() => handleInputFocus('clubEmail', true)}
                onBlur={() => handleInputFocus('clubEmail', false)}
                required
              />
              <div className="focus-border"></div>
            </div>
            <div className={`form-group ${inputFocus.facultyCoordinator ? 'focused' : ''}`}>
              <label htmlFor="facultyCoordinator">Faculty Coordinator ID</label>
              <input
                type="text"
                id="facultyCoordinator"
                placeholder="Enter faculty coordinator ID"
                value={formInputs.facultyCoordinator}
                onChange={(e) => handleInputChange('facultyCoordinator', e.target.value)}
                onFocus={() => handleInputFocus('facultyCoordinator', true)}
                onBlur={() => handleInputFocus('facultyCoordinator', false)}
                required
              />
              <div className="focus-border"></div>
            </div>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
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

export default SignInComponent;