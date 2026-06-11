# CivilEye Backend (Node.js + Express + MongoDB)

CivilEye Backend is a **clean, exam/viva-ready** REST API for a real-world civic / municipal issue reporting system.

It supports:
- User authentication (Citizen/Admin)
- Role-based access control (RBAC)
- Complaint storage in MongoDB
- Image uploads for complaint evidence
- Location + metadata storage (lat/lng/accuracy/altitude/address)
- Public feed APIs
- Admin status update APIs
- Comments + upvotes
- Professional error handling and structured responses

This backend is designed to integrate with the existing CivilEye frontend.

---

## Tech Stack

- **Node.js** (>= 18)
- **Express** (HTTP API)
- **MongoDB 7.0.29** (local instance)
- **Mongoose** (MongoDB ODM; compatible with MongoDB 7.x)
- **JWT** (authentication)
- **bcrypt** (password hashing)
- **multer** (image uploads)
- **helmet + cors + morgan** (security/logging)

---

## Folder Structure

```
backend/
 ├── src/
 │   ├── config/
 │   │   ├── db.js
 │   │   └── env.js
 │   ├── models/
 │   │   ├── User.model.js
 │   │   ├── Complaint.model.js
 │   │   └── Comment.model.js
 │   ├── controllers/
 │   │   ├── auth.controller.js
 │   │   ├── complaint.controller.js
 │   │   └── admin.controller.js
 │   ├── routes/
 │   │   ├── auth.routes.js
 │   │   ├── complaint.routes.js
 │   │   └── admin.routes.js
 │   ├── middleware/
 │   │   ├── auth.middleware.js
 │   │   └── role.middleware.js
 │   ├── services/
 │   │   ├── image.service.js
 │   │   └── location.service.js
 │   ├── utils/
 │   │   ├── response.util.js
 │   │   └── error.util.js
 │   └── app.js
 ├── uploads/
 ├── server.js
 ├── package.json
 ├── .env
 ├── README.md
 ├── RUN_BACKEND.md
 └── BACKEND_ARCHITECTURE.md
```

---

## High-Level Working

Request flow:

`Client → Routes → Middleware → Controller → (Service) → Model → MongoDB → Response`

- **Routes** define endpoints and validations.
- **Middlewares** enforce authentication and roles.
- **Controllers** implement business logic.
- **Services** handle specialized concerns (image upload config, location normalization).
- **Models** define MongoDB schemas.

---

## API Summary

Base URL: `http://localhost:5001` (default; configurable via `PORT`)

### Auth APIs
- `POST /api/auth/register`
- `POST /api/auth/login`

### Complaint APIs
- `POST /api/complaints` (Auth + Image upload)
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `POST /api/complaints/:id/upvote` (Auth)
- `POST /api/complaints/:id/comment` (Auth)

### Admin APIs
- `PATCH /api/admin/complaints/:id/status` (Admin)
- `GET /api/admin/analytics` (Admin)

For full run steps and troubleshooting, see `RUN_BACKEND.md`.
For architecture details, see `BACKEND_ARCHITECTURE.md`.

---

## API Usage Examples (Postman Ready)

Base URL (local): `http://localhost:5001`

### Authorization Header Usage

CivilEye uses **JWT Bearer tokens** for protected routes.

- Token is returned by: `POST /api/auth/login` (also returned by register)
- Header format:
	- `Authorization: Bearer <JWT_TOKEN>`

In Postman:
- Go to **Authorization** tab
- Type: **Bearer Token**
- Paste the token value (without the word “Bearer”)

---

### 1) AUTH — Register User

**Method + Endpoint**
- `POST /api/auth/register`

**Authentication**
- Not required

**Headers**
- `Content-Type: application/json`

**Body (raw JSON)**
```json
{
	"name": "Ankit",
	"email": "ankit@example.com",
	"password": "Password123",
	"role": "citizen"
}
```

**Role Notes (IMPORTANT)**
- Default role is `citizen`.
- Admin registration is **restricted** by design.
	- To register an admin, the server must have `ADMIN_INVITE_CODE` set in `backend/.env`.
	- Then send `role: "admin"` and provide `adminInviteCode`.

**Admin Register Example (raw JSON)**
```json
{
	"name": "Municipal Admin",
	"email": "admin@example.com",
	"password": "AdminPass123",
	"role": "admin",
	"adminInviteCode": "<YOUR_ADMIN_INVITE_CODE>"
}
```

**Example Success Response (201)**
```json
{
	"success": true,
	"message": "Registration successful",
	"data": {
		"token": "<JWT_TOKEN>",
		"user": {
			"id": "65b0c2f3f1a1b2c3d4e5f678",
			"name": "Ankit",
			"email": "ankit@example.com",
			"role": "citizen",
			"createdAt": "2026-01-24T10:15:30.000Z"
		}
	},
	"meta": null
}
```

---

### 2) AUTH — Login User

**Method + Endpoint**
- `POST /api/auth/login`

**Authentication**
- Not required

**Headers**
- `Content-Type: application/json`

**Body (raw JSON)**
```json
{
	"email": "ankit@example.com",
	"password": "Password123"
}
```

**Example Success Response (200)**
```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"token": "<JWT_TOKEN>",
		"user": {
			"id": "65b0c2f3f1a1b2c3d4e5f678",
			"name": "Ankit",
			"email": "ankit@example.com",
			"role": "citizen",
			"createdAt": "2026-01-24T10:15:30.000Z"
		}
	},
	"meta": null
}
```

**Important**
- Copy `data.token` and use it for protected routes.

---

### 3) CREATE COMPLAINT (WITH IMAGE + LOCATION)

**Method + Endpoint**
- `POST /api/complaints`

**Authentication**
- Required (`Authorization: Bearer <JWT_TOKEN>`)

**Headers**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: multipart/form-data` (Postman sets this automatically)

**Body type**
- `form-data`

**Form-Data Fields (exact keys)**
- `title` (text)
- `description` (text)
- `issueType` (text) — examples: `pothole`, `drainage`, `streetlight`
- `priority` (text, optional) — `critical | high | medium | low`
- `image` (file) — *required*, upload an image file
- `latitude` (text/number)
- `longitude` (text/number)
- `altitude` (text/number, optional)
- `accuracy` (text/number, optional)
- `address` (text, optional)

**Example Success Response (201)**
```json
{
	"success": true,
	"message": "Complaint created successfully",
	"data": {
		"_id": "65b0c4d7f1a1b2c3d4e5f999",
		"title": "Large pothole near market",
		"description": "A pothole is causing traffic and is dangerous for two-wheelers.",
		"issueType": "pothole",
		"imagePath": "/uploads/complaint-1706091400000-123456789.jpg",
		"location": {
			"latitude": 28.6139,
			"longitude": 77.209,
			"altitude": null,
			"accuracy": 12,
			"address": "Connaught Place, New Delhi"
		},
		"status": "reported",
		"priority": "high",
		"upvotes": 0,
		"assignedTo": null,
		"createdBy": "65b0c2f3f1a1b2c3d4e5f678",
		"createdAt": "2026-01-24T10:20:00.000Z",
		"updatedAt": "2026-01-24T10:20:00.000Z",
		"__v": 0
	},
	"meta": null
}
```

**Status Note (Important for Frontend Integration)**
- Backend uses `status: "reported"` as the initial state.
- If your frontend shows “Pending”, map it to `reported`.

---

### 4) GET ALL COMPLAINTS (PUBLIC FEED)

**Method + Endpoint**
- `GET /api/complaints`

**Authentication**
- Not required (public)
- Optional: you *may* include Authorization, but it is not required

**Headers (optional)**
- `Authorization: Bearer <JWT_TOKEN>`

**Common Query Parameters (optional)**
- `status=reported|assigned|in-progress|resolved` (also accepts `pending` and treats it as `reported`)
- `issueType=pothole|drainage|...`
- `priority=critical|high|medium|low`
- `sortBy=newest|priority|upvotes`

Example URL:
- `http://localhost:5001/api/complaints?sortBy=newest`

**Example Success Response (200)**
```json
{
	"success": true,
	"message": "OK",
	"data": [
		{
			"_id": "65b0c4d7f1a1b2c3d4e5f999",
			"title": "Large pothole near market",
			"issueType": "pothole",
			"status": "reported",
			"priority": "high",
			"upvotes": 0,
			"imagePath": "/uploads/complaint-1706091400000-123456789.jpg",
			"location": {
				"latitude": 28.6139,
				"longitude": 77.209,
				"altitude": null,
				"accuracy": 12,
				"address": "Connaught Place, New Delhi"
			},
			"createdAt": "2026-01-24T10:20:00.000Z",
			"updatedAt": "2026-01-24T10:20:00.000Z"
		}
	],
	"meta": null
}
```

**Public Feed Note**
- This endpoint powers the public feed view.

---

### 5) GET SINGLE COMPLAINT DETAILS

**Method + Endpoint**
- `GET /api/complaints/:id`

**Authentication**
- Not required (public)

**Path Parameter**
- `:id` = complaint MongoDB ObjectId

Example URL:
- `http://localhost:5001/api/complaints/65b0c4d7f1a1b2c3d4e5f999`

**Example Success Response (200)**
```json
{
	"success": true,
	"message": "OK",
	"data": {
		"complaint": {
			"_id": "65b0c4d7f1a1b2c3d4e5f999",
			"title": "Large pothole near market",
			"description": "A pothole is causing traffic and is dangerous for two-wheelers.",
			"issueType": "pothole",
			"imagePath": "/uploads/complaint-1706091400000-123456789.jpg",
			"location": {
				"latitude": 28.6139,
				"longitude": 77.209,
				"altitude": null,
				"accuracy": 12,
				"address": "Connaught Place, New Delhi"
			},
			"status": "reported",
			"priority": "high",
			"upvotes": 1,
			"assignedTo": null,
			"createdBy": {
				"_id": "65b0c2f3f1a1b2c3d4e5f678",
				"name": "Ankit",
				"email": "ankit@example.com",
				"role": "citizen"
			},
			"createdAt": "2026-01-24T10:20:00.000Z",
			"updatedAt": "2026-01-24T10:25:00.000Z"
		},
		"comments": [
			{
				"_id": "65b0c6aaf1a1b2c3d4e5fabc",
				"complaintId": "65b0c4d7f1a1b2c3d4e5f999",
				"userId": {
					"_id": "65b0c2f3f1a1b2c3d4e5f678",
					"name": "Ankit",
					"role": "citizen"
				},
				"message": "Please resolve this quickly.",
				"timestamp": "2026-01-24T10:26:00.000Z"
			}
		]
	},
	"meta": null
}
```

---

### 6) UPVOTE A COMPLAINT

**Method + Endpoint**
- `POST /api/complaints/:id/upvote`

**Authentication**
- Required (`Authorization: Bearer <JWT_TOKEN>`)

**Headers**
- `Authorization: Bearer <JWT_TOKEN>`

**Body**
- No body required

**Example Success Response (200)**
```json
{
	"success": true,
	"message": "Upvoted successfully",
	"data": {
		"_id": "65b0c4d7f1a1b2c3d4e5f999",
		"upvotes": 2,
		"status": "reported"
	},
	"meta": null
}
```

---

### 7) ADD COMMENT TO COMPLAINT

**Method + Endpoint**
- `POST /api/complaints/:id/comment`

**Authentication**
- Required (`Authorization: Bearer <JWT_TOKEN>`)

**Headers**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Body (raw JSON)**
```json
{
	"message": "This issue is affecting school children. Please prioritize."
}
```

**Example Success Response (201)**
```json
{
	"success": true,
	"message": "Comment added successfully",
	"data": {
		"_id": "65b0c7fff1a1b2c3d4e5fdef",
		"complaintId": "65b0c4d7f1a1b2c3d4e5f999",
		"userId": {
			"_id": "65b0c2f3f1a1b2c3d4e5f678",
			"name": "Ankit",
			"role": "citizen"
		},
		"message": "This issue is affecting school children. Please prioritize.",
		"timestamp": "2026-01-24T10:30:00.000Z"
	},
	"meta": null
}
```

---

### 8) ADMIN — UPDATE COMPLAINT STATUS

**Method + Endpoint**
- `PATCH /api/admin/complaints/:id/status`

**Authentication**
- Required
- **Admin-only** (`role: admin`)

**Headers**
- `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- `Content-Type: application/json`

**Body (raw JSON)**
```json
{
	"status": "in-progress",
	"assignedTo": "Road Maintenance Department"
}
```

**Status Values Accepted by Backend**
- `reported` (also accepts `pending` and converts it to `reported`)
- `assigned`
- `in-progress` (also accepts `in progress`)
- `resolved`

**Example Success Response (200)**
```json
{
	"success": true,
	"message": "Complaint status updated",
	"data": {
		"_id": "65b0c4d7f1a1b2c3d4e5f999",
		"status": "in-progress",
		"assignedTo": "Road Maintenance Department",
		"updatedAt": "2026-01-24T10:40:00.000Z"
	},
	"meta": null
}
```

---

### 9) ADMIN — GET ANALYTICS

**Method + Endpoint**
- `GET /api/admin/analytics`

**Authentication**
- Required
- **Admin-only**

**Headers**
- `Authorization: Bearer <ADMIN_JWT_TOKEN>`

**Example Success Response (200)**
```json
{
	"success": true,
	"message": "OK",
	"data": {
		"total": 18,
		"reported": 6,
		"assigned": 4,
		"inProgress": 5,
		"resolved": 3
	},
	"meta": null
}
```

**Important Notes**
- This endpoint currently returns counts by status only.
- If your UI uses the word “pending”, treat it as `reported`.
- Priority breakdown is not returned by this endpoint in the current implementation (it can be computed client-side by fetching complaints).

---

## Common Error Responses (Examples)

### 401 Unauthorized (Missing/Invalid Token)
When a protected endpoint is called without a valid Bearer token.

```json
{
	"success": false,
	"message": "Authentication required (missing Bearer token)",
	"details": null
}
```

### 403 Forbidden (Admin-Only Route)
When a non-admin user tries to access admin endpoints.

```json
{
	"success": false,
	"message": "Forbidden: insufficient permissions",
	"details": null
}
```

### 400 Validation Error
When request fields fail validation rules.

```json
{
	"success": false,
	"message": "Validation failed",
	"details": [
		{
			"type": "field",
			"msg": "Invalid value",
			"path": "email",
			"location": "body"
		}
	]
}
```
