/**
 * PriorityBadge.jsx
 * 
 * Purpose: Display complaint priority badges in CivilEye
 * 
 * Responsibilities:
 * - Show priority level with appropriate color
 * - Provide consistent priority visualization
 * - Support all priority levels
 * 
 * How it works:
 * - Receives priority string as prop
 * - Maps priority to color scheme
 * - Renders colored badge with text and icon
 * 
 * Props:
 * - priority: Priority string (critical, high, medium, low)
 * 
 * Priority Levels:
 * - critical: Red (urgent, safety issues)
 * - high: Orange (important, needs attention)
 * - medium: Blue (normal priority)
 * - low: Gray (minor issues)
 * 
 * CivilEye Context:
 * Helps citizens and authorities quickly identify
 * the urgency of reported civic issues.
 */

import React from 'react'
import './PriorityBadge.css'

/**
 * PriorityBadge Component
 * 
 * Displays a colored badge representing complaint priority.
 * 
 * @param {string} priority - Priority level of the complaint
 */
function PriorityBadge({ priority }) {
  /**
   * Get priority display configuration
   * Returns label, icon, and CSS class for the given priority
   * 
   * @param {string} priority - Priority value
   * @returns {Object} - {label, icon, className}
   */
  const getPriorityConfig = (priority) => {
    const priorityMap = {
      'critical': {
        label: 'Critical',
        icon: '🔴',
        className: 'priority-critical'
      },
      'high': {
        label: 'High',
        icon: '🟠',
        className: 'priority-high'
      },
      'medium': {
        label: 'Medium',
        icon: '🔵',
        className: 'priority-medium'
      },
      'low': {
        label: 'Low',
        icon: '⚪',
        className: 'priority-low'
      }
    }

    return priorityMap[priority] || { 
      label: priority, 
      icon: '⚪',
      className: 'priority-default' 
    }
  }

  const config = getPriorityConfig(priority)

  return (
    <span className={`priority-badge ${config.className}`}>
      <span className="priority-icon">{config.icon}</span>
      {config.label}
    </span>
  )
}

export default PriorityBadge
