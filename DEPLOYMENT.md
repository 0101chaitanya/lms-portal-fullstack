# Vercel Deployment Guide

This workspace contains two main projects: the Vite-based React frontend (`frontend`) and the Express-based Node.js backend (`backend`). Both are configured to be deployed on Vercel.

Follow the instructions below to deploy both components and connect them.

---

## Step 1: Deploy the Backend

The backend is configured to run as a **Vercel Serverless Function** using Node.js.

1. **Sign in to Vercel** and select **Add New > Project**.
2. **Import your repository** containing this codebase.
3. In the project settings, configure:
   - **Project Name**: `learning-experience-platform-backend` (or similar)
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend`
4. Expand **Environment Variables** and add the following keys:
   - `MONGO_URI`: Your MongoDB connection string (e.g. `mongodb+srv://...`).
   - `JWT_ACCESS_SECRET`: A secure string for signing access tokens (e.g., `your_secure_access_secret`).
   - `JWT_REFRESH_SECRET`: A secure string for signing refresh tokens (e.g., `your_secure_refresh_secret`).
   - `RESEND_API_KEY`: Your Resend mailer API key.
   - `RESEND_FROM_EMAIL`: The verified "from" address for registration OTP emails (e.g. `noreply@yourdomain.com`).
   - `NODE_ENV`: Set to `production`.
   - `CLIENT_URL`: Point this to your frontend URL (e.g. `https://learning-experience-platform-frontend.vercel.app`). *Note: If you haven't deployed the frontend yet, you can update this variable in your project settings later.*
5. Click **Deploy**.
6. Once deployed, copy the generated **Deployment Domain** (e.g. `https://learning-experience-platform-backend.vercel.app`).

---

## Step 2: Deploy the Frontend

The frontend is a React application built with Vite, utilizing client-side routing.

1. In the Vercel dashboard, select **Add New > Project** again.
2. **Import the same repository**.
3. In the project settings, configure:
   - **Project Name**: `learning-experience-platform-frontend` (or similar)
   - **Framework Preset**: `Vite` (Vercel will auto-detect Vite)
   - **Root Directory**: `frontend`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL`: Your Vercel backend deployment domain + `/api` (e.g. `https://learning-experience-platform-backend.vercel.app/api`).
5. Click **Deploy**.
6. Copy the generated **Deployment Domain** for the frontend.

---

## Step 3: Connect Frontend and Backend

1. Go back to your Vercel **Backend** project settings page.
2. Select **Settings > Environment Variables**.
3. Edit the value of `CLIENT_URL` to point to the frontend domain you copied in Step 2 (e.g. `https://learning-experience-platform-frontend.vercel.app`).
4. **Redeploy** the backend (or trigger a rebuild/deployment from the deployments tab) for the new environment variable value to take effect.
