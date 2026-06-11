/**
 * server.js
 *
 * Purpose:
 * - Application entry point for the CivilEye backend.
 *
 * Responsibilities:
 * - Load environment variables.
 * - Connect to MongoDB (7.x) using Mongoose.
 * - Start the Express HTTP server.
 * - Log server and database startup events.
 *
 * How it connects:
 * - Imports the Express app from `src/app.js`.
 * - Imports the database connector from `src/config/db.js`.
 */

const http = require('http')
const app = require('./src/app')
const { connectToDatabase } = require('./src/config/db')
const { env } = require('./src/config/env')

async function startServer() {
  await connectToDatabase()

  const server = http.createServer(app)

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`[CivilEye] Port ${env.PORT} is already in use.`)
      console.error('[CivilEye] Fix: Stop the other process or set a different PORT in backend/.env')
      process.exit(1)
    }
    console.error('[CivilEye] Server error:', err)
    process.exit(1)
  })

  server.listen(env.PORT, () => {
    console.log(`[CivilEye] Backend running on http://localhost:${env.PORT}`)
    console.log(`[CivilEye] Environment: ${env.NODE_ENV}`)
  })

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n[CivilEye] Received ${signal}. Shutting down...`)
    server.close(() => {
      console.log('[CivilEye] HTTP server closed.')
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

startServer().catch((err) => {
  console.error('[CivilEye] Failed to start server:', err)
  process.exit(1)
})
