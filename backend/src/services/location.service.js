/**
 * location.service.js
 *
 * Purpose:
 * - Location and metadata normalization for CivilEye.
 *
 * Responsibilities:
 * - Validate and normalize incoming location payloads.
 * - Ensure numeric coordinate fields are properly typed.
 *
 * How it connects:
 * - Used by complaint creation/update controllers.
 */

const { AppError } = require('../utils/error.util')

/**
 * Normalize an incoming location payload.
 *
 * Input:
 * - Raw location object (typically from frontend form submission).
 *
 * Output:
 * - Normalized object with numeric lat/lng and optional fields.
 */
function normalizeLocation(raw) {
  if (!raw) {
    throw new AppError('Location is required', 400)
  }

  const latitude = Number(raw.latitude)
  const longitude = Number(raw.longitude)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new AppError('Valid latitude and longitude are required', 400)
  }

  const altitude = raw.altitude === null || raw.altitude === undefined ? null : Number(raw.altitude)
  const accuracy = raw.accuracy === null || raw.accuracy === undefined ? null : Number(raw.accuracy)

  return {
    latitude,
    longitude,
    altitude: Number.isFinite(altitude) ? altitude : null,
    accuracy: Number.isFinite(accuracy) ? accuracy : null,
    address: typeof raw.address === 'string' ? raw.address.trim() : ''
  }
}

module.exports = { normalizeLocation }
