/**
 * Comment.model.js
 *
 * Purpose:
 * - Defines the Comment schema for CivilEye.
 *
 * Responsibilities:
 * - Store user comments tied to a specific complaint.
 * - Track author (user) and timestamp.
 *
 * How it connects:
 * - Created by `complaint.controller.js` when users post comments.
 * - Queried by complaint detail endpoints as needed.
 */

const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = { Comment }
