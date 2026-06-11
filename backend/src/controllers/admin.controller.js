/**
 * admin.controller.js
 *
 * Purpose:
 * - Admin-only APIs for CivilEye.
 *
 * Responsibilities:
 * - Update complaint status (and optional assignment).
 * - Provide analytics for municipal authorities.
 *
 * How it connects:
 * - Used by `src/routes/admin.routes.js`.
 * - Protected by `auth.middleware.js` + `role.middleware.js`.
 */

const { validationResult } = require('express-validator')

const { Complaint } = require('../models/Complaint.model')
const { ok } = require('../utils/response.util')
const { AppError, asyncHandler } = require('../utils/error.util')

const normalizeStatus = (statusRaw) => {
  const s = String(statusRaw || '').trim().toLowerCase()
  if (s === 'pending' || s === 'reported') return 'reported'
  if (s === 'assigned') return 'assigned'
  if (s === 'in progress' || s === 'in-progress') return 'in-progress'
  if (s === 'resolved') return 'resolved'
  return s
}

/**
 * PATCH /api/admin/complaints/:id/status
 *
 * Admin-only status update.
 * Inputs:
 * - status (Reported/Assigned/In Progress/Resolved supported)
 * - assignedTo (optional)
 */
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array())
  }

  const { status, assignedTo } = req.body

  const updates = {
    status: normalizeStatus(status)
  }

  if (assignedTo !== undefined) {
    updates.assignedTo = assignedTo ? String(assignedTo).trim() : null
  }

  const complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, { new: true })
  if (!complaint) {
    throw new AppError('Complaint not found', 404)
  }

  return ok(res, {
    message: 'Complaint status updated',
    data: complaint
  })
})

/**
 * GET /api/admin/analytics
 *
 * Returns high-level statistics for the admin dashboard.
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const [total, reported, assigned, inProgress, resolved] = await Promise.all([
    Complaint.countDocuments({}),
    Complaint.countDocuments({ status: 'reported' }),
    Complaint.countDocuments({ status: 'assigned' }),
    Complaint.countDocuments({ status: 'in-progress' }),
    Complaint.countDocuments({ status: 'resolved' })
  ])

  return ok(res, {
    data: {
      total,
      reported,
      assigned,
      inProgress,
      resolved
    }
  })
})

module.exports = {
  updateComplaintStatus,
  getAnalytics
}
