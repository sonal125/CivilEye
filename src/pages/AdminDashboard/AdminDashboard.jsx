/**
 * AdminDashboard.jsx
 * 
 * Purpose: Administrative dashboard for municipal authorities in CivilEye
 * 
 * Responsibilities:
 * - Display all complaints with management options
 * - Show analytics and statistics
 * - Allow status updates
 * - Assign complaints to departments
 * - Filter and sort complaints
 * 
 * CivilEye Context:
 * Professional admin interface for municipal authorities to manage civic issues.
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminAnalytics, getComplaints, updateComplaint } from '../../services/api'
import { departments } from '../../services/mockData'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge'
import { formatDateTime, kebabToTitle } from '../../utils/formatters'
import './AdminDashboard.css'

function AdminDashboard({ user }) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(() => {
    fetchComplaints()
  }, [filterStatus])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchComplaints = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getComplaints({ status: filterStatus, sortBy: 'newest' })
      setComplaints(data)
    } catch (error) {
      console.error('Error fetching complaints:', error)
      setError(error?.message || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    setError('')
    try {
      const data = await getAdminAnalytics()
      setStats({
        total: data?.total ?? 0,
        pending: data?.reported ?? 0,
        assigned: data?.assigned ?? 0,
        inProgress: data?.inProgress ?? 0,
        resolved: data?.resolved ?? 0
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Keep table usable even if analytics fails
      if (error?.status === 403) {
        setError('Forbidden: admin access required for analytics')
      }
    }
  }

  const handleStatusUpdate = async (complaintId, newStatus, department = null) => {
    try {
      const updates = { status: newStatus }
      if (department) {
        updates.assignedTo = department
      }
      
      await updateComplaint(complaintId, updates)
      fetchComplaints()
      fetchStats()
    } catch (error) {
      console.error('Error updating complaint:', error)
      setError(error?.message || 'Failed to update complaint')
    }
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Manage and track civic issues</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Issues</div>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-card in-progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>

          <div className="stat-card resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="admin-filters">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Complaints Table */}
        {loading ? (
          <LoadingSpinner message="Loading complaints..." />
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Issue</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(complaint => (
                  <tr key={complaint.id}>
                    <td>#{complaint.id}</td>
                    <td>
                      <Link to={`/complaints/${complaint.id}`} className="complaint-link">
                        {complaint.title}
                      </Link>
                    </td>
                    <td>{kebabToTitle(complaint.issueType)}</td>
                    <td>
                      <PriorityBadge priority={complaint.priority} />
                    </td>
                    <td>
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td>{complaint.assignedTo || '-'}</td>
                    <td className="date-col">{formatDateTime(complaint.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        {complaint.status === 'pending' && (
                          <select
                            onChange={(e) => handleStatusUpdate(complaint.id, 'assigned', e.target.value)}
                            defaultValue=""
                            className="action-select"
                          >
                            <option value="" disabled>Assign to...</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        )}
                        {complaint.status === 'assigned' && (
                          <button
                            onClick={() => handleStatusUpdate(complaint.id, 'in-progress')}
                            className="btn btn-sm btn-primary"
                          >
                            Start Work
                          </button>
                        )}
                        {complaint.status === 'in-progress' && (
                          <button
                            onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                            className="btn btn-sm btn-success"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
