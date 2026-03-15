# Vercel deployment (frontend + backend on different URLs)

To fix "Failed to fetch data. Not authenticated" on mobile (cookies not sent cross-origin), the frontend proxies API requests to the backend so the browser always talks to the same origin.

## Frontend (Vercel) environment variables

1. **NEXT_PUBLIC_API_URL** = your **frontend** URL + `/api`  
   - Example: `https://timefirst.weraldco.com/api`  
   - Or: `https://your-project.vercel.app/api`  
   - All API calls then go to the same origin and are rewritten to the backend.

2. **BACKEND_API_URL** (optional) = backend deployment URL  
   - Example: `https://timefirst-backend.vercel.app`  
   - Default in code is `https://timefirst-backend.vercel.app` if not set.

## Backend (Vercel) environment variables

- **CORS_ORIGINS** = your frontend origin(s), comma-separated  
  - Example: `https://timefirst.weraldco.com,https://your-project.vercel.app`  
  - Required for direct requests; less critical once the frontend uses the proxy.

## Flow

- Browser requests `https://your-frontend.vercel.app/api/journal` (same origin).
- Vercel rewrites that to `https://timefirst-backend.vercel.app/api/journal`.
- Backend sets cookies on the response; Vercel forwards them, so the browser stores them for your frontend domain (first-party).
- Later requests to `/api/*` include the cookie and work on mobile.
