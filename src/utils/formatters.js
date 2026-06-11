/**
 * formatters.js
 * 
 * Purpose: Utility functions for formatting data in CivilEye
 * 
 * Responsibilities:
 * - Format dates for display
 * - Format numbers (counts, distances)
 * - Format text strings
 * - Provide consistent formatting across app
 * 
 * How it works:
 * - Pure functions that take input and return formatted output
 * - Used throughout components for consistent display
 * - Handles edge cases and null values
 * 
 * CivilEye Context:
 * Ensures professional, consistent data presentation
 * throughout the civic platform.
 */

/**
 * Format date to relative time (e.g., "2 hours ago")
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted relative time
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return 'just now'
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  } else {
    return formatDate(dateString)
  }
}

/**
 * Format date to readable string (e.g., "Jan 23, 2026")
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

/**
 * Format date with time (e.g., "Jan 23, 2026 at 10:30 AM")
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date and time
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true }
  
  const dateStr = date.toLocaleDateString('en-US', dateOptions)
  const timeStr = date.toLocaleTimeString('en-US', timeOptions)
  
  return `${dateStr} at ${timeStr}`
}

/**
 * Format number with commas (e.g., 1,234)
 * 
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  return num.toLocaleString('en-US')
}

/**
 * Format count with "k" suffix for thousands (e.g., 1.2k)
 * 
 * @param {number} count - Count to format
 * @returns {string} - Formatted count
 */
export const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

/**
 * Truncate text to specified length
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitalize first letter of string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert kebab-case to Title Case
 * 
 * @param {string} str - Kebab-case string
 * @returns {string} - Title case string
 */
export const kebabToTitle = (str) => {
  return str
    .split('-')
    .map(word => capitalize(word))
    .join(' ')
}
