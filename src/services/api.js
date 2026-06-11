/**
 * api.js
 *
 * Purpose: Real API service for CivilEye (frontend → backend)
 *
 * Responsibilities:
 * - Call the Node/Express backend using fetch
 * - Keep API calls centralized and consistent
 * - Attach JWT token automatically for protected routes
 * - Normalize backend payloads into UI-friendly shapes
 */

import { getApiBaseUrl, request } from './httpService'

const normalizeStatusForUI = (statusRaw) => {
  const s = String(statusRaw || '').trim().toLowerCase()
  // Frontend previously used "pending"; backend stores initial state as "reported".
  if (s === 'reported') return 'pending'
  if (s === 'in progress') return 'in-progress'
  return s
}

const normalizeLocationForUI = (location) => {
  if (!location || typeof location !== 'object') {
    return { lat: null, lng: null, address: '', accuracy: null, altitude: null }
  }

  return {
    lat: location.latitude ?? location.lat ?? null,
    lng: location.longitude ?? location.lng ?? null,
    address: location.address || '',
    accuracy: location.accuracy ?? null,
    altitude: location.altitude ?? null
  }
}

const normalizeComplaintForUI = (c) => {
  const baseUrl = getApiBaseUrl()
  const id = c?._id || c?.id
  const imagePath = c?.imagePath

  return {
    // Keep the UI stable by exposing `id`
    id,
    _id: c?._id,
    title: c?.title,
    description: c?.description,
    issueType: c?.issueType,
    priority: c?.priority,
    status: normalizeStatusForUI(c?.status),
    assignedTo: c?.assignedTo ?? null,
    upvotes: c?.upvotes ?? 0,
    createdAt: c?.createdAt,
    updatedAt: c?.updatedAt,
    imageUrl: imagePath ? `${baseUrl}${imagePath}` : c?.imageUrl,
    location: normalizeLocationForUI(c?.location),
    // ComplaintDetails expects reportedBy
    reportedBy: c?.createdBy
      ? {
          id: c.createdBy._id || c.createdBy.id,
          name: c.createdBy.name,
          email: c.createdBy.email,
          role: c.createdBy.role
        }
      : c?.reportedBy
  }
}

const normalizeCommentForUI = (comment) => {
  return {
    id: comment?._id || comment?.id,
    user: {
      id: comment?.userId?._id || comment?.userId?.id || comment?.user?.id,
      name: comment?.userId?.name || comment?.user?.name || 'Anonymous'
    },
    text: comment?.message || comment?.text || '',
    createdAt: comment?.timestamp || comment?.createdAt
  }
}

// -------------------------
// Auth
// -------------------------

export const registerUser = async ({ name, email, password, role, adminInviteCode }) => {
  const data = await request('POST', '/api/auth/register', {
    body: { name, email, password, role, adminInviteCode }
  })

  return {
    token: data?.token,
    user: data?.user
  }
}

export const loginUser = async ({ email, password }) => {
  const data = await request('POST', '/api/auth/login', {
    body: { email, password }
  })

  return {
    token: data?.token,
    user: data?.user
  }
}

// -------------------------
// Complaints
// -------------------------

export const getComplaints = async (filters = {}) => {
  const query = {
    ...filters,
    status: filters.status === 'pending' ? 'reported' : filters.status
  }

  const data = await request('GET', '/api/complaints', { query })
  return Array.isArray(data) ? data.map(normalizeComplaintForUI) : []
}

export const getComplaintDetails = async (id) => {
  const data = await request('GET', `/api/complaints/${encodeURIComponent(id)}`)
  const complaint = normalizeComplaintForUI(data?.complaint)
  const comments = Array.isArray(data?.comments) ? data.comments.map(normalizeCommentForUI) : []
  return { complaint, comments }
}

// Backwards-compatible exports used by existing components
export const getComplaint = async (id) => {
  const { complaint } = await getComplaintDetails(id)
  return complaint
}

export const getComments = async (complaintId) => {
  const { comments } = await getComplaintDetails(complaintId)
  return comments
}

export const createComplaint = async ({
  title,
  description,
  issueType,
  priority,
  imageFile,
  location,
  captureMetadata
}) => {
  const form = new FormData()
  form.append('title', title)
  form.append('description', description)
  form.append('issueType', issueType)

  if (priority) form.append('priority', priority)
  if (imageFile) form.append('image', imageFile)

  if (location?.lat != null) form.append('latitude', String(location.lat))
  if (location?.lng != null) form.append('longitude', String(location.lng))
  if (location?.altitude != null && location?.altitude !== '') form.append('altitude', String(location.altitude))
  if (location?.accuracy != null && location?.accuracy !== '') form.append('accuracy', String(location.accuracy))
  if (location?.address) form.append('address', String(location.address))

  if (captureMetadata) {
    form.append('captureMetadata', JSON.stringify(captureMetadata))
  }

  const data = await request('POST', '/api/complaints', {
    auth: true,
    body: form,
    isFormData: true
  })

  return normalizeComplaintForUI(data)
}

export const upvoteComplaint = async (id) => {
  const data = await request('POST', `/api/complaints/${encodeURIComponent(id)}/upvote`, {
    auth: true
  })
  return normalizeComplaintForUI(data)
}

export const addComment = async (complaintId, { message }) => {
  const data = await request('POST', `/api/complaints/${encodeURIComponent(complaintId)}/comment`, {
    auth: true,
    body: { message }
  })
  return normalizeCommentForUI(data)
}

// -------------------------
// Admin
// -------------------------

export const getAdminAnalytics = async () => {
  return request('GET', '/api/admin/analytics', { auth: true })
}

export const updateComplaint = async (id, updates) => {
  // Existing UI calls updateComplaint(id, { status, assignedTo })
  const data = await request('PATCH', `/api/admin/complaints/${encodeURIComponent(id)}/status`, {
    auth: true,
    body: {
      status: updates?.status,
      assignedTo: updates?.assignedTo
    }
  })

  return normalizeComplaintForUI(data)
}
