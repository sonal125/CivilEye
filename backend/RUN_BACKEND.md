# CivilEye Backend — Run Instructions

## 1) System Requirements

- **Node.js**: v18 or higher
- **MongoDB**: **7.0.29**
- OS: Windows/macOS/Linux

---

## 2) MongoDB Requirement (IMPORTANT)

This backend is designed for **MongoDB 7.x**, specifically **7.0.29**, running locally at:

`mongodb://127.0.0.1:27017`

### Start MongoDB (common options)

- If MongoDB is installed as a service: start the MongoDB service.
- If you use MongoDB Community Edition:
  - Start `mongod` with your configured dbpath.

Quick sanity check:
- Confirm MongoDB is reachable by connecting with a client (Compass or `mongosh`).

---

## 3) Environment Variables

Edit `.env` in `backend/`.

Required:
- `MONGODB_URI=mongodb://127.0.0.1:27017`
- `MONGODB_DB_NAME=civileye`
- `JWT_SECRET=...` (must be long and random)

Optional:
- `FRONTEND_ORIGIN=http://localhost:3000`
- `ADMIN_INVITE_CODE=` (set this only if you want to allow admin self-registration)

---

## 4) Install Dependencies

From the backend directory:

```bash
cd backend
npm install
```

---

## 5) Run the Server

### Development mode (recommended)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

Expected output includes:
- MongoDB connection success logs
- Server listening log

---

## 6) Test the Health Endpoint

Open:
- `GET http://localhost:5001/api/health` (or your configured `PORT`)

Expected response:
- `ok: true`

---

## 7) Common Errors and Fixes

### A) "Missing required environment variable: MONGODB_URI"
- Fix: ensure `.env` exists in `backend/` and contains `MONGODB_URI`.

### B) MongoDB connection refused
- Fix: ensure MongoDB is running and listening on `127.0.0.1:27017`.

### C) JWT errors
- Fix: set `JWT_SECRET` and restart the server.

### D) Upload issues
- Fix: ensure the `backend/uploads/` directory exists (it is included in the repo).
- The backend serves images from `/uploads/...`.

### E) "EADDRINUSE: address already in use" (Port already in use)
- Meaning: another process is already using the backend port (default `5000`).
- Fix option 1: stop the other process using the port.
- Fix option 2: change `PORT` in `backend/.env` (example: `PORT=5001`) and restart.

---

## 8) How the Frontend Integrates (Later)

The frontend will:
- Call auth endpoints to obtain a JWT token.
- Send `Authorization: Bearer <token>` for protected routes.
- Upload complaint images using `multipart/form-data` with field name `image`.
