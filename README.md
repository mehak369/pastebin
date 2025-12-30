Pastebin-Lite

A minimal Pastebin-like web application that allows users to create and share text pastes with optional time-based expiry and view-count limits.

The project is designed to meet the functional and non-functional requirements described in the take-home assignment and is suitable for automated testing against a deployed environment.
--------------
Deployed Application

Frontend (Vercel):
https://pastebin-sooty.vercel.app/

Backend (Render):
https://pastebin-ypc5.onrender.com
-------------------------------

Features

Create a paste containing arbitrary text

Receive a shareable URL for each paste

View a paste via a public HTML page
------------------------
Optional constraints:

Time-based expiry (TTL)

View-count limit

Paste becomes unavailable as soon as any constraint is triggered

Safe rendering of paste content (no script execution)
---------------------------
Tech Stack
Backend

Node.js

Express.js

MongoDB (Atlas)

Mongoose

Frontend

React (Vite)

Tailwind CSS (dark theme)
------------------------------
Deployment

Backend: Render

Frontend: Vercel

API Endpoints
Health Check
GET /api/healthz


Response:

{ "ok": true }


Confirms that the service is running and able to access the persistence layer.

Create Paste
POST /api/pastes


Request body (JSON):

{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}

------------------------------
Rules:

content is required and must be a non-empty string

ttl_seconds is optional; if present, must be an integer ≥ 1

max_views is optional; if present, must be an integer ≥ 1

Response (2xx):

{
  "id": "string",
  "url": "https://pastebin-ypc5.onrender.com/p/<id>"
}

Fetch Paste (API)
GET /api/pastes/:id


Response (200):

{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}

-----------------------
Notes:

remaining_views is null if unlimited

expires_at is null if no TTL

Each successful fetch counts as one view

Unavailable cases (expired, view limit exceeded, or missing) return:

HTTP 404

JSON error response

View Paste (HTML)
GET /p/:id


Returns an HTML page containing the paste content

Paste content is rendered safely (escaped)

Each successful visit counts as one view

Returns HTTP 404 if the paste is unavailable

Deterministic Time Support (Testing)

The application supports deterministic expiry testing.

If the environment variable below is set:

TEST_MODE=1


Then the request header:

x-test-now-ms: <milliseconds since epoch>

is used as the current time for expiry logic only.

If the header is absent, the system time is used.
----------------------------------
Persistence Layer

MongoDB Atlas is used as the persistence layer.

All pastes are stored persistently in MongoDB

View counts and expiry metadata are stored per paste

No in-memory storage is used, ensuring correctness across serverless requests
-----------------------------
Running the Project Locally
Backend
cd backend
npm install
npm run dev


Environment variables required:

PORT=3001
MONGO_URI=<your MongoDB Atlas connection string>
----------------------
Frontend
cd frontend
npm install
npm run dev

-------------------
Environment variable:

VITE_API_BASE_URL=http://localhost:3001
-----------------------------
Design Decisions

Manual TTL handling (instead of MongoDB TTL indexes) to support deterministic testing

View limits enforced at the API level to avoid serving pastes beyond constraints

Backend owns /p/:id HTML routes to meet assignment requirements

Environment-based configuration for deployment safety

Minimal UI with focus on correctness and reliability over styling
--------------------------------------
Notes

No secrets or credentials are committed to the repository

No hardcoded localhost URLs in production code

Server-side code does not rely on global mutable state

The application starts without requiring manual database migrations
--------------------
Author

Mehak
