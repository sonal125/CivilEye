/**
 * error.util.js
 *
 * Purpose:
 * - Centralized error primitives and global error handlers for CivilEye backend.
 *
 * Responsibilities:
 * - Provide an operational `AppError` type.
 * - Provide `asyncHandler` to wrap async route handlers.
 * - Provide Express middlewares for 404 and error handling.
 *
 * How it connects:
 * - Controllers throw `AppError` for known client/server errors.
 * - `src/app.js` registers `notFoundHandler` and `errorHandler`.
 */

class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.details = details
    this.isOperational = true
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404))
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV !== 'production') {
    console.error('[CivilEye] Error:', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details || null
  })
}

module.exports = {
  AppError,
  asyncHandler,
  notFoundHandler,
  errorHandler
}
