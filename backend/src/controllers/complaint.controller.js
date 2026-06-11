/**
 * complaint.controller.js
 *
 * Purpose:
 * - Complaint APIs for CivilEye (public + authenticated interactions).
 *
 * Responsibilities:
 * - Create a complaint with image upload and location metadata.
 * - Provide public feed listing with filters and sorting.
 * - Provide complaint details.
 * - Allow authenticated users to upvote and comment.
 *
 * How it connects:
 * - Used by `src/routes/complaint.routes.js`.
 * - Uses `Complaint.model.js` and `Comment.model.js` for persistence.
 * - Uses `location.service.js` for location normalization.
 */

const { validationResult } = require('express-validator')

const { Complaint } = require('../models/Complaint.model')
const { Comment } = require('../models/Comment.model')
const { ok } = require('../utils/response.util')
const { AppError, asyncHandler } = require('../utils/error.util')
const { normalizeLocation } = require('../services/location.service')

const mapSort = (sortBy) => {
  const s = String(sortBy || 'newest').toLowerCase()
  if (s === 'newest') return { createdAt: -1 }
  if (s === 'upvotes') return { upvotes: -1, createdAt: -1 }
  if (s === 'priority') {
    // Custom order: critical > high > medium > low
    // Implemented using aggregation in listing (see getComplaints).
    return null
  }
  return { createdAt: -1 }
}

const normalizeStatusQuery = (statusRaw) => {
  if (!statusRaw) return null
  const s = String(statusRaw).trim().toLowerCase()

  // Frontend commonly uses "pending"; backend stores it as "reported".
  if (s === 'pending') return 'reported'

  if (['reported', 'assigned', 'in-progress', 'resolved'].includes(s)) return s

  // Accept title-like variants
  if (s === 'in progress') return 'in-progress'

  return s
}

/**
 * POST /api/complaints
 *
 * Creates a complaint (authenticated).
 *
 * Inputs:
 * - multipart/form-data
 * - image: file (required)
 * - title, description, issueType, priority
 * - location.latitude, location.longitude, location.altitude, location.accuracy, location.address
 */
const createComplaint = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array())
  }

  if (!req.file) {
    throw new AppError('Image file is required', 400)
  }

  const { title, description, issueType, priority } = req.body

  // Support both nested payloads (location[latitude]) and JSON string payloads.
  let locationRaw = req.body.location
  if (!locationRaw) {
    locationRaw = {
      latitude: req.body['location.latitude'] ?? req.body.latitude,
      longitude: req.body['location.longitude'] ?? req.body.longitude,
      altitude: req.body['location.altitude'] ?? req.body.altitude,
      accuracy: req.body['location.accuracy'] ?? req.body.accuracy,
      address: req.body['location.address'] ?? req.body.address
    }
  }

  const location = normalizeLocation(locationRaw)

  // Optional: store capture metadata (date/day/time and any client-provided context)
  let captureMetadata = null
  if (req.body.captureMetadata) {
    if (typeof req.body.captureMetadata === 'string') {
      try {
        captureMetadata = JSON.parse(req.body.captureMetadata)
      } catch (e) {
        // Keep null if malformed; do not block complaint creation.
        captureMetadata = null
      }
    } else if (typeof req.body.captureMetadata === 'object') {
      captureMetadata = req.body.captureMetadata
    }
  }

  const complaint = await Complaint.create({
    title: String(title).trim(),
    description: String(description).trim(),
    issueType: String(issueType).trim().toLowerCase(),
    priority: priority ? String(priority).trim().toLowerCase() : 'medium',
    imagePath: `/uploads/${req.file.filename}`,
    location,
    captureMetadata,
    createdBy: req.user.id
  })

  return ok(res, {
    statusCode: 201,
    message: 'Complaint created successfully',
    data: complaint
  })
})

/**
 * GET /api/complaints
 *
 * Public feed endpoint with optional filters.
 * Query params:
 * - status, issueType, priority, sortBy
 */
const getComplaints = asyncHandler(async (req, res) => {
  const { status, issueType, priority, sortBy } = req.query

  const match = {}

  const normalizedStatus = normalizeStatusQuery(status)
  if (normalizedStatus) match.status = normalizedStatus
  if (issueType) match.issueType = String(issueType).trim().toLowerCase()
  if (priority) match.priority = String(priority).trim().toLowerCase()

  // Priority sort uses a safe aggregation (no deprecated syntax).
  if (String(sortBy || '').toLowerCase() === 'priority') {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }

    const data = await Complaint.aggregate([
      { $match: match },
      {
        $addFields: {
          _priorityRank: {
            $ifNull: [
              { $getField: { field: '$priority', input: priorityOrder } },
              99
            ]
          }
        }
      },
      { $sort: { _priorityRank: 1, createdAt: -1 } },
      { $project: { _priorityRank: 0 } }
    ])

    return ok(res, { data })
  }

  const sort = mapSort(sortBy) || { createdAt: -1 }

  const data = await Complaint.find(match)
    .sort(sort)
    .populate('createdBy', 'name email role')
    .lean()

  return ok(res, { data })
})

/**
 * GET /api/complaints/:id
 *
 * Returns complaint details. Publicly visible.
 */
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('createdBy', 'name email role')

  if (!complaint) {
    throw new AppError('Complaint not found', 404)
  }

  // Fetch latest comments
  const comments = await Comment.find({ complaintId: complaint._id })
    .sort({ timestamp: -1 })
    .populate('userId', 'name role')
    .lean()

  return ok(res, {
    data: {
      complaint,
      comments
    }
  })
})

/**
 * POST /api/complaints/:id/upvote
 *
 * Authenticated upvote.
 */
const upvoteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  )

  if (!complaint) {
    throw new AppError('Complaint not found', 404)
  }

  return ok(res, {
    message: 'Upvoted successfully',
    data: complaint
  })
})

/**
 * POST /api/complaints/:id/comment
 *
 * Authenticated comment.
 * Inputs:
 * - message
 */
const addComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array())
  }

  const complaint = await Complaint.findById(req.params.id)
  if (!complaint) {
    throw new AppError('Complaint not found', 404)
  }

  const comment = await Comment.create({
    complaintId: complaint._id,
    userId: req.user.id,
    message: String(req.body.message).trim(),
    timestamp: new Date()
  })

  const populated = await Comment.findById(comment._id).populate('userId', 'name role')

  return ok(res, {
    statusCode: 201,
    message: 'Comment added successfully',
    data: populated
  })
})

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  upvoteComplaint,
  addComment
}
