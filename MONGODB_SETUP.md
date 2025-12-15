# MongoDB Setup Guide

## Current Status
❌ **MongoDB is NOT connected**

The backend is trying to connect to: `mongodb://localhost:27017/eshuri` but MongoDB is not running.

## Solution Options

### Option 1: MongoDB Atlas (Cloud - RECOMMENDED - Free)

**Easiest and fastest way - no installation needed!**

1. **Sign up for free account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create free account (no credit card needed)

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Set up database access:**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `eshuri_user` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Set up network access:**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP address
   - Click "Confirm"

5. **Get connection string:**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update backend/.env:**
   - Open `backend/.env`
   - Replace `MONGODB_URI` with your Atlas connection string
   - Replace `<username>` and `<password>` with your database user credentials
   - Example:
     ```
     MONGODB_URI=mongodb+srv://eshuri_user:yourpassword@cluster0.xxxxx.mongodb.net/eshuri?retryWrites=true&w=majority
     ```

7. **Restart backend:**
   - Stop backend (Ctrl+C)
   - Start again: `npm run dev`
   - Should see: "✅ Connected to MongoDB"

### Option 2: Local MongoDB Installation

**If you want to run MongoDB on your computer:**

#### Windows Installation:

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Download and install

2. **Start MongoDB Service:**
   - Open Services (Win+R, type `services.msc`)
   - Find "MongoDB" service
   - Right-click → Start
   - Or run in terminal:
     ```powershell
     net start MongoDB
     ```

3. **Verify it's running:**
   ```powershell
   mongod --version
   ```

4. **Restart backend:**
   - The backend will automatically connect
   - Should see: "✅ Connected to MongoDB"

#### Alternative: Run MongoDB with Docker

If you have Docker Desktop running:

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:7
```

Then restart your backend.

## Verify Connection

After setting up MongoDB, check backend logs. You should see:

```
✅ Connected to MongoDB
💡 To seed database, run: npm run seed
```

If you see errors, check:
- MongoDB service is running (for local)
- Connection string is correct (for Atlas)
- Network access is allowed (for Atlas)
- Username and password are correct (for Atlas)

## Test Connection

Once connected, you can test by:
1. Trying to login/register in the frontend
2. Checking backend logs for "✅ Connected to MongoDB"
3. Running: `cd backend && npm run seed` (to add sample data)

## Quick Fix Script

I can create a script to help you set up MongoDB Atlas connection. Would you like me to create it?

