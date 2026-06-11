/**
 * Footer.jsx
 * 
 * Purpose: Footer component for CivilEye
 * 
 * Responsibilities:
 * - Display CivilEye branding and tagline
 * - Show copyright information
 * - Provide links to important pages
 * - Display contact information (mock)
 * 
 * How it works:
 * - Static footer component with no props
 * - Displays current year dynamically
 * - Contains quick links and about info
 * - Responsive layout
 * 
 * CivilEye Context:
 * Professional footer providing context about the civic platform
 * and enhancing trust with citizens and authorities.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

/**
 * Footer Component
 * 
 * Professional footer for CivilEye platform.
 * Displays branding, links, and copyright information.
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-title">CivilEye</h3>
          <p className="footer-description">
            A digital platform that enables citizens to report and track civic issues 
            using image-based reporting and transparency.
          </p>
          <p className="footer-tagline">
            Empowering communities through civic engagement.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Public Feed</Link></li>
            <li><Link to="/submit">Report Issue</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        {/* Contact Info (Mock) */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-contact">
            <li>Email: support@civileye.gov</li>
            <li>Phone: 1-800-CIVIL-EYE</li>
            <li>Address: Municipal Services Building</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} CivilEye. All rights reserved. 
          Built for civic transparency and accountability.
        </p>
      </div>
    </footer>
  )
}

export default Footer
