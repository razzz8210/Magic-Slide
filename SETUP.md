# Silent Study Blocks - Setup Guide

## Backend Setup

### 1. Install Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Environment Variables
Create a `.env` file in the backend directory:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/study-blocks
PORT=5000
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
\`\`\`

**Gmail Setup:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password as `EMAIL_PASSWORD`

**Google OAuth Setup:**
1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/google`
6. Copy Client ID and Client Secret

### 3. Start MongoDB
\`\`\`bash
mongod
\`\`\`

### 4. Start Backend Server
\`\`\`bash
npm run dev
\`\`\`

## Frontend Setup

### 1. Environment Variables
Create a `.env.local` file in the frontend directory:

\`\`\`env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Start Frontend Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` in your browser.

## Features

- **Google OAuth Authentication** - Secure login with Google
- **Study Blocks Management** - Create, edit, and delete study sessions
- **Calendar View** - Visualize your study schedule
- **Countdown Timer** - Track time remaining in active sessions
- **Email Notifications** - Get reminders 5 minutes before sessions start
- **AI Study Assistant** - Chat with OpenAI for study tips and motivation
- **Overlap Validation** - Prevent scheduling conflicts
- **Light/Dark Mode** - Responsive design with theme support

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth callback

### Study Blocks
- `GET /api/study-blocks/user/:userId` - Get all blocks for user
- `POST /api/study-blocks` - Create new block
- `GET /api/study-blocks/:id` - Get specific block
- `PUT /api/study-blocks/:id` - Update block
- `DELETE /api/study-blocks/:id` - Delete block

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Email Not Sending:**
- Verify Gmail app password is correct
- Check that 2FA is enabled on Gmail account
- Ensure "Less secure app access" is disabled (use app passwords instead)

**Google OAuth Not Working:**
- Verify Client ID matches in both backend and frontend
- Check redirect URI is correctly configured in Google Cloud Console
- Ensure frontend URL matches `FRONTEND_URL` in backend `.env`

**AI Assistant Not Responding:**
- Verify OpenAI API key is set in the dashboard
- Check that key is valid and has available credits
- Ensure key is stored in localStorage
