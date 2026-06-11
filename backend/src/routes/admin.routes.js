/**
 * admin.routes.js
 *
 * Purpose:
 * - Admin route definitions for CivilEye.
 *
 * Responsibilities:
 * - Restrict routes to admin role.
 * - Bind admin controller handlers.
 *
 * How it connects:
 * - Mounted at `/api/admin` in `src/app.js`.
 */

const express = require('express')
const { body } = require('express-validator')

const { authMiddleware } = require('../middleware/auth.middleware')
const { requireRole } = require('../middleware/role.middleware')
const { updateComplaintStatus, getAnalytics } = require('../controllers/admin.controller')

const router = express.Router()

// Admin-only
router.use(authMiddleware)
router.use(requireRole('admin'))

router.patch(
  '/complaints/:id/status',
  [
    body('status').isString().trim().notEmpty(),
    body('assignedTo').optional().isString().trim()
  ],
  updateComplaintStatus
)

router.get('/analytics', getAnalytics)

module.exports = router
