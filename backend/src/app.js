/**
 * app.js
 *
 * Purpose:
 * - Defines and configures the Express application for CivilEye.
 *
 * Responsibilities:
 * - Register global middlewares (security, JSON parsing, logging, CORS).
 * - Serve uploaded images via a static route.
 * - Register feature routes (auth, complaints, admin).
 * - Provide a consistent error-handling strategy.
 *
 * How it connects:
 * - Mounted by `server.js`.
 * - Uses routers from `src/routes/*`.
 * - Uses error utilities from `src/utils/*`.
 */

const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const { env } = require('./config/env')
const { notFoundHandler, errorHandler } = require('./utils/error.util')

const authRoutes = require('./routes/auth.routes')
const complaintRoutes = require('./routes/complaint.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

// Security headers
app.use(helmet())

// Request logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// CORS
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true
  })
)

// Body parsing
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// Static serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'civileye-backend',
    timestamp: new Date().toISOString()
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/admin', adminRoutes)

// 404 + error handlers
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
