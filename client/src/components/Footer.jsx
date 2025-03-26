import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import './Footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <img src="https://vnrvjiet.ac.in/assets/images/Footer%20Logo.png" alt="College Logo" className="footer-logo" />
        </div>
        
        <div className="footer-info">
          <p className="address">Vignana Jyothi Nagar, Pragathi Nagar, Hyderabad - 500 090</p>
          <p className="contact">Ph: 91-040-23042758 | <a href="mailto:postbox@vnrvjiet.ac.in">postbox@vnrvjiet.ac.in</a></p>
        </div>
        
        <div className="footer-social">
          <a href="https://www.facebook.com/VNRVJ/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://www.instagram.com/vnrvjiet.hyd/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://x.com/vnrvjiethyd" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
          <a href="https://www.linkedin.com/school/vnrvjiethyd/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://www.youtube.com/@vnrvjiethyd" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>© 2025 VNR VJIET. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;