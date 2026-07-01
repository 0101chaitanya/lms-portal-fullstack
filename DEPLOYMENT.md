# Vercel Deployment Guide

This repository is configured to support **two different deployment strategies** on Vercel:
1. **Option A (Recommended)**: Unified deployment (both frontend and backend deployed as a **single Vercel project** under one domain).
2. **Option B**: Separate deployments (frontend and backend deployed as **two separate Vercel projects** under different domains).

---

## Option A: Unified Deployment (Recommended)

This strategy deploys the entire repository as a single project. The API will be accessible at `/api/*` on the same domain as the frontend, which simplifies CORS configuration and cookie domains.

### Steps:
1. On Vercel, select **Add New > Project** and import the repository.
2. Configure project settings:
   - **Framework Preset**: Vite (auto-detected).
   - **Root Directory**: Leave **blank** (uses repository root `./`).
3. Set **Environment Variables** in this project:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_ACCESS_SECRET`: A secure random string for signing access tokens.
   - `JWT_REFRESH_SECRET`: A secure random string for signing refresh tokens.
   - `RESEND_API_KEY`: Your Resend API key.
   - `RESEND_FROM_EMAIL`: The verified sender address for OTP emails.
   - `NODE_ENV`: Set to `production`.
   - `CLIENT_URL`: The domain of the Vercel project itself (e.g. `https://my-lms-portal.vercel.app`).
   - `VITE_API_URL`: Set to `/api` (uses relative pathing since they share a domain).
4. Click **Deploy**.

---

## Option B: Separate Deployments

This strategy deploys the frontend and backend as two completely independent Vercel projects (e.g., `my-lms-client.vercel.app` and `my-lms-api.vercel.app`).

### Step 1: Deploy the Backend
1. On Vercel, select **Add New > Project** and import the repository.
2. Configure project settings:
   - **Framework Preset**: Select **Other**.
   - **Root Directory**: Set to `backend`.
3. Set **Environment Variables**:
   - `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NODE_ENV` as described above.
   - `CLIENT_URL`: Point this to your frontend Vercel deployment URL (e.g. `https://my-lms-client.vercel.app`). *You can update this after deploying the frontend.*
4. Click **Deploy** and copy the generated Backend URL (e.g., `https://my-lms-api.vercel.app`).

### Step 2: Deploy the Frontend
1. In the Vercel dashboard, select **Add New > Project** and import the repository again.
2. Configure project settings:
   - **Framework Preset**: Select **Vite**.
   - **Root Directory**: Set to `frontend`.
3. Set **Environment Variables**:
   - `VITE_API_URL`: Your Vercel backend deployment URL + `/api` (e.g., `https://my-lms-api.vercel.app/api`).
4. Click **Deploy**.
