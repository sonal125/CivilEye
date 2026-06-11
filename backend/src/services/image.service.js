/**
 * image.service.js
 *
 * Purpose:
 * - Image upload handling utilities for CivilEye.
 *
 * Responsibilities:
 * - Configure Multer storage for evidence image uploads.
 * - Validate file types and sizes.
 * - Provide Express middleware to handle multipart/form-data.
 *
 * How it connects:
 * - Used by `complaint.routes.js` for `POST /api/complaints`.
 */

const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { AppError } = require('../utils/error.util')

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads')

const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir()
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase()
    const safeExt = ext && ext.length <= 10 ? ext : ''
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `complaint-${unique}${safeExt}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (!allowed.includes(file.mimetype)) {
    return cb(new AppError('Only image files (JPEG/PNG/WebP) are allowed', 400))
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

module.exports = {
  upload
}
