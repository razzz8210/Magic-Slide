# MongoDB Atlas Setup Guide (Free Cloud Database)

Since you don't have MongoDB installed locally, you can use **MongoDB Atlas** - a free cloud MongoDB service.

## Step-by-Step Instructions

### 1. Create MongoDB Atlas Account (Free)
- Go to: **https://www.mongodb.com/cloud/atlas/register**
- Sign up with your email or Google account
- It's completely FREE for the M0 tier (512 MB storage)

### 2. Create a Free Cluster
1. After signing in, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select a cloud provider and region (choose one closest to you):
   - AWS, Google Cloud, or Azure
   - Region: Pick the nearest one (e.g., US East, Europe, Asia)
4. Name your cluster (or keep default "Cluster0")
5. Click **"Create Cluster"** (takes 1-3 minutes)

### 3. Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `studyapp` (or any name you want)
5. Set password: Generate a secure password (save it!)
   - **IMPORTANT**: Save this password - you'll need it for the connection string
6. User Privileges: **"Atlas admin"** or **"Read and write to any database"**
7. Click **"Add User"**

### 4. Allow Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` 
   - For production, you'd restrict this to your server's IP
4. Click **"Confirm"**

### 5. Get Your Connection String
1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Configure Your Backend
1. Open `backend/.env` file
2. Replace the placeholder with your actual connection string:
   ```
   MONGODB_URI=mongodb+srv://studyapp:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/study-blocks?retryWrites=true&w=majority
   ```
   
   **Important changes to make:**
   - Replace `<username>` with your database username (e.g., `studyapp`)
   - Replace `<password>` with your database password
   - Add `/study-blocks` after `.mongodb.net` to specify the database name
   
   **Example:**
   ```
   MONGODB_URI=mongodb+srv://studyapp:MySecurePass123@cluster0.ab1cd.mongodb.net/study-blocks?retryWrites=true&w=majority
   ```

3. Save the file

### 7. Test the Connection
```powershell
cd backend
npm run dev
```

You should see in the terminal:
```
Server running on port 5000
MongoDB connected
```

## Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created (username + password saved)
- [ ] Network access set to "Allow from Anywhere" (0.0.0.0/0)
- [ ] Connection string copied
- [ ] `backend/.env` updated with your connection string
- [ ] Password replaced in connection string
- [ ] Database name `/study-blocks` added to connection string
- [ ] Backend started successfully with `npm run dev`

## Troubleshooting

**Error: "MongoServerError: bad auth"**
- Your password in the connection string is wrong
- Make sure you used the DATABASE USER password (not your Atlas account password)
- Check for special characters - they need to be URL encoded:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - Or use a simpler password without special characters

**Error: "Connection timeout"**
- Check Network Access settings - make sure 0.0.0.0/0 is allowed
- Wait a few minutes after adding IP address
- Check your internet connection

**"MongoDB connected" but queries fail**
- Your database will be created automatically when you save the first document
- No need to manually create the database or collections

## Security Note

For production deployment:
1. Change Network Access from "0.0.0.0/0" to your production server's IP
2. Use environment variables (never commit `.env` to git)
3. Use a strong, unique password for the database user

---

**Need Help?**
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- Free tier is perfect for development and small apps
- Upgrade only when you need more storage or features
