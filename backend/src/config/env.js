/**
 * env.js
 *
 * Purpose:
 * - Centralized environment configuration for CivilEye backend.
 *
 * Responsibilities:
 * - Load environment variables from `.env`.
 * - Provide validated, typed configuration values.
 * - Prevent hardcoded secrets in source code.
 *
 * How it connects:
 * - Imported by `server.js`, `app.js`, and services that need config.
 */

const path = require('path')
const dotenv = require('dotenv')

// Always load the backend's .env by default, even if the process is started
// from a different working directory.
const defaultEnvPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: process.env.ENV_FILE || defaultEnvPath })

const required = (name) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`[env] Missing required environment variable: ${name}`)
  }
  return value
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),

  MONGODB_URI: required('MONGODB_URI'),
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'civileye',

  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',

  ADMIN_INVITE_CODE: process.env.ADMIN_INVITE_CODE || ''
}

module.exports = { env }
