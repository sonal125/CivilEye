# CivilEye Backend — Architecture Documentation

## 1) Architecture Overview

CivilEye backend follows a clean Express architecture:

```
Client
  ↓
Routes (validators)
  ↓
Middleware (auth + role)
  ↓
Controllers (business logic)
  ↓
Services (specialized logic)
  ↓
Models (Mongoose schemas)
  ↓
MongoDB 7.0.29
```

Key goals:
- Professional separation of concerns
- Clear request lifecycle for viva/exam explanations
- Secure authentication and controlled admin access

---

## 2) Request → Controller → Service → Model Flow

### Example: Create Complaint

1. `POST /api/complaints`
2. Router applies:
   - `authMiddleware` (JWT verification)
   - `upload.single('image')` (multer file handling)
   - field validation
3. Controller (`complaint.controller.js`) performs:
   - field trimming/validation
   - location normalization via `location.service.js`
   - complaint creation via `Complaint.model.js`
4. MongoDB persists the complaint document.
5. Standard JSON response returned via `response.util.js`.

---

## 3) Authentication Flow (JWT)

### Registration
- `POST /api/auth/register`
- Creates user in MongoDB
- Password is hashed using bcrypt in `User.model.js` pre-save hook
- Returns a signed JWT + user object

### Login
- `POST /api/auth/login`
- Finds user by email
- Compares password with bcrypt
- Returns a signed JWT + user object

### Protected Routes
- Client sends: `Authorization: Bearer <token>`
- `auth.middleware.js`:
  - verifies token
  - fetches user from DB
  - attaches user to `req.user`

---

## 4) Role-Based Access Control (RBAC)

Admin routes are protected by:
- `authMiddleware` (must be logged in)
- `requireRole('admin')` (must have admin role)

This ensures only municipal authorities can:
- update complaint status
- access analytics

Admin self-registration is intentionally restricted:
- controlled via `ADMIN_INVITE_CODE` environment variable

---

## 5) Data Flow: Frontend → Backend → Database

### User session
1. Frontend logs in
2. Backend returns JWT
3. Frontend stores JWT
4. Protected requests use Bearer token

### Complaint submission
1. Frontend sends `multipart/form-data`:
   - `image` file
   - title, description, issueType, priority
   - location fields
2. Backend stores image in `backend/uploads/`
3. Backend stores complaint record with `imagePath` as `/uploads/<filename>`
4. Public feed returns complaints for transparency

---

## 6) Error Handling Strategy

- Controllers throw `AppError` for expected failures (400/401/403/404/409)
- A global error handler returns:
  - `success: false`
  - clear `message`
  - optional `details` (validation errors)

---

## 7) API Surface

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`

Complaints:
- `POST /api/complaints`
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `POST /api/complaints/:id/upvote`
- `POST /api/complaints/:id/comment`

Admin:
- `PATCH /api/admin/complaints/:id/status`
- `GET /api/admin/analytics`
