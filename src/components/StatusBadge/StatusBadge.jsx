/**
 * StatusBadge.jsx
 * 
 * Purpose: Display complaint status badges in CivilEye
 * 
 * Responsibilities:
 * - Show complaint status with appropriate color
 * - Provide consistent status visualization
 * - Support all status types
 * 
 * How it works:
 * - Receives status string as prop
 * - Maps status to color scheme
 * - Renders colored badge with text
 * 
 * Props:
 * - status: Status string (pending, assigned, in-progress, resolved, rejected)
 * 
 * Status Types:
 * - pending: Yellow/Orange (awaiting assignment)
 * - assigned: Blue (assigned to department)
 * - in-progress: Purple (being worked on)
 * - resolved: Green (completed)
 * - rejected: Red (cannot be resolved)
 * 
 * CivilEye Context:
 * Provides clear visual indicators of complaint status throughout
 * the platform for transparency and tracking.
 */

import React from 'react'
import './StatusBadge.css'

/**
 * StatusBadge Component
 * 
 * Displays a colored badge representing complaint status.
 * 
 * @param {string} status - Current status of the complaint
 */
function StatusBadge({ status }) {
  /**
   * Get status display configuration
   * Returns label and CSS class for the given status
   * 
   * @param {string} status - Status value
   * @returns {Object} - {label, className}
   */
  const getStatusConfig = (status) => {
    const statusMap = {
      'pending': {
        label: 'Pending',
        className: 'status-pending'
      },
      'assigned': {
        label: 'Assigned',
        className: 'status-assigned'
      },
      'in-progress': {
        label: 'In Progress',
        className: 'status-in-progress'
      },
      'resolved': {
        label: 'Resolved',
        className: 'status-resolved'
      },
      'rejected': {
        label: 'Rejected',
        className: 'status-rejected'
      }
    }

    return statusMap[status] || { label: status, className: 'status-default' }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  )
}

export default StatusBadge
