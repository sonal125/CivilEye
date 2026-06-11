/**
 * index.jsx
 * 
 * Purpose: Application entry point for CivilEye
 * 
 * Responsibilities:
 * - Mount the React application to the DOM
 * - Import global styles
 * - Render the root App component
 * 
 * How it works:
 * - Uses React 18's createRoot API for concurrent rendering
 * - Applies global CSS styles to the entire application
 * - Provides the foundation for all CivilEye components
 * 
 * CivilEye Context:
 * This is the entry point for the CivilEye civic issue reporting platform.
 * It initializes the React application and loads the global styling that
 * creates the professional, government-grade interface.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// Mount the React application to the root DOM element
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
