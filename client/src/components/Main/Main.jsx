import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
  const [userEmail, setUserEmail] = useState('');
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

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate, auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The navigation to '/' will happen automatically due to the auth state change
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-centent-center">
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm m-3">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">Dashboard</a>
          <div className="d-flex align-items-center">
            <span className="me-3 text-secondary">
              <i className="bi bi-person-circle me-2"></i>
              {userEmail}
            </span>
            <button 
              onClick={handleLogout}
              className="btn btn-danger"
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="row flex-grow-1 m-3 ">

        {/* Main content */}
        <div className="col-md-9 col-lg-10 p-4">
          <div className="card mb-4">
            <div className="card-header bg-white">
              <h4 className="card-title mb-0">Welcome to Your Dashboard</h4>
            </div>
            <div className="card-body">
              <p className="card-text">
                You are logged in as <strong>{userEmail}</strong>
              </p>
              <p>This is your personalized dashboard. You can manage your account and settings from here.</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Recent Activity</h5>
                </div>
                <div className="card-body">
                  <p>No recent activities to display.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Account Summary</h5>
                </div>
                <div className="card-body">
                  <p>Account Status: <span className="badge bg-success">Active</span></p>
                  <p>Last Login: Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-light text-center text-muted py-3 mt-auto">
        <small>&copy; 2025 Your Application. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default Main;