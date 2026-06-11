/**
 * User.model.js
 *
 * Purpose:
 * - Defines the User schema for CivilEye.
 *
 * Responsibilities:
 * - Store user identity and authentication fields.
 * - Hash passwords securely using bcrypt.
 * - Enforce unique emails and role constraints.
 *
 * How it connects:
 * - Used by `auth.controller.js` for registration/login.
 * - Referenced by Complaint and Comment models.
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const ROLE_ENUM = ['citizen', 'admin']

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 180
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ROLE_ENUM,
      default: 'citizen'
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

/**
 * Hash password before saving.
 *
 * Called when:
 * - A new user is created.
 * - A user's password is changed.
 */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()

  const saltRounds = 12
  this.password = await bcrypt.hash(this.password, saltRounds)
  next()
})

/**
 * Compare plaintext password with stored hash.
 *
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = { User, ROLE_ENUM }
