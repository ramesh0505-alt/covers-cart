# Railway Production Deployment Readiness Report - CoversCart Backend

This report provides details about the backend preparation and readiness for Railway production deployment.

## 1. Railway Readiness Status

**Ready for Deployment**: **YES** ✅

All required configurations, scripts, and endpoints have been successfully prepared and tested locally:
- **Build Stage**: Prisma client generation is integrated into the build phase via npm scripts.
- **Port Binding**: Standardized `process.env.PORT` binding allows Railway to dynamically assign HTTP ports.
- **Health Checks**: Fully responsive `/health` endpoint configured in `railway.json`.
- **Process Stability**: Implemented graceful shutdown (`SIGTERM` / `SIGINT` handlers) to disconnect Prisma and cleanly terminate HTTP connections, ensuring zero-downtime rolling deploys.
- **Local Startup Tests**: `npm test` successfully starts the server, connects to Supabase, and answers health check requests on `http://127.0.0.1:5000/health`.

---

## 2. Fixed Files

The following files were updated or added to prepare the codebase:

| File | Change Type | Purpose |
| :--- | :--- | :--- |
| [`package.json`](file:///c:/Users/Ramesh/OneDrive/Pictures/Desktop/covers/backend/package.json) | Modify | Added `"build"` script for Prisma generation and included `axios` devDependency for local verification. |
| [`server.js`](file:///c:/Users/Ramesh/OneDrive/Pictures/Desktop/covers/backend/server.js) | Modify | Standardized environment validation on `RAZORPAY_KEY_SECRET` and implemented OS signal graceful shutdown. |
| [`deploy-test.js`](file:///c:/Users/Ramesh/OneDrive/Pictures/Desktop/covers/backend/deploy-test.js) | Modify | Enabled `.env` loading, aligned Razorpay variable names, and used dynamic ports for local verification checks. |
| [`.env`](file:///c:/Users/Ramesh/OneDrive/Pictures/Desktop/covers/backend/.env) | Modify | Aligned development secret key designation to `RAZORPAY_KEY_SECRET`. |
| [`railway.json`](file:///c:/Users/Ramesh/OneDrive/Pictures/Desktop/covers/backend/railway.json) | New | Created Railway service config with NIXPACKS builder, start command, and healthcheck path. |

---

## 3. Environment Variables Required

Configure these environment variables in your Railway service dashboard under **Variables**:

### Required
| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Prisma PostgreSQL connection string | `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public` |
| `JWT_SECRET` | Secret key for custom token signing | *A long random string (e.g. `openssl rand -hex 64`)* |
| `SUPABASE_URL` | Supabase project endpoint | `https://[PROJECT_REF].supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous API key | *Your project's public anon key* |
| `RAZORPAY_KEY_ID` | Razorpay Merchant account key id | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Merchant account key secret | *Your Razorpay api secret key* |
| `CLOUDINARY_URL` | Cloudinary credentials URL | `cloudinary://[API_KEY]:[API_SECRET]@[CLOUD_NAME]` |

### Recommended (Optional)
| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Production environment flag | `production` |
| `SUPABASE_JWT_SECRET` | JWT secret to verify direct Supabase user tokens | *From Supabase Dashboard -> API settings* |
| `FRONTEND_URL` | Allow-list URL for CORS | `https://coverscart.com` |
| `ADMIN_URL` | Allow-list URL for CORS | `https://admin.coverscart.com` |

---

## 4. Deployment Checklist

Use this checklist when deploying the service on Railway:

1. **[ ] Connect Repository**: Link your GitHub repository in the Railway dashboard.
2. **[ ] Add Service**: Select the repository and choose the `backend` folder as the root directory of the service (or configure the root directory to `/backend` in the service settings).
3. **[ ] Set Environment Variables**: Input all variables listed in Section 3 in the Railway Service **Variables** tab.
4. **[ ] Run Deployment**: Trigger the build. Railway will automatically:
   - Identify Node.js and run `npm install`.
   - Run `npm run build` (which generates the Prisma client).
   - Start the server using `npm start` (listening on `process.env.PORT`).
5. **[ ] Verify Health Checks**: Ensure Railway confirms the service is running via the `/health` endpoint.
