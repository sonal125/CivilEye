/**
 * response.util.js
 *
 * Purpose:
 * - Standard API response helpers.
 *
 * Responsibilities:
 * - Provide consistent success response shape across controllers.
 * - Reduce repeated response boilerplate.
 *
 * How it connects:
 * - Used inside controllers in `src/controllers/*`.
 */

function ok(res, { statusCode = 200, message = 'OK', data = null, meta = null } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  })
}

module.exports = { ok }
