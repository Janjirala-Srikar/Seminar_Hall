import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar/Sidebar';
import './DirectorDashboard.css';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import WelcomeSection from '../Welcome/WelcomeSection';
import ClubRequests from '../Auth/ClubRequests';
import DirectorSettings from './DirectorSettings';
import BookingCalendar from '../Calender/BookingCalender';
import RequestDashboard from '../Request/RequestDashBoard';
import { FaUser, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';

function DirectorDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    // Get current user from Firebase Auth
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        // User is signed in
        setUserEmail(user.email || 'No email available');
        
        // Try to get user's photo URL
        if (user.photoURL) {
          console.log("Photo URL from auth:", user.photoURL);
          setUserPhotoURL(user.photoURL);
        } else {
          console.log("No photo URL in auth, checking Firestore and Storage");
          await fetchUserPhoto(user.uid);
        }
        
        // Try to get user's name
        if (user.displayName) {
          console.log("Display name from auth:", user.displayName);
          setUserName(user.displayName);
        } else {
          console.log("No display name in auth, checking Firestore");
          await fetchUserName(user.uid);
        }
      } else {
        // User is signed out, redirect to home/login page
        console.log("No authenticated user");
        navigate('/');
      }
    });

    // Handle screen size on load and resize
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate, auth]);

  const fetchUserPhoto = async (userId) => {
    try {
      // First try to get from Firestore
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists() && userSnap.data().photoURL) {
        console.log("Found photo URL in Firestore:", userSnap.data().photoURL);
        setUserPhotoURL(userSnap.data().photoURL);
        return;
      }
      
      // Then try to get from Storage
      try {
        const storage = getStorage();
        const photoRef = ref(storage, `users/${userId}/profile.jpg`);
        const photoURL = await getDownloadURL(photoRef);
        console.log("Found photo in Storage:", photoURL);
        setUserPhotoURL(photoURL);
      } catch (storageError) {
        console.log("No photo in Storage:", storageError);
        // No profile photo in storage
      }
    } catch (error) {
      console.error("Error fetching user photo:", error);
    }
  };

  const fetchUserName = async (userId) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // Check various common field names for the name
        const userData = userSnap.data();
        const nameValue = userData.name || userData.fullName || userData.displayName || userData.userName || 'Director';
        console.log("Found name in Firestore:", nameValue);
        setUserName(nameValue);
      } else {
        console.log("No user document found in Firestore");
        setUserName('Director');
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      setUserName('Director');
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      // The navigation to '/' will happen automatically due to the auth state change
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigateToSettings = () => {
    setActiveSection('settings');
    setDropdownOpen(false);
  };

  const renderContent = () => {
    console.log("Rendering content for:", activeSection);
    switch (activeSection) {
      case 'bookingCalender':
        return <BookingCalendar />;
      case 'bookingRequests':
        return <RequestDashboard />;
      case 'clubRequests':
        return <ClubRequests />;
      case 'settings':
        return <DirectorSettings />;
      case 'dashboard':
      default:
        return <WelcomeSection />;
    }
  };

  // Placeholder component for settings
  const SettingsComponent = () => (
    <div className="container mt-4">
      <h2>Director Settings</h2>
      <p>Settings page content goes here.</p>
    </div>
  );

  return (
    <div className="director-dashboard-container">
      {/* Top Navigation Bar */}
      <nav className="director-top-navbar">
        <div className="director-navbar-container">
          <div className="director-navbar-left">
            <button 
              className="director-sidebar-toggle" 
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
            <div className="director-brand">
              <h3>Admin Dashboard</h3>
            </div>
          </div>
          <div className="director-navbar-right ">
            <div className="director-profile-dropdown" ref={dropdownRef}>
              <div 
                className="director-profile-trigger" 
                onClick={toggleDropdown}
                title={userEmail}
              >
                {userPhotoURL ? (
                  <img 
                    src={userPhotoURL} 
                    alt="Profile" 
                    className="director-profile-image" 
                    onError={(e) => {
                      console.log("Error loading image, falling back to placeholder");
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="director-profile-image-placeholder" style={{display: userPhotoURL ? 'none' : 'flex'}}>
                  <FaUser />
                </div>
              </div>
              {dropdownOpen && (
                <div className="director-dropdown-menu">
                  <div className="director-dropdown-header">
                    <div className="director-profile-preview">
                      {userPhotoURL ? (
                        <img 
                          src={userPhotoURL} 
                          alt="Profile" 
                          className="director-dropdown-profile-image" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="director-dropdown-profile-placeholder" style={{display: userPhotoURL ? 'none' : 'flex'}}>
                        <FaUser />
                      </div>
                    </div>
                    <div className="director-profile-info">
                      <p className="director-profile-email">{userEmail}</p>
                    </div>
                  </div>
                  <div className="director-dropdown-divider"></div>
                  <ul className="director-dropdown-list">
                    <li onClick={handleNavigateToSettings}>
                      <FaCog className="director-dropdown-icon" />
                      <span>Settings</span>
                    </li>
                    <li onClick={handleLogout}>
                      <FaSignOutAlt className="director-dropdown-icon" />
                      <span>Logout</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="director-content-wrapper">
        {/* Sidebar Component */}
        <Sidebar 
          collapsed={collapsed}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Content Area */}
        <div className={`director-main-content ${collapsed ? 'director-content-expanded' : ''}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default DirectorDashboard;