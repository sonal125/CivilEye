/**
 * App.jsx
 * 
 * Purpose: Root component and routing configuration for CivilEye
 * 
 * Responsibilities:
 * - Define application routing structure using React Router
 * - Manage global authentication state
 * - Provide navigation between different pages
 * - Render shared layout components (Navbar, Footer)
 * 
 * How it works:
 * - Uses React Router DOM for client-side routing
 * - Maintains user authentication context
 * - Renders different pages based on current route
 * - Provides role-based navigation (Citizen vs Admin)
 * 
 * Routes:
 * - / : Home/Public Feed
 * - /login : User login
 * - /register : User registration
 * - /submit : Submit new complaint
 * - /complaints/:id : Complaint details
 * - /admin : Admin dashboard
 * - /profile : User profile
 * 
 * CivilEye Context:
 * This component orchestrates the entire CivilEye application flow,
 * enabling citizens to report issues and authorities to manage them
 * through a professional, organized interface.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import SubmitComplaint from './pages/SubmitComplaint/SubmitComplaint'
import ComplaintDetails from './pages/ComplaintDetails/ComplaintDetails'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import Profile from './pages/Profile/Profile'
import './App.css'

/**
 * App Component
 * 
 * Main application component that handles routing and authentication state.
 * 
 * State:
 * - user: Currently logged-in user object (null if not authenticated)
 * 
 * Functions:
 * - handleLogin: Updates user state when user logs in
 * - handleLogout: Clears user state and removes from localStorage
 */
function App() {
  // Authentication state - persisted in localStorage
  const [user, setUser] = useState(null)

  const UnauthorizedEventHandler = ({ onLogout }) => {
    const navigate = useNavigate()

    useEffect(() => {
      const handler = () => {
        onLogout()
        navigate('/login', { replace: true })
      }

      window.addEventListener('civileye:unauthorized', handler)
      return () => window.removeEventListener('civileye:unauthorized', handler)
    }, [navigate, onLogout])

    return null
  }

  /**
   * Load user from localStorage on mount
   * This maintains authentication across page refreshes
   */
  useEffect(() => {
    const storedUser = localStorage.getItem('civileye_user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        // Require a token for authenticated sessions (backend integration).
        if (parsed?.token) {
          setUser(parsed)
        } else {
          localStorage.removeItem('civileye_user')
        }
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('civileye_user')
      }
    }
  }, [])

  /**
   * Handle user login
   * Saves user data to state and localStorage
   * 
   * @param {Object} userData - User object with id, email, name, role
   */
  const handleLogin = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('civileye_user', JSON.stringify(userData))
  }, [])

  /**
   * Handle user logout
   * Clears user data from state and localStorage
   */
  const handleLogout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('civileye_user')
  }, [])

  /**
   * Protected Route wrapper
   * Redirects to login if user is not authenticated
   */
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    
    if (adminOnly && user.role !== 'admin') {
      return <Navigate to="/" replace />
    }
    
    return children
  }

  return (
    <Router>
      <div className="app">
        <UnauthorizedEventHandler onLogout={handleLogout} />
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={
              user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/" replace /> : <Register onLogin={handleLogin} />
            } />
            <Route path="/complaints/:id" element={<ComplaintDetails user={user} />} />
            
            {/* Protected routes */}
            <Route path="/submit" element={
              <ProtectedRoute>
                <SubmitComplaint user={user} />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile user={user} />
              </ProtectedRoute>
            } />
            
            {/* Admin-only routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
