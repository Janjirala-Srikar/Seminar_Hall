import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClubRegistrationLanding = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/club'); // Navigate to your ClubInfoForm route
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-h-screen">
        <div className="col-lg-10">
          <div className="card shadow-lg rounded-lg overflow-hidden">
            <div className="card-body p-0">
              <div className="row g-0">
                {/* Left side with SVG */}
                <div className="col-md-6 bg-primary d-flex align-items-center justify-content-center p-4"
                  style={{
                    background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
                    minHeight: '400px'
                  }}>
                  <div className="text-center">
                    <svg 
                      width="280" 
                      height="280" 
                      viewBox="0 0 600 600" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto"
                    >
                      {/* Central circle representing the club */}
                      <circle cx="300" cy="300" r="120" fill="white" fillOpacity="0.9" />
                      
                      {/* Club icon in center */}
                      <g transform="translate(245, 245)">
                        <path d="M110 55C110 85.3757 85.3757 110 55 110C24.6243 110 0 85.3757 0 55C0 24.6243 24.6243 0 55 0C85.3757 0 110 24.6243 110 55Z" fill="#82001A"/>
                        <path d="M82.5 55C82.5 69.6355 70.6355 81.5 56 81.5C41.3645 81.5 29.5 69.6355 29.5 55C29.5 40.3645 41.3645 28.5 56 28.5C70.6355 28.5 82.5 40.3645 82.5 55Z" stroke="white" strokeWidth="3"/>
                        <path d="M33 55C33 42.2975 43.2975 32 56 32C68.7025 32 79 42.2975 79 55C79 67.7025 68.7025 78 56 78" stroke="white" strokeWidth="3"/>
                        <path d="M56 78C43.2975 78 33 67.7025 33 55" stroke="white" strokeWidth="3"/>
                        <circle cx="56" cy="55" r="10" fill="white"/>
                      </g>
                      
                      {/* Connecting lines for people */}
                      <line x1="300" y1="180" x2="300" y2="120" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
                      <line x1="300" y1="480" x2="300" y2="420" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
                      <line x1="180" y1="300" x2="240" y2="300" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
                      <line x1="420" y1="300" x2="360" y2="300" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
                      
                      <line x1="210" y1="210" x2="250" y2="250" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
                      <line x1="390" y1="210" x2="350" y2="250" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
                      <line x1="210" y1="390" x2="250" y2="350" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
                      <line x1="390" y1="390" x2="350" y2="350" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
                      
                      {/* People icons as circles */}
                      <circle cx="300" cy="140" r="40" fill="white" fillOpacity="0.7" />
                      <circle cx="300" cy="460" r="40" fill="white" fillOpacity="0.7" />
                      <circle cx="140" cy="300" r="40" fill="white" fillOpacity="0.7" />
                      <circle cx="460" cy="300" r="40" fill="white" fillOpacity="0.7" />
                      
                      <circle cx="180" cy="180" r="35" fill="white" fillOpacity="0.7" />
                      <circle cx="420" cy="180" r="35" fill="white" fillOpacity="0.7" />
                      <circle cx="180" cy="420" r="35" fill="white" fillOpacity="0.7" />
                      <circle cx="420" cy="420" r="35" fill="white" fillOpacity="0.7" />
                      
                      {/* Activity lines in background */}
                      <path d="M60,300 Q200,100 300,300 T540,300" stroke="white" strokeWidth="2" strokeOpacity="0.4" fill="none" />
                      <path d="M300,60 Q500,200 300,300 T300,540" stroke="white" strokeWidth="2" strokeOpacity="0.4" fill="none" />
                      
                      {/* Decorative elements */}
                      <circle cx="80" cy="80" r="15" fill="white" fillOpacity="0.4" />
                      <circle cx="520" cy="80" r="15" fill="white" fillOpacity="0.4" />
                      <circle cx="80" cy="520" r="15" fill="white" fillOpacity="0.4" />
                      <circle cx="520" cy="520" r="15" fill="white" fillOpacity="0.4" />
                    </svg>
                  </div>
                </div>
                
                {/* Right side with text and button */}
                <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
                  <h2 className="fw-bold mb-4 text-primary" style={{ color: '#4b6cb7' }}>New Club Registration</h2>
                  
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Registration Process:</h5>
                    <ul className="list-unstyled">
                      <li className="mb-3 d-flex">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '28px', height: '28px', minWidth: '28px', background: '#4b6cb7' }}>1</div>
                        <div>Complete the registration form with basic club information</div>
                      </li>
                      <li className="mb-3 d-flex">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '28px', height: '28px', minWidth: '28px', background: '#4b6cb7' }}>2</div>
                        <div>Provide contact details and faculty advisor information</div>
                      </li>
                      <li className="mb-3 d-flex">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '28px', height: '28px', minWidth: '28px', background: '#4b6cb7' }}>3</div>
                        <div>Submit your application for review by the administration</div>
                      </li>
                      <li className="d-flex">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '28px', height: '28px', minWidth: '28px', background: '#4b6cb7' }}>4</div>
                        <div>Receive confirmation and next steps via email</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="alert alert-info" role="alert" style={{ background: 'rgba(75, 108, 183, 0.1)', border: 'none' }}>
                    <div className="d-flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="me-2 text-primary" viewBox="0 0 16 16" style={{ color: '#4b6cb7' }}>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                      </svg>
                      <div>
                        <p className="mb-0">All clubs must have a faculty advisor and at least 10 founding members to be considered for approval.</p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="btn mt-4 w-100 py-3 fw-bold text-white rounded-pill"
                    style={{
                      background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
                      boxShadow: '0 4px 15px rgba(75, 108, 183, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
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
  );
};

export default ClubRegistrationLanding;