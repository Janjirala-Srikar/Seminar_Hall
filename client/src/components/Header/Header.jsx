import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Navigation items with their routes
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Club", path: "/clubreg" },
    {name: "Director", path: "/director"},
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

  // Determine if we're in mobile view
  const isMobile = windowWidth <= 990;

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: windowWidth <= 480 ? "0.8rem" : windowWidth <= 768 ? "0.8rem 1rem" : "1rem 2rem",
      background: "rgba(255, 255, 255, 0.25)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderRadius: windowWidth <= 480 ? "15px" : "20px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      width: windowWidth <= 350 ? "95%" : 
             windowWidth <= 480 ? "calc(100% - 20px)" : 
             windowWidth <= 768 ? "calc(100% - 40px)" : 
             windowWidth <= 990 ? "calc(100% - 80px)" : 
             windowWidth <= 1200 ? "calc(100% - 120px)" : "calc(100% - 240px)",
      maxWidth: "1400px",
      margin: windowWidth <= 350 ? "3px auto 0" : 
              windowWidth <= 480 ? "5px auto 0" : "10px auto 0",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <img 
            src="https://vnrvjiet.ac.in/assets/images/Header%20Logo.png" 
            alt="Logo" 
            style={{ 
              height: windowWidth <= 350 ? "2rem" : 
                      windowWidth <= 480 ? "2.5rem" : "3rem",
              transition: "transform 0.3s ease-in-out"
            }} 
          />
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      {!isMobile && (
        <nav style={{ 
          display: "flex", 
          gap: "1.5rem", 
          alignItems: "center" 
        }}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#1f2937",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                position: "relative",
                whiteSpace: "nowrap",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#82001A";
                const underline = document.createElement("div");
                underline.style.position = "absolute";
                underline.style.bottom = "0";
                underline.style.left = "50%";
                underline.style.width = "0";
                underline.style.height = "2px";
                underline.style.backgroundColor = "#82001A";
                underline.style.transition = "width 0.3s ease, left 0.3s ease";
                underline.className = "nav-underline";
                e.currentTarget.appendChild(underline);
                
                // Trigger reflow to ensure transition happens
                underline.offsetWidth;
                
                underline.style.width = "70%";
                underline.style.left = "15%";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#1f2937";
                const underline = e.currentTarget.querySelector(".nav-underline");
                if (underline) {
                  underline.style.width = "0";
                  underline.style.left = "50%";
                  
                  // Remove the element after transition completes
                  setTimeout(() => {
                    if (underline.parentNode === e.currentTarget) {
                      e.currentTarget.removeChild(underline);
                    }
                  }, 300);
                }
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
      
      {/* Mobile Navigation Dropdown */}
      {isMobile && isOpen && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "70px",
          right: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: windowWidth <= 350 ? "160px" : "220px",
          padding: "1rem",
          zIndex: 1001,
        }}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={{
                fontSize: windowWidth <= 350 ? "1rem" : "1.1rem",
                textAlign: "center",
                width: "100%",
                padding: windowWidth <= 350 ? "0.6rem 0" : "0.8rem 0",
                color: "#1f2937",
                textDecoration: "none",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#82001A";
                const underline = document.createElement("div");
                underline.style.position = "absolute";
                underline.style.bottom = "5px";
                underline.style.left = "50%";
                underline.style.width = "0";
                underline.style.height = "2px";
                underline.style.backgroundColor = "#82001A";
                underline.style.transition = "width 0.3s ease, left 0.3s ease";
                underline.className = "nav-underline-mobile";
                e.currentTarget.appendChild(underline);
                
                // Trigger reflow
                underline.offsetWidth;
                
                underline.style.width = "50%";
                underline.style.left = "25%";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#1f2937";
                const underline = e.currentTarget.querySelector(".nav-underline-mobile");
                if (underline) {
                  underline.style.width = "0";
                  underline.style.left = "50%";
                  
                  setTimeout(() => {
                    if (underline.parentNode === e.currentTarget) {
                      e.currentTarget.removeChild(underline);
                    }
                  }, 300);
                }
              }}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
      
      {/* Hamburger Menu Icon - Only visible on mobile */}
      {isMobile && (
        <div 
          style={{
            display: "block",
            fontSize: windowWidth <= 480 ? "1.5rem" : "1.8rem",
            cursor: "pointer",
            color: "#1f2937"
          }} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </div>
      )}
    </div>
  );
};

export default Header;