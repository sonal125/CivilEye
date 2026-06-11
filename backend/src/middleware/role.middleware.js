/**
 * role.middleware.js
 *
 * Purpose:
 * - Role-based access control middleware for CivilEye.
 *
 * Responsibilities:
 * - Ensure an authenticated user has an allowed role.
 *
 * How it connects:
 * - Used by admin routes to restrict access to municipal authorities.
 */

const { AppError } = require('../utils/error.util')

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: insufficient permissions', 403))
    }

    next()
  }
}

module.exports = { requireRole }
