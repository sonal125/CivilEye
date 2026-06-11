/**
 * Register.jsx
 * 
 * Purpose: User registration page for CivilEye
 * 
 * Responsibilities:
 * - Provide registration form for new users
 * - Validate all input fields
 * - Handle form submission
 * - Support different user roles (Citizen, Admin)
 * - Create new user accounts
 * - Auto-login after successful registration
 * 
 * How it works:
 * - Maintains form state using React hooks
 * - Validates name, email, password, and confirms password
 * - Simulates user creation (would be API call in production)
 * - Automatically logs in user after registration
 * - Redirects to home page or admin dashboard based on role
 * 
 * Props:
 * - onLogin: Function to call after successful registration (updates App state)
 * 
 * Validation Rules:
 * - Name: Required, minimum 2 characters
 * - Email: Required, valid email format
 * - Password: Required, minimum 6 characters
 * - Confirm Password: Must match password
 * - Role: Required selection
 * 
 * CivilEye Context:
 * This page enables new citizens and municipal authorities to create
 * accounts on the CivilEye platform for civic engagement.
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/api'
import './Register.css'

/**
 * Register Component
 * 
 * Professional registration interface for new CivilEye users.
 * 
 * State:
 * - formData: {name, email, password, confirmPassword, role}
 * - errors: Object containing field-specific errors
 * - loading: Boolean for form submission state
 */
function Register({ onLogin }) {
  const navigate = useNavigate()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen', // Default role
    adminInviteCode: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  /**
   * Handle input field changes
   * Updates form data and clears field-specific errors
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * Validate entire form
   * Checks all fields and returns validation errors
   * 
   * @returns {Object} - Object containing field errors
   */
  const validateForm = () => {
    const newErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.role === 'admin' && !formData.adminInviteCode.trim()) {
      newErrors.adminInviteCode = 'Admin invite code is required for admin registration'
    }
    
    return newErrors
  }

  const mapBackendValidationErrors = (details) => {
    if (!Array.isArray(details)) return null
    const mapped = {}
    for (const d of details) {
      const field = d?.path
      if (!field) continue
      mapped[field] = mapped[field] || 'Invalid value'
    }
    return Object.keys(mapped).length ? mapped : null
  }

  /**
   * Handle form submission
   * Validates form and creates new user account
   * 
   * In production: Would make API call to backend
   * Currently: Simulates user creation with mock data
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setLoading(true)
    setErrors({})

    try {
      const { token, user } = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        adminInviteCode: formData.role === 'admin' ? formData.adminInviteCode.trim() : undefined
      })

      if (!token || !user) {
        setErrors({ general: 'Registration failed: invalid server response' })
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
      const mapped = mapBackendValidationErrors(err?.details)
      if (mapped) {
        setErrors(mapped)
      } else if (status === 409) {
        setErrors({ email: 'Email already registered' })
      } else if (status === 403) {
        setErrors({ general: err?.message || 'Admin registration is restricted on this server' })
      } else if (status === 0) {
        setErrors({ general: 'Network error: Unable to reach the backend server.' })
      } else {
        setErrors({ general: err?.message || 'Registration failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Join CivilEye</h1>
          <p className="register-subtitle">
            Create an account to report and track civic issues in your community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="alert alert-error" role="alert">
              {errors.general}
            </div>
          )}
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
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          {/* Admin Invite Code (shown only if role=admin) */}
          {formData.role === 'admin' && (
            <div className="form-group">
              <label htmlFor="adminInviteCode">Admin Invite Code</label>
              <input
                type="text"
                id="adminInviteCode"
                name="adminInviteCode"
                value={formData.adminInviteCode}
                onChange={handleChange}
                placeholder="Enter invite code provided by server"
                disabled={loading}
                className={errors.adminInviteCode ? 'input-error' : ''}
              />
              {errors.adminInviteCode && (
                <span className="error-message">{errors.adminInviteCode}</span>
              )}
            </div>
          )}

          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              required
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
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
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
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
              placeholder="Minimum 6 characters"
              disabled={loading}
              required
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              disabled={loading}
              required
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
