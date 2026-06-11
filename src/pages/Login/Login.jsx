/**
 * Login.jsx
 * 
 * Purpose: User authentication page for CivilEye
 * 
 * Responsibilities:
 * - Provide login form with email and password
 * - Validate user credentials
 * - Handle authentication errors
 * - Support different user roles (Citizen, Admin)
 * - Navigate to appropriate page after login
 * 
 * How it works:
 * - Maintains form state using React hooks
 * - Validates input fields before submission
 * - Authenticates against mock user database (would be API in production)
 * - Stores user session in localStorage via App component
 * - Shows success/error messages
 * 
 * Props:
 * - onLogin: Function to call when login is successful (updates App state)
 * 
 * CivilEye Context:
 * This page allows citizens and municipal authorities to access the
 * CivilEye platform. Citizens can report and track issues, while
 * admins can manage and resolve complaints.
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/api'
import './Login.css'

/**
 * Login Component
 * 
 * Provides a professional authentication interface for CivilEye users.
 * 
 * State:
 * - formData: {email, password, role}
 * - error: Error message string
 * - loading: Boolean for form submission state
 */
function Login({ onLogin }) {
  const navigate = useNavigate()
  
  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'citizen' // Default role
  })
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Handle input field changes
   * Updates form data state as user types
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  /**
   * Validate form fields
   * Ensures all required fields are filled and valid
   * 
   * @returns {boolean} - True if form is valid
   */
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    
    return true
  }

  /**
   * Handle form submission
   * Authenticates user and redirects to appropriate page
   * 
   * In production: Would make API call to backend
   * Currently: Uses mock authentication
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const { token, user } = await loginUser({
        email: formData.email.trim(),
        password: formData.password
      })

      if (!token || !user) {
        setError('Login failed: invalid server response')
        return
      }

      // Optional role gate: keep existing UI role selector meaningful.
      if (formData.role && user.role && String(formData.role) !== String(user.role)) {
        setError(`This account is a ${user.role}. Please select the correct role and try again.`)
        return
      }

      onLogin({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      })

      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      const status = err?.status
      if (status === 401) {
        setError('Invalid email or password. Please try again.')
      } else if (status === 0) {
        setError('Network error: Unable to reach the backend server.')
      } else {
        setError(err?.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>CivilEye</h1>
          <p className="login-subtitle">Sign in to report and track civic issues</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="citizen">Citizen</option>
              <option value="admin">Municipal Authority</option>
            </select>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div className="demo-info">
          <p className="demo-title">Demo Credentials:</p>
          <div className="demo-credentials">
            <div>
              <strong>Citizens:</strong>
              <div>citizen@civileye.com / password123</div>
              <div>sonalcitizen@civic.com / Sonal123</div>
              <div>ankitcitizen@civic.com / Raj123</div>
            </div>
            <div>
              <strong>Admins:</strong>
              <div>admin@civileye.com / admin123</div>
              <div>sonaladmin@civic.com / Sonal123</div>
              <div>ankitadmin@civic.com / Raj123</div>
            </div>
            <div>
              <strong>Note:</strong> Select the correct role above before signing in.
            </div>
          </div>
        </div>

        {/* Register Link */}
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
