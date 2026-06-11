/**
 * SubmitComplaint.jsx
 * 
 * Purpose: Complaint submission form for CivilEye
 * 
 * Responsibilities:
 * - Provide form for reporting civic issues
 * - Allow direct camera capture (mobile) or gallery upload (desktop fallback)
 * - Automatically capture metadata at the moment an image is captured/selected:
 *   - Date, Day, Time
 *   - Latitude, Longitude, Accuracy, Altitude (if available)
 *   - Human-readable location via reverse geocoding
 * - Validate all form fields
 * - Submit complaint to API
 * - Show success/error messages
 * 
 * How it works:
 * - Uses React hooks for form state management
 * - Uses `input type="file" accept="image/*" capture="environment"` to trigger rear camera on supported devices
 * - Uses Geolocation API to capture precise GPS coordinates (permission required)
 * - Uses OpenStreetMap reverse geocoding (best-effort) to convert coordinates into a readable address
 * - Validates all required fields before submission
 * - Shows real-time preview of uploaded image
 * - Provides inline error messages
 * 
 * Form Fields:
 * - Image: Required (camera or upload)
 * - Issue Type: Required dropdown
 * - Title: Required text
 * - Description: Required textarea
 * - Location: Auto-captured (permission required for accurate reporting)
 * - Priority: Auto-assigned based on issue type
 * 
 * Props:
 * - user: Current logged-in user object
 * 
 * CivilEye Context:
 * This is the core feature enabling citizens to report civic issues
 * with image evidence and precise location data.
 */

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createComplaint } from '../../services/api'
import { getGeoPosition, reverseGeocodeOSM, formatCaptureDateTime } from '../../services/locationService'
import { issueTypes } from '../../services/mockData'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import './SubmitComplaint.css'

/**
 * SubmitComplaint Component
 * 
 * Professional form interface for reporting civic issues.
 * 
 * State:
 * - formData: All form field values
 * - imagePreview: Base64 preview of uploaded image
 * - errors: Validation error messages
 * - loading: Form submission state
 * - locationLoading: GPS location capture state
 */
function SubmitComplaint({ user }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const metadataRequestIdRef = useRef(0)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueType: '',
    priority: 'medium',
    imageUrl: '',
    imageFile: null,
    location: {
      lat: null,
      lng: null,
      address: '',
      accuracy: null,
      altitude: null
    }
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [captureMetadata, setCaptureMetadata] = useState(null)
  const [metadataLoading, setMetadataLoading] = useState(false)
  const [metadataError, setMetadataError] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  /**
   * Auto-capture location on component mount
   */
  useEffect(() => {
    captureLocation()
  }, [])

  /**
   * Capture user's current GPS location
   * Uses Geolocation API
   */
  const captureLocation = async () => {
    setLocationLoading(true)
    try {
      const coords = await getGeoPosition()
      let address = ''
      try {
        const resolved = await reverseGeocodeOSM(coords.latitude, coords.longitude)
        address = resolved.readable || resolved.displayName || ''
      } catch (e) {
        address = ''
      }

      const location = {
        lat: coords.latitude,
        lng: coords.longitude,
        address,
        accuracy: coords.accuracy,
        altitude: coords.altitude
      }

      setFormData(prev => ({
        ...prev,
        location: location
      }))
    } catch (error) {
      console.error('Location error:', error)
      setErrors(prev => ({
        ...prev,
        location: error.message
      }))
    } finally {
      setLocationLoading(false)
    }
  }

  /**
   * Capture metadata at the time the user selects/captures an image.
   * This is the core "authenticity" enhancement for civic reporting.
   */
  const captureMetadataForImage = async () => {
    const requestId = ++metadataRequestIdRef.current
    setMetadataLoading(true)
    setMetadataError('')

    try {
      const coords = await getGeoPosition()

      // If a newer image selection happened, ignore this result
      if (requestId !== metadataRequestIdRef.current) return

      let resolvedAddress = ''
      try {
        const resolved = await reverseGeocodeOSM(coords.latitude, coords.longitude)
        resolvedAddress = resolved.readable || resolved.displayName || ''
      } catch (e) {
        resolvedAddress = ''
      }

      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          lat: coords.latitude,
          lng: coords.longitude,
          address: resolvedAddress || prev.location.address,
          accuracy: coords.accuracy,
          altitude: coords.altitude
        }
      }))

      setCaptureMetadata(prev => ({
        ...(prev || {}),
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        locationText: resolvedAddress || 'Not available'
      }))
    } catch (error) {
      console.error('Metadata capture error:', error)
      setMetadataError(error.message)
      setErrors(prev => ({
        ...prev,
        location: error.message
      }))
    } finally {
      if (requestId === metadataRequestIdRef.current) {
        setMetadataLoading(false)
      }
    }
  }

  /**
   * Handle text input changes
   * 
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Auto-assign priority based on issue type
    if (name === 'issueType') {
      const criticalTypes = ['drainage', 'fallen-tree']
      const highTypes = ['pothole', 'road-blockage']
      
      let priority = 'medium'
      if (criticalTypes.includes(value)) {
        priority = 'critical'
      } else if (highTypes.includes(value)) {
        priority = 'high'
      }
      
      setFormData(prev => ({
        ...prev,
        priority: priority
      }))
    }
  }

  /**
   * Handle image file selection
   * Supports both camera and file upload
   * 
   * @param {Event} e - File input change event
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const captureTime = new Date()
    const captureClock = formatCaptureDateTime(captureTime)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: 'Please select a valid image file'
      }))
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        image: 'Image size must be less than 5MB'
      }))
      return
    }

    // Read and preview image
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      setFormData(prev => ({
        ...prev,
        imageUrl: reader.result,
        imageFile: file
      }))

      setCaptureMetadata({
        capturedAtISO: captureClock.iso,
        date: captureClock.date,
        day: captureClock.day,
        time: captureClock.time,
        latitude: null,
        longitude: null,
        accuracy: null,
        altitude: null,
        locationText: 'Detecting location...'
      })

      // Capture location + reverse-geocoded address for authenticity
      captureMetadataForImage()
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  /**
   * Trigger file input click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * Trigger camera input click
   */
  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  /**
   * Remove selected image
   */
  const handleRemoveImage = () => {
    setImagePreview(null)
    setCaptureMetadata(null)
    setMetadataError('')
    setFormData(prev => ({
      ...prev,
      imageUrl: '',
      imageFile: null
    }))
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  /**
   * Validate form fields
   * 
   * @returns {boolean} - True if form is valid
   */
  const validateForm = () => {
    const newErrors = {}

    if (!formData.imageFile) {
      newErrors.image = 'Please upload an image of the issue'
    }

    if (!formData.issueType) {
      newErrors.issueType = 'Please select an issue type'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title'
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description'
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (!formData.location.lat || !formData.location.lng) {
      newErrors.location = 'Location permission required for accurate reporting'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await createComplaint({
        title: formData.title.trim(),
        description: formData.description.trim(),
        issueType: formData.issueType,
        priority: formData.priority,
        imageFile: formData.imageFile,
        location: formData.location,
        captureMetadata: captureMetadata
          ? {
              ...captureMetadata,
              geo: {
                latitude: formData.location.lat,
                longitude: formData.location.lng,
                accuracy: formData.location.accuracy,
                altitude: formData.location.altitude
              }
            }
          : null
      })

      // Show success message
      setSubmitSuccess(true)

      // Redirect after delay
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (error) {
      console.error('Submission error:', error)
      if (error?.status === 401) {
        setErrors({ submit: 'Please login again to submit a complaint.' })
      } else if (error?.status === 0) {
        setErrors({ submit: 'Network error: Unable to reach the backend server.' })
      } else {
        setErrors({ submit: error?.message || 'Failed to submit complaint. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  // Show success message
  if (submitSuccess) {
    return (
      <div className="submit-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Issue Reported Successfully!</h2>
          <p>Your civic issue has been submitted and will be reviewed by municipal authorities.</p>
          <p className="success-note">Redirecting to public feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="submit-page">
      <div className="submit-container">
        <div className="submit-header">
          <h1>Report a Civic Issue</h1>
          <p className="submit-subtitle">
            Help improve your community by reporting civic issues with photo evidence
          </p>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          {/* Image Upload Section */}
          <div className="form-section">
            <h3>Issue Photo *</h3>
            <p className="section-description">
              Upload a clear photo showing the civic issue
            </p>

            {!imagePreview ? (
              <div className="image-upload-area">
                <div className="upload-buttons">
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="btn btn-primary"
                  >
                    📷 Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="btn btn-secondary"
                  >
                    📁 Upload from Gallery
                  </button>
                </div>
                <p className="upload-hint">Maximum file size: 5MB</p>
              </div>
            ) : (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Issue preview" className="image-preview" />

                {/* Read-only metadata card (fade-in) */}
                <div className={`metadata-card ${captureMetadata ? 'visible' : ''}`}>
                  <div className="metadata-header">
                    <h4>Captured Metadata</h4>
                    {metadataLoading && <span className="metadata-loading">Collecting…</span>}
                  </div>

                  {metadataError && (
                    <div className="metadata-warning">
                      {metadataError}
                    </div>
                  )}

                  {captureMetadata && (
                    <div className="metadata-grid">
                      <div className="metadata-item">
                        <div className="metadata-label">Date:</div>
                        <div className="metadata-value">{captureMetadata.date}</div>
                      </div>
                      <div className="metadata-item">
                        <div className="metadata-label">Day:</div>
                        <div className="metadata-value">{captureMetadata.day}</div>
                      </div>
                      <div className="metadata-item">
                        <div className="metadata-label">Time:</div>
                        <div className="metadata-value">{captureMetadata.time}</div>
                      </div>
                      <div className="metadata-item">
                        <div className="metadata-label">Latitude:</div>
                        <div className="metadata-value">
                          {typeof captureMetadata.latitude === 'number' ? captureMetadata.latitude.toFixed(6) : 'Detecting…'}
                        </div>
                      </div>
                      <div className="metadata-item">
                        <div className="metadata-label">Longitude:</div>
                        <div className="metadata-value">
                          {typeof captureMetadata.longitude === 'number' ? captureMetadata.longitude.toFixed(6) : 'Detecting…'}
                        </div>
                      </div>
                      <div className="metadata-item">
                        <div className="metadata-label">Altitude:</div>
                        <div className="metadata-value">
                          {typeof captureMetadata.altitude === 'number' ? `${captureMetadata.altitude.toFixed(1)} m` : 'Not available'}
                        </div>
                      </div>
                      <div className="metadata-item">
                        <div className="metadata-label">Accuracy:</div>
                        <div className="metadata-value">
                          {typeof captureMetadata.accuracy === 'number' ? `±${Math.round(captureMetadata.accuracy)} m` : 'Not available'}
                        </div>
                      </div>
                      <div className="metadata-item metadata-item-wide">
                        <div className="metadata-label">Location:</div>
                        <div className="metadata-value">{captureMetadata.locationText || 'Not available'}</div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-danger btn-sm remove-image-btn"
                >
                  Remove Image
                </button>
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          {/* Issue Type */}
          <div className="form-group">
            <label htmlFor="issueType">Issue Type *</label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              disabled={loading}
              required
              className={errors.issueType ? 'input-error' : ''}
            >
              <option value="">Select issue type</option>
              {issueTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.issueType && <span className="error-message">{errors.issueType}</span>}
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Issue Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue (min 10 characters)"
              disabled={loading}
              required
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the issue (min 20 characters)"
              rows="5"
              disabled={loading}
              required
              className={errors.description ? 'input-error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location *</label>
            <div className="location-info">
              {locationLoading ? (
                <div className="location-loading">
                  <LoadingSpinner size="small" />
                  <span>Detecting location...</span>
                </div>
              ) : formData.location.address ? (
                <div className="location-display">
                  <div className="location-icon">📍</div>
                  <div className="location-text">
                    <div className="location-address">{formData.location.address}</div>
                    <div className="location-coords">
                      {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                    </div>
                    {(typeof formData.location.accuracy === 'number' || typeof formData.location.altitude === 'number') && (
                      <div className="location-coords">
                        Accuracy: {typeof formData.location.accuracy === 'number' ? `±${Math.round(formData.location.accuracy)} m` : 'Not available'}
                        {' · '}
                        Altitude: {typeof formData.location.altitude === 'number' ? `${formData.location.altitude.toFixed(1)} m` : 'Not available'}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={captureLocation}
                    className="btn btn-outline btn-sm"
                  >
                    Re-capture
                  </button>
                </div>
              ) : (
                <div className="location-error">
                  <p>Location permission required for accurate reporting</p>
                  <button
                    type="button"
                    onClick={captureLocation}
                    className="btn btn-primary btn-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          {/* Priority (Auto-assigned, shown for info) */}
          <div className="form-group">
            <label>Priority (Auto-assigned)</label>
            <div className="priority-display">
              <span className={`priority-indicator priority-${formData.priority}`}>
                {formData.priority.toUpperCase()}
              </span>
              <span className="priority-note">
                Based on issue type
              </span>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="alert alert-error">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Submitting...
                </>
              ) : (
                'Submit Issue Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitComplaint
