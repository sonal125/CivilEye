/**
 * vite.config.js
 * 
 * Purpose: Vite build tool configuration for CivilEye frontend application
 * 
 * Responsibilities:
 * - Configure React plugin for JSX transformation
 * - Set up development server settings
 * - Define build output configuration
 * 
 * CivilEye Context:
 * This configuration enables fast development and optimized production builds
 * for the CivilEye civic issue reporting platform.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
