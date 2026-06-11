/**
 * Navbar.jsx
 * 
 * Purpose: Main navigation component for CivilEye
 * 
 * Responsibilities:
 * - Display CivilEye branding and logo
 * - Provide navigation links (Home, Submit, Admin)
 * - Show user profile/login status
 * - Handle user logout
 * - Responsive mobile menu
 * 
 * How it works:
 * - Receives user prop from App component
 * - Conditionally renders links based on authentication state
 * - Shows different options for citizen vs admin users
 * - Sticky positioning for accessibility
 * - Mobile hamburger menu for small screens
 * 
 * Props:
 * - user: Current user object (null if not logged in)
 * - onLogout: Function to call when user clicks logout
 * 
 * Navigation Structure:
 * - Unauthenticated: Home, Login, Register
 * - Citizen: Home, Submit Complaint, Profile, Logout
 * - Admin: Home, Submit, Admin Dashboard, Profile, Logout
 * 
 * CivilEye Context:
 * Professional navigation bar providing access to all platform features
 * for citizens and municipal authorities.
 */

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

/**
 * Navbar Component
 * 
 * Responsive navigation bar with role-based menu items.
 * 
 * State:
 * - mobileMenuOpen: Boolean for mobile menu toggle
 */
function Navbar({ user, onLogout }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  /**
   * Derive initials for the small profile avatar.
   * Kept lightweight to avoid introducing new dependencies.
   */
  const getInitials = (fullName = '') => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'U'
    const first = parts[0][0] || ''
    const last = parts.length > 1 ? (parts[parts.length - 1][0] || '') : ''
    return (first + last).toUpperCase()
  }

  /**
   * Check if a route is currently active
   * Used to highlight active navigation links
   * 
   * @param {string} path - Route path to check
   * @returns {boolean} - True if path matches current location
   */
  const isActive = (path) => {
    return location.pathname === path
  }

  /**
   * Toggle mobile menu
   * Opens/closes hamburger menu on mobile devices
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  /**
   * Close mobile menu
   * Called when a link is clicked or menu needs to close
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  /**
   * Handle logout action
   * Closes mobile menu and calls logout function
   */
  const handleLogout = () => {
    closeMobileMenu()
    onLogout()
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-surface">
          {/* Logo/Brand */}
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark-dot" />
            </span>
            <span className="brand-text">CivilEye</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
          </button>

          {/* Navigation Links + Right Actions */}
          <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
            {/* Center navigation (pill style) */}
            <div className="navbar-center" aria-label="Primary navigation">
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Public Feed
              </Link>

              <Link
                to="/submit"
                className={`nav-link ${isActive('/submit') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Submit Issue
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            </div>

            {/* Right side: user info + logout OR auth buttons */}
            <div className="navbar-right" aria-label="User actions">
              {user ? (
                <div className="navbar-user">
                  <div className="user-avatar" aria-hidden="true">
                    {getInitials(user.name)}
                  </div>
                  <div className="user-meta">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role">{user.role === 'admin' ? 'Admin' : 'Citizen'}</div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="navbar-auth">
                  <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMobileMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
