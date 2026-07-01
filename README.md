# Learning Experience Platform (LMS Portal)

A modern, responsive, and secure Learning Management System (LMS) monorepo. It features a Vite-based React frontend paired with an Express and Mongoose server backend.

The platform provides a comprehensive workflow for administrators to manage users, trainers to construct courses and publish lecture videos, and students to enroll, track progress, and watch course materials.

---

## 🚀 Key Features

* **Multi-Role Authentication**: Built-in support for **Admin**, **Trainer**, and **Student** portals.
* **OTP Email Verification**: Secure registration system validating user emails using a 6-digit OTP dispatched via Resend.
* **Access & Refresh Tokens**: Security hardened token validation. Refresh tokens are stored in secure, `HttpOnly`, `Strict` cookies, preventing CSRF/XSS, while access tokens are rotated dynamically.
* **Course & Content Builder**: Trainers and Admins can build custom courses, append lecture topics, adjust playback orders, and paste YouTube URLs which are validated and rendered dynamically.
* **Cascading Relationship Cleanup**: Robust backend listeners that ensure that if courses or users (trainers/students) are deleted, all corresponding enrollments, topics, and references are purged.
* **Optimized Chunks & Lazy Loading**: Split bundles for vendor packages (React, Redux, React-Router) and MUI, combined with route-level lazy loading to deliver sub-11kB entrypoint loads.

---

## 🛠️ Technology Stack

### Frontend (`/frontend`)
* **Core**: React 19, Vite 8 (Rolldown bundler)
* **State Management**: Redux Toolkit & React-Redux
* **Routing**: React Router DOM (v7)
* **Styling & UI**: Material UI (MUI v9) & Emotion

### Backend (`/backend`)
* **Framework**: Express (v5)
* **Database**: MongoDB & Mongoose
* **Mailer**: Resend API
* **Security & Performance**: Helmet, Express Rate Limiter, Compression (Gzip), bcryptjs, and JSON Web Tokens (JWT)

---

## 📂 Project Structure

```text
├── DEPLOYMENT.md              # Detailed Vercel hosting instructions
├── README.md                  # Project overview (this file)
├── backend/                   # Backend API workspace
│   ├── vercel.json            # Vercel serverless function routing rules
│   ├── src/
│   │   ├── server.js          # App entrypoint & middleware configuration
│   │   ├── controllers/       # Controller endpoint handlers
│   │   ├── middleware/        # Auth, Role guards, and Error handlers
│   │   ├── models/            # Mongoose schemas (User, Course, Topic, Enrollment)
│   │   ├── routes/            # Express route groups
│   │   └── scripts/           # DB Seeding scripts (e.g. createAdmin)
│   └── package.json
└── frontend/                  # React Vite client workspace
    ├── vercel.json            # Vercel SPA routing rewrites
    ├── vite.config.js         # Build chunk-splitting setup
    ├── src/
    │   ├── App.jsx            # Dynamic lazy routes
    │   ├── main.jsx           # Global theme & stores providers
    │   ├── api/               # Axios client & automatic JWT refresh interceptor
    │   ├── components/        # Reusable navbar & route protection guards
    │   └── pages/             # Student, Trainer, and Admin dashboard pages
    └── package.json
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and a running **MongoDB** database (local or Atlas cluster) installed.

### 2. Configure Environment Variables

Create a `.env` file in the **backend** directory:
```env
PORT="3000"
MONGO_URI="your_mongodb_connection_uri"
CLIENT_URL="http://localhost:5173"
JWT_ACCESS_SECRET="your_jwt_access_token_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_token_secret"
NODE_ENV="development"
RESEND_API_KEY="your_resend_api_key"
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

Create a `.env` file in the **frontend** directory:
```env
VITE_API_URL="http://localhost:3000/api"
```

### 3. Install Dependencies & Run

#### Run the Backend:
```bash
cd backend
npm install
npm run dev
```

#### Seed the Admin Account:
To seed a master Admin account (`ololchaitanya@yahoo.com` / `Pass@123`), run:
```bash
node src/scripts/createAdmin.js
```

#### Run the Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Production Deployment

This project is pre-configured for instant deployment on **Vercel** as a serverless monorepo application. 

For complete build options and step-by-step instructions on setting up backend environment variables and CORS headers, refer to the **[Vercel Deployment Guide](DEPLOYMENT.md)**.
