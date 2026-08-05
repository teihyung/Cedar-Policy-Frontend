# SmartVerify — Cedar Policy Frontend

React frontend for uploading, listing, downloading, and deleting Cedar
policy files, scoped per tenant. Talks to the Cedar Policy Backend
(FastAPI) — see that repo's README for backend setup.

## Tech stack

- React (Vite)
- react-router-dom
- styled-components
- Bearer-token auth against the backend API (seeded users only — no
  OAuth/signup, per assignment scope)

## Prerequisites

- Node.js 18+
- The backend running and reachable (locally at `http://127.0.0.1:8000` by
  default, or a deployed URL)

## Setup

```bash
npm install
```

Create a `.env` file in the project root (copy from `.env.example`):

VITE_API_BASE_URL=http://127.0.0.1:8000


> Point this at a deployed backend URL instead if you're not running the
> backend locally.

## Running locally

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

## Demo login credentials

Seeded on the backend — see the backend README for full seeding
instructions.

| Username | Password    | Tenants                        |
|----------|-------------|----------------------------------|
| alice    | password123 | Acme Production, Acme Staging  |
| bob      | password123 | Acme Production                |
| carol    | password123 | Globex Production               |

Use alice + carol to demonstrate cross-tenant isolation (different
companies). Use alice + bob to demonstrate same-company, different-tenant
isolation.

## Project structure

src/
├── pages/
│ ├── login/
│ │ └── Login.jsx
│ └── dashboard/
│ ├── Dashboard.jsx
│ └── components/
│ ├── TenantSelector.jsx
│ ├── PolicyList.jsx
│ └── PolicyUploadForm.jsx
├── AuthContext.jsx # holds token/username in memory, exposes login()/logout()
├── ProtectedRoute.jsx # redirects to /login if there's no active session
├── Layout.jsx # shared page shell
├── router.jsx # route definitions
├── api.js # all backend fetch calls in one place
└── App.jsx


Components under `dashboard/components/` are kept "dumb" — they receive
data and callbacks as props. `Dashboard.jsx` owns state and all API calls,
and re-fetches the policy list after every upload/delete rather than
patching local state manually.

## Features

- **Login** — seeded users only, session token stored in memory via
  `AuthContext` (not localStorage — token doesn't persist across a page
  refresh, deliberate simplification given "keep auth minimal").
- **Protected routes** — `ProtectedRoute.jsx` redirects unauthenticated
  users to `/login`.
- **Tenant switcher** — dropdown showing only the tenants the logged-in
  user is scoped to, as returned by the backend from their bearer token
  (never client-supplied).
- **Upload** — accepts `.cedar` files. Invalid Cedar policies are rejected
  by the backend with the real parser's error message, surfaced directly
  in the upload form rather than a generic failure message.
- **List** — filename, size, and upload timestamp for the active tenant.
- **Download** — triggers a browser download via a temporary object URL.
- **Delete** — confirms before deleting, then refreshes the list.

## Known limitations

- Auth token held in memory only — refreshing the page requires logging
  in again.
- No client-side Cedar syntax pre-check — all validation is server-side,
  against the real Cedar parser (via `cedarpy` on the backend), which is
  the actual source of truth for validity.
- If pointed at a backend hosted on a free tier without persistent disk
  (e.g. Render free tier), uploaded files may not persist across backend
  restarts — a backend/storage limitation, not a frontend one. See the
  backend README for details.

## Build for production

```bash
npm run build
```

Outputs static files to `dist/` — deployable to any static host (Vercel,
Netlify, etc.).