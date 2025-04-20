import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrolled, setScrolled] = useState(false);
  
  // Navigation items with their routes
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Club", path: "/clubreg" },
    { name: "Director", path: "/director" },
    { name: "Login", path: "/signin" }
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 990) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll for background transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if we're in mobile view
  const isMobile = windowWidth <= 990;

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const closeMenu = (e) => {
        if (!e.target.closest('.mobile-nav-dropdown') && 
            !e.target.closest('.hamburger-icon')) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('click', closeMenu);
      return () => document.removeEventListener('click', closeMenu);
    }
  }, [isOpen]);

  return (
    <div className={`header-container ${isMobile ? 'mobile' : ''} ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <div className="logo-container">
        <Link to="/">
          <img 
            src="https://vnrvjiet.ac.in/assets/images/Header%20Logo.png" 
            alt="Logo" 
            className="logo-image"
          />
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="desktop-nav">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="nav-link1"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
      
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="mobile-nav-container">
          <div 
            className="hamburger-icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
          
          <div className={`mobile-nav-dropdown ${isOpen ? 'open' : ''}`}>
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="mobile-nav-link"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isOpen && isMobile && (
        <div className="mobile-menu-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default Header;