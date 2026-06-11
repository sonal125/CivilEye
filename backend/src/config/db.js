/**
 * db.js
 *
 * Purpose:
 * - MongoDB connection setup for CivilEye backend.
 *
 * Responsibilities:
 * - Connect to MongoDB 7.x via Mongoose.
 * - Use non-deprecated configuration and safe connection handling.
 * - Log connection lifecycle events.
 *
 * How it connects:
 * - Called by `server.js` before the Express server starts.
 */

const mongoose = require('mongoose')
const { env } = require('./env')

async function connectToDatabase() {
  const mongoUri = env.MONGODB_URI
  const dbName = env.MONGODB_DB_NAME

  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(mongoUri, {
      dbName
    })

    console.log('[CivilEye] MongoDB connected')
    console.log(`[CivilEye] MongoDB URI: ${mongoUri}`)
    console.log(`[CivilEye] Database: ${dbName}`)

    mongoose.connection.on('error', (err) => {
      console.error('[CivilEye] MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('[CivilEye] MongoDB disconnected')
    })
  } catch (err) {
    console.error('[CivilEye] MongoDB connection failed:', err)
    throw err
  }
}

module.exports = { connectToDatabase }
