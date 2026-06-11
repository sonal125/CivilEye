# CivilEye — Full Project Documentation (Frontend)

## 1. Project Title and Overview

**Project Title:** CivilEye — Civic Issue Reporting and Tracking Platform (Frontend)

**CivilEye** is a frontend-only civic-tech web application that enables:
- **Citizens** to report municipal issues (e.g., potholes, drainage problems) with photo evidence and automatically captured location metadata.
- **Municipal Authorities (Admins)** to manage reported complaints via an administrative dashboard (assignment + status updates).
- **The Public** to transparently view the complaint feed, upvote issues, and engage through comments.

The application is built as a **React + Vite single-page application (SPA)** and uses a **mock API layer implemented on top of browser `localStorage`** (no backend server is included in this repository).

---

## 2. Problem Statement

Traditional civic issue reporting (phone calls, paper forms, informal messaging) is often:
- slow and non-transparent,
- difficult to track,
- inconsistent in evidence quality,
- ambiguous in location information.

CivilEye addresses these gaps by providing:
- **image-based reporting**, 
- **automatic GPS-based location capture**,
- a **public complaint feed** for transparency,
- a structured **admin workflow** for assignment and resolution.

---

## 3. Objectives

1. Provide a simple, professional interface for citizens to submit complaints with photo evidence.
2. Capture verifiable metadata (time + coordinates) to improve authenticity.
3. Provide a public feed with filtering/sorting/search to improve discoverability.
4. Support public engagement via upvotes and comments.
5. Provide admins a dashboard to assign complaints to departments and update statuses.
6. Maintain a clean architecture suitable for future backend integration.

---

## 4. Scope (What This Project Includes / Excludes)

### Included
- Frontend SPA (React 18) with role-based routing
- Mock authentication (predefined demo users)
- Mock API implemented with `localStorage` persistence
- Complaint reporting workflow (image + location)
- Public feed (dashboard hero + stats + filters + search)
- Complaint details (upvotes + comments)
- Admin dashboard (status updates + department assignment)

### Excluded
- No real backend server, database, or REST endpoints
- No production-grade authentication (JWT/OAuth)
- No real-time notifications
- No server-side geocoding (reverse-geocoding is done client-side as best-effort)

---

## 5. Technology Stack

### Core
- **React 18**: Functional components and hooks
- **React Router DOM (v6)**: Client-side routing
- **Vite**: Development server and production builds

### Mapping Support (foundation)
- **Leaflet + React-Leaflet** are installed and Leaflet CSS is loaded in `index.html` for potential map views.

### Persistence / Data
- **Browser localStorage** as a mock data store

### Browser APIs
- **Geolocation API**: `navigator.geolocation.getCurrentPosition`
- **FileReader API**: image to base64 preview payload

---

## 6. How to Run (Development and Production)

See: `RUN_INSTRUCTIONS.md`

Summary:
- Install dependencies: `npm install`
- Development: `npm run dev` (defaults to `http://localhost:3000`)
- Production build: `npm run build`
- Preview build: `npm run preview`

Vite server/build settings are configured in `vite.config.js`.

---

## 7. High-Level Architecture

CivilEye follows a layered frontend architecture.

```
Presentation Layer
  - Pages (route-level UI)
  - Components (shared UI)

Business Logic Layer
  - Component state (React hooks)
  - Utils (formatters)

Service Layer
  - services/api.js (mock backend)
  - services/locationService.js (GPS + reverse geocoding)

Data Layer
  - localStorage keys (complaints, comments, session)
```

Key principle: **Pages orchestrate logic**, while shared components stay reusable and presentational.

---

## 8. Project Directory Structure

Top-level repository layout (important entries):

- `index.html` — HTML template and document metadata
- `vite.config.js` — Vite configuration
- `src/` — application source
- `README.md`, `RUN_INSTRUCTIONS.md`, `FRONTEND_ARCHITECTURE.md` — project docs
- `LOCATION_CAPTURE_WORKFLOW.md` — detailed location-only explanation (viva-friendly)

Inside `src/`:

- `App.jsx` — application router + auth session
- `index.jsx` — React entry point
- `styles/global.css` — design tokens and global styles
- `components/` — reusable UI components
- `pages/` — route-level pages
- `services/` — mock API and data services
- `utils/` — formatting and helper functions

---

## 9. Routing and Access Control

### Routing
All routing is defined in `src/App.jsx` using React Router v6.

Routes:
- `/` → Home / Public Feed
- `/login` → Login
- `/register` → Register
- `/submit` → SubmitComplaint (protected)
- `/complaints/:id` → ComplaintDetails (public, with gated upvote/comment actions)
- `/profile` → Profile (protected)
- `/admin` → AdminDashboard (protected + admin-only)

### ProtectedRoute
`App.jsx` defines a simple `ProtectedRoute` wrapper:
- If no `user` session exists, redirect to `/login`.
- If `adminOnly` is true and user role is not `admin`, redirect to `/`.

### Authentication Session Storage
- Session is stored in `localStorage` key: `civileye_user`
- On app mount, `App.jsx` loads the user from localStorage.

---

## 10. Mock Backend (LocalStorage API)

CivilEye is **frontend-only**; therefore, persistence and “API calls” are simulated.

### Storage Keys
- `civileye_complaints` → array of complaint objects
- `civileye_comments` → object keyed by complaintId; each value is an array of comment objects
- `civileye_user` → current session user object

### Service: `src/services/api.js`
The mock API exposes async functions and simulates network delay:
- `getComplaints(filters)`
- `getComplaint(id)`
- `createComplaint(complaintData)`
- `updateComplaint(id, updates)`
- `deleteComplaint(id)`
- `getComments(complaintId)`
- `addComment(complaintId, commentData)`
- `upvoteComplaint(id)`

Sorting in `getComplaints` supports:
- `newest`
- `priority`
- `upvotes`

### Data Initialization
On module load, `api.js` seeds localStorage using sample data from `src/services/mockData.js` if the keys do not exist.

---

## 11. Data Model (Core Entities)

### 11.1 User
Stored in session (`civileye_user`) and used in `reportedBy`.

Minimal structure used across the app:
- `id: number`
- `name: string`
- `email: string`
- `role: 'citizen' | 'admin'`

### 11.2 Complaint
Complaints are stored in `civileye_complaints`.

Typical structure (fields used across pages/services):
- `id: number`
- `title: string`
- `description: string`
- `issueType: string` (kebab-case)
- `priority: 'critical' | 'high' | 'medium' | 'low'`
- `status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'rejected'`
- `imageUrl: string` (base64 data URL for new reports; URLs for seeded data)
- `location: { lat, lng, address, accuracy?, altitude? }`
- `reportedBy: { id, name, email }`
- `assignedTo: string | null`
- `createdAt: ISO string`
- `updatedAt: ISO string`
- `upvotes: number`
- `comments: number` (derived / tracked)
- `captureMetadata: object | null` (added by the authenticity enhancement)

### 11.3 Comments
Stored in `civileye_comments`:
- Dictionary: `{ [complaintId: number]: Comment[] }`

Comment fields:
- `id: number` (uses `Date.now()` in mock)
- `complaintId: number`
- `user: { id, name }`
- `text: string`
- `createdAt: ISO string`

---

## 12. Core Workflows

### 12.1 Citizen Workflow (End-to-End)
1. User registers or logs in.
2. User navigates to Submit Issue.
3. User captures/upload an image.
4. App captures time + location metadata (GPS + optional reverse-geocoded label).
5. User selects issue type and fills title/description.
6. App validates fields and submits using `createComplaint()`.
7. Complaint becomes visible on the Public Feed.
8. Public users can open the Complaint Details page.
9. Logged-in users can upvote and comment.

### 12.2 Admin Workflow (End-to-End)
1. Admin logs in and visits Admin Dashboard.
2. Admin filters complaints and reviews priority/status.
3. Admin assigns a department (pending → assigned).
4. Admin starts work (assigned → in-progress).
5. Admin marks resolved (in-progress → resolved).

---

## 13. Image Capture + Location Metadata (Authenticity Feature)

This feature is implemented primarily in:
- `src/pages/SubmitComplaint/SubmitComplaint.jsx`
- `src/services/locationService.js`

### 13.1 Camera Capture vs Gallery Upload
The submission page provides two pathways:
- **Capture Photo**: uses `capture="environment"` on a file input to prefer the rear camera on supported mobile browsers.
- **Upload from Gallery**: standard `input type="file"` for desktop/mobile.

Both paths feed the same `handleImageChange()` handler.

### 13.2 What Gets Captured
At image selection time:
- Date / Day / Time (formatted and stored)
- Latitude / Longitude
- Accuracy (meters)
- Altitude (optional)
- Human-readable location label (best-effort via OpenStreetMap reverse geocoding)

The metadata is displayed in a read-only “Captured Metadata” card and attached to the complaint payload under `captureMetadata`.

### 13.3 Reverse Geocoding
Reverse geocoding is performed via **OpenStreetMap Nominatim** (best-effort). If it fails (network/rate-limits), the complaint still retains lat/lng.

### 13.4 Privacy Notes
- Location is captured only when needed for submission.
- The browser permission prompt provides explicit consent.

For a deep, viva-friendly explanation of the location workflow, see `LOCATION_CAPTURE_WORKFLOW.md`.

---

## 14. UI / UX Design System

### 14.1 Global Design Tokens
`src/styles/global.css` defines the design tokens:
- color palette (primary, neutrals, semantic colors)
- spacing scale
- typography scale
- radii, shadows, transitions

### 14.2 Component Styling Approach
Each page/component has its own CSS file imported directly into the component (e.g., `Home.jsx` imports `Home.css`). This keeps styling organized by feature while still using standard CSS.

### 14.3 Public Feed Dashboard UI
The Home page uses:
- a dashboard hero section,
- stats cards,
- a complaint list with filters/sorting,
- client-side search over the loaded complaint list.

---

## 15. File-by-File Documentation (What Each File Does)

### 15.1 Root / Config
- `index.html`: document metadata, Leaflet CSS link, mounts `#root`
- `vite.config.js`: dev server port + build output config
- `package.json`: scripts, dependencies

### 15.2 Entry and App Shell
- `src/index.jsx`: mounts React app, imports global CSS
- `src/App.jsx`: routing + auth session + protected routes + shared layout
- `src/App.css`: app-level layout (header/content/footer spacing)

### 15.3 Shared Components (`src/components/`)
- `Navbar/`:
  - `Navbar.jsx`: role-aware navigation, mobile menu, logout, user summary
  - `Navbar.css`: professional pill-style navigation surface
- `Footer/`:
  - `Footer.jsx`: branding + links + contact (mock)
  - `Footer.css`
- `LoadingSpinner/`:
  - `LoadingSpinner.jsx`: reusable loading indicator
  - `LoadingSpinner.css`
- `StatusBadge/`:
  - `StatusBadge.jsx`: visual status mapping (pending/assigned/in-progress/resolved/rejected)
  - `StatusBadge.css`
- `PriorityBadge/`:
  - `PriorityBadge.jsx`: visual priority mapping (critical/high/medium/low)
  - `PriorityBadge.css`

### 15.4 Pages (`src/pages/`)

#### Home (`src/pages/Home/`)
- `Home.jsx`: public feed dashboard + filters/sorting + search + stats
- `Home.css`: dashboard hero, stats cards, complaint layout

#### Login (`src/pages/Login/`)
- `Login.jsx`: mock login with role selection; stores session via `onLogin`
- `Login.css`

Demo users are defined in the Login page (mock authentication list). See also `RUN_INSTRUCTIONS.md` for credentials.

#### Register (`src/pages/Register/`)
- `Register.jsx`: collects name/email/password/role; auto-login; routes to correct home
- `Register.css`

#### SubmitComplaint (`src/pages/SubmitComplaint/`)
- `SubmitComplaint.jsx`: core submission workflow; image capture/upload; metadata capture; form validation; calls `createComplaint()`
- `SubmitComplaint.css`: professional form layout + metadata card styling

#### ComplaintDetails (`src/pages/ComplaintDetails/`)
- `ComplaintDetails.jsx`: loads complaint + comments; supports upvotes and comments (requires login)
- `ComplaintDetails.css`

#### AdminDashboard (`src/pages/AdminDashboard/`)
- `AdminDashboard.jsx`: admin-only complaint management; assignment + status updates; stats
- `AdminDashboard.css`

#### Profile (`src/pages/Profile/`)
- `Profile.jsx`: simple profile summary + navigation shortcuts
- `Profile.css`

### 15.5 Services (`src/services/`)
- `api.js`: localStorage-backed mock backend (CRUD + comments + upvotes)
- `mockData.js`: seeded complaint list + issue types + departments
- `locationService.js`: geolocation + reverse geocoding + capture datetime formatting

### 15.6 Utilities (`src/utils/`)
- `formatters.js`: presentation utilities for dates, relative time, counts, kebab-to-title
- `geolocation.js`: legacy/general geolocation helpers (not currently used by the new metadata workflow)

### 15.7 Styles (`src/styles/`)
- `global.css`: global reset, tokens, typography, buttons, layout utilities

---

## Appendix A — Demo Accounts (For Testing/Viva)

CivilEye uses frontend-only mock authentication. Select the correct role on the Login screen.

Citizen demo accounts:
- `citizen@civileye.com` / `password123`
- `sonalcitizen@civic.com` / `Sonal123` (Visible name: Sonal Sher (Thikedar))
- `ankitcitizen@civic.com` / `Raj123` (Visible name: Ankit (Majdoor))

Admin demo accounts:
- `admin@civileye.com` / `admin123`
- `sonaladmin@civic.com` / `Sonal123` (Visible name: Sonal Sher (Thikedar))
- `ankitadmin@civic.com` / `Raj123` (Visible name: Ankit (Majdoor))

---

## Appendix B — Resetting the Demo Data

Because data persists in the browser:
- Clear site storage for the app origin (DevTools → Application/Storage → Clear Storage), or
- Manually remove localStorage keys: `civileye_complaints`, `civileye_comments`, `civileye_user`.

On the next reload, `src/services/api.js` will re-seed data using `src/services/mockData.js`.
