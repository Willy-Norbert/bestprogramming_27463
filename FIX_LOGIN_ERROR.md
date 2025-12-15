# Fix Login Connection Error

## Problem
"Unable to connect to the server. Please check your internet connection and try again."

## Root Cause
1. Frontend .env was missing `VITE_API_BASE_URL`
2. Frontend needs restart to pick up environment variables
3. MongoDB might not be connected

## Solution

### Step 1: Restart Frontend
The `.env` file has been updated with `VITE_API_BASE_URL=http://localhost:3000/api`

**You MUST restart the frontend for this to take effect:**

1. Stop the frontend server (press Ctrl+C in the terminal running it)
2. Restart it:
   ```powershell
   npm run dev
   ```

### Step 2: Check MongoDB Connection

The backend is running but MongoDB is disconnected. You need MongoDB running.

**Option A: Local MongoDB**
- Start MongoDB service on Windows
- Or run `mongod` if installed manually

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=your-atlas-connection-string
   ```
6. Restart backend

### Step 3: Verify

After restarting frontend:
1. Open browser console (F12)
2. Try to login
3. Check console for API requests
4. Should see requests to `http://localhost:3000/api/auth/login`

## Quick Test

Test if backend is accessible:
```powershell
curl http://localhost:3000/health
```

Should return JSON with status "ok"

## Current Status

✅ Backend running on port 3000
✅ VITE_API_BASE_URL added to .env
⚠️ Frontend needs restart
⚠️ MongoDB needs to be connected

