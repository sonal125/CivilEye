# CivilEye — Frontend ↔ Backend Integration

This document explains how the **CivilEye React frontend** talks to the **CivilEye Node/Express backend**.

Backend base URL (local): `http://localhost:5001`

---

## 1) Configuration

### Environment variable
CivilEye uses a Vite environment variable to avoid hardcoding URLs:

- `VITE_API_BASE_URL` (default in `.env`): `http://localhost:5001`

The frontend reads it in:
- `src/services/httpService.js` → `getApiBaseUrl()`

---

## 2) Centralized API Layer

### HTTP wrapper
All HTTP calls go through:
- `src/services/httpService.js`

Key behaviors:
- Uses `fetch` consistently
- Adds `Authorization: Bearer <token>` automatically when `auth: true`
- Parses backend responses and returns only `data`
- Throws a normalized `HttpError` with:
  - `status` (0 for network errors)
  - `message`
  - `details` (validation array from backend when present)
- On `401 Unauthorized`:
  - Clears `localStorage` key `civileye_user`
  - Emits `window` event: `civileye:unauthorized`

### API functions
Backend-facing functions live in:
- `src/services/api.js`

This module:
- Calls the backend endpoints exactly as implemented
- Normalizes backend payloads to the UI’s expected shape:
  - `_id` → `id`
  - `status: reported` → UI `pending`
  - `imagePath` → `imageUrl` (absolute URL using `VITE_API_BASE_URL`)
  - `location.latitude/longitude` → `location.lat/lng`

---

## 3) Authentication Flow

### Login
- UI: `src/pages/Login/Login.jsx`
- API: `POST /api/auth/login`

On success, frontend stores a single auth object in localStorage:
- Key: `civileye_user`
- Shape:
  - `{ id, name, email, role, token }`

### Register
- UI: `src/pages/Register/Register.jsx`
- API: `POST /api/auth/register`

Admin registration:
- If user selects role `admin`, the UI shows **Admin Invite Code**.
- Backend enforces `ADMIN_INVITE_CODE`.

### Token attachment
Protected endpoints set `auth: true`, so `httpService` automatically sends:
- `Authorization: Bearer <JWT>`

---

## 4) Complaints Flow

### Create complaint (multipart/form-data)
- UI: `src/pages/SubmitComplaint/SubmitComplaint.jsx`
- API: `POST /api/complaints`

Frontend sends:
- `image` (file)
- `title`, `description`, `issueType`, `priority`
- `latitude`, `longitude`, `accuracy`, `altitude`, `address`

### Public feed
- UI: `src/pages/Home/Home.jsx`
- API: `GET /api/complaints`

Optional query params used:
- `status`, `issueType`, `priority`, `sortBy`

### Details + comments
- UI: `src/pages/ComplaintDetails/ComplaintDetails.jsx`
- API: `GET /api/complaints/:id`

The backend returns `{ complaint, comments }`.

### Upvote + comment
- `POST /api/complaints/:id/upvote` (auth)
- `POST /api/complaints/:id/comment` (auth)

---

## 5) Admin Flow

### Analytics
- UI: `src/pages/AdminDashboard/AdminDashboard.jsx`
- API: `GET /api/admin/analytics` (admin-only)

### Update status
- UI: `src/pages/AdminDashboard/AdminDashboard.jsx`
- API: `PATCH /api/admin/complaints/:id/status` (admin-only)

---

## 6) Error Handling Strategy

Frontend distinguishes:
- **Network failures** (`status === 0`): show “Unable to reach backend server”
- **401 Unauthorized**: auto-logout + redirect to `/login`
- **403 Forbidden**: show “admin access required” (admin screens)
- **400 Validation**: backend may return a `details` array; UI maps it into field errors where appropriate

Implementation points:
- `src/services/httpService.js` emits `civileye:unauthorized`
- `src/App.jsx` listens and redirects to login

---

## 7) Quick Run (Local)

1. Start MongoDB (local)
2. Start backend:
   - `cd backend`
   - `npm start`
   - Backend should be on `http://localhost:5001`
3. Start frontend (project root):
   - `npm run dev`

