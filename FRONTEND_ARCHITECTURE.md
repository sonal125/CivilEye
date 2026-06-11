# CivilEye - Frontend Architecture Documentation

This document provides a comprehensive overview of the CivilEye frontend architecture, design patterns, and implementation details.

---

## 📐 Architecture Overview

CivilEye follows a **component-based architecture** using React with a clear separation of concerns.

### Architecture Layers:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components, UI Elements)       │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│    (Hooks, State Management, Utils)     │
├─────────────────────────────────────────┤
│         Service Layer                   │
│      (API, Data Fetching, Mock Data)    │
├─────────────────────────────────────────┤
│         Data Layer                      │
│       (LocalStorage, Mock Database)     │
└─────────────────────────────────────────┘
```

---

## 🗂️ Directory Structure Explained

### `/src/components/`
**Purpose:** Reusable UI components used across multiple pages

**Components:**
- **Navbar** - Application navigation bar
- **Footer** - Application footer
- **LoadingSpinner** - Loading state indicator
- **StatusBadge** - Complaint status display
- **PriorityBadge** - Priority level display

**Design Pattern:** Presentational components (stateless where possible)

### `/src/pages/`
**Purpose:** Page-level components that represent routes

**Pages:**
- **Home** - Public feed with filters and sorting
- **Login** - User authentication
- **Register** - New user registration
- **SubmitComplaint** - Issue reporting form
- **ComplaintDetails** - Detailed view of single issue
- **AdminDashboard** - Administrative interface
- **Profile** - User profile page

**Design Pattern:** Container components (stateful, handle business logic)

### `/src/services/`
**Purpose:** API interactions and data management

**Files:**
- **api.js** - Mock API functions simulating backend
- **mockData.js** - Sample data for development

**Design Pattern:** Service layer abstraction

### `/src/utils/`
**Purpose:** Utility functions and helpers

**Files:**
- **geolocation.js** - GPS location utilities
- **formatters.js** - Data formatting functions

**Design Pattern:** Pure functions, single responsibility

### `/src/styles/`
**Purpose:** Global styling and design system

**Files:**
- **global.css** - CSS variables, reset, utility classes

---

## 🔀 Application Flow

### 1. Application Bootstrap

```
index.html
    ↓
index.jsx (Entry Point)
    ↓
App.jsx (Root Component)
    ↓
React Router (Routing Setup)
    ↓
Individual Pages/Components
```

### 2. User Journey - Citizen

```
Landing (Home Page)
    ↓
Register/Login
    ↓
Submit New Issue
    ├─→ Upload Image
    ├─→ Capture Location
    ├─→ Fill Form
    └─→ Submit
    ↓
View in Public Feed
    ↓
View Details
    ├─→ Upvote
    └─→ Comment
```

### 3. User Journey - Admin

```
Login as Admin
    ↓
Admin Dashboard
    ├─→ View Statistics
    ├─→ View All Issues
    └─→ Filter Issues
    ↓
Manage Issue
    ├─→ Assign to Department
    ├─→ Update Status
    └─→ Mark Resolved
```

---

## 🎨 Component Hierarchy

```
App
├── Navbar
│   └── Navigation Links (conditional based on auth)
├── Routes
│   ├── Home
│   │   ├── Hero Section
│   │   ├── Filters Section
│   │   └── Complaints Grid
│   │       └── ComplaintCard (multiple)
│   │           ├── StatusBadge
│   │           └── PriorityBadge
│   ├── Login
│   │   └── Login Form
│   ├── Register
│   │   └── Registration Form
│   ├── SubmitComplaint
│   │   ├── Image Upload
│   │   ├── Issue Form
│   │   └── Location Capture
│   ├── ComplaintDetails
│   │   ├── Image Display
│   │   ├── Details Sidebar
│   │   │   ├── StatusBadge
│   │   │   └── PriorityBadge
│   │   ├── Comments Section
│   │   └── Upvote Button
│   ├── AdminDashboard
│   │   ├── Statistics Cards
│   │   ├── Filters
│   │   └── Complaints Table
│   └── Profile
│       └── User Information
└── Footer
```

---

## 🔄 State Management

### Authentication State
**Location:** `App.jsx`

**State:**
```javascript
const [user, setUser] = useState(null)
```

**Persistence:** localStorage (`civileye_user`)

**Access:** Passed as prop to child components

### Page-Level State

Each page manages its own state using `useState` and `useEffect`:

**Example - Home.jsx:**
```javascript
const [complaints, setComplaints] = useState([])
const [loading, setLoading] = useState(true)
const [filters, setFilters] = useState({...})
const [sortBy, setSortBy] = useState('newest')
```

### Form State

Form components use controlled components pattern:

**Example - SubmitComplaint.jsx:**
```javascript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  issueType: '',
  // ...
})
```

---

## 🛣️ Routing Structure

### Route Configuration

```javascript
<Router>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/complaints/:id" element={<ComplaintDetails />} />
    
    {/* Protected Routes */}
    <Route path="/submit" element={
      <ProtectedRoute>
        <SubmitComplaint />
      </ProtectedRoute>
    } />
    
    {/* Admin Routes */}
    <Route path="/admin" element={
      <ProtectedRoute adminOnly={true}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
  </Routes>
</Router>
```

### Route Protection

**ProtectedRoute Component:**
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Checks admin role for admin-only routes
- Redirects to `/` if non-admin tries to access admin routes

---

## 💾 Data Flow

### 1. Data Fetching

```javascript
// In component
useEffect(() => {
  fetchData()
}, [dependencies])

const fetchData = async () => {
  setLoading(true)
  try {
    const data = await api.getComplaints(filters)
    setComplaints(data)
  } catch (error) {
    handleError(error)
  } finally {
    setLoading(false)
  }
}
```

### 2. Data Mutation

```javascript
const handleSubmit = async (formData) => {
  try {
    await api.createComplaint(formData)
    navigate('/')  // Redirect on success
  } catch (error) {
    setError(error.message)
  }
}
```

### 3. Data Persistence

**Current Implementation:**
```javascript
// services/api.js
const data = JSON.parse(localStorage.getItem('key'))
// ... modify data ...
localStorage.setItem('key', JSON.stringify(data))
```

**Production Implementation:**
```javascript
// Would use real API calls
const data = await fetch('/api/complaints')
const json = await data.json()
```

---

## 🎯 Design Patterns

### 1. Container/Presentational Pattern

**Container Components** (Pages):
- Handle data fetching
- Manage state
- Handle business logic
- Pass data to presentational components

**Presentational Components** (Components):
- Receive data via props
- Focus on UI rendering
- Minimal or no state
- Reusable across pages

### 2. Controlled Components

All form inputs are controlled:

```javascript
<input
  value={formData.title}
  onChange={(e) => setFormData({
    ...formData,
    title: e.target.value
  })}
/>
```

### 3. Composition

Components are composed together:

```javascript
<ComplaintCard>
  <StatusBadge status={complaint.status} />
  <PriorityBadge priority={complaint.priority} />
</ComplaintCard>
```

### 4. Render Props / Children

```javascript
<ProtectedRoute>
  <SubmitComplaint />
</ProtectedRoute>
```

---

## 🔌 API Layer

### Mock API Structure

**Location:** `src/services/api.js`

**Functions:**

```javascript
// GET operations
getComplaints(filters)      // Fetch all complaints
getComplaint(id)            // Fetch single complaint
getComments(complaintId)    // Fetch comments

// POST operations
createComplaint(data)       // Create new complaint
addComment(id, comment)     // Add comment

// PUT operations
updateComplaint(id, updates) // Update complaint
upvoteComplaint(id)         // Increment upvotes

// DELETE operations
deleteComplaint(id)         // Delete complaint
```

### API Response Format

**Complaint Object:**
```javascript
{
  id: 1,
  title: "Issue title",
  description: "Issue description",
  issueType: "pothole",
  status: "pending",
  priority: "high",
  imageUrl: "https://...",
  location: {
    lat: 40.7128,
    lng: -74.0060,
    address: "Main Street"
  },
  reportedBy: { id, name, email },
  assignedTo: "Department Name",
  createdAt: "ISO Date",
  updatedAt: "ISO Date",
  upvotes: 45,
  comments: 12
}
```

---

## 🎨 Styling Architecture

### CSS Variables (Design Tokens)

**Location:** `src/styles/global.css`

**Categories:**
- **Colors:** Primary, secondary, neutrals, semantic
- **Spacing:** XS to 3XL scale
- **Typography:** Font sizes, weights, families
- **Borders:** Radius values
- **Shadows:** Elevation levels
- **Transitions:** Duration and timing

**Usage:**
```css
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

### Component-Level Styles

Each component has its own CSS file:

```
Component.jsx
Component.css  ← Styles specific to this component
```

**BEM-like Naming:**
```css
.complaint-card { }
.complaint-card__header { }
.complaint-card__title { }
.complaint-card--featured { }
```

### Responsive Design

**Mobile-First Approach:**
```css
/* Base styles (mobile) */
.container { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .container { max-width: 720px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 960px; }
}
```

---

## 🔐 Authentication Flow

### Login Process

```
User enters credentials
    ↓
Client-side validation
    ↓
API call (mock authentication)
    ↓
Check credentials against mock users
    ↓
Success: Create user object
    ↓
Store in localStorage
    ↓
Update App state (user)
    ↓
Redirect based on role
```

### Session Persistence

```javascript
// On login
localStorage.setItem('civileye_user', JSON.stringify(userData))

// On app mount
useEffect(() => {
  const storedUser = localStorage.getItem('civileye_user')
  if (storedUser) {
    setUser(JSON.parse(storedUser))
  }
}, [])

// On logout
localStorage.removeItem('civileye_user')
setUser(null)
```

---

## 📍 Geolocation Integration

### Location Capture Flow

```
User submits complaint
    ↓
Request browser permission
    ↓
User allows/denies
    ↓
If allowed: Get GPS coordinates
    ↓
Reverse geocode (mock)
    ↓
Display address and coordinates
    ↓
Include in complaint submission
```

### Implementation

**Location Utility:** `src/utils/geolocation.js`

```javascript
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Geocoded address"
        })
      },
      (error) => reject(error),
      { enableHighAccuracy: true }
    )
  })
}
```

---

## 🔄 Lifecycle & Effects

### Component Lifecycle

**Mounting:**
```javascript
useEffect(() => {
  // Component mounted - fetch data
  fetchComplaints()
}, []) // Empty array = run once
```

**Updating:**
```javascript
useEffect(() => {
  // Re-fetch when filters change
  fetchComplaints()
}, [filters, sortBy])
```

**Cleanup:**
```javascript
useEffect(() => {
  const timer = setTimeout(...)
  
  return () => {
    clearTimeout(timer) // Cleanup
  }
}, [])
```

---

## ⚡ Performance Optimizations

### Current Optimizations:

1. **Code Splitting:** Routes are lazy-loaded (can be implemented)
2. **Image Optimization:** File size validation (< 5MB)
3. **Memoization:** Can use `useMemo` and `useCallback`
4. **Conditional Rendering:** Components only render when needed

### Future Optimizations:

```javascript
// Lazy loading routes
const Home = lazy(() => import('./pages/Home/Home'))

// Memoized expensive computations
const filteredComplaints = useMemo(() => {
  return complaints.filter(...)
}, [complaints, filters])

// Memoized callbacks
const handleFilter = useCallback((type, value) => {
  setFilters({...filters, [type]: value})
}, [filters])
```

---

## 🧪 Testing Approach

### Recommended Testing Strategy:

**1. Unit Tests:**
- Utility functions (`formatters.js`, `geolocation.js`)
- Individual components

**2. Integration Tests:**
- Page components with mock API
- Form submissions
- Navigation flows

**3. E2E Tests:**
- Complete user journeys
- Login → Submit → View flow

**Tools to Use:**
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

---

## 🔮 Future Enhancements

### Backend Integration

**Replace Mock API with Real Backend:**

```javascript
// Current
const getComplaints = async () => {
  const data = localStorage.getItem('complaints')
  return JSON.parse(data)
}

// Future
const getComplaints = async () => {
  const response = await fetch('/api/v1/complaints')
  return response.json()
}
```

### State Management Library

For larger scale, consider:
- **Redux** - Global state management
- **Context API** - React's built-in solution
- **Zustand** - Lightweight alternative

### Real-time Updates

**WebSocket Integration:**
```javascript
useEffect(() => {
  const ws = new WebSocket('ws://api.civileye.com')
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data)
    updateComplaint(update)
  }
  
  return () => ws.close()
}, [])
```

---

## 📦 Build & Deployment

### Build Process

```bash
npm run build
```

**Output:**
- `dist/` folder with optimized files
- Minified JavaScript
- Compressed CSS
- Optimized images

### Deployment Options:

**1. Static Hosting:**
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

**2. Traditional Hosting:**
- Upload `dist/` folder to web server
- Configure server for SPA routing

**3. Docker Container:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

---

## 🔍 Debugging Tips

### React DevTools

Install browser extension for:
- Component hierarchy inspection
- Props and state inspection
- Performance profiling

### Console Logging

**Strategic logging:**
```javascript
console.log('Form data:', formData)
console.log('API response:', response)
console.error('Error:', error)
```

### Network Tab

Monitor API calls:
- Check request/response
- Verify data format
- Debug failed requests

---

## 📚 Key Takeaways

### Architecture Principles:

1. **Component Reusability** - DRY principle
2. **Separation of Concerns** - Pages, components, services, utils
3. **Unidirectional Data Flow** - Props down, events up
4. **Mobile-First Design** - Responsive from the start
5. **Accessibility** - Semantic HTML, ARIA labels
6. **Performance** - Lazy loading, optimization
7. **Maintainability** - Clear structure, documentation

### Best Practices Followed:

- ✅ Functional components with hooks
- ✅ Controlled form inputs
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ CSS variables for theming
- ✅ Comprehensive documentation
- ✅ Meaningful variable names
- ✅ Modular file structure

---

## 🎓 Learning Resources

**To understand the codebase better:**

1. **React Documentation:** https://react.dev
2. **React Router:** https://reactrouter.com
3. **Vite:** https://vitejs.dev
4. **MDN Web Docs:** https://developer.mozilla.org

**Related concepts:**
- JavaScript ES6+ features
- CSS Flexbox and Grid
- Browser APIs (Geolocation, FileReader)
- LocalStorage API

---

## 📝 Contributing Guidelines

**When extending CivilEye:**

1. **Follow existing patterns** - Use established component structure
2. **Document changes** - Add comments and update docs
3. **Test thoroughly** - Verify on multiple devices
4. **Maintain style** - Follow CSS conventions
5. **Keep it professional** - Government-grade aesthetic

---

**This architecture enables CivilEye to be:**
- 🔧 **Maintainable** - Clear structure and documentation
- 📈 **Scalable** - Easy to add features
- 🎨 **Customizable** - Flexible design system
- 🚀 **Performant** - Optimized and efficient
- ♿ **Accessible** - Inclusive for all users

---

*For additional questions about the architecture, refer to inline code comments and README.md*
