# Vercel Deployment Guide (Unified Setup)

This project is configured as a **unified monorepo deployment** on Vercel. A single `vercel.json` file in the root manages building both the frontend client and backend API, hosting them together on the **same domain**.

This configuration eliminates CORS configuration issues and simplifies secure `HttpOnly` cookie setups.

---

## Deployment Steps

### 1. Create the Project on Vercel
1. Log in to your Vercel Dashboard and click **Add New > Project**.
2. **Import your repository** containing this monorepo.
3. In the project settings configuration:
   - **Framework Preset**: Select **Vite** (Vercel will auto-detect Vite inside the monorepo root builders).
   - **Root Directory**: Leave this **blank** (keep it as the repository root directory `./`).

### 2. Configure Environment Variables
Expand the **Environment Variables** section and add the following keys. *All of these will be configured in this single Vercel project:*

* **Backend Variables (Node.js runtime)**:
  - `MONGO_URI`: Your MongoDB database connection string (e.g. `mongodb+srv://...`).
  - `JWT_ACCESS_SECRET`: A secure random string for signing access tokens (e.g., `your_secure_access_secret`).
  - `JWT_REFRESH_SECRET`: A secure random string for signing refresh tokens (e.g., `your_secure_refresh_secret`).
  - `RESEND_API_KEY`: Your Resend API mailer key.
  - `RESEND_FROM_EMAIL`: The verified "from" address for registration OTP emails (e.g., `noreply@yourdomain.com`).
  - `NODE_ENV`: Set to `production`.
  - `CLIENT_URL`: The domain of this Vercel project itself (e.g. `https://my-lms-portal.vercel.app`). *Note: If you don't know the exact domain name yet, you can add it as a placeholder and update it after your first deployment.*

* **Frontend Variables (Injected during Vite build)**:
  - `VITE_API_URL`: Set this value to `/api` (since both frontend and backend share the same domain, relative pathing is fully supported!).

### 3. Deploy
1. Click **Deploy**. Vercel will install dependencies, build the Vite React app, register the serverless API routes, and deploy the application.
2. Verify the project URL. Once the deployment domain is generated, ensure that you update the backend `CLIENT_URL` environment variable to match the exact URL (e.g., `https://my-lms-portal.vercel.app`) in the settings and trigger a redeployment for it to take effect.
