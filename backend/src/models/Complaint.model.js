/**
 * Complaint.model.js
 *
 * Purpose:
 * - Defines the Complaint schema for CivilEye.
 *
 * Responsibilities:
 * - Store complaint content (title/description/type).
 * - Store image path for uploaded evidence.
 * - Store structured location metadata (lat/lng/accuracy/altitude/address).
 * - Track status, priority, upvotes, and ownership.
 *
 * How it connects:
 * - Created/queried by `complaint.controller.js`.
 * - Updated by `admin.controller.js` for status changes.
 * - Related comments are stored in `Comment.model.js`.
 */

const mongoose = require('mongoose')

const STATUS_ENUM = ['reported', 'assigned', 'in-progress', 'resolved']
const PRIORITY_ENUM = ['critical', 'high', 'medium', 'low']

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number, default: null },
    accuracy: { type: Number, default: null },
    address: { type: String, default: '' }
  },
  { _id: false }
)

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 140
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000
    },
    issueType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    imagePath: {
      type: String,
      required: true
    },
    location: {
      type: locationSchema,
      required: true
    },
    captureMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    status: {
      type: String,
      enum: STATUS_ENUM,
      default: 'reported'
    },
    priority: {
      type: String,
      enum: PRIORITY_ENUM,
      default: 'medium'
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    assignedTo: {
      type: String,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Complaint = mongoose.model('Complaint', complaintSchema)

module.exports = { Complaint, STATUS_ENUM, PRIORITY_ENUM }
