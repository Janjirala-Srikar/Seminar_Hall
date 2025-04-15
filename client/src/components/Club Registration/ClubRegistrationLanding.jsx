import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaInfoCircle, FaUsers, FaUserFriends, FaHome, FaArrowLeft } from 'react-icons/fa';
import './ClubRegistrationLanding.css';

const ClubRegistrationLanding = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/club'); // Navigate to your ClubInfoForm route
  };

  return (
    <div className="club-registration-container">
      {/* Home navigation button */}
      <Link to="/" className="home-button">
        <FaArrowLeft />
        <span>Back to Home</span>
      </Link>
      
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12 col-sm-12">
            <div className="card shadow-lg rounded-lg overflow-hidden">
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Left side with illustration */}
                  <div className="col-lg-6 col-md-6 col-sm-12 left-panel d-flex align-items-center justify-content-center p-4">
                    <div className="text-center">
                      <div className="club-icon-container">
                        <FaUsers className="club-icon" />
                        <div className="club-icon-circle">
                          <FaUserFriends className="member-icon" />
                        </div>
                      </div>
                      <h3 className="mt-4 text-white">Join Our Community</h3>
                      <p className="text-white-50">Create and manage clubs at your campus</p>
                    </div>
                  </div>
                  
                  {/* Right side with text and button */}
                  <div className="col-lg-6 col-md-6 col-sm-12 p-4 p-lg-5 d-flex flex-column justify-content-center">
                    <h2 className="fw-bold mb-4 heading-text">New Club Registration</h2>
                    
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">Registration Process:</h5>
                      <ul className="list-unstyled">
                        <li className="mb-3 d-flex align-items-center">
                          <div className="step-circle me-3">1</div>
                          <div>Complete the registration form with basic club information</div>
                        </li>
                        <li className="mb-3 d-flex align-items-center">
                          <div className="step-circle me-3">2</div>
                          <div>Provide contact details and faculty advisor information</div>
                        </li>
                        <li className="mb-3 d-flex align-items-center">
                          <div className="step-circle me-3">3</div>
                          <div>Submit your application for review by the administration</div>
                        </li>
                        <li className="d-flex align-items-center">
                          <div className="step-circle me-3">4</div>
                          <div>Receive confirmation and next steps via email</div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="alert-info-box" role="alert">
                      <div className="d-flex align-items-center">
                        <FaInfoCircle className="info-icon me-2" />
                        <div>
                          <p className="mb-0">All clubs must have a faculty advisor and at least 10 founding members to be considered for approval.</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="btn register-btn mt-4 w-100 py-3 fw-bold text-white rounded-pill"
                      onClick={handleRegisterClick}
                    >
                      Register Your Club
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubRegistrationLanding;