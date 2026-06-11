/**
 * complaint.routes.js
 *
 * Purpose:
 * - Complaint route definitions for CivilEye.
 *
 * Responsibilities:
 * - Public feed routes (list + details).
 * - Protected interaction routes (create, upvote, comment).
 * - Bind image upload middleware for complaint creation.
 *
 * How it connects:
 * - Mounted at `/api/complaints` in `src/app.js`.
 */

const express = require('express')
const { body } = require('express-validator')

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  upvoteComplaint,
  addComment
} = require('../controllers/complaint.controller')

const { authMiddleware } = require('../middleware/auth.middleware')
const { upload } = require('../services/image.service')

const router = express.Router()

// Public
router.get('/', getComplaints)
router.get('/:id', getComplaintById)

// Create complaint with image upload (authenticated)
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  [
    body('title').isString().trim().isLength({ min: 5, max: 140 }),
    body('description').isString().trim().isLength({ min: 10, max: 5000 }),
    body('issueType').isString().trim().isLength({ min: 2, max: 60 }),
    body('priority').optional().isString().trim()
  ],
  createComplaint
)

// Upvote (authenticated)
router.post('/:id/upvote', authMiddleware, upvoteComplaint)

// Comment (authenticated)
router.post(
  '/:id/comment',
  authMiddleware,
  [body('message').isString().trim().isLength({ min: 1, max: 2000 })],
  addComment
)

module.exports = router
