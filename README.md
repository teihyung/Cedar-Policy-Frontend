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
```
Cedar-Policy-Frontend/
├── src/
│   ├── pages/
│   │   ├── login/
│   │   │   └── Login.jsx
│   │   └── dashboard/
│   │       ├── Dashboard.jsx
│   │       └── components/
│   │           ├── TenantSelector.jsx
│   │           ├── PolicyList.jsx
│   │           └── PolicyUploadForm.jsx
│   ├── AuthContext.jsx      # holds token/username in memory, login()/logout()
│   ├── ProtectedRoute.jsx   # redirects to /login if no token is present in AuthContext
│   ├── Layout.jsx           # full-height wrapper w/ padding, renders <Outlet /> for child routes
│   ├── router.jsx           # route definitions
│   ├── api.js               # all backend fetch calls in one place
│   └── App.jsx
├── package.json
└── package-lock.json

```



Components under `dashboard/components/` are presentational — they take
data and callbacks as props and don't touch the API themselves.
`Dashboard.jsx` centralizes all state and API calls, refetching the policy
list after each upload/delete rather than manually reconciling local state.

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

## Testing

Component tests use Vitest + React Testing Library, colocated next to the
components they test (e.g. `TenantSelector.test.jsx` sits beside
`TenantSelector.jsx`).

```bash
npm run test
```

Coverage is intentionally targeted at components with real logic rather
than exhaustive — full upload/list/download/delete flows and cross-tenant
isolation scenarios are covered by the backend's automated test suite
(where isolation is actually enforced) plus a documented manual pass
through the UI.

**Covered:**
- `TenantSelector` — renders an option per tenant; calls `onChange` with
  the selected tenant id
- `PolicyUploadForm` — submit stays disabled until a file is chosen;
  backend validation errors (e.g. a rejected Cedar file) surface in the
  UI; form clears after a successful upload
- `ProtectedRoute` — redirects to `/login` when there's no token; renders
  its children when a token is present

**Not covered by automated tests** (exercised manually instead — see
[Manual test notes](#manual-test-notes)):
- `Dashboard.jsx` — mostly orchestration/API wiring; more effectively
  verified end-to-end than mocked in isolation
- `PolicyList` — rendering is straightforward enough that manual
  verification was sufficient for this scope
- `api.js` — thin fetch wrappers around the backend; low value to unit
  test independently of a real request

## Manual test notes

Exercised the running app end-to-end against the local backend, covering:

- Login with each seeded user (alice, bob, carol)
- Upload — valid and invalid `.cedar` files
- Download and delete
- Switching tenants via the dropdown
- Cross-tenant isolation — confirmed carol (different company) and bob
  (same company as alice, but scoped to fewer tenants) can't see files
  outside their own tenant access

This was a manual pass, not a tracked/ticketed QA process — reasonable
given the scope of a take-home assignment. Automated coverage for
tenant-isolation edge cases (including hand-crafted/hostile requests)
lives in the backend test suite, which is where that requirement is
actually enforced.