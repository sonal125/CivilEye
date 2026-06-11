/**
 * LoadingSpinner.jsx
 * 
 * Purpose: Reusable loading indicator component for CivilEye
 * 
 * Responsibilities:
 * - Display animated loading spinner
 * - Show optional loading message
 * - Support different sizes
 * - Provide centered or inline display
 * 
 * How it works:
 * - Uses CSS animation for smooth rotation
 * - Accepts props for customization
 * - Can be used as overlay or inline element
 * 
 * Props:
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - message: Optional text to display below spinner
 * - fullPage: Boolean to display as full-page overlay
 * 
 * CivilEye Context:
 * Provides visual feedback during data loading operations
 * for a professional user experience.
 */

import React from 'react'
import './LoadingSpinner.css'

/**
 * LoadingSpinner Component
 * 
 * Animated loading indicator with optional message.
 * 
 * @param {string} size - Size variant: 'small', 'medium', 'large'
 * @param {string} message - Optional loading message
 * @param {boolean} fullPage - Display as full-page overlay
 */
function LoadingSpinner({ size = 'medium', message = '', fullPage = false }) {
  const spinnerClass = `loading-spinner ${size}`
  
  if (fullPage) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={spinnerClass}></div>
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="loading-container">
      <div className={spinnerClass}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
