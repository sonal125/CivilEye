/**
 * Home.jsx
 * 
 * Purpose: Public complaint feed and dashboard for CivilEye
 * 
 * Responsibilities:
 * - Display all reported civic complaints
 * - Provide filtering by status, type, and priority
 * - Support sorting (newest, priority, upvotes)
 * - Show complaint cards with key information
 * - Enable navigation to complaint details
 * - Provide search functionality
 * 
 * How it works:
 * - Fetches complaints from API on mount
 * - Maintains filter and sort state
 * - Re-fetches data when filters change
 * - Displays loading states
 * - Shows empty state when no complaints
 * 
 * Features:
 * - Filter by status, issue type, priority
 * - Sort by date, priority, upvotes
 * - Responsive grid layout
 * - Smooth animations
 * 
 * Props:
 * - user: Current logged-in user (optional)
 * 
 * CivilEye Context:
 * Main dashboard showing all civic issues reported by citizens,
 * providing transparency and public visibility.
 * 
 * UI redesigned to match modern CivilEye dashboard layout
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getComplaints } from '../../services/api'
import { issueTypes } from '../../services/mockData'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge'
import { formatRelativeTime, kebabToTitle, formatCount } from '../../utils/formatters'
import './Home.css'

/**
 * Home Component
 * 
 * Public feed displaying all civic complaints with filtering and sorting.
 * 
 * State:
 * - complaints: Array of complaint objects
 * - loading: Loading state
 * - filters: Current filter values
 * - sortBy: Current sort option
 */
function Home({ user }) {
  const [complaints, setComplaints] = useState([])
  const [allComplaints, setAllComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    issueType: '',
    priority: ''
  })
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Fetch complaints on mount and when filters change
   */
  useEffect(() => {
    fetchComplaints()
  }, [filters, sortBy])

  /**
   * Fetch full complaint list for high-level stats
   * This keeps the stats cards stable even when users apply filters.
   */
  useEffect(() => {
    fetchAllComplaints()
  }, [])

  const fetchAllComplaints = async () => {
    try {
      const data = await getComplaints({ sortBy: 'newest' })
      setAllComplaints(data)
    } catch (error) {
      console.error('Error fetching complaints for stats:', error)
    }
  }

  /**
   * Fetch complaints from API
   */
  const fetchComplaints = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getComplaints({ ...filters, sortBy })
      setComplaints(data)
    } catch (error) {
      console.error('Error fetching complaints:', error)
      setError(error?.message || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle filter change
   * 
   * @param {string} filterName - Name of filter
   * @param {string} value - Filter value
   */
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      status: '',
      issueType: '',
      priority: ''
    })
    setSortBy('newest')
    setSearchQuery('')
  }

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = () => {
    return filters.status || filters.issueType || filters.priority || sortBy !== 'newest'
  }

  /**
   * Client-side search across the currently loaded complaint list.
   * Intentionally does not alter routing or API behavior.
   */
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const visibleComplaints = normalizedQuery
    ? complaints.filter((complaint) => {
        const haystack = [
          complaint.title,
          complaint.description,
          complaint.location?.address,
          complaint.issueType
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedQuery)
      })
    : complaints

  const statsSource = allComplaints.length ? allComplaints : complaints
  const activeIssuesCount = statsSource.filter(c => ['pending', 'assigned', 'in-progress'].includes(c.status)).length
  const resolvedTodayCount = statsSource.filter(c => {
    if (c.status !== 'resolved') return false
    const updatedAt = c.updatedAt || c.createdAt
    const d = new Date(updatedAt)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }).length
  const totalIssuesCount = statsSource.length
  const communityMembersDisplay = '1.2k'

  return (
    <div className="home-page">
      {error && (
        <div className="container" style={{ paddingTop: '12px' }}>
          <div className="alert alert-error" role="alert">{error}</div>
        </div>
      )}
      {/*
        Dashboard Hero
        Layout mirrors a modern civic-tech dashboard: kicker + headline, then actions (CTA + search).
        Kept as a single rounded surface for a strong first impression.
      */}
      <div className="dashboard-hero-section">
        <div className="container">
          <div className="dashboard-hero" role="banner">
            <div className="dashboard-hero-content">
              <div className="hero-kicker">Overview</div>
              <h1 className="hero-title">CivilEye Public Feed</h1>
              <p className="hero-subtitle">
                Track, monitor, and resolve civic issues to build a better community together.
              </p>

              <div className="hero-actions" aria-label="Primary actions">
                <Link to="/submit" className="btn btn-primary btn-lg hero-cta">
                  Report New Issue
                </Link>

                <div className="hero-search" role="search">
                  <span className="hero-search-icon" aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find an existing issue..."
                    aria-label="Find an existing issue"
                  />
                </div>
              </div>

              {(normalizedQuery || hasActiveFilters()) && (
                <div className="hero-hint">
                  Showing <strong>{visibleComplaints.length}</strong> of <strong>{complaints.length}</strong> issues
                  {normalizedQuery ? ' matching your search' : ''}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" aria-hidden="true">📌</div>
              <div className="stat-body">
                <div className="stat-label">Active Issues</div>
                <div className="stat-value">{formatCount(activeIssuesCount)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" aria-hidden="true">✅</div>
              <div className="stat-body">
                <div className="stat-label">Resolved Today</div>
                <div className="stat-value">{formatCount(resolvedTodayCount)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" aria-hidden="true">🗂️</div>
              <div className="stat-body">
                <div className="stat-label">Total Issues</div>
                <div className="stat-value">{formatCount(totalIssuesCount)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" aria-hidden="true">👥</div>
              <div className="stat-body">
                <div className="stat-label">Community Members</div>
                <div className="stat-value">{communityMembersDisplay}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-header">
            <h2>Filter Issues</h2>
            {hasActiveFilters() && (
              <button onClick={clearFilters} className="btn btn-outline btn-sm">
                Clear All Filters
              </button>
            )}
          </div>

          <div className="filters-grid">
            {/* Status Filter */}
            <div className="filter-group">
              <label htmlFor="statusFilter">Status</label>
              <select
                id="statusFilter"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Issue Type Filter */}
            <div className="filter-group">
              <label htmlFor="typeFilter">Issue Type</label>
              <select
                id="typeFilter"
                value={filters.issueType}
                onChange={(e) => handleFilterChange('issueType', e.target.value)}
              >
                <option value="">All Types</option>
                {issueTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="filter-group">
              <label htmlFor="priorityFilter">Priority</label>
              <select
                id="priorityFilter"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label htmlFor="sortFilter">Sort By</label>
              <select
                id="sortFilter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="priority">Priority Level</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="complaints-section">
        <div className="container">
          {loading ? (
            <LoadingSpinner message="Loading civic issues..." />
          ) : visibleComplaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Issues Found</h3>
              <p>
                {normalizedQuery
                  ? 'No issues match your search. Try a different keyword.'
                  : hasActiveFilters()
                    ? 'Try adjusting your filters to see more results.'
                    : 'No civic issues have been reported yet. Be the first to report!'}
              </p>
              {(hasActiveFilters() || normalizedQuery) && (
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="complaints-count">
                Showing <strong>{visibleComplaints.length}</strong> issue{visibleComplaints.length !== 1 ? 's' : ''}
              </div>
              <div className="complaints-grid">
                {visibleComplaints.map((complaint) => (
                  <Link
                    key={complaint.id}
                    to={`/complaints/${complaint.id}`}
                    className="complaint-card"
                  >
                    <div className="complaint-image">
                      <img src={complaint.imageUrl} alt={complaint.title} />
                      <div className="complaint-badges">
                        <PriorityBadge priority={complaint.priority} />
                      </div>
                    </div>

                    <div className="complaint-content">
                      <div className="complaint-header">
                        <h3 className="complaint-title">{complaint.title}</h3>
                        <StatusBadge status={complaint.status} />
                      </div>

                      <div className="complaint-meta">
                        <span className="meta-item">
                          <span className="meta-icon">📂</span>
                          {kebabToTitle(complaint.issueType)}
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">📍</span>
                          {complaint.location.address}
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">🕒</span>
                          {formatRelativeTime(complaint.createdAt)}
                        </span>
                      </div>

                      <p className="complaint-description">
                        {complaint.description.substring(0, 120)}
                        {complaint.description.length > 120 ? '...' : ''}
                      </p>

                      <div className="complaint-stats">
                        <span className="stat-item">
                          <span className="stat-icon">👍</span>
                          {complaint.upvotes} upvotes
                        </span>
                        <span className="stat-item">
                          <span className="stat-icon">💬</span>
                          {complaint.comments} comments
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
