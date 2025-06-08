# Community Events Platform

A full-stack web application for managing and discovering community events. Built using React (frontend), Node.js/Express (backend), PostgreSQL (database), Supabase (image storage), and Render (deployment).

---

## 📧 Test Account Credentials

Use these Google accounts to test authentication and role-specific access:

### 👩‍💼 Staff Account

* **Email**: `eventplatform1@gmail.com`
* **Password**: `Z9!kM3$wTbP@7x`

### 🙋‍♂️ User Account

* **Email**: `eventplatform3@gmail.com`
* **Password**: `Z9!kM3$wTbP@7x`

---

## 🛠 Running the Project Locally

### 1. Clone the Repository

git clone https://github.com/your-username/community-events-platform.git
cd community-events-platform

### 2. Backend Setup

#### Navigate to backend folder:

cd backend

#### Install dependencies:

npm install

#### Create `.env` file:

In the `backend/` folder, create a `.env` file with the following content:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secure_session_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=events_platform
DB_USER=your_postgres_username
DB_PASS=your_postgres_password
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET_NAME=event-images
```

> ⚠️ Never commit `.env` to GitHub!

#### Start the server:

npm start

---

### 3. Frontend Setup

#### Navigate to frontend folder:

cd ../frontend

#### Install dependencies:

npm install

#### Create `.env` file:

In the `frontend/` folder, create a `.env` file with the following content:

REACT_APP_API_URL=http://localhost:5000

#### Start the React dev server:

npm start

---

## 🗃 Additional Setup Notes

### 📦 Database Setup

* Ensure PostgreSQL is installed and running locally.
* Create a database called `events_platform`.
* Run your SQL init script to create the necessary tables (users, events, etc).

### 🖼 Supabase Bucket

* Go to [supabase.io](https://supabase.io), create a project, and create a storage bucket named `event-images`.
* Copy the project URL and API key to use in the backend `.env`.

---

## 🌐 Hosting

This project is designed to be deployed on [Render](https://events-frontend-bduu.onrender.com):

* **Backend**: Deployed as a Web Service (Node.js).
* **Frontend**: Deployed as a Static Site (React).

Refer to the deployment guide in this repo for full steps.

---

## 📬 Contact

If you have any issues or feedback, feel free to open an issue or contact the project maintainer.
