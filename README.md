---

Events Platform

A full-stack web application for managing and discovering community events. Built with React (frontend), Node.js/Express (backend), PostgreSQL (database), Supabase (image storage), and deployed to Render.

---

## 🎯 MVP Feature Overview

* **Event browsing**: Display a list of upcoming and past events for users to browse.
* **User signup**: Allow users to sign up for an event.
* **Google Calendar integration**: After signing up, add the event directly to the user’s Google Calendar.
* **Staff management**: Enable staff members to log in, create, edit, and delete events via a protected dashboard.
* **Deployment**: Hosted and publicly accessible on Render.

---

## 📧 Test Account Credentials

Use these Google accounts for testing authentication and role-based features:

| Role  | Email                      | Password         |
| ----- | -------------------------- | ---------------- |
| Staff | `eventplatform1@gmail.com` | `Z9!kM3$wTbP@7x` |
| User  | `eventplatform3@gmail.com` | `Z9!kM3$wTbP@7x` |

> **Note**: These accounts are configured in the Google Cloud console with calendar scopes. When you “Sign in with Google,” you’ll be prompted to grant calendar access.

---

## 🌐 Live Demo

* **Frontend (client)**: [https://events-frontend-bduu.onrender.com](https://events-frontend-bduu.onrender.com)
* **Backend (API)**: [https://events-backend-](https://events-backend-)<your-backend-service>.onrender.com

---

## 🛠 Running the Project Locally

### 1. Clone the repository

git clone https://github.com/your-username/community-events-platform.git
cd community-events-platform

### 2. Backend setup

cd backend
npm install

**Create a `.env` file** in `backend/` with:

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
SESSION_SECRET=your_session_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=events_platform
DB_USER=your_db_user
DB_PASS=your_db_pass
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET_NAME=event-images
PORT=5000

**Initialize the database** (PostgreSQL must be running):

createdb events_platform\ psql -d events_platform -f db/init.sql

**Start the backend server**:

npm start

### 3. Frontend setup

cd ../frontend
npm install

**Create a `.env` file** in `frontend/` with:

REACT_APP_API_URL=http://localhost:5000

**Start the React dev server**:

npm start

### 4. Testing core flows

1. Open `http://localhost:3000` in your browser.
2. Click **Sign in with Google** using either test account above.
3. Browse the event list and click **Sign Up** on an event.
4. After signup, click **Add to Google Calendar** and confirm the event appears in your calendar.
5. Sign in with the **Staff** account to see **+ Add Event**, **Edit**, and **Delete** controls on the main page.

---

## 📦 Environment Variables Checklist

| Variable               | Description                          |
| ---------------------- | ------------------------------------ |
| `GOOGLE_CLIENT_ID`     | OAuth client ID for Google sign-in   |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret                  |
| `GOOGLE_CALLBACK_URL`  | OAuth callback endpoint              |
| `SESSION_SECRET`       | Secret for express-session           |
| `DB_*`                 | PostgreSQL connection details        |
| `SUPABASE_*`           | Supabase storage credentials         |
| `REACT_APP_API_URL`    | URL to backend API (frontend `.env`) |

---

## ✅ Deployment

This application is deployed on [Render](https://render.com):

* **Frontend**: configured as a Static Site with SPA rewrites.
* **Backend**: configured as a Web Service with environment variables set in the Render dashboard.

For full deployment steps, see `render.yaml` and the repo’s **Deployment Guide**.

---

## 📬 Contact

Questions or feedback? Open an issue or contact the maintainer at `burhan.anjum2005@gmail.com`.

---
