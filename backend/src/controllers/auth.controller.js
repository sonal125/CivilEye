/**
 * auth.controller.js
 *
 * Purpose:
 * - Authentication controller for CivilEye.
 *
 * Responsibilities:
 * - Register new users (citizens by default; admins optionally via invite code).
 * - Authenticate existing users and issue JWT tokens.
 *
 * How it connects:
 * - Used by `src/routes/auth.routes.js`.
 * - Uses `User.model.js` for persistence.
 */

const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const { env } = require('../config/env')
const { User, ROLE_ENUM } = require('../models/User.model')
const { ok } = require('../utils/response.util')
const { AppError, asyncHandler } = require('../utils/error.util')

const normalizeRole = (roleRaw) => {
  if (!roleRaw) return 'citizen'
  const r = String(roleRaw).trim().toLowerCase()
  if (r === 'citizen' || r === 'user') return 'citizen'
  if (r === 'admin' || r === 'authority' || r === 'municipal') return 'admin'

  // Accept title-case values
  if (r === 'citizen'.toLowerCase()) return 'citizen'
  if (r === 'admin'.toLowerCase()) return 'admin'

  return r
}

/**
 * Issue a signed JWT for a user.
 *
 * @param {{ id: string }} user
 * @returns {string}
 */
const signToken = (user) => {
  return jwt.sign(
    {
      sub: user.id
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN
    }
  )
}

/**
 * POST /api/auth/register
 *
 * Creates a new user.
 * Inputs:
 * - name, email, password
 * - role (optional; defaults to citizen)
 * - adminInviteCode (optional; required if role=admin)
 */
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array())
  }

  const { name, email, password, role, adminInviteCode } = req.body
  const normalizedRole = normalizeRole(role)

  if (!ROLE_ENUM.includes(normalizedRole)) {
    throw new AppError('Invalid role. Allowed: citizen, admin', 400)
  }

  // Security best practice: do not allow arbitrary admin self-registration.
  if (normalizedRole === 'admin') {
    if (!env.ADMIN_INVITE_CODE) {
      throw new AppError('Admin registration is disabled on this server', 403)
    }

    if (String(adminInviteCode || '') !== String(env.ADMIN_INVITE_CODE)) {
      throw new AppError('Invalid admin invite code', 403)
    }
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() })
  if (existing) {
    throw new AppError('Email already registered', 409)
  }

  const user = await User.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    password: String(password),
    role: normalizedRole
  })

  const token = signToken({ id: user._id.toString() })

  return ok(res, {
    statusCode: 201,
    message: 'Registration successful',
    data: {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    }
  })
})

/**
 * POST /api/auth/login
 *
 * Authenticates a user and returns a JWT.
 * Inputs:
 * - email, password
 */
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array())
  }

  const { email, password } = req.body

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password')
  if (!user) {
    throw new AppError('Invalid email or password', 401)
  }

  const isMatch = await user.comparePassword(String(password))
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401)
  }

  const token = signToken({ id: user._id.toString() })

  return ok(res, {
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    }
  })
})

module.exports = {
  register,
  login
}
