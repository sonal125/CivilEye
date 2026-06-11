/**
 * locationService.js
 *
 * Purpose: Location + metadata utilities for CivilEye complaint submissions
 *
 * Responsibilities:
 * - Capture high-accuracy GPS coordinates (lat/lng) with optional accuracy/altitude
 * - Reverse-geocode coordinates into a human-readable location string
 * - Provide consistent date/day/time formatting for capture events
 *
 * Notes:
 * - Uses browser Geolocation API (permission required)
 * - Uses OpenStreetMap Nominatim reverse geocoding (best-effort; may be rate-limited)
 * - Designed for frontend-only usage; in production, reverse-geocoding is often done server-side
 */

/**
 * @typedef {Object} GeoCoords
 * @property {number} latitude
 * @property {number} longitude
 * @property {number|null} accuracy
 * @property {number|null} altitude
 */

/**
 * Get a single high-accuracy geolocation reading.
 *
 * @param {PositionOptions} [options]
 * @returns {Promise<GeoCoords>}
 */
export const getGeoPosition = (options = { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude } = position.coords
        resolve({
          latitude,
          longitude,
          accuracy: typeof accuracy === 'number' ? accuracy : null,
          altitude: typeof altitude === 'number' ? altitude : null
        })
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            // Matches product requirement wording
            errorMessage = 'Location permission required for accurate reporting'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown location error occurred'
        }

        reject(new Error(errorMessage))
      },
      options
    )
  })
}

/**
 * Build a compact, readable location label from Nominatim response.
 *
 * @param {any} nominatimJson
 * @returns {string}
 */
export const buildReadableLocation = (nominatimJson) => {
  const addr = nominatimJson?.address
  if (!addr) return nominatimJson?.display_name || ''

  const area = addr.suburb || addr.neighbourhood || addr.quarter || addr.village || addr.hamlet || addr.locality || ''
  const city = addr.city || addr.town || addr.municipality || addr.county || ''
  const state = addr.state || ''
  const country = addr.country || ''

  const parts = [area, city, state, country].filter(Boolean)
  return parts.join(', ')
}

/**
 * Reverse-geocode coordinates to a readable address using OpenStreetMap Nominatim.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<{ displayName: string, readable: string, raw: any }>}
 */
export const reverseGeocodeOSM = async (latitude, longitude, opts = {}) => {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('zoom', '18')
  url.searchParams.set('addressdetails', '1')

  const res = await fetch(url.toString(), {
    method: 'GET',
    signal: opts.signal,
    headers: {
      // Keep headers minimal for browser environments
      'Accept': 'application/json'
    }
  })

  if (!res.ok) {
    throw new Error('Unable to resolve address from coordinates')
  }

  const json = await res.json()
  const readable = buildReadableLocation(json)

  return {
    displayName: json?.display_name || readable,
    readable,
    raw: json
  }
}

/**
 * Format date/day/time at the moment of capture.
 *
 * @param {Date} date
 * @returns {{ date: string, day: string, time: string, iso: string }}
 */
export const formatCaptureDateTime = (date) => {
  const iso = date.toISOString()

  // DD/MM/YYYY
  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  // Monday, Tuesday...
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long'
  })

  // HH:MM:SS (24h)
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  return {
    date: dateFormatter.format(date),
    day: dayFormatter.format(date),
    time: timeFormatter.format(date),
    iso
  }
}
