Attend.ly - MERN Attendance Manager
Attend.ly is a full-stack web application designed to help students track their class attendance seamlessly. It features a robust backend built with Node.js/Express and a modern, reactive frontend built with React and Vite. The core functionality is enhanced with Google Calendar integration, allowing users to sync their class schedules and receive automatic reminders.

Check live at - https://attendly-one.vercel.app/

✨ Features
Dual Authentication: Secure sign-up and login using either traditional email/password or a Google account.

Session Management: Persistent login sessions handled by Passport.js and stored securely in MongoDB.

Subject Management: Users can create, view, and manage their own academic subjects.

Initial Attendance: Ability to set a starting attendance count (e.g., 9/10) when creating a subject, perfect for mid-semester starts.

Daily Tracking: Mark daily attendance as "present" or "absent" with a single click.

Live Statistics: The UI updates instantly to reflect attendance ratios and percentages without needing a page refresh.

Google Calendar Integration:

Connect a Google account via a secure OAuth 2.0 flow.

Create recurring weekly schedules for subjects that automatically sync to the user's primary Google Calendar.

Events are created with a 30-minute reminder by default.

Notes added when marking attendance are automatically added to the description of that day's calendar event.

🛠️ Tech Stack
Category

Technology

Frontend

React (Vite), Tailwind CSS, FullCalendar

Backend

Node.js, Express.js, MongoDB (Mongoose)

Auth

Passport.js (Local & Google OAuth 2.0)

Deployment

Vercel (Frontend), Render (Backend)

🚀 Local Development Setup
To run this project on your local machine, you need to set up the backend and frontend separately.

1. Backend Setup (backend folder)
   Clone the Repository

git clone <your-backend-repo-url>
cd <backend-folder-name>

Install Dependencies

npm install

Create .env file
Create a file named .env in the root of the backend folder and add the following variables. This file is crucial.

# MongoDB Connection String

MONGODB_URL=your_mongodb_connection_string

# Session Secret

SESSION_SECRET=a_very_long_random_and_secret_string

# Google OAuth Credentials

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL (for CORS)

CLIENT_URL=http://localhost:5173

Run the Server

npm start

The backend server should now be running on http://localhost:3000.

2. Frontend Setup (client folder)
   Clone the Repository

git clone <your-frontend-repo-url>
cd <frontend-folder-name>

Install Dependencies

npm install

Create .env.local file
Create a file named .env.local in the root of the frontend folder and add the following variable:

# URL of your local backend server

VITE_API_URL=http://localhost:3000

Run the Development Server

npm run dev

The frontend should now be running on http://localhost:5173 and connected to your local backend.

🔑 Google OAuth Configuration for Development
To get Google Login working locally, you must configure your Google Cloud project:

Go to your project's Credentials page in the Google Cloud Console.

Click on your OAuth 2.0 Client ID.

Ensure the following URIs are added:

Authorized JavaScript origins: http://localhost:5173

Authorized redirect URIs: http://localhost:3000/api/v1/auth/google/callback

Add your Google account to the "Test users" list in the OAuth consent screen to be able to log in while the app is in testing mode.
