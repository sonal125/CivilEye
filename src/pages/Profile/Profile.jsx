/**
 * Profile.jsx
 * 
 * Purpose: User profile page for CivilEye
 * 
 * Responsibilities:
 * - Display user information
 * - Show user's reported complaints
 * - Display user statistics
 * - Allow profile viewing
 * 
 * CivilEye Context:
 * Simple profile page showing user's civic engagement activity.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import './Profile.css'

function Profile({ user }) {
  if (!user) {
    return null
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              <span className="profile-role-badge">{user.role}</span>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{user.name}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <p className="capitalize">{user.role}</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>January 2026</p>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/" className="btn btn-primary">
                View Public Feed
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-secondary">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
