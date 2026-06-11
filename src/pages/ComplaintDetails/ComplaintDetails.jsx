/**
 * ComplaintDetails.jsx
 * 
 * Purpose: Detailed view of a single complaint in CivilEye
 * 
 * Responsibilities:
 * - Display full complaint information
 * - Show complaint image, description, location
 * - Display status timeline
 * - Allow commenting
 * - Enable upvoting
 * - Show all comments
 * 
 * CivilEye Context:
 * Detailed complaint view for transparency and tracking.
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getComplaintDetails, addComment, upvoteComplaint } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge'
import { formatDateTime, formatRelativeTime, kebabToTitle } from '../../utils/formatters'
import './ComplaintDetails.css'

function ComplaintDetails({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [complaint, setComplaint] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [upvoting, setUpvoting] = useState(false)

  useEffect(() => {
    fetchComplaintData()
  }, [id])

  const fetchComplaintData = async () => {
    setLoading(true)
    try {
      const data = await getComplaintDetails(id)
      setComplaint(data.complaint)
      setComments(data.comments)
    } catch (error) {
      console.error('Error fetching complaint:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async () => {
    if (!user || upvoting) return
    
    setUpvoting(true)
    try {
      const updated = await upvoteComplaint(id)
      setComplaint(updated)
    } catch (error) {
      console.error('Error upvoting:', error)
    } finally {
      setUpvoting(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return

    setSubmittingComment(true)
    try {
      const newComment = await addComment(id, {
        message: commentText.trim()
      })
      setComments([newComment, ...comments])
      setCommentText('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullPage message="Loading complaint details..." />
  }

  if (!complaint) {
    return (
      <div className="error-page">
        <h2>Complaint Not Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Feed
        </button>
      </div>
    )
  }

  return (
    <div className="details-page">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Feed
        </button>

        <div className="details-container">
          {/* Main Content */}
          <div className="details-main">
            <div className="complaint-image-large">
              <img src={complaint.imageUrl} alt={complaint.title} />
            </div>

            <div className="complaint-header-details">
              <div className="header-top">
                <h1>{complaint.title}</h1>
                <div className="header-badges">
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              <div className="complaint-meta-details">
                <span className="meta-item">
                  📂 {kebabToTitle(complaint.issueType)}
                </span>
                <span className="meta-item">
                  📍 {complaint.location.address}
                </span>
                <span className="meta-item">
                  🕒 {formatDateTime(complaint.createdAt)}
                </span>
                <span className="meta-item">
                  👤 {complaint.reportedBy.name}
                </span>
              </div>
            </div>

            <div className="complaint-description-full">
              <h3>Description</h3>
              <p>{complaint.description}</p>
            </div>

            {/* Upvote Section */}
            <div className="upvote-section">
              <button
                onClick={handleUpvote}
                disabled={!user || upvoting}
                className="btn btn-outline upvote-btn"
              >
                👍 {complaint.upvotes} Upvotes
              </button>
              {!user && <span className="login-hint">Login to upvote</span>}
            </div>

            {/* Comments Section */}
            <div className="comments-section">
              <h3>Comments ({comments.length})</h3>

              {user && (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    disabled={submittingComment}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={!commentText.trim() || submittingComment}
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              )}

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-avatar">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <strong>{comment.user.name}</strong>
                          <span className="comment-time">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="details-sidebar">
            <div className="sidebar-card">
              <h3>Issue Details</h3>
              <div className="detail-row">
                <label>Status</label>
                <StatusBadge status={complaint.status} />
              </div>
              <div className="detail-row">
                <label>Priority</label>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <div className="detail-row">
                <label>Assigned To</label>
                <p>{complaint.assignedTo || 'Unassigned'}</p>
              </div>
              <div className="detail-row">
                <label>Reported By</label>
                <p>{complaint.reportedBy.name}</p>
              </div>
              <div className="detail-row">
                <label>Last Updated</label>
                <p>{formatRelativeTime(complaint.updatedAt)}</p>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Location</h3>
              <p className="location-address">{complaint.location.address}</p>
              <p className="location-coords">
                {complaint.location.lat.toFixed(6)}, {complaint.location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetails
