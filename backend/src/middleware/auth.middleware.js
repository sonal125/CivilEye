/**
 * auth.middleware.js
 *
 * Purpose:
 * - JWT authentication middleware for CivilEye.
 *
 * Responsibilities:
 * - Read the Bearer token from the Authorization header.
 * - Verify and decode JWT.
 * - Load the user from MongoDB and attach it to `req.user`.
 *
 * How it connects:
 * - Used in protected routes (complaint creation, comments, upvotes, admin APIs).
 */

const jwt = require('jsonwebtoken')
const { env } = require('../config/env')
const { User } = require('../models/User.model')
const { AppError, asyncHandler } = require('../utils/error.util')

const authMiddleware = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Authentication required (missing Bearer token)', 401)
  }

  let payload
  try {
    payload = jwt.verify(token, env.JWT_SECRET)
  } catch (e) {
    throw new AppError('Invalid or expired token', 401)
  }

  const user = await User.findById(payload.sub).select('name email role createdAt')
  if (!user) {
    throw new AppError('User not found for this token', 401)
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  }

  next()
})

module.exports = { authMiddleware }
