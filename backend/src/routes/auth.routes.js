/**
 * auth.routes.js
 *
 * Purpose:
 * - Auth route definitions for CivilEye.
 *
 * Responsibilities:
 * - Declare request validators.
 * - Bind routes to controller handlers.
 *
 * How it connects:
 * - Mounted at `/api/auth` in `src/app.js`.
 */

const express = require('express')
const { body } = require('express-validator')

const { register, login } = require('../controllers/auth.controller')

const router = express.Router()

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').isString().trim().isLength({ min: 2, max: 120 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 200 }),
    body('role').optional().isString().trim(),
    body('adminInviteCode').optional().isString().trim()
  ],
  register
)

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 200 })
  ],
  login
)

module.exports = router
