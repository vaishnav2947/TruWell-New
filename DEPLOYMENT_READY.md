# TruWell Pharmacy - Deployment Readiness Report

## Issues Fixed

### 1. Root package.json
- **Issue**: Contained only `@sendgrid/mail` and was not configured as a workspace, causing confusion if `npm install` was run at the root.
- **Fix**: Converted to a private workspace with `./backend` and `./frontend`.

### 2. Backend package.json
- **Issues**:
  - Unnecessary `mongoose` dependency (unused, as we use PostgreSQL/Prisma).
  - `@nestjs/mapped-types` used wildcard version `"*"`, which is unstable.
- **Fixes**:
  - Removed `mongoose`.
  - Changed `@nestjs/mapped-types` to `^1.0.0`.

### 3. Backend Dockerfile
- **Issues**:
  - No `PORT` environment variable set, causing the container to default to port 3001 while exposing 3000.
  - Did not run database migrations on startup.
- **Fixes**:
  - Added `ENV PORT=3000`.
  - Changed the startup command to run migrations before starting the server:  
    `CMD ["sh", "-c", "npm run prisma:migrate && node dist/main"]`.

### 4. docker-compose.yml
- **Issue**: Backend service lacked `PORT` environment variable, causing a mismatch between the container's default port (3001) and the host mapping (3001:3000).
- **Fix**: Added `environment: - PORT=3000` to the backend service.

### 5. docker-compose.production.yml
- **Issue**: Same as docker-compose.yml—missing `PORT` environment variable for the backend.
- **Fix**: Added `environment: - PORT=3000` to the backend service.

### 6. render.yaml
- **Issues**:
  - Backend service had `PORT` set to `"3001"`, causing a port mismatch.
  - `JWT_SECRET` and `JWT_REFRESH_SECRET` were set to `generate: true`, which is unsuitable for production as the secret would regenerate on each deploy, invalidating tokens.
- **Fixes**:
  - Set `PORT` to `"3000"`.
  - Changed `JWT_SECRET` and `JWT_REFRESH_SECRET` to `sync: false`, requiring manual configuration.

### 7. Prisma Schema
- **Issue**: None found after review.
- **Fix**: No changes required.

## Files Modified

- `package.json` (root)
- `backend/package.json`
- `backend/Dockerfile`
- `docker-compose.yml`
- `docker-compose.production.yml`
- `render.yaml`

## Dependency Changes

- **Removed**: `mongoose`
- **Updated**: `@nestjs/mapped-types` from `"*"` to `^1.0.0`

## Docker Changes

- `backend/Dockerfile`: 
  - Added `ENV PORT=3000`.
  - Changed `CMD` to run migrations before starting the server: `CMD ["sh", "-c", "npm run prisma:migrate && node dist/main"]`.

## Deployment Configuration Changes

- `docker-compose.yml`: Added `environment: - PORT=3000` to the backend service.
- `docker-compose.production.yml`: Added `environment: - PORT=3000` to the backend service.
- `render.yaml`: 
  - Set backend `PORT` to `"3000"`.
  - Changed `JWT_SECRET` and `JWT_REFRESH_SECRET` to `sync: false`.

## Remaining Manual Steps

### Railway
1. Create a PostgreSQL database and a Redis instance.
2. In the Railway dashboard, set the following environment variables for the **backend** service:
   - `DATABASE_URL` (provided by the PostgreSQL plugin)
   - `REDIS_URL` (provided by the Redis plugin)
   - `JWT_SECRET` (a strong, unique string)
   - `JWT_REFRESH_SECRET` (a strong, unique string)
   - `SENDGRID_API_KEY` (from your SendGrid account)
   - `EMAIL_FROM` (a verified sender email address)
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (optional, as it is set in the Dockerfile, but setting explicitly is recommended)
3. For the **frontend** service:
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_API_URL` = Set to the public URL of your backend service (e.g., `https://your-backend.up.railway.app`).

### Render
1. The `render.yaml` file already defines a PostgreSQL database (`truwell-db`) and a Redis service (`truwell-redis`). Ensure these are created when deploying via Render.
2. In the Render dashboard (or via the `render.yaml` if you prefer to manage variables there), set the following environment variables for the **backend** service:
   - `JWT_SECRET` (a strong, unique string)
   - `JWT_REFRESH_SECRET` (a strong, unique string)
   - `SENDGRID_API_KEY` (from your SendGrid account)
   - `EMAIL_FROM` (a verified sender email address)
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (optional, as set in the Dockerfile)
3. For the **frontend** service:
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_API_URL` = Set to the public URL of your backend service (e.g., `https://your-backend.onrender.com`).

### Vercel (Frontend Only)
1. Deploy the frontend to Vercel.
2. In the Vercel project settings, set the environment variable:
   - `NEXT_PUBLIC_API_URL` = Set to the public URL of your deployed backend (e.g., `https://your-backend.onrender.com` or your Railway backend URL).
   - No other environment variables are required for the frontend.

## Database Migrations
- The Dockerfile has been updated to run `prisma migrate deploy` on container startup. Ensure that the database is accessible at container startup (handled by `depends_on` in Docker Compose and by service dependencies in Render/Railway).

## Verification
After applying the above changes, the following should work:
- `docker compose up --build` builds and starts the application locally.
- The application builds successfully on Railway, Render, and Vercel (frontend).
- Database migrations are applied automatically on startup.
- The frontend can communicate with the backend via the configured `NEXT_PUBLIC_API_URL`.