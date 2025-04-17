import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookingCalender from '../Calender/BookingCalender'
import { FaHome, FaCalendarCheck, FaListAlt, FaCog, FaSignOutAlt, FaUser, FaBars } from 'react-icons/fa';
import UserSettings from './UserSettings';

function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('User');
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [activePage, setActivePage] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

    // Check screen size on initial load
    handleResize();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Add click event listener to close dropdown when clicking outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup subscription on unmount
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
        const nameValue = userData.name || userData.fullName || userData.displayName || userData.userName || 'User';
        console.log("Found name in Firestore:", nameValue);
        setUserName(nameValue);
      } else {
        console.log("No user document found in Firestore");
        setUserName('User');
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      setUserName('User');
    }
  };

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
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
    setActivePage('settings');
    setDropdownOpen(false);
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
        return <UserSettings />; 
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
            <div className="hbs_profile-dropdown" ref={dropdownRef}>
              <div 
                className="hbs_profile-trigger" 
                onClick={toggleDropdown}
                title={userEmail}
              >
                {userPhotoURL ? (
                  <img 
                    src={userPhotoURL} 
                    alt="Profile" 
                    className="hbs_profile-image" 
                    onError={(e) => {
                      console.log("Error loading image, falling back to placeholder");
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="hbs_profile-image-placeholder" style={{display: userPhotoURL ? 'none' : 'flex'}}>
                  <FaUser />
                </div>
              </div>
              {dropdownOpen && (
                <div className="hbs_dropdown-menu">
                  <div className="hbs_dropdown-header">
                    <div className="hbs_profile-preview">
                      {userPhotoURL ? (
                        <img 
                          src={userPhotoURL} 
                          alt="Profile" 
                          className="hbs_dropdown-profile-image" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="hbs_dropdown-profile-placeholder" style={{display: userPhotoURL ? 'none' : 'flex'}}>
                        <FaUser />
                      </div>
                    </div>
                    <div className="hbs_profile-info">
                      {/* <p className="hbs_profile-name">{userName}</p> */}
                      <p className="hbs_profile-email">{userEmail}</p>
                    </div>
                  </div>
                  <div className="hbs_dropdown-divider"></div>
                  <ul className="hbs_dropdown-list">
                    <li onClick={handleNavigateToSettings}>
                      <FaCog className="hbs_dropdown-icon" />
                      <span>Settings</span>
                    </li>
                    <li onClick={handleLogout}>
                      <FaSignOutAlt className="hbs_dropdown-icon" />
                      <span>Logout</span>
                    </li>
                  </ul>
                </div>
              )}
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