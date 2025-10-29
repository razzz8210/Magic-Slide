# MagicSlides Study App

A comprehensive study management platform built with Next.js and Node.js, featuring intelligent scheduling, automated email reminders, and AI-powered learning tools.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google Sign-In
- 📅 **Smart Study Scheduling** - Create and manage study blocks with datetime precision
- 📧 **Automated Email Notifications** - Instant confirmations and 5-minute reminders
- 🤖 **AI Assistant** - Get study help and generate flashcards
- 📊 **Calendar View** - Visualize your study schedule
- ☁️ **Cloud Database** - MongoDB Atlas for reliable data storage
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and Radix UI

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Language:** TypeScript

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Email:** Nodemailer (Gmail SMTP)
- **Scheduler:** node-cron

## Prerequisites

- Node.js 18+ and npm/pnpm
- Google Cloud account (for OAuth)
- MongoDB Atlas account (free tier)
- Gmail account with App Password

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/razzz8210/Magic-Slide.git
cd Magic-Slide
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Configuration

#### Frontend (.env.local)

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

#### Backend (backend/.env)

Create `backend/.env`:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
FRONTEND_URL=http://localhost:3000
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

## Setup Guides

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins: `http://localhost:3000`
7. Copy the **Client ID** to `.env.local`

### MongoDB Atlas Setup

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free M0 cluster
3. Create a database user
4. Add your IP to Network Access (or use `0.0.0.0/0` for development)
5. Click **Connect** → **Connect your application**
6. Copy the connection string to `backend/.env`

### Gmail App Password Setup

1. Enable [2-Step Verification](https://myaccount.google.com/security)
2. Go to [App passwords](https://myaccount.google.com/apppasswords)
3. Generate password for "Mail" → "Other (MagicSlides)"
4. Copy the 16-character password to `backend/.env` (remove spaces)

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build frontend
npm run build
npm start

# Backend production
cd backend
npm start
```

## Project Structure

```
MagicSlides/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── backend/               # Express backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── utils/            # Email & scheduler
│   └── server.js         # Entry point
├── components/           # React components
│   └── ui/              # UI component library
├── context/             # React context providers
└── lib/                # Utility functions
```

## Key Features Explained

### Study Block Management
- Create study sessions with title, subject, description
- Set precise start/end times
- Choose custom colors for organization
- Enable/disable email notifications

### Email Notifications
- **Immediate**: Sent when creating/updating study blocks
- **Reminder**: Sent 5 minutes before session starts
- **Customizable**: Toggle notifications per study block

### AI Assistant
- Ask study-related questions
- Generate flashcards from content
- Requires OpenAI API key (optional)

## Troubleshooting

### "Missing credentials" error
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set in `backend/.env`
- Remove spaces from Gmail App Password
- Restart backend server

### "Origin not allowed" (Google Sign-In)
- Add `http://localhost:3000` to Authorized JavaScript origins in Google Cloud Console
- Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` matches the OAuth client

### MongoDB connection failed
- Check connection string format
- Verify Network Access allows your IP
- Ensure database user password is correct (URL-encode special characters)

## Documentation

- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [Email Configuration](./EMAIL_SETUP.md)
- [Complete Setup](./SETUP.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or production.

## Author

**Raj Jaiswal**
- GitHub: [@razzz8210](https://github.com/razzz8210)

## Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- MongoDB for cloud database hosting
