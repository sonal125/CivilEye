# CivilEye - Civic Issue Reporting Platform

**CivilEye** is a professional digital platform that enables citizens to report and track civic issues using image-based reporting and transparency. This is a real-world municipal issue reporting and tracking system designed for citizens and municipal authorities.

---

## 📋 Project Overview

CivilEye empowers communities through civic engagement by providing a transparent, trustworthy, and government-grade platform where:

- **Citizens** can report civic issues with photo evidence and GPS location
- **Municipal Authorities** can manage, assign, and resolve reported issues
- **Public** can view all reported issues for transparency and accountability

---

## 🎯 Problem Statement

Citizens often face difficulties reporting civic issues such as potholes, drainage problems, broken street lights, and other municipal concerns. Traditional reporting methods are slow, lack transparency, and provide no way to track issue resolution.

**CivilEye solves this by:**
- Providing an easy-to-use web platform accessible to all citizens
- Enabling photo-based reporting with automatic location capture
- Offering complete transparency through a public feed
- Allowing citizens to upvote and comment on issues
- Giving authorities a professional dashboard to manage issues efficiently

---

## ✨ Key Features

### For Citizens:
- **User Registration & Authentication** - Secure account creation and login
- **Image-Based Reporting** - Upload photos from camera or gallery
- **Auto GPS Location** - Automatic location capture using Geolocation API
- **Issue Categorization** - Select from predefined civic issue types
- **Public Feed** - Redesigned dashboard-style landing page with hero + stats cards, plus issue feed with filters, sorting, and search
- **Upvoting System** - Support issues by upvoting
- **Comments** - Add comments and updates on issues
- **Status Tracking** - Track issue from pending to resolved

### For Municipal Authorities:
- **Admin Dashboard** - Comprehensive overview of all issues
- **Analytics** - Statistics on pending, in-progress, and resolved issues
- **Assignment System** - Assign issues to specific departments
- **Status Updates** - Update issue status (assigned, in-progress, resolved)
- **Department Management** - Organize work by departments

### General Features:
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Professional UI** - Clean, trustworthy, government-grade interface
- **Real-time Filters** - Filter by status, type, priority
- **Subtle Transitions** - Professional hover and focus states
- **Accessibility** - WCAG-compliant with good contrast ratios

---

## 📷 Image Capture & Location Metadata

CivilEye supports authentic civic reporting by allowing citizens to capture images directly from the device camera (or upload from gallery) and automatically attach verifiable context.

What gets captured automatically when an image is selected/captured:
- **Date / Day / Time** (system time at capture)
- **Latitude / Longitude** (Geolocation API)
- **Accuracy** and **Altitude** (when available)
- **Human‑readable location** (reverse geocoding via OpenStreetMap)

Why this matters:
- **Camera capture** reduces friction and encourages real-time reporting.
- **Auto-location** improves authenticity and helps municipal teams triage and route issues faster.

---

## 🛠️ Tech Stack

### Frontend:
- **React 18** - Modern functional components with hooks
- **React Router DOM** - Client-side routing
- **HTML5 & CSS3** - Semantic markup and modern styling
- **ES6+ JavaScript** - Modern JavaScript features
- **Vite** - Fast build tool and development server
- **CSS Modules** - Scoped component styling

### APIs & Services:
- **Geolocation API** - Browser-based GPS location
- **FileReader API** - Image upload and preview
- **CivilEye Backend REST API** - Node.js + Express + MongoDB
- **JWT (Bearer Token)** - Secure authentication for protected routes

---

## 📁 Project Structure

```
CivilEye/
├── public/
│   └── favicon.svg              # CivilEye favicon
├── src/
│   ├── components/              # Reusable components
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   └── Navbar.css
│   │   ├── Footer/
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   └── Footer.css
│   │   ├── LoadingSpinner/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── LoadingSpinner.css
│   │   ├── StatusBadge/
│   │   │   ├── StatusBadge.jsx  # Status indicator
│   │   │   └── StatusBadge.css
│   │   └── PriorityBadge/
│   │       ├── PriorityBadge.jsx # Priority indicator
│   │       └── PriorityBadge.css
│   ├── pages/                   # Page components
│   │   ├── Home/
│   │   │   ├── Home.jsx         # Public feed/dashboard
│   │   │   └── Home.css
│   │   ├── Login/
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Login.css
│   │   ├── Register/
│   │   │   ├── Register.jsx     # Registration page
│   │   │   └── Register.css
│   │   ├── SubmitComplaint/
│   │   │   ├── SubmitComplaint.jsx  # Issue reporting form
│   │   │   └── SubmitComplaint.css
│   │   ├── ComplaintDetails/
│   │   │   ├── ComplaintDetails.jsx # Detailed issue view
│   │   │   └── ComplaintDetails.css
│   │   ├── AdminDashboard/
│   │   │   ├── AdminDashboard.jsx   # Admin interface
│   │   │   └── AdminDashboard.css
│   │   └── Profile/
│   │       ├── Profile.jsx       # User profile
│   │       └── Profile.css
│   ├── services/                # API and data services
│   │   ├── httpService.js       # Centralized fetch wrapper (auth + errors)
│   │   ├── api.js               # Backend API functions (REST)
│   │   └── mockData.js          # Static lists (issueTypes, departments)
│   ├── utils/                   # Utility functions
│   │   ├── geolocation.js       # GPS location utilities
│   │   └── formatters.js        # Data formatting
│   ├── styles/
│   │   └── global.css           # Global styles and design tokens
│   ├── App.jsx                  # Root component with routing
│   ├── App.css                  # App-level styles
│   └── index.jsx                # Application entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── README.md                    # This file
├── RUN_INSTRUCTIONS.md          # Setup and run guide
└── FRONTEND_ARCHITECTURE.md     # Architecture documentation
```

---

## 🎨 Design Philosophy

CivilEye follows a **professional, government-grade design** philosophy:

### Color Palette:
- **Primary**: Professional blue (#2563eb)
- **Neutrals**: Grays and whites for clean backgrounds
- **Semantic**: Green for success, yellow for warnings, red for critical

### Typography:
- **Font**: System fonts for maximum readability
- **Hierarchy**: Clear heading levels (h1-h6)
- **Weights**: Normal, medium, semibold, bold

### UI Principles:
- ✅ Clean and minimal
- ✅ High contrast for accessibility
- ✅ Subtle animations (fade, slide)
- ✅ Mobile-first responsive
- ❌ No flashy gradients or neon colors
- ❌ No gaming/social media aesthetics

---

## 🚀 How CivilEye Works

### 1. **Citizen Reports an Issue**
   - Login or register
   - Navigate to "Submit Issue"
   - Take photo or upload image
   - Select issue type (pothole, drainage, etc.)
   - Add title and description
   - Location is auto-captured via GPS
   - Submit report

### 2. **Issue Appears in Public Feed**
   - All citizens can view the issue
   - Issue displays status, priority, location
   - Citizens can upvote and comment
   - Transparent tracking of all issues

### 3. **Admin/Authority Reviews**
   - Login to admin dashboard
   - View all pending issues
   - See analytics (total, pending, resolved)
   - Filter by status, type, priority

### 4. **Admin Takes Action**
   - Assign issue to department
   - Update status (assigned → in-progress → resolved)
   - Citizens receive updates

### 5. **Citizens Track Progress**
   - View complaint details
   - See status timeline
   - Read comments from authorities
   - Confirm when issue is resolved

---

## 🔌 How Frontend Connects To Backend

- Backend base URL (local): `http://localhost:5001`
- Frontend uses environment variable: `VITE_API_BASE_URL`
   - Default is set in `.env` at project root.
- API layer:
   - `src/services/httpService.js` (fetch wrapper)
   - `src/services/api.js` (CivilEye REST endpoints)

Token handling:
- On login/register, frontend stores `{ id, name, email, role, token }` in `localStorage` key `civileye_user`.
- Protected routes send: `Authorization: Bearer <token>` automatically.

More details: see `FRONTEND_BACKEND_INTEGRATION.md`.

### Run Full Stack (Local)

1) Start MongoDB (local) on `mongodb://127.0.0.1:27017`

2) Start backend:
- `cd backend`
- `npm install`
- `npm start`

3) Start frontend (project root):
- `npm install`
- `npm run dev`

---

## 🔐 User Roles

### Citizen (Default)
- Report new issues
- View public feed
- Upvote issues
- Comment on issues
- Track own submissions

### Admin/Municipal Authority
- All citizen permissions
- Access admin dashboard
- View analytics
- Assign issues to departments
- Update issue status
- Manage all complaints

---

## 📊 Data Flow

```
User Action → Frontend Validation → API Service → Backend API → MongoDB → UI Update
```

### Current Implementation (Integrated):
- **Real REST API** (Node/Express backend)
- **MongoDB persistence** (complaints, users, comments)
- **JWT authentication** with role-based access (Citizen/Admin)

### Production Ready:
- Integrate real geocoding service (Google Maps, Mapbox)
- Add refresh tokens / session rotation (optional)
- Add rate limiting + audit logs (optional)

---

## 🎯 Future Enhancements

### Planned Features:
- [ ] **Map View** - Interactive map with issue markers
- [ ] **Email Notifications** - Alert users on status changes
- [ ] **Mobile App** - Native iOS and Android apps
- [ ] **Multilingual Support** - Support multiple languages
- [ ] **Advanced Analytics** - Detailed reports and insights
- [ ] **Image Recognition** - Auto-detect issue types from photos
- [ ] **Department Dashboards** - Separate views for each department
- [ ] **Public API** - Allow third-party integrations
- [ ] **Social Sharing** - Share issues on social media
- [ ] **Escalation System** - Auto-escalate unresolved issues

---

## 📱 Responsive Design

CivilEye is fully responsive and works on:
- **Mobile** (320px - 767px)
- **Tablet** (768px - 1024px)
- **Desktop** (1025px+)

All interactions are touch-friendly and optimized for each screen size.

---

## ♿ Accessibility

CivilEye follows WCAG 2.1 guidelines:
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast ratios (4.5:1 minimum)
- Focus indicators
- Screen reader friendly

---

## 📄 License

This project is created for educational and civic engagement purposes.

---

## 👥 Target Users

1. **Citizens** - Anyone wanting to report civic issues
2. **Municipal Authorities** - Government departments managing civic infrastructure
3. **Community Leaders** - Local representatives tracking community issues
4. **Researchers** - Studying civic engagement patterns

---

## 🌟 Why CivilEye?

- **Transparency** - Public visibility of all issues
- **Accountability** - Track authority response times
- **Community** - Collective action through upvoting
- **Evidence** - Photo documentation of issues
- **Efficiency** - Streamlined reporting and management
- **Trust** - Professional, government-grade platform

---

## 📞 Demo Accounts
CivilEye now uses the real backend + MongoDB, so demo accounts are created dynamically.

Recommended demo approach:
- Register a **citizen** from the UI (`/register`) or Postman.
- Login to get a token.
- For **admin**:
   - Set `ADMIN_INVITE_CODE` in `backend/.env`
   - Register an admin account using the invite code
   - Then login and access `/admin`

For ready-to-import Postman requests, use: `CivilEye_Postman_Collection.json`.
- **Role**: Admin
- **Visible name**: Ankit 

---

## 🙏 Acknowledgments

CivilEye is built to empower communities and improve civic infrastructure through technology and transparency.

**Built for civic engagement. Built for the people.**

---

*For setup instructions, see [RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md)*

*For architecture details, see [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md)*
