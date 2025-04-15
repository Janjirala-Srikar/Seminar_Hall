import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';

// Import Firebase modules from our config
import { auth } from '../firebase/config'; // Adjust the path as needed
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

function SignInComponent() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('user');
  const [currentPage, setCurrentPage] = useState('login');
  const [animationState, setAnimationState] = useState('enter');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form inputs state
  const [formInputs, setFormInputs] = useState({
    facultyId: '',
    facultyPassword: '',
    adminEmail: '',
    adminPassword: '',
    clubName: '',
    clubEmail: '',
    facultyCoordinator: '',
    resetEmail: '' // Added for password reset
  });
  
  const [inputFocus, setInputFocus] = useState({
    facultyId: false,
    facultyPassword: false,
    adminEmail: false,
    adminPassword: false,
    clubName: false,
    clubEmail: false,
    facultyCoordinator: false,
    resetEmail: false // Added for password reset
  });

  // Handle page transitions with animation
  const changePage = (page) => {
    setAnimationState('exit');
    setError('');
    setSuccessMessage('');
    
    setTimeout(() => {
      setCurrentPage(page);
      setAnimationState('enter');
    }, 400);
  };

  const handleTabChange = (tab) => {
    // Animate tab change
    setActiveTab(tab);
    setError('');
    setSuccessMessage('');
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

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // For faculty, construct email from ID if needed
      let resetEmail = formInputs.resetEmail;
      if (activeTab === 'user' && !resetEmail.includes('@')) {
        resetEmail = `${resetEmail}@vnrvjiet.edu.in`; // Example domain
      }
      
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccessMessage('Password reset email sent! Please check your inbox.');
      setFormInputs(prev => ({ ...prev, resetEmail: '' }));
    } catch (error) {
      console.error('Password reset error:', error.message);
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
          {successMessage && <div className="success-message">{successMessage}</div>}
          
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
                <button 
                  type="button" 
                  className="form-link"
                  onClick={() => changePage('forgot')}
                >
                  Forgot password?
                </button>
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
                <button 
                  type="button" 
                  className="form-link"
                  onClick={() => changePage('forgot')}
                >
                  Forgot password?
                </button>
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

  // Render the forgot password page
  const renderForgotPasswordPage = () => (
    <div className={`login-wrapper ${animationState === 'enter' ? 'page-enter' : 'page-exit'}`}>
      <div className="card forgot-card">
        <div className="card-body">
          <h2 className="card-title">Reset Password</h2>
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <form className="login-form" onSubmit={handlePasswordReset}>
            <div className={`form-group ${inputFocus.resetEmail ? 'focused' : ''}`}>
              <label htmlFor="resetEmail">
                {activeTab === 'user' ? 'Faculty ID or Email' : 'Email'}
              </label>
              <input
                type={activeTab === 'user' ? 'text' : 'email'}
                id="resetEmail"
                placeholder={activeTab === 'user' ? 'Enter Faculty ID or Email' : 'Enter email'}
                value={formInputs.resetEmail}
                onChange={(e) => handleInputChange('resetEmail', e.target.value)}
                onFocus={() => handleInputFocus('resetEmail', true)}
                onBlur={() => handleInputFocus('resetEmail', false)}
                required
              />
              <div className="focus-border"></div>
            </div>
            <p className="reset-instructions">
              Enter your {activeTab === 'user' ? 'faculty ID or email' : 'email'} address and we'll send you a link to reset your password.
            </p>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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

      {currentPage === 'login' && renderLoginPage()}
      {currentPage === 'club' && renderClubPage()}
      {currentPage === 'forgot' && renderForgotPasswordPage()}
      
      <style jsx>{`
        .success-message {
          background-color: rgba(39, 174, 96, 0.1);
          color: #27ae60;
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
          border-left: 4px solid #27ae60;
        }
        
        .reset-instructions {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
          font-style: italic;
        }
        
        .form-link {
          background: none;
          border: none;
          color: #4285f4;
          padding: 0;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
        }
        
        .form-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default SignInComponent;