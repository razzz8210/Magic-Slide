# Email Notifications Setup Guide (Gmail + Nodemailer)

The app uses **Nodemailer** to send email notifications when you create/update study blocks and send reminders before sessions start.

## Quick Setup (3 Steps)

### 1. Enable Gmail App Password

Since Google disabled "Less secure app access", you need to create an **App Password**:

**Prerequisites:**
- Gmail account
- 2-Step Verification must be enabled on your Google account

**Steps:**

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Under "How you sign in to Google", enable **2-Step Verification** (if not already enabled)
4. After 2-Step is enabled, go back to Security
5. Under "How you sign in to Google", click **App passwords**
   - Or go directly to: https://myaccount.google.com/apppasswords
6. In "Select app", choose **Mail**
7. In "Select device", choose **Other (Custom name)**
8. Type: `MagicSlides Study Blocks`
9. Click **Generate**
10. **Copy the 16-character password** (shown like: `xxxx xxxx xxxx xxxx`)
    - Save this - you won't see it again!

### 2. Update Backend .env File

Open `backend/.env` and replace the email configuration lines:

```env
# Email configuration for notifications
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Replace with your actual values:**
- `EMAIL_USER` = Your Gmail address (e.g., `john.doe@gmail.com`)
- `EMAIL_PASSWORD` = The 16-character App Password you just generated (include the spaces or remove them - both work)

**Example:**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### 3. Restart the Backend Server

```powershell
cd backend
npm run dev
```

## ✅ How Email Notifications Work

### When Creating a Study Block:
- If "Send email notification" checkbox is checked ✅
- You'll receive an email immediately with study block details:
  - Title, Subject, Start/End Time, Description

### Reminder Emails (Automatic):
- The scheduler runs every minute (in the background)
- If a study block is starting in **5 minutes**
- AND `notifyEmail` is true
- You'll receive a reminder email: "Your study block starts in 5 minutes!"

## Testing Email Notifications

1. **Make sure backend is running** with email credentials set
2. **Create a study block** with:
   - Start time: 6-7 minutes from now
   - "Send email notification" ✅ checked
3. **Check your email inbox** - you should receive:
   - Immediate email: "Study Block Created: [Title]"
   - Reminder email in 5 minutes: "Your study block starts in 5 minutes!"

## Troubleshooting

### ❌ "Invalid login" or "Authentication failed"
- Your App Password is wrong or expired
- Make sure you're using the **App Password**, not your regular Gmail password
- Regenerate the App Password and update `.env`

### ❌ "2-Step Verification required"
- You must enable 2-Step Verification on your Google account first
- Go to: https://myaccount.google.com/security
- Enable 2-Step Verification, then create App Password

### ❌ No email received but no errors
- Check your **Spam/Junk** folder
- Make sure the `EMAIL_USER` in `.env` matches the account that generated the App Password
- Check backend terminal logs for "Email sending error:"

### ❌ Backend shows "Email sending error"
- Check if `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly in `backend/.env`
- Restart the backend server after changing `.env`
- Verify the App Password (try regenerating it)

### ❌ Getting old Gmail password errors
**Common mistake:** Using your regular Gmail password instead of App Password
- The 16-character App Password is **different** from your regular password
- Must be generated from Google Account → Security → App passwords

## Security Best Practices

✅ **DO:**
- Use App Passwords (secure and revocable)
- Keep `.env` file in `.gitignore` (never commit it)
- Regenerate App Password if compromised

❌ **DON'T:**
- Share your App Password
- Commit `.env` file to git/GitHub
- Use "Less secure apps" (deprecated by Google)

## Alternative Email Providers

If you don't want to use Gmail, you can configure other providers:

**Outlook/Hotmail:**
```javascript
service: "hotmail"
```

**SendGrid (recommended for production):**
```javascript
host: "smtp.sendgrid.net",
port: 587,
auth: {
  user: "apikey",
  pass: process.env.SENDGRID_API_KEY
}
```

**Custom SMTP:**
```javascript
host: "smtp.example.com",
port: 587,
secure: false,
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD
}
```

## Current Implementation

The app sends emails in two scenarios:

1. **Immediate notification** (`backend/routes/studyBlocks.js`):
   - When creating a study block
   - Uses `sendStudyBlockEmail()` function

2. **5-minute reminder** (`backend/utils/scheduler.js`):
   - Cron job runs every minute
   - Finds blocks starting in next 5 minutes
   - Sends reminder if `notifyEmail: true`

## Need Help?

**Gmail App Password docs:** https://support.google.com/accounts/answer/185833
**Nodemailer docs:** https://nodemailer.com/about/

---

**Quick checklist:**
- [ ] 2-Step Verification enabled on Google account
- [ ] App Password generated (16 characters)
- [ ] `backend/.env` updated with `EMAIL_USER` and `EMAIL_PASSWORD`
- [ ] Backend server restarted
- [ ] Test email sent successfully
