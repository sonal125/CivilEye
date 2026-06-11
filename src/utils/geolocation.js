/**
 * geolocation.js
 * 
 * Purpose: Geolocation utilities for CivilEye
 * 
 * Responsibilities:
 * - Get user's current GPS coordinates
 * - Handle geolocation permissions
 * - Provide fallback for denied permissions
 * - Format location data
 * 
 * How it works:
 * - Uses browser Geolocation API
 * - Handles success and error cases
 * - Returns promises for async operations
 * - Provides user-friendly error messages
 * 
 * Functions:
 * - getCurrentLocation(): Get user's current position
 * - reverseGeocode(): Convert coordinates to address (mock)
 * 
 * CivilEye Context:
 * Enables automatic location capture when citizens report
 * civic issues, making it easier to pinpoint problem areas.
 */

/**
 * Get current user location using browser Geolocation API
 * 
 * @returns {Promise<Object>} - {lat, lng, address}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    // Request current position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Get address from coordinates (using mock for now)
        const address = await reverseGeocode(latitude, longitude)
        
        resolve({
          lat: latitude,
          lng: longitude,
          address: address
        })
      },
      // Error callback
      (error) => {
        let errorMessage = 'Unable to retrieve location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred'
        }
        
        reject(new Error(errorMessage))
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  })
}

/**
 * Convert coordinates to human-readable address
 * 
 * Note: This is a mock implementation.
 * In production, this would use a real geocoding API like:
 * - Google Maps Geocoding API
 * - OpenStreetMap Nominatim
 * - Mapbox Geocoding API
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address
 */
export const reverseGeocode = async (lat, lng) => {
  // Mock implementation
  // In production, replace with actual API call
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock address based on coordinates
      const street = Math.floor(Math.abs(lat * 100)) % 100
      const avenue = Math.floor(Math.abs(lng * 100)) % 20
      
      resolve(`${street} Main Street & ${avenue}th Avenue`)
    }, 300)
  })
}

/**
 * Format coordinates for display
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} - Formatted coordinates
 */
export const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

/**
 * Calculate distance between two points (Haversine formula)
 * 
 * @param {number} lat1 - First point latitude
 * @param {number} lng1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lng2 - Second point longitude
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

/**
 * Convert degrees to radians
 * 
 * @param {number} degrees - Degrees
 * @returns {number} - Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180)
}
