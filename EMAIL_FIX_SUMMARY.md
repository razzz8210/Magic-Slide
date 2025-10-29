# Email Notifications - Quick Fix Summary

## ✅ What I Fixed

### 1. **Fixed scheduler.js**
- **Problem**: Used `require()` instead of `import` (caused errors in ES modules)
- **Fix**: Changed to proper ES6 import for nodemailer
- **Added**: 
  - Check for email credentials before sending
  - `notificationSent` flag to prevent duplicate reminder emails
  - Better console logging with emojis for easy debugging

### 2. **Enhanced email.js**
- **Added**: Check if email credentials are configured
- **Added**: Helpful error messages and setup hints
- **Improved**: Email HTML styling
- **Added**: Better logging to show success/failure clearly

### 3. **Updated StudyBlock model**
- **Added**: `notificationSent` field to track if 5-minute reminder was sent
- **Prevents**: Sending duplicate reminder emails every minute

### 4. **Created comprehensive setup guide**
- **File**: `EMAIL_SETUP.md`
- **Includes**: Step-by-step Gmail App Password setup
- **Includes**: Troubleshooting guide
- **Includes**: Alternative email provider configs

## 🚀 How to Enable Email Notifications NOW

### Step 1: Get Gmail App Password (2 minutes)

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. If you don't see "App passwords", enable **2-Step Verification** first
4. Select app: **Mail**, device: **Other** → name it "MagicSlides"
5. Click **Generate**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update backend/.env (30 seconds)

Open `backend/.env` and uncomment/update these lines:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

Replace with your actual Gmail and the App Password you just copied.

### Step 3: Restart Backend (10 seconds)

```powershell
# Stop the backend (Ctrl+C) and restart:
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected
📧 Email notification scheduler started (checks every minute)
```

## ✅ Test It Works

1. **Create a study block** with:
   - Title: "Test Block"
   - Start time: 6-7 minutes from now
   - "Send email notification" ✅ checked

2. **Check your email** - you should receive:
   - **Immediately**: "Study Block Created: Test Block"
   - **In ~5 minutes**: "Reminder: Your study block starts in 5 minutes!"

3. **Check backend terminal** - you should see:
   ```
   ✅ Email sent to your-email@gmail.com: Study block created
   ```

## 📧 Email Notifications Features

### 1. Immediate Notification (on create/update)
- Sent when you create a new study block
- Only if "Send email notification" is checked ✅
- Contains: title, subject, start/end time, description

### 2. 5-Minute Reminder (automatic)
- Scheduler runs every minute in background
- Finds blocks starting in next 5 minutes
- Sends reminder: "Your study block starts in 5 minutes!"
- Only sent once per block (prevents spam)

## 🔍 Debugging

### Backend logs will show:

**✅ Success:**
```
✅ Email sent to user@gmail.com: Study block created
📧 Email notification scheduler started
✅ Reminder email sent for block: Math Study
```

**⚠️ Email not configured:**
```
⚠️  Email credentials not configured. Skipping email notification.
💡 To enable emails, set EMAIL_USER and EMAIL_PASSWORD in backend/.env
```

**❌ Error (wrong password):**
```
❌ Email sending error: Invalid login
💡 Check your EMAIL_USER and EMAIL_PASSWORD in backend/.env
💡 For Gmail, you need an App Password: https://myaccount.google.com/apppasswords
```

## Common Issues

### "Invalid login" error
- You're using your regular Gmail password instead of App Password
- **Fix**: Generate App Password from Google Account settings

### "2-Step Verification required"
- Gmail requires 2-Step Verification for App Passwords
- **Fix**: Enable it at https://myaccount.google.com/security

### No emails received
- Check Spam/Junk folder
- Verify EMAIL_USER matches the Gmail that generated the App Password
- Make sure backend is running with updated .env

### Emails work but reminders don't
- Check if study block start time is actually in the future
- Check backend logs for scheduler messages
- The reminder is sent when block starts in 5 minutes (±1 minute)

## Security Notes

✅ **Safe:**
- App Passwords are secure and can be revoked anytime
- Each app gets its own password
- Never commit `.env` to version control

❌ **Don't:**
- Share your App Password
- Use "Less secure app access" (deprecated)
- Commit credentials to git

## Alternative: Skip Email Setup (for now)

If you don't want email notifications right now:
- Just leave EMAIL_USER and EMAIL_PASSWORD commented out
- The app will work fine, just without email features
- Backend logs will show: "Email credentials not configured"
- You can add them later anytime

---

**Full setup guide:** See `EMAIL_SETUP.md`
**Need help?** Check backend terminal logs for detailed error messages
